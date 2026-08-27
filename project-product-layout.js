/* Builds a common product-detail shell while preserving each project's content. */
(function () {
  const headerLinks = [
    ['Home', 'index.html'],
    ['Listing', 'senarai-hartanah.html'],
    ['Video Tour', 'index.html#video-tour'],
    ['About Me', 'index.html#about']
  ];

  function createHeader() {
    const nav = document.querySelector('nav');
    if (!nav || nav.dataset.projectHeader === 'true') return;

    nav.dataset.projectHeader = 'true';
    nav.id = 'mainNav';
    nav.replaceChildren();

    const brand = document.createElement('a');
    brand.className = 'nav-brand';
    brand.href = 'index.html';
    brand.innerHTML = '<img src="logo-razi.png" alt="Razi Property">';

    const links = document.createElement('div');
    links.className = 'nav-links';
    headerLinks.forEach(([label, href]) => {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      links.appendChild(link);
    });

    const hamburger = document.createElement('button');
    hamburger.type = 'button';
    hamburger.className = 'nav-hamburger';
    hamburger.setAttribute('aria-label', 'Buka menu');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.innerHTML = '<span></span><span></span><span></span>';

    const mobileNav = document.createElement('div');
    mobileNav.className = 'project-mobile-nav';
    mobileNav.id = 'projectMobileNav';
    headerLinks.forEach(([label, href]) => {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      mobileNav.appendChild(link);
    });
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
    mobileNav.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });

    nav.append(brand, links, hamburger);
    nav.insertAdjacentElement('afterend', mobileNav);
  }

  function getFringeMedia(hero) {
    const media = document.createElement('section');
    media.className = 'product-media product-media--generated';
    media.setAttribute('aria-label', 'Galeri projek');
    const seen = new Set();
    const images = [
      ...hero.querySelectorAll('img'),
      ...document.querySelectorAll('section:not(.hero) img')
    ].filter((image) => image.src && !seen.has(image.src) && seen.add(image.src)).slice(0, 6);

    images.forEach((image) => {
      const figure = document.createElement('figure');
      const copy = image.cloneNode(true);
      copy.loading = 'lazy';
      figure.appendChild(copy);
      media.appendChild(figure);
    });
    return media;
  }

  function createProductLayout() {
    createHeader();
    const hero = document.querySelector('.hero');
    if (!hero || hero.closest('.product-layout')) return;

    let media = document.querySelector('#gallery');
    if (media) {
      media.classList.add('product-media');
    } else {
      media = getFringeMedia(hero);
    }
    if (!media || !media.children.length) return;

    const layout = document.createElement('main');
    layout.className = 'product-layout';
    layout.setAttribute('aria-label', 'Maklumat projek');
    hero.parentNode.insertBefore(layout, hero);
    layout.append(media, hero);
    hero.classList.add('product-info');
    document.documentElement.classList.add('product-template');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createProductLayout, { once: true });
  } else {
    createProductLayout();
  }
}());
