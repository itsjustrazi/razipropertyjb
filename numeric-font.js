/* Applies Rubik only to visible numeric values without changing the body copy. */
(function () {
  function loadRubik() {
    if (document.querySelector('link[data-rubik-font]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.dataset.rubikFont = 'true';
    link.href = 'https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&display=swap';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.textContent = '.numeric-font { font-family: "Rubik", "Inter", Arial, sans-serif !important; font-variant-numeric: tabular-nums lining-nums; }';
    document.head.appendChild(style);
  }

  function applyNumericFont() {
    loadRubik();
    const ignoredTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'OPTION']);
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || ignoredTags.has(parent.tagName) || parent.closest('.numeric-font')) return NodeFilter.FILTER_REJECT;
        return /\d/.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const parts = node.nodeValue.split(/(\d(?:[\d,./:+×xX–-]*\d)?)/g);
      if (parts.length < 2) return;
      const fragment = document.createDocumentFragment();
      parts.forEach((part, index) => {
        if (index % 2 === 1) {
          const number = document.createElement('span');
          number.className = 'numeric-font';
          number.textContent = part;
          fragment.appendChild(number);
        } else if (part) {
          fragment.appendChild(document.createTextNode(part));
        }
      });
      node.parentNode.replaceChild(fragment, node);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyNumericFont, { once: true });
  } else {
    applyNumericFont();
  }
}());
