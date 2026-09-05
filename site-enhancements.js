/* Shared quality-of-life improvements for public pages. */
(function () {
  const currentYear = new Date().getFullYear();

  function addFavicon() {
    if (document.querySelector('link[rel~="icon"]')) return;
    const icon = document.createElement('link');
    icon.rel = 'icon';
    icon.type = 'image/svg+xml';
    icon.href = 'favicon.svg';
    document.head.appendChild(icon);
  }

  function updateCopyright() {
    document.querySelectorAll('#copy-year').forEach((element) => { element.textContent = currentYear; });
    document.querySelectorAll('footer .footer-copy').forEach((element) => {
      element.innerHTML = element.innerHTML.replace(/©\s*20\d{2}/g, `© ${currentYear}`);
    });
  }

  function useCleanUrls() {
    if (!/^https?:$/.test(window.location.protocol)) return;
    document.querySelectorAll('a[href]').forEach((link) => {
      const rawHref = link.getAttribute('href');
      if (!rawHref || /^(?:#|mailto:|tel:|javascript:)/i.test(rawHref)) return;
      let target;
      try { target = new URL(rawHref, window.location.href); } catch { return; }
      if (target.origin !== window.location.origin || !target.pathname.endsWith('.html')) return;
      const rootDocument = rawHref.split(/[?#]/)[0].replace(/^\.\//, '');
      if (/^[^/]+\.html$/i.test(rootDocument)) {
        target.pathname = rootDocument.toLowerCase() === 'index.html'
          ? '/'
          : `/${rootDocument.replace(/\.html$/i, '/')}`;
      } else {
        target.pathname = target.pathname === '/index.html'
          ? '/'
          : target.pathname.replace(/\.html$/, '/');
      }
      link.setAttribute('href', `${target.pathname}${target.search}${target.hash}`);
    });
  }

  function linkPhoneNumbers() {
    const ignored = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'OPTION']);
    const phonePattern = /(?:\+?60|0)1\d(?:[-\s]?\d){7,8}/;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || ignored.has(parent.tagName) || parent.closest('a, .phone-linked')) return NodeFilter.FILTER_REJECT;
        return phonePattern.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const parts = node.nodeValue.split(/((?:\+?60|0)1\d(?:[-\s]?\d){7,8})/g);
      if (parts.length < 2) return;
      const fragment = document.createDocumentFragment();
      parts.forEach((part, index) => {
        if (index % 2 === 1) {
          const digits = part.replace(/\D/g, '');
          const link = document.createElement('a');
          link.href = `tel:${digits.startsWith('0') ? `+60${digits.slice(1)}` : `+${digits}`}`;
          link.className = 'phone-linked';
          link.textContent = part;
          fragment.appendChild(link);
        } else if (part) fragment.appendChild(document.createTextNode(part));
      });
      node.parentNode.replaceChild(fragment, node);
    });
  }

  function improveFormAccessibility() {
    document.querySelectorAll('input[placeholder], textarea[placeholder], select').forEach((field) => {
      if (!field.getAttribute('aria-label')) {
        field.setAttribute('aria-label', field.getAttribute('placeholder') || 'Pilih pilihan');
      }
    });
  }

  function optimiseImages() {
    document.querySelectorAll('img').forEach((image, index) => {
      image.decoding = 'async';
      if (index > 1 && !image.hasAttribute('loading')) image.loading = 'lazy';
    });
  }

  function showFeedback(button, message, type) {
    const old = button.parentElement.querySelector('.site-feedback');
    if (old) old.remove();
    const feedback = document.createElement('div');
    feedback.className = `site-feedback site-feedback--${type}`;
    feedback.setAttribute('role', type === 'error' ? 'alert' : 'status');
    feedback.textContent = message;
    button.insertAdjacentElement('afterend', feedback);
  }

  function validatePropertyForms() {
    document.addEventListener('click', (event) => {
      const button = event.target.closest('.cta-submit, .btn-eoi, .btn-submit-pill');
      if (!button) return;
      const container = button.closest('.cta-form, .eoi-form, .inquiry-form') || document;
      const name = container.querySelector('[id$="-name"]');
      const phone = container.querySelector('[id$="-phone"]');
      const type = container.querySelector('[id$="-type"]');
      const invalidName = name && !name.value.trim();
      const invalidPhone = phone && !/^(?:\+?60|0)1\d(?:[-\s]?\d){7,8}$/.test(phone.value.trim());
      const invalidType = button.classList.contains('btn-submit-pill') && type && !type.value;
      if (invalidName || invalidPhone || invalidType) {
        event.preventDefault();
        event.stopImmediatePropagation();
        showFeedback(button, invalidPhone ? 'Sila isi nombor WhatsApp Malaysia yang sah.' : 'Sila lengkapkan maklumat yang diperlukan.', 'error');
        (invalidName ? name : invalidPhone ? phone : type).focus();
        return;
      }
      showFeedback(button, 'Terima kasih. WhatsApp akan dibuka untuk meneruskan pertanyaan anda.', 'success');
    }, true);
  }

  function initialise() {
    addFavicon();
    updateCopyright();
    useCleanUrls();
    linkPhoneNumbers();
    improveFormAccessibility();
    optimiseImages();
    validatePropertyForms();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise, { once: true });
  else initialise();
}());
