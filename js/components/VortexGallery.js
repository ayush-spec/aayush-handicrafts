/**
 * VortexGallery — Cinematic 3D rotating product ring
 * Features: Auto-rotation, momentum drag, depth blur/opacity,
 *           click-to-select with detach animation, mobile fallback.
 */
export function createVortexGallery(container, items, onSelectProduct) {
    const vortexRing = document.createElement('div');
    vortexRing.className = 'vortex-ring';

    let rotationY = 0;
    const autoSpeed = 0.06;
    let isDragging = false;
    let lastX = 0;
    let velocity = 0;
    let isHovered = false;
    let animationFrameId;
    const numItems = items.length;

    // Build each card on the ring
    const domItems = items.map((item, index) => {
        const el = document.createElement('div');
        el.className = 'vortex-item';
        el.dataset.id = item.id;

        const img = document.createElement('img');
        img.src = item.images[0];
        img.alt = item.title;
        img.loading = index < 3 ? 'eager' : 'lazy';

        el.appendChild(img);
        vortexRing.appendChild(el);

        // Click to contemplate
        el.addEventListener('click', () => {
            if (Math.abs(velocity) > 0.3) return;
            if (!onSelectProduct) return;

            // Detach animation
            el.style.zIndex = '999';
            el.style.transition = 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1), filter 500ms, opacity 500ms';
            const currentTransform = el.style.transform || '';
            el.style.transform = currentTransform + ' scale(1.12)';

            setTimeout(() => {
                el.style.zIndex = '';
                el.style.transition = '';
                el.style.transform = '';
                onSelectProduct(item.id);
            }, 480);
        });

        return { el, index };
    });

    container.appendChild(vortexRing);

    // Add instruction hint
    const hint = document.createElement('div');
    hint.className = 'vortex-hint label-caps';
    hint.textContent = 'Drag to explore  \u00b7  Click to contemplate';
    container.appendChild(hint);

    function updateTransforms() {
        const isMobile = window.innerWidth < 768;
        const radius = isMobile ? 0 : Math.max(window.innerWidth * 0.65, 800);

        if (isMobile) {
            domItems.forEach(({ el }) => {
                el.style.transform = '';
                el.classList.remove('is-front', 'is-back');
            });
            vortexRing.style.transform = '';
            return;
        }

        vortexRing.style.transform = `translateZ(${-radius}px) rotateY(${rotationY}deg)`;

        domItems.forEach(({ el, index }) => {
            const angle = (index / numItems) * 360;
            el.style.transform = `rotateY(${angle}deg) translateZ(${radius}px) rotateY(${-rotationY - angle}deg)`;

            let currentAngle = (angle + rotationY) % 360;
            if (currentAngle < 0) currentAngle += 360;

            if (currentAngle > 90 && currentAngle < 270) {
                el.classList.add('is-back');
                el.classList.remove('is-front');
            } else {
                el.classList.remove('is-back');
                el.classList.add('is-front');
            }
        });
    }

    function animate() {
        // Respect prefers-reduced-motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            updateTransforms();
            return;
        }

        if (!isDragging) {
            if (Math.abs(velocity) > 0.01) {
                rotationY += velocity;
                velocity *= 0.95;
            } else if (!isHovered) {
                rotationY -= autoSpeed;
            }
        }
        updateTransforms();
        animationFrameId = requestAnimationFrame(animate);
    }

    // --- Drag interaction ---
    const onStart = (clientX) => {
        if (window.innerWidth < 768) return;
        isDragging = true;
        lastX = clientX;
        velocity = 0;
    };

    const onMove = (clientX) => {
        if (!isDragging || window.innerWidth < 768) return;
        const dx = clientX - lastX;
        rotationY += dx * 0.3;
        velocity = dx * 0.3;
        lastX = clientX;
    };

    const onEnd = () => { isDragging = false; };

    container.addEventListener('mousedown', (e) => onStart(e.clientX));
    window.addEventListener('mousemove', (e) => onMove(e.clientX));
    window.addEventListener('mouseup', onEnd);

    container.addEventListener('touchstart', (e) => onStart(e.touches[0].clientX), { passive: true });
    window.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX), { passive: true });
    window.addEventListener('touchend', onEnd);

    container.addEventListener('mouseenter', () => { isHovered = true; });
    container.addEventListener('mouseleave', () => { isHovered = false; });

    window.addEventListener('resize', updateTransforms);

    // Pause animation when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationFrameId);
        } else {
            animate();
        }
    });

    animate();

    return {
        destroy() {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('mousemove', (e) => onMove(e.clientX));
            window.removeEventListener('mouseup', onEnd);
            window.removeEventListener('touchmove', (e) => onMove(e.touches[0].clientX));
            window.removeEventListener('touchend', onEnd);
            window.removeEventListener('resize', updateTransforms);
            container.innerHTML = '';
        }
    };
}
