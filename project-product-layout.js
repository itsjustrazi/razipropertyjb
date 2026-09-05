/* Builds a common product-detail shell while preserving each project's content. */
(function () {
  const projectImageFolders = {
    'allamanda.html': 'allamanda',
    'caliaresidence.html': 'caliaresidence',
    'mgrandminori.html': 'mgrandminori',
    'premiumheight.html': 'premiumheight',
    'redhill.html': 'redhill',
    'thefringe.html': 'thefringe',
    'thestraitsviewduo.html': 'thestraitsviewduo'
  };
  const imageAliases = {
    'floorplan-type-a.jpg': 'duo-floorplan-type-a.jpg',
    'floorplan-type-b.jpg': 'duo-floorplan-type-b.jpg',
    'floorplan-type-c.jpg': 'duo-floorplan-type-c.jpg'
  };
  const projectGalleryImages = {
    'allamanda.html': [
      'allamanda-hero.jpg', 'allamanda-living.jpg', 'allamanda-living2.jpg',
      'allamanda-living3.jpg', 'allamanda-kitchen.jpg', 'allamanda-bedroom.jpg', 'allamanda-bedroom2.jpg'
    ],
    'caliaresidence.html': [
      'calia_residences.png', 'ruang_tamu_4.jpg', 'dining_area_1.jpg', 'master_bedroom.jpg',
      'kitchen_area.jpg', 'bathroom_2.jpg', 'ruang_tamu.jpg', 'ruang_tamu_1.jpg', 'ruang_tamu_3.jpg',
      'dining_area_3.jpg', 'dining_area_4.jpg', 'dining_area_7.jpg', 'master_bedroom_1.jpg',
      'laundry_area.jpg', 'bathroom_3.jpg'
    ],
    'mgrandminori.html': [
      'MGM_Apartment.jpg', 'Entrance_MGM.jpg', 'MGM_Fasilities_1.jpg',
      'MGM_Fasilities.jpg', 'M_Grand_Minori_Fasilities_Layout.jpg'
    ],
    'premiumheight.html': [
      'premium-height-hero.jpg', 'ph-living.jpg', 'ph-bedroom.jpg', 'ph-bedroom2.jpg',
      'ph-master-bed.jpg', 'ph-master-bed2.jpg', 'ph-kitchen.jpg', 'ph-kitchen2.jpg',
      'ph-master-bath.jpg', 'ph-master-bath2.jpg', 'ph-laundry.jpg'
    ],
    'redhill.html': [
      'redhill-hero.jpg', 'redhill-living.jpg', 'redhill-living2.jpg', 'redhill-dining.jpg',
      'redhill-kitchen.jpg', 'redhill-master-bed.jpg', 'redhill-bedroom.jpg', 'redhill-bedroom2.jpg',
      'redhill-bedroom3.jpg', 'redhill-bathroom.jpg'
    ],
    'thestraitsviewduo.html': [
      'The_Straits_View_Duo.jpg', 'duo-living.jpg', 'duo-kitchen.jpg',
      'duo-bedroom.jpg', 'duo-bathroom.jpg', 'duo-entrance.jpg'
    ]
  };

  function getCurrentProjectFileName() {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const pageName = (pathParts.at(-1) || 'index').toLowerCase();
    return pageName.endsWith('.html') ? pageName : `${pageName}.html`;
  }

  function mapProjectImages() {
    const pageName = getCurrentProjectFileName();
    const folder = projectImageFolders[pageName];
    if (!folder) return;

    document.querySelectorAll('img[src]').forEach((image) => {
      const source = image.getAttribute('src');
      if (!source || /^(https?:|data:|#)/i.test(source) || /^(logo-razi|razi-profile)/i.test(source)) return;
      const originalName = source.split('/').pop();
      const imageName = imageAliases[originalName] || originalName;
      image.setAttribute('src', `/images/${folder}/${imageName}`);
    });
  }

  function addGalleryImages() {
    const pageName = getCurrentProjectFileName();
    const folder = projectImageFolders[pageName];
    const imageNames = projectGalleryImages[pageName];
    const track = document.querySelector('#gallery .gallery-track');
    if (!folder || !imageNames || !track) return;

    const currentImages = new Set(
      [...track.querySelectorAll('img')].map((image) => image.getAttribute('src').split('/').pop())
    );
    imageNames.forEach((imageName) => {
      if (currentImages.has(imageName)) return;
      const slide = document.createElement('div');
      slide.className = 'gallery-slide';
      const image = document.createElement('img');
      image.src = `/images/${folder}/${imageName}`;
      image.alt = 'Galeri projek';
      image.loading = 'lazy';
      slide.appendChild(image);
      track.appendChild(slide);
    });
    track.querySelectorAll('.gallery-slide[onclick]').forEach((slide) => slide.removeAttribute('onclick'));
  }

  function removeLegacyAccentInteractions() {
    document.querySelectorAll('[onmouseover*="#e8"], [onmouseout*="var(--gold)"]').forEach((element) => {
      element.removeAttribute('onmouseover');
      element.removeAttribute('onmouseout');
    });
  }

  const headerLinks = [
    ['Home', 'index.html'],
    ['Listing', 'senaraihartanah.html'],
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
    brand.innerHTML = '<img src="logo-razi-wordmark.svg" alt="Razi Property JB">';

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
    mapProjectImages();
    addGalleryImages();
    removeLegacyAccentInteractions();
    createHeader();
    document.querySelector('#mobileMenu')?.remove();
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
