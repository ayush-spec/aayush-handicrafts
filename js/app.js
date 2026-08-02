import { products } from './data.js';
import { createVortexGallery } from './components/VortexGallery.js';
import { createHoverMaskReveal } from './components/HoverMaskReveal.js';
import { createCinematicScroll } from './components/CinematicScroll.js';
// ==========================================================================
// APPLICATION STATE
// ==========================================================================
const appRoot = document.getElementById('app-root');
let currentPage = 'home';
let currentGallery = null;
let currentCategoryFilter = 'all';
let productModal = null;
let contactFormHandler = null;

// ==========================================================================
// PRODUCT DETAIL MODAL (Slide-out Drawer)
// ==========================================================================
class ProductModal {
    constructor(onEnquireCallback) {
        this.onEnquire = onEnquireCallback;
        this.activeProduct = null;
        this.activeImageIdx = 0;
        this._createDom();
    }

    _createDom() {
        this.overlay = document.createElement('div');
        this.overlay.id = 'product-modal';
        this.overlay.className = 'modal-overlay';
        document.body.appendChild(this.overlay);

        this.overlay.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" aria-label="Close details">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <div class="modal-img-wrap">
                    <img class="modal-img" src="" alt="">
                </div>
                <div class="modal-gallery-controls" id="modal-gallery-controls"></div>
                <div>
                    <span class="label-caps modal-category"></span>
                    <h2 class="modal-title"></h2>
                </div>
                <p class="modal-story"></p>
                <div>
                    <h3 class="label-caps" style="margin-bottom: 1rem; border-bottom: 1px solid var(--color-border); padding-bottom: 8px;">Atelier Specifications</h3>
                    <table class="spec-table">
                        <tbody>
                            <tr><td class="label">Dimensions</td><td class="value spec-size"></td></tr>
                            <tr><td class="label">Net Weight</td><td class="value spec-weight"></td></tr>
                            <tr><td class="label">Material Purity</td><td class="value spec-material"></td></tr>
                            <tr><td class="label">Available Sizes</td><td class="value spec-sizes"></td></tr>
                        </tbody>
                    </table>
                </div>
                <div style="display: flex; flex-direction: column; gap: 1.5rem; margin-top: auto;">
                    <button class="btn-enquire">Enquire About This Piece</button>
                    <a class="btn-enquire" style="background: transparent; color: var(--color-text); border-color: var(--color-border);" href="" target="_blank" id="modal-etsy-link">View on Etsy &#8599;</a>
                    <p class="craftsmanship-note">
                        Every piece is a work of art handcrafted with love and compassion, standing out for the little irregularities which enhance its intricate design and bring imperfect patterns of grace and leisure to life.
                    </p>
                </div>
            </div>
        `;

        // Bindings
        this.overlay.querySelector('.modal-close').addEventListener('click', () => this.close());
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });
        this.overlay.querySelector('.btn-enquire').addEventListener('click', () => {
            if (this.activeProduct && this.onEnquire) {
                this.onEnquire(this.activeProduct);
                this.close();
            }
        });

        // Keyboard escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close();
        });
    }

    open(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        this.activeProduct = product;
        this.activeImageIdx = 0;
        this._updateImage();

        // Gallery buttons
        const controls = this.overlay.querySelector('#modal-gallery-controls');
        controls.innerHTML = '';
        if (product.images.length > 1) {
            product.images.forEach((_, idx) => {
                const btn = document.createElement('button');
                btn.className = `modal-gallery-btn ${idx === 0 ? 'active' : ''}`;
                btn.textContent = `View ${idx + 1}`;
                btn.addEventListener('click', () => {
                    this.activeImageIdx = idx;
                    this._updateImage();
                    controls.querySelectorAll('.modal-gallery-btn').forEach((b, i) => {
                        b.classList.toggle('active', i === idx);
                    });
                });
                controls.appendChild(btn);
            });
        }

        // Fill data
        this.overlay.querySelector('.modal-category').textContent = product.category;
        this.overlay.querySelector('.modal-title').textContent = product.title;
        this.overlay.querySelector('.modal-story').textContent = `\u201c${product.description}\u201d`;

        this.overlay.querySelector('.spec-size').textContent = product.specs.size;
        this.overlay.querySelector('.spec-weight').textContent = product.specs.weight;
        this.overlay.querySelector('.spec-material').textContent = product.specs.material;
        this.overlay.querySelector('.spec-sizes').textContent = product.specs.availableSizes;

        // Etsy link
        const etsyLink = this.overlay.querySelector('#modal-etsy-link');
        if (product.etsyLink) {
            etsyLink.href = product.etsyLink;
            etsyLink.style.display = '';
        } else {
            etsyLink.style.display = 'none';
        }

        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    _updateImage() {
        if (!this.activeProduct) return;
        const img = this.overlay.querySelector('.modal-img');
        img.src = this.activeProduct.images[this.activeImageIdx];
        img.alt = `${this.activeProduct.title} \u2014 view ${this.activeImageIdx + 1}`;
    }

    close() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
        this.activeProduct = null;
    }
}

// ==========================================================================
// CONTACT FORM HANDLER
// ==========================================================================
class ContactFormHandler {
    constructor() {}

    init() {
        this.form = document.getElementById('enquiry-form');
        this.success = document.getElementById('enquiry-success');
        if (!this.form) return;

        // Populate product select
        const select = this.form.querySelector('#enquiry-interest');
        if (select) {
            select.innerHTML = '<option value="" disabled selected>Select a piece of interest\u2026</option>';
            products.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.title;
                opt.textContent = `${p.title} (${p.specs.material})`;
                select.appendChild(opt);
            });
        }

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this._submit();
        });
    }

    prefill(product) {
        setTimeout(() => {
            const select = document.getElementById('enquiry-interest');
            if (select) select.value = product.title;
        }, 80);
    }

    _submit() {
        const name = this.form.querySelector('#enquiry-name').value;
        const email = this.form.querySelector('#enquiry-email').value;
        const piece = this.form.querySelector('#enquiry-interest').value;

        if (!name || !email || !piece) {
            alert('Please complete the required fields.');
            return;
        }

        this.form.style.display = 'none';
        if (this.success) {
            this.success.style.display = 'block';
            this.success.innerHTML = `
                <div class="form-success-container">
                    <h3 class="form-success-title">Enquiry Received</h3>
                    <p class="form-success-text">
                        Your interest in the <strong>${piece}</strong> has been received at our Jaipur atelier. A design counsellor will reach you at <strong>${email}</strong> to coordinate sizing, purity selection, and delivery.
                    </p>
                </div>
            `;
        }
    }
}

// ==========================================================================
// ROUTER & NAVIGATION
// ==========================================================================
function navigateTo(pageId) {
    if (pageId === currentPage && appRoot.children.length > 0) return;

    if (currentGallery) {
        currentGallery.destroy();
        currentGallery = null;
    }

    currentPage = pageId;

    // Update nav
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
        link.classList.toggle('active', link.dataset.page === pageId);
    });

    // Close mobile menu
    const nav = document.getElementById('site-nav');
    const toggle = document.getElementById('mobile-menu-toggle');
    if (nav) nav.classList.remove('open');
    if (toggle) toggle.classList.remove('open');

    renderPage(pageId);
    window.location.hash = pageId;
    window.scrollTo({ top: 0, behavior: 'instant' });
}

function renderPage(pageId) {
    appRoot.innerHTML = '';
    appRoot.className = `page ${pageId} fade-in`;

    switch (pageId) {
        case 'home': renderHome(); break;
        case 'collection': renderCollection(); break;
        case 'our-craft': renderOurCraft(); break;
        case 'contact': renderContact(); break;
        case 'faq': renderFaq(); break;
        default: renderHome();
    }
}

// ==========================================================================
// PAGE RENDERERS
// ==========================================================================
function renderHome() {
    // 1. Vortex Hero
    const heroSection = document.createElement('section');
    heroSection.className = 'vortex-container';
    currentGallery = createVortexGallery(heroSection, products, (id) => productModal.open(id));
    appRoot.appendChild(heroSection);

    // 2. Brand Statement
    const statement = document.createElement('section');
    statement.className = 'brand-statement';
    statement.innerHTML = `
        <span class="label-caps">A Philosophy of Craft</span>
        <p>\u201cEvery piece is a work of art handcrafted with love and compassion, celebrated for the little irregularities which enhance its intricate design, bringing imperfect patterns of grace and leisure to life.\u201d</p>
    `;
    appRoot.appendChild(statement);

    // Cinematic Scroll for Jewellery Image
    createCinematicScroll(appRoot, 'assets/products/bangle.jpg');

    // 3. Curated Pieces
    const featured = document.createElement('section');
    featured.className = 'container';
    featured.style.paddingBottom = 'clamp(4rem, 8vw, 8rem)';

    const header = document.createElement('div');
    header.className = 'section-header';
    header.innerHTML = `
        <h2>Curated Pieces</h2>
        <a href="#collection" data-page="collection">View Full Collection</a>
    `;
    header.querySelector('a').addEventListener('click', (e) => { e.preventDefault(); navigateTo('collection'); });
    featured.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'product-grid';
    products.slice(0, 3).forEach(p => createHoverMaskReveal(grid, p, (id) => productModal.open(id)));
    featured.appendChild(grid);

    appRoot.appendChild(featured);
}

function renderCollection() {
    const section = document.createElement('section');
    section.className = 'container';
    section.style.paddingTop = 'clamp(3rem, 6vw, 5rem)';
    section.style.paddingBottom = 'clamp(4rem, 8vw, 8rem)';

    section.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <span class="label-caps" style="display:block; margin-bottom:1rem;">Jaipur Silver Atelier</span>
            <h1>The Collection</h1>
        </div>
    `;

    // Filter tabs
    const filters = document.createElement('ul');
    filters.className = 'filter-tabs';
    const categories = ['all', 'Jewellery', 'Pooja & Ritual', 'Home & Tableware'];
    categories.forEach(cat => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.className = `filter-tab-btn ${cat === currentCategoryFilter ? 'active' : ''}`;
        btn.textContent = cat === 'all' ? 'All Pieces' : cat;
        btn.addEventListener('click', () => {
            filters.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategoryFilter = cat;
            renderGrid();
        });
        li.appendChild(btn);
        filters.appendChild(li);
    });
    section.appendChild(filters);

