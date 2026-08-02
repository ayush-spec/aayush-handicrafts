/**
 * HoverMaskReveal — Cursor-tracking circular spotlight reveal
 * Desktop: tracks mouse position to reveal full-color image through mask
 * Mobile: IntersectionObserver triggers scroll-based wipe reveal
 */
export function createHoverMaskReveal(container, product, onClickCallback) {
    const el = document.createElement('div');
    el.className = 'hover-reveal-container';

    // Base image (desaturated silhouette)
    const baseImg = document.createElement('img');
    baseImg.className = 'hover-reveal-base';
    baseImg.src = product.images[0];
    baseImg.alt = product.title;
    baseImg.loading = 'lazy';

    // Color image (revealed under mask)
    const colorImg = document.createElement('img');
    colorImg.className = 'hover-reveal-color';
    colorImg.src = product.images[0];
    colorImg.alt = `${product.title} — revealed`;
    colorImg.loading = 'lazy';

    // Info overlay
    const overlay = document.createElement('div');
    overlay.className = 'hover-reveal-overlay';

    const title = document.createElement('div');
    title.className = 'product-title';
    title.textContent = product.title;

    const specs = document.createElement('div');
    specs.className = 'product-specs';
    specs.innerHTML = `
        <span>${product.specs.material}</span>
        <span>${product.specs.weight}</span>
    `;

    overlay.appendChild(title);
    overlay.appendChild(specs);

    el.appendChild(baseImg);
    el.appendChild(colorImg);
    el.appendChild(overlay);

    // Click handler
    if (onClickCallback) {
        el.addEventListener('click', () => onClickCallback(product.id));
    }

    // Desktop: cursor tracking
    el.addEventListener('mousemove', (e) => {
        if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.style.setProperty('--mouseX', `${x}px`);
        el.style.setProperty('--mouseY', `${y}px`);
    });

    // Mobile: scroll-triggered reveal via IntersectionObserver
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                el.classList.toggle('is-visible', entry.isIntersecting);
            });
        }, { threshold: 0.15 });
        observer.observe(el);
    }

    container.appendChild(el);
    return { el };
}
