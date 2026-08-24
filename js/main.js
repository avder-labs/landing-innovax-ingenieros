document.addEventListener('DOMContentLoaded', function () {

  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const backTop = document.getElementById('backTop');

  const year = document.getElementById('year');

  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  const serviceSelect =
    document.getElementById('servicioSelect');


  /* =====================================================
     AÑO
  ===================================================== */

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }



  /* =====================================================
     HEADER AL HACER SCROLL
  ===================================================== */

  window.addEventListener(
    'scroll',
    function () {

      const y =
        window.scrollY;

      if (header) {

        header.classList.toggle(
          'scrolled',
          y > 30
        );

      }

      if (backTop) {

        backTop.classList.toggle(
          'show',
          y > 500
        );

      }

    },
    {
      passive:true
    }
  );



  /* =====================================================
     BOTÓN VOLVER ARRIBA
  ===================================================== */

  if (backTop) {

    backTop.addEventListener(
      'click',
      function () {

        window.scrollTo({
          top:0,
          behavior:'smooth'
        });

      }
    );

  }



  /* =====================================================
     MENÚ MÓVIL
  ===================================================== */

  if (
    menuToggle &&
    mainNav
  ) {

    menuToggle.addEventListener(
      'click',
      function () {

        const open =
          mainNav.classList.toggle(
            'open'
          );

        menuToggle.setAttribute(
          'aria-expanded',
          open
            ? 'true'
            : 'false'
        );

      }
    );


    mainNav
      .querySelectorAll('a')
      .forEach(function (link) {

        link.addEventListener(
          'click',
          function () {

            mainNav.classList.remove(
              'open'
            );

            menuToggle.setAttribute(
              'aria-expanded',
              'false'
            );

          }
        );

      });

  }



  /* =====================================================
     SELECCIONAR SERVICIO DESDE LA URL
  ===================================================== */

  if (serviceSelect) {

    const params =
      new URLSearchParams(
        window.location.search
      );

    const service =
      params.get('servicio');


    if (service) {

      const option =
        [...serviceSelect.options]
          .find(function (o) {

            return (
              o.value.toLowerCase() ===
              service.toLowerCase()
            );

          });


      if (option) {

        serviceSelect.value =
          option.value;

      }

    }

  }



  /* =====================================================
     FORMULARIO
  ===================================================== */

  if (form) {

    form.addEventListener(
      'submit',
      async function (event) {

        event.preventDefault();


        status.textContent = '';

        status.className =
          'form-status';


        const honeypot =
          form.querySelector(
            '[name="empresa_web"]'
          );


        if (
          honeypot &&
          honeypot.value
        ) {

          return;

        }


        const button =
          form.querySelector(
            'button[type="submit"]'
          );


        const original =
          button.innerHTML;


        button.disabled =
          true;


        button.innerHTML =
          'Enviando...';


        try {

          const response =
            await fetch(
              form.action,
              {
                method:'POST',

                body:
                  new FormData(form),

                headers:{
                  'X-Requested-With':
                    'XMLHttpRequest'
                }
              }
            );


          const data =
            await response.json();


          if (!data.success) {

            throw new Error(
              data.message ||
              'No se pudo enviar.'
            );

          }


          status.textContent =
            data.message ||
            'Solicitud enviada correctamente.';


          status.classList.add(
            'ok'
          );


          form.reset();


        } catch (error) {

          status.textContent =
            'No se pudo enviar automáticamente. ' +
            'Si estás probando la web desde tu PC, ' +
            'súbela a un hosting con PHP para activar el formulario.';


          status.classList.add(
            'err'
          );


        } finally {

          button.disabled =
            false;

          button.innerHTML =
            original;

        }

      }
    );

  }

});