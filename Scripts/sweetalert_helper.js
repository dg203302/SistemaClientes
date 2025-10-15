// Carga SweetAlert2 dinámicamente y expone utilidades globales
(function(){
  const CDN = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';

  async function loadSwal(){
    if (window.Swal) return window.Swal;
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = CDN;
      s.async = true;
      s.onload = () => resolve(window.Swal);
      s.onerror = () => reject(new Error('No se pudo cargar SweetAlert2'));
      document.head.appendChild(s);
    });
  }

  function getPalette(){
    const root = getComputedStyle(document.documentElement);
    const gradientCard = root.getPropertyValue('--gradient-card') || '#522B5B';
    const purpleDark = root.getPropertyValue('--color-purple-dark') || '#2B124C';
    const pink = root.getPropertyValue('--color-pink') || '#DFB6B2';
    const light = root.getPropertyValue('--color-light') || '#FBE4D8';
    return { gradientCard: gradientCard.trim(), purpleDark: purpleDark.trim(), pink: pink.trim(), light: light.trim() };
  }

  // Toast para éxitos (no bloqueante). Devuelve Promise que se resuelve al cerrarse.
  async function showSuccess(message, opts = {}){
    const Swal = await loadSwal();
    const pal = getPalette();
    return Swal.fire(Object.assign({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: opts.timer || 1800,
      timerProgressBar: true,
      background: pal.gradientCard || pal.purpleDark,
      color: pal.light,
      customClass: { popup: 'swal2-custom' }
    }, opts));
  }

  // Modal para errores/avisos (bloqueante hasta cerrar). Devuelve Promise.
  async function showError(message, title = 'Error', opts = {}){
    const Swal = await loadSwal();
    const pal = getPalette();
    return Swal.fire(Object.assign({
      title: title,
      html: message,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      background: pal.gradientCard || pal.purpleDark,
      color: pal.light,
      confirmButtonColor: pal.pink
    }, opts));
  }

  // Exponer funciones globales y un loader para usos antes de que el script esté cargado
  window.loadSweetAlertHelper = loadSwal;
  window.showSuccess = showSuccess;
  window.showError = showError;
})();