    // Grid container
    const grid = document.createElement('div');
    grid.className = 'product-grid';
    grid.style.marginTop = 'clamp(2rem, 4vw, 3rem)';
    section.appendChild(grid);

    const renderGrid = () => {
        grid.innerHTML = '';
        const items = currentCategoryFilter === 'all' ? products : products.filter(p => p.category === currentCategoryFilter);
        items.forEach(p => createHoverMaskReveal(grid, p, (id) => productModal.open(id)));
    };
    renderGrid();

    appRoot.appendChild(section);
}

function renderOurCraft() {
    const section = document.createElement('section');
    section.className = 'container';
    section.style.maxWidth = '1100px';
    section.style.paddingTop = 'clamp(3rem, 6vw, 5rem)';
    section.style.paddingBottom = 'clamp(4rem, 8vw, 8rem)';

    section.innerHTML = `
        <div style="text-align: center; margin-bottom: clamp(3rem, 6vw, 5rem);">
            <span class="label-caps" style="display:block; margin-bottom:1rem;">Jaipur Tradition</span>
            <h1>Irregularities As Grace</h1>
        </div>
        <div class="craft-layout">
            <div class="craft-img-block">
                <img src="assets/products/Kamadhenu Cow with Calf/1.webp" alt="Silver craftsmanship detail" loading="lazy">
            </div>
            <div class="craft-editorial">
                <div class="craft-section">
                    <span class="label-caps" style="display:block; margin-bottom:0.5rem;">Legacy</span>
                    <h3>The Silversmiths of Jaipur</h3>
                    <p>For centuries, Jaipur has served as the epicentre of luxury silver handicraft in India. Our family workshop employs generational artisans who still use hand-cast mouldings, intricate chasing tools, and traditional polishing leaves. We reject uniform mechanical stamping; we believe the soul of silver is forged by the hands that touch it.</p>
                </div>
                <div class="craft-section">
                    <span class="label-caps" style="display:block; margin-bottom:0.5rem;">Purity</span>
                    <h3>92.5% Sterling vs 97% Pure</h3>
                    <p>Our pieces range from 92.5% sterling silver for durable jewellery like bangles and anklets, up to 97% purity for ritual pooja thalis and home tableware. Tableware remains tarnish-resistant and brightly lustrous, while ornaments maintain structural integrity and lifelong wearability.</p>
                </div>
                <div class="craft-section">
                    <span class="label-caps" style="display:block; margin-bottom:0.5rem;">The Creed</span>
                    <h3>Beautifully Imperfect</h3>
                    <p>If you look closely at our scalloped Pooja thalis or embossed water jugs, you will notice minuscule variations in hexagonal outlines, slight weight disparities, and micro-marks of chisel hammer strokes. These are not flaws \u2014 they are the hallmarks of authentic manual crafting. Each irregularity is a marker of time, devotion, and character.</p>
                </div>
            </div>
        </div>
    `;
    appRoot.appendChild(section);
}

