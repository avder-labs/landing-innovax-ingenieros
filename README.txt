VOLTEC — Sitio web
===================

CONFIGURAR CORREO DE DESTINO:
Editar /php/config.php:
  - DESTINO_EMAIL   -> tu correo Gmail donde llegarán los formularios
  - DOMINIO_SITIO   -> el dominio donde subirás el sitio (sin http/https)

CONFIGURAR WHATSAPP:
En index.html, buscar "whatsapp-float" y cambiar el número en el href:
  https://wa.me/51987654321?text=...
Formato: código de país + número, sin espacios ni signos (+).

SUBIR AL HOSTING:
Sube toda la carpeta (index.html, css/, js/, php/) manteniendo la
misma estructura. El formulario usa la función mail() nativa de PHP,
por lo que no requiere librerías ni configuración adicional siempre
que el hosting tenga mail() habilitado (la mayoría de hostings con
cPanel lo tienen activo por defecto).

Estructura:
  index.html
  css/style.css
  js/main.js
  php/enviar.php
  php/config.php
