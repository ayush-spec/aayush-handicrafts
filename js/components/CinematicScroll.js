export function createCinematicScroll(parentElement, imageUrl) {
    const section = document.createElement('section');
    section.className = 'cinematic-scroll-section';
    
    section.innerHTML = `
        <div class="cinematic-sticky">
            <div class="cinematic-bg">
                <img src="${imageUrl}" alt="Silver Jewellery Detail" class="cinematic-img">
                <div class="cinematic-overlay"></div>
            </div>
            <div class="cinematic-content">
                <span class="label-caps cinematic-label">The Art of Adornment</span>
                <h2 class="cinematic-title">Grace in Every Detail</h2>
                <p class="cinematic-text">Observe the subtle play of light upon pure silver, tracing the intricate patterns forged by hands that understand the soul of the metal.</p>
            </div>
        </div>
    `;
    
    parentElement.appendChild(section);

    const img = section.querySelector('.cinematic-img');
    const content = section.querySelector('.cinematic-content');
    
    const handleScroll = () => {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Progress from 0 (top of section reaches top of viewport) to 1 (bottom of section reaches bottom of viewport)
        let progress = -rect.top / (rect.height - windowHeight);
        progress = Math.max(0, Math.min(1, progress));
        
        // Zoom image slightly as we scroll
        img.style.transform = `scale(${1 + progress * 0.25})`;
        
        // Fade in text halfway through the scroll
        if (progress > 0.2) {
            let contentProgress = Math.min(1, (progress - 0.2) * 2.5);
            content.style.opacity = contentProgress;
            content.style.transform = `translateY(${(1 - contentProgress) * 40}px)`;
        } else {
            content.style.opacity = 0;
            content.style.transform = `translateY(40px)`;
        }
    };
    
    // Use observer to only listen to scroll when section is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                window.addEventListener('scroll', handleScroll, { passive: true });
                handleScroll(); // Init
            } else {
                window.removeEventListener('scroll', handleScroll);
            }
        });
    });
    
    observer.observe(section);
}