function renderContact() {
    const section = document.createElement('section');
    section.className = 'container';
    section.style.maxWidth = '650px';
    section.style.paddingTop = 'clamp(3rem, 6vw, 5rem)';
    section.style.paddingBottom = 'clamp(4rem, 8vw, 8rem)';

    section.innerHTML = `
        <div style="text-align: center; margin-bottom: clamp(2.5rem, 5vw, 4rem);">
            <span class="label-caps" style="display:block; margin-bottom:1rem;">Atelier Inquiry</span>
            <h1>Contemplate &amp; Request</h1>
            <p style="color: var(--color-text-muted); font-family: var(--font-heading); font-style: italic; font-size: 1.15rem; margin-top: 0.5rem;">\u201cLet us customize your piece of imperfect grace.\u201d</p>
        </div>

        <form class="enquiry-form" id="enquiry-form">
            <div class="form-group">
                <label for="enquiry-name">Your Full Name *</label>
                <input type="text" id="enquiry-name" required>
            </div>
            <div class="form-group">
                <label for="enquiry-email">Email Address *</label>
                <input type="email" id="enquiry-email" required>
            </div>
            <div class="form-group">
                <label for="enquiry-interest">Piece of Interest *</label>
                <select id="enquiry-interest" required></select>
            </div>
            <div class="form-group">
                <label for="enquiry-message">Special Customization / Message</label>
                <textarea id="enquiry-message" rows="4" placeholder="Mention size requests, engravings, or temple setups\u2026"></textarea>
            </div>
            <button type="submit" class="btn-submit">Submit Enquiry</button>
        </form>
        <div id="enquiry-success" style="display: none;"></div>
    `;
    appRoot.appendChild(section);

    // Init contact form after DOM is in place
    contactFormHandler.init();
}

