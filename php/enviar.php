<?php
/**
 * enviar.php — Procesa el formulario de contacto y envía el correo
 * usando la función nativa mail() de PHP (gratuita, sin librerías externas).
 * Compatible con hosting compartido que solo permite backend PHP.
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

function responder($success, $message){
    echo json_encode(['success' => $success, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

if($_SERVER['REQUEST_METHOD'] !== 'POST'){
    http_response_code(405);
    responder(false, 'Método no permitido.');
}

// Honeypot anti-spam
if(!empty($_POST['empresa_web'])){
    responder(true, 'Gracias, tu mensaje fue enviado.');
}

function limpiar($valor){
    $valor = trim($valor ?? '');
    $valor = str_replace(["\r", "\n"], ' ', $valor); // evita inyección de cabeceras
    return htmlspecialchars($valor, ENT_QUOTES, 'UTF-8');
}

$nombre   = limpiar($_POST['nombre']   ?? '');
$telefono = limpiar($_POST['telefono'] ?? '');
$email    = trim($_POST['email']       ?? '');
$servicio = limpiar($_POST['servicio'] ?? '');
$mensaje  = trim($_POST['mensaje']     ?? '');

if($nombre === '' || $telefono === '' || $email === '' || $servicio === '' || $mensaje === ''){
    responder(false, 'Todos los campos son obligatorios.');
}

if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
    responder(false, 'El correo electrónico no es válido.');
}

if(mb_strlen($mensaje) > 3000){
    responder(false, 'El mensaje es demasiado largo.');
}

$mensajeLimpio = htmlspecialchars(strip_tags($mensaje), ENT_QUOTES, 'UTF-8');

$para     = DESTINO_EMAIL;
$asunto   = '=?UTF-8?B?' . base64_encode(ASUNTO_BASE . ' — ' . $nombre) . '?=';
$fecha    = date('d/m/Y H:i');

$cuerpo  = "Nueva solicitud recibida desde el sitio web\n";
$cuerpo .= "-------------------------------------------\n\n";
$cuerpo .= "Nombre:     {$nombre}\n";
$cuerpo .= "Teléfono:   {$telefono}\n";
$cuerpo .= "Correo:     {$email}\n";
$cuerpo .= "Servicio:   {$servicio}\n";
$cuerpo .= "Fecha:      {$fecha}\n\n";
$cuerpo .= "Mensaje:\n{$mensajeLimpio}\n";

$remitente = 'no-responder@' . DOMINIO_SITIO;

$headers  = "From: " . DESTINO_NOMBRE . " <{$remitente}>\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$enviado = @mail($para, $asunto, $cuerpo, $headers);

if($enviado){
    responder(true, 'Gracias, ' . explode(' ', $nombre)[0] . '. Tu solicitud fue enviada, te contactaremos pronto.');
} else {
    responder(false, 'No se pudo enviar el mensaje. Verifica la configuración de correo del hosting o inténtalo más tarde.');
}
