(() => {
  function initSidebarOutsideClose() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const menuIcon = document.querySelector('label.menu-icon[for="menu-toggle"]');

    if (!menuToggle || !sidebar) return;

    const isInside = (target) => {
      if (!(target instanceof Node)) return false;
      if (sidebar.contains(target)) return true;
      if (menuIcon && menuIcon.contains(target)) return true;
      if (menuToggle.contains(target)) return true;
      return false;
    };

    const closeIfOpenAndOutside = (event) => {
      if (!menuToggle.checked) return;

      if (event.type === 'pointerdown') {
        if (event.pointerType === 'mouse' && typeof event.button === 'number' && event.button !== 0) {
          return;
        }
      }

      const target = event.target;
      if (isInside(target)) return;

      menuToggle.checked = false;
    };

    if (window.PointerEvent) {
      document.addEventListener('pointerdown', closeIfOpenAndOutside, true);
    } else {
      document.addEventListener('mousedown', closeIfOpenAndOutside, true);
      document.addEventListener('touchstart', closeIfOpenAndOutside, { capture: true, passive: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSidebarOutsideClose);
  } else {
    initSidebarOutsideClose();
  }
})();