function renderFaq() {
    const section = document.createElement('section');
    section.className = 'container';
    section.style.maxWidth = '800px';
    section.style.paddingTop = 'clamp(3rem, 6vw, 5rem)';
    section.style.paddingBottom = 'clamp(4rem, 8vw, 8rem)';

    const faqs = [
        { q: 'How do I purchase a piece?', a: 'Most of our collection can be acquired through our Etsy shop (linked in the navigation). For bespoke pieces, custom engravings, or tableware setups, please use the Enquire form to reach our Jaipur atelier.' },
        { q: 'What is the purity of your silver?', a: 'We work exclusively with 92.5% (Sterling) and 97% purity silver. Bangles and anklets use 92.5% for durability, while icons, Charan Padukas, and Pooja tableware sets use 97% for maximum lustre.' },
        { q: 'Do you ship internationally?', a: 'Yes, all shipments coordinate through secure express shipping with full tracking and insurance from India.' },
        { q: 'Are the irregularities intentional?', a: 'Absolutely. Every piece stands out for its minute hand-carved details and shape variations which enhance the intricate design. These hammer strokes and texture shifts represent the grace and soul of true handicraft.' }
    ];

    let html = `
        <div style="text-align: center; margin-bottom: clamp(2.5rem, 5vw, 4rem);">
            <h1>Frequently Asked Questions</h1>
        </div>
        <div>
    `;
    faqs.forEach(f => {
        html += `<div class="faq-item"><h3>${f.q}</h3><p>${f.a}</p></div>`;
    });
    html += '</div>';
    section.innerHTML = html;
    appRoot.appendChild(section);
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Modal & Form
    contactFormHandler = new ContactFormHandler();
    productModal = new ProductModal((product) => {
        contactFormHandler.prefill(product);
        navigateTo('contact');
    });

    // Navigation
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.dataset.page);
        });
    });

    // Mobile menu toggle
    const toggle = document.getElementById('mobile-menu-toggle');
    const nav = document.getElementById('site-nav');
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('open');
            toggle.classList.toggle('open');
        });
        // Close menu on link click
        nav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                toggle.classList.remove('open');
            });
        });
    }

    // Hash routing
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '') || 'home';
        navigateTo(hash);
    });

    const initialHash = window.location.hash.replace('#', '') || 'home';
    navigateTo(initialHash);
});
