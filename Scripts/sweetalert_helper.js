// Carga SweetAlert2 dinámicamente y expone utilidades globales
(function(){
  const CDN = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
  const THEME_STYLE_ID = 'swal2-el-lote-theme';

  async function loadSwal(){
    if (window.Swal) return window.Swal;
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = CDN;
      s.async = true;
      s.onload = () => {
        try {
          // Si el helper cargó Swal, lo themeamos inmediatamente.
          applyThemeVars();
          ensureThemeCssInjected();
          themeSwalGlobal();
        } catch (_) {}
        resolve(window.Swal);
      };
      s.onerror = () => reject(new Error('No se pudo cargar SweetAlert2'));
      document.head.appendChild(s);
    });
  }

  function getPalette(){
    const root = getComputedStyle(document.documentElement);

    // Tema dorado (páginas tipo "El Lote" premium)
    const bgDeep = root.getPropertyValue('--bg-deep').trim();
    const gold = root.getPropertyValue('--gold').trim();
    const goldLite = root.getPropertyValue('--gold-lite').trim();
    const cream = root.getPropertyValue('--cream').trim();
    const gBorder = root.getPropertyValue('--g-border').trim();
    const accent2 = root.getPropertyValue('--accent2').trim();

    // Tema violeta (páginas principales actuales)
    const gradientCard = (root.getPropertyValue('--gradient-card') || '#522B5B').trim();
    const purpleDark = (root.getPropertyValue('--color-purple-dark') || '#2B124C').trim();
    const pink = (root.getPropertyValue('--color-pink') || '#DFB6B2').trim();
    const light = (root.getPropertyValue('--color-light') || '#FBE4D8').trim();
    const glassBorder = (root.getPropertyValue('--glass-border') || 'rgba(255,255,255,0.18)').trim();
    const pinkDark = (root.getPropertyValue('--color-pink-dark') || '#854F6C').trim();

    const usaDorado = Boolean(bgDeep && cream && (gold || goldLite));

    if (usaDorado) {
      return {
        bg: bgDeep || '#0E0A06',
        surface: 'rgba(18,12,8,0.96)',
        text: cream || '#F5EDD8',
        border: gBorder || 'rgba(196,154,74,0.18)',
        accent: goldLite || gold || '#C49A4A',
        danger: accent2 || gold || goldLite || '#C49A4A',
        muted: 'rgba(196,180,154,0.78)',
        ghostBg: 'rgba(245,237,216,0.06)',
      };
    }

    return {
      bg: purpleDark,
      surface: gradientCard || purpleDark,
      text: light,
      border: glassBorder,
      accent: pink,
      danger: pinkDark || pink,
      muted: 'rgba(251,228,216,0.78)',
      ghostBg: 'rgba(255,255,255,0.08)',
    };
  }

  function getFontFamily(){
    const base = document.body || document.documentElement;
    const computed = getComputedStyle(base);
    return (computed.fontFamily || 'inherit').trim();
  }

  function applyThemeVars(){
    const pal = getPalette();
    const font = getFontFamily();
    const el = document.documentElement;

    el.style.setProperty('--swal-bg', pal.surface);
    el.style.setProperty('--swal-text', pal.text);
    el.style.setProperty('--swal-muted', pal.muted);
    el.style.setProperty('--swal-border', pal.border);
    el.style.setProperty('--swal-accent', pal.accent);
    el.style.setProperty('--swal-danger', pal.danger);
    el.style.setProperty('--swal-ghost-bg', pal.ghostBg || 'rgba(255,255,255,0.08)');
    el.style.setProperty('--swal-font', font);
    el.style.setProperty('--swal-radius', '18px');
    el.style.setProperty('--swal-shadow', '0 22px 70px rgba(0,0,0,0.55)');
  }

  function ensureThemeCssInjected(){
    if (document.getElementById(THEME_STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = THEME_STYLE_ID;
    style.textContent = `
      /* SweetAlert2 theme (El Lote) */
      .el-swal.swal2-popup {
        font-family: var(--swal-font, inherit);
        background: var(--swal-bg, #2B124C) !important;
        color: var(--swal-text, #FBE4D8) !important;
        border: 1px solid var(--swal-border, rgba(255,255,255,0.18));
        border-radius: var(--swal-radius, 18px);
        box-shadow: var(--swal-shadow, 0 22px 70px rgba(0,0,0,0.55));
        -webkit-backdrop-filter: blur(22px) saturate(170%);
        backdrop-filter: blur(22px) saturate(170%);
      }

      .el-swal .swal2-title,
      .el-swal-title {
        font-family: var(--swal-font, inherit);
        color: var(--swal-text, #FBE4D8) !important;
        letter-spacing: 0.2px;
      }

      .el-swal .swal2-html-container,
      .el-swal-html {
        color: var(--swal-muted, rgba(251,228,216,0.78)) !important;
        line-height: 1.55;
      }

      .el-swal .swal2-actions,
      .el-swal-actions {
        gap: 0.6rem;
      }

      /* Buttons */
      .el-swal-confirm,
      .el-swal .swal2-confirm {
        border: 1px solid rgba(255,255,255,0.16);
        background: var(--swal-accent, #DFB6B2) !important;
        color: rgba(14,10,6,0.92) !important;
        font-weight: 800;
        border-radius: 12px;
        padding: 0.65rem 1.1rem;
        box-shadow: 0 12px 28px rgba(0,0,0,0.35);
      }

      .el-swal-cancel,
      .el-swal .swal2-cancel,
      .el-swal-deny,
      .el-swal .swal2-deny {
        border: 1px solid var(--swal-border, rgba(255,255,255,0.18));
        background: var(--swal-ghost-bg, rgba(255,255,255,0.08)) !important;
        color: var(--swal-text, #FBE4D8) !important;
        font-weight: 700;
        border-radius: 12px;
        padding: 0.65rem 1.1rem;
      }

      .el-swal .swal2-close {
        color: var(--swal-text, #FBE4D8) !important;
        opacity: 0.75;
      }
      .el-swal .swal2-close:hover { opacity: 1; }

      /* Toast */
      .el-swal.swal2-toast {
        padding: 0.75rem 1rem;
      }
      .el-swal.swal2-toast .swal2-title {
        font-size: 0.95rem;
        font-weight: 800;
      }
      .el-swal .swal2-timer-progress-bar,
      .el-swal-timer {
        background: var(--swal-accent, #DFB6B2) !important;
      }

      /* Icon tweaks */
      .el-swal .swal2-icon {
        border-color: rgba(255,255,255,0.22);
      }
    `;
    document.head.appendChild(style);
  }

  function getSwalBaseConfig(){
    return {
      buttonsStyling: false,
      customClass: {
        popup: 'el-swal',
        title: 'el-swal-title',
        htmlContainer: 'el-swal-html',
        actions: 'el-swal-actions',
        confirmButton: 'el-swal-confirm',
        cancelButton: 'el-swal-cancel',
        denyButton: 'el-swal-deny',
        timerProgressBar: 'el-swal-timer',
      },
    };
  }

  function themeSwalGlobal(){
    if (!window.Swal || window.Swal.__elLoteThemed) return;
    if (typeof window.Swal.mixin !== 'function') return;

    // Envolvemos Swal para que TODAS las llamadas (Swal.fire / Swal.mixin) hereden el theme.
    const themed = window.Swal.mixin(getSwalBaseConfig());
    themed.__elLoteThemed = true;
    window.Swal = themed;
  }

  function bootTheme(){
    // Variables + CSS listos antes de que se dispare cualquier alerta.
    try {
      applyThemeVars();
      ensureThemeCssInjected();
      themeSwalGlobal();
    } catch (_) {}
  }

  // Boot temprano
  bootTheme();

  // Reintentar tras DOM listo (por si la fuente/vars se cargan después)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootTheme, { once: true });
  }

  // Si otra parte del sitio carga Swal después, lo detectamos.
  let tries = 0;
  const maxTries = 80; // ~4s
  const iv = setInterval(() => {
    tries += 1;
    bootTheme();
    if (window.Swal?.__elLoteThemed || tries >= maxTries) {
      clearInterval(iv);
    }
  }, 50);

  // Toast para éxitos (no bloqueante). Devuelve Promise que se resuelve al cerrarse.
  async function showSuccess(message, opts = {}){
    const Swal = await loadSwal();
    applyThemeVars();
    ensureThemeCssInjected();
    themeSwalGlobal();
    const mixin = window.Swal.mixin({});

    return mixin.fire(Object.assign({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: opts.timer || 1800,
      timerProgressBar: true,
      showCloseButton: true
    }, opts));
  }

  // Modal para errores/avisos (bloqueante hasta cerrar). Devuelve Promise.
  async function showError(message, title = 'Error', opts = {}){
    const Swal = await loadSwal();
    applyThemeVars();
    ensureThemeCssInjected();
    themeSwalGlobal();
    const mixin = window.Swal.mixin({});

    return mixin.fire(Object.assign({
      title: title,
      html: message,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      showCloseButton: true
    }, opts));
  }

  // Exponer funciones globales y un loader para usos antes de que el script esté cargado
  window.loadSweetAlertHelper = loadSwal;
  window.showSuccess = showSuccess;
  window.showError = showError;
})();
