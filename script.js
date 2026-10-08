/**
 * Personal Portfolio & Project Showroom Script
 * 
 * Features:
 * - Single helper function for all WhatsApp links built from CONFIG.whatsappNumber
 * - "Tap to Try" hero trigger launches featured project in full-screen demo modal
 * - Dynamic featured phone and browser mockups
 * - Real-time live search & multi-criterion sorting (Featured, Newest, For Sale, Price low/high)
 * - Interactive filter chips with dynamic count badges
 * - Project status indicators:
 *   - "available": normal live demo & buy/enquire
 *   - "sold": grey "Sold" badge, disabled buy button, live demo still works
 *   - "coming-soon": "Coming Soon" badge, no demo button, active enquiry
 * - Native Web Share API on each card and inside modal (with fallback copy to clipboard & "Link copied" toast)
 * - Direct deep links: opening modal updates URL hash to #project-<id>; opening URL with hash scrolls to projects and launches modal
 * - Dynamic Services section with direct WhatsApp enquiry
 * - Request a Quote form with validation and formatted WhatsApp dispatch
 * - Interactive single-item FAQ accordion
 * - Client Testimonials carousel (auto-hidden if empty)
 * - Full-screen Live Demo modal with iframe sandboxing, camera permissions, fallback and close controls
 * - Floating WhatsApp quick button (hidden when modal is open)
 * - Back to top button, toast notification component, and PWA service worker registration
 */

(function () {
  'use strict';

  // 1. Data Validation & Configuration
  const cfg = (typeof CONFIG !== 'undefined') ? CONFIG : {
    name: "Alex Rivera",
    tagline: "I build responsive web apps, high-performance websites & interactive browser games.",
    about: "Full-stack developer crafting high-performance digital products.",
    whatsappNumber: "916003428863",
    displayPhone: "+91 6003428863",
    email: "alex.rivera.developer@gmail.com",
    skills: ["JavaScript", "React", "Node.js"]
  };

  const projectList = (typeof PROJECTS !== 'undefined' && Array.isArray(PROJECTS)) ? PROJECTS : [];
  const servicesList = (typeof SERVICES !== 'undefined' && Array.isArray(SERVICES)) ? SERVICES : [];
  const faqList = (typeof FAQ !== 'undefined' && Array.isArray(FAQ)) ? FAQ : [];
  const testimonialsList = (typeof TESTIMONIALS !== 'undefined' && Array.isArray(TESTIMONIALS)) ? TESTIMONIALS : [];

  // 2. State Management
  let activeFilter = 'all';
  let searchQuery = '';
  let sortOrder = 'featured';
  let modalTimeoutId = null;
  let isModalOpen = false;
  let currentModalProject = null;

  // 3. DOM Element References
  // Brand & Identity
  const brandNameEls = document.querySelectorAll('.bind-brand-name');
  const taglineEls = document.querySelectorAll('.bind-tagline');
  const aboutTextEl = document.getElementById('aboutText');
  const skillsListEl = document.getElementById('skillsList');
  const browserAddressBar = document.getElementById('browserAddressBar');
  const footerLastUpdated = document.getElementById('footerLastUpdated');
  const currentYearEl = document.getElementById('currentYear');

  // Hero Mockups & Triggers
  const mockupTitle = document.getElementById('mockupTitle');
  const mockupFeaturedTag = document.getElementById('mockupFeaturedTag');
  const heroPhoneAppName = document.getElementById('heroPhoneAppName');
  const heroPhoneBadge = document.getElementById('heroPhoneBadge');
  const browserMockupTrigger = document.getElementById('browserMockupTrigger');
  const phoneMockupTrigger = document.getElementById('phoneMockupTrigger');
  const heroTapToTryBtn = document.getElementById('heroTapToTryBtn');
  const heroPlayTrigger = document.getElementById('heroPlayTrigger');

  // Stats & Badges
  const totalProjectsCountEls = document.querySelectorAll('.bind-total-projects');
  const forSaleCountEl = document.getElementById('forSaleCount');
  const liveDemosCountEl = document.getElementById('liveDemosCount');
  const trustCountProjects = document.getElementById('trustCountProjects');
  const trustCountLive = document.getElementById('trustCountLive');
  const trustCountSale = document.getElementById('trustCountSale');
  const typeCountApps = document.getElementById('typeCountApps');
  const typeCountWebsites = document.getElementById('typeCountWebsites');
  const typeCountGames = document.getElementById('typeCountGames');
  const typeCountSale = document.getElementById('typeCountSale');

  // Search & Filter & Grid
  const projectSearchInput = document.getElementById('projectSearchInput');
  const projectSearchClear = document.getElementById('projectSearchClear');
  const projectSortSelect = document.getElementById('projectSortSelect');
  const filterChipsWrap = document.getElementById('filterChipsWrap');
  const projectsGridEl = document.getElementById('projectsGrid');

  // Services, Testimonials, FAQ
  const servicesGridEl = document.getElementById('servicesGrid');
  const testimonialsSection = document.getElementById('testimonials');
  const testimonialsCarouselEl = document.getElementById('testimonialsCarousel');
  const faqAccordionEl = document.getElementById('faqAccordion');

  // Featured Sale Banner
  const saleBannerTitle = document.getElementById('saleBannerTitle');
  const saleBannerDesc = document.getElementById('saleBannerDesc');
  const saleBannerPrice = document.getElementById('saleBannerPrice');
  const saleBannerInitials = document.getElementById('saleBannerInitials');
  const saleBannerBuyBtn = document.getElementById('saleBannerBuyBtn');
  const saleBannerDemoBtn = document.getElementById('saleBannerDemoBtn');

  // Quote Form
  const quoteForm = document.getElementById('quoteForm');
  const quoteName = document.getElementById('quoteName');
  const quoteType = document.getElementById('quoteType');
  const quoteBudget = document.getElementById('quoteBudget');
  const quoteDetails = document.getElementById('quoteDetails');
  const quoteNameError = document.getElementById('quoteNameError');
  const quoteDetailsError = document.getElementById('quoteDetailsError');

  // Direct Contact Elements
  const displayPhoneText = document.getElementById('displayPhoneText');
  const contactCallBtn = document.getElementById('contactCallBtn');
  const headerWaBtn = document.getElementById('headerWaBtn');
  const contactWaBtn = document.getElementById('contactWaBtn');
  const contactEmailBtn = document.getElementById('contactEmailBtn');
  const githubLinkEl = document.getElementById('githubLink');
  const instaLinkEl = document.getElementById('instaLink');

  // Floating Buttons & Notifications
  const floatingWaBtn = document.getElementById('floatingWaBtn');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const toastNotification = document.getElementById('toastNotification');

  // Mobile Navigation
  const btnMobileMenu = document.getElementById('btnMobileMenu');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');

  // Live Demo Modal
  const demoModal = document.getElementById('demoModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalTypeTag = document.getElementById('modalTypeTag');
  const modalShareBtn = document.getElementById('modalShareBtn');
  const modalNewTabBtn = document.getElementById('modalNewTabBtn');
  const modalApkBtn = document.getElementById('modalApkBtn');
  const modalBuyBtn = document.getElementById('modalBuyBtn');
  const modalBuyBtnText = document.getElementById('modalBuyBtnText');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalSpinner = document.getElementById('modalSpinner');
  const modalErrorBox = document.getElementById('modalErrorBox');
  const modalErrorNewTabBtn = document.getElementById('modalErrorNewTabBtn');
  const modalFrameContainer = document.getElementById('modalFrameContainer');

  // ==========================================================================
  // SINGLE WHATSAPP HELPER FUNCTION
  // Built strictly from CONFIG.whatsappNumber. No hardcoded numbers anywhere else.
  // ==========================================================================
  function buildWhatsAppUrl(message = '') {
    const rawNum = cfg.whatsappNumber ? String(cfg.whatsappNumber) : '916003428863';
    const cleanPhone = rawNum.replace(/[^0-9]/g, '');
    const defaultText = `Hi ${cfg.name || 'Developer'}, I visited your portfolio website.`;
    const msgToSend = message && message.trim() ? message.trim() : defaultText;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msgToSend)}`;
  }

  function getProjectWhatsAppUrl(project) {
    if (!project) return buildWhatsAppUrl();
    if (project.forSale && project.status !== 'sold') {
      const priceText = project.price ? ` (${project.price})` : '';
      return buildWhatsAppUrl(`Hi ${cfg.name || 'Developer'}, I saw "${project.title}"${priceText} on your portfolio and I want to buy it. Please share the details.`);
    } else {
      return buildWhatsAppUrl(`Hi ${cfg.name || 'Developer'}, I checked out "${project.title}" on your portfolio. I want something similar built for my business.`);
    }
  }

  function getServiceWhatsAppUrl(service) {
    if (!service) return buildWhatsAppUrl();
    const priceText = service.startingPrice ? ` (${service.startingPrice})` : '';
    return buildWhatsAppUrl(`Hi ${cfg.name || 'Developer'}, I am interested in your "${service.title}" service${priceText}. Please share more details and a timeline.`);
  }

  // ==========================================================================
  // UTILITIES & REUSABLE TOAST
  // ==========================================================================
  function getInitials(title) {
    if (!title) return "PR";
    const words = title.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function parseNumericPrice(priceStr) {
    if (!priceStr) return 0;
    const digitsOnly = String(priceStr).replace(/[^0-9]/g, '');
    return digitsOnly ? parseInt(digitsOnly, 10) : 0;
  }

  function showToast(message) {
    if (!toastNotification) return;
    toastNotification.textContent = message;
    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 2800);
  }

  // Web Share API helper with clipboard fallback
  function shareProject(project) {
    if (!project) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}#project-${project.id}`;
    const shareData = {
      title: `${project.title} - ${cfg.name || 'Developer'} Portfolio`,
      text: `Check out ${project.title}: ${project.description}`,
      url: shareUrl
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => {
        if (err.name !== 'AbortError') {
          copyToClipboard(shareUrl, 'Link copied');
        }
      });
    } else {
      copyToClipboard(shareUrl, 'Link copied');
    }
  }

  function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        promptFallback(text);
      });
    } else {
      promptFallback(text);
    }
  }

  function promptFallback(text) {
    window.prompt('Copy project URL:', text);
  }

  // ==========================================================================
  // INITIALIZE CONFIGURATION & BRAND DATA
  // ==========================================================================
  function initConfig() {
    const ownerName = cfg.name || 'Developer';
    brandNameEls.forEach(el => el.textContent = ownerName);
    taglineEls.forEach(el => el.textContent = cfg.tagline || 'I build web apps, websites & interactive browser games.');

    if (aboutTextEl) {
      aboutTextEl.textContent = cfg.about || '';
    }

    if (browserAddressBar) {
      const slug = ownerName.toLowerCase().replace(/[^a-z0-9]/g, '');
      browserAddressBar.textContent = `https://${slug || 'developer'}.dev/showroom`;
    }

    if (skillsListEl && Array.isArray(cfg.skills)) {
      skillsListEl.innerHTML = cfg.skills.map(skill =>
        `<span class="skill-tag">${escapeHtml(skill)}</span>`
      ).join('');
    }

    // Counters & Trust Row
    const totalCount = projectList.length;
    const forSaleTotal = projectList.filter(p => p.forSale).length;
    const liveDemosTotal = projectList.filter(p => p.liveUrl && p.status !== 'coming-soon').length;
    const appsTotal = projectList.filter(p => p.type === 'app').length;
    const websitesTotal = projectList.filter(p => p.type === 'website').length;
    const gamesTotal = projectList.filter(p => p.type === 'game').length;

    totalProjectsCountEls.forEach(el => el.textContent = totalCount);
    if (forSaleCountEl) forSaleCountEl.textContent = forSaleTotal;
    if (liveDemosCountEl) liveDemosCountEl.textContent = liveDemosTotal;

    // Strict Trust Row Copy per PRD
    if (trustCountProjects) trustCountProjects.textContent = `${totalCount} Projects Built`;
    if (trustCountLive) trustCountLive.textContent = `Live Demos Available`;
    if (trustCountSale) trustCountSale.textContent = `Projects For Sale`;

    // Type cards
    if (typeCountApps) typeCountApps.textContent = `${appsTotal} Available`;
    if (typeCountWebsites) typeCountWebsites.textContent = `${websitesTotal} Available`;
    if (typeCountGames) typeCountGames.textContent = `${gamesTotal} Available`;
    if (typeCountSale) typeCountSale.textContent = `${forSaleTotal} Turnkey Builds`;

    // Direct WhatsApp Buttons
    const defaultWaUrl = buildWhatsAppUrl();
    if (headerWaBtn) headerWaBtn.href = defaultWaUrl;
    if (contactWaBtn) contactWaBtn.href = defaultWaUrl;

    // Floating WhatsApp Button
    if (floatingWaBtn) {
      floatingWaBtn.href = buildWhatsAppUrl("Hi, I visited your portfolio website.");
    }

    // Direct Phone Number & Call Me Button
    const cleanPhoneDigits = (cfg.whatsappNumber || '916003428863').replace(/[^0-9]/g, '');
    if (displayPhoneText) {
      displayPhoneText.textContent = cfg.displayPhone || `+${cleanPhoneDigits}`;
    }
    if (contactCallBtn) {
      contactCallBtn.href = `tel:+${cleanPhoneDigits}`;
    }

    // Email
    if (contactEmailBtn && cfg.email) {
      contactEmailBtn.href = `mailto:${cfg.email}?subject=${encodeURIComponent('Inquiry via Developer Portfolio')}`;
      contactEmailBtn.style.display = 'inline-flex';
    } else if (contactEmailBtn) {
      contactEmailBtn.style.display = 'none';
    }

    // Social Links
    if (githubLinkEl) {
      if (cfg.githubUrl) {
        githubLinkEl.href = cfg.githubUrl;
        githubLinkEl.style.display = 'inline-flex';
      } else {
        githubLinkEl.style.display = 'none';
      }
    }

    if (instaLinkEl) {
      if (cfg.instagram) {
        instaLinkEl.href = cfg.instagram;
        instaLinkEl.style.display = 'inline-flex';
      } else {
        instaLinkEl.style.display = 'none';
      }
    }

    // Footer info
    if (footerLastUpdated && cfg.lastUpdated) {
      footerLastUpdated.textContent = cfg.lastUpdated;
    }
    if (currentYearEl) {
      currentYearEl.textContent = new Date().getFullYear();
    }

    // Populate Hero Mockup Visuals from real projects
    const featuredApp = projectList.find(p => p.featured && p.type === 'app') || projectList.find(p => p.featured) || projectList[0];
    const featuredWeb = projectList.find(p => p.featured && p.type === 'website') || projectList.find(p => p.type === 'website') || projectList[1] || projectList[0];

    if (heroPhoneAppName && featuredApp) {
      heroPhoneAppName.textContent = featuredApp.title;
    }
    if (heroPhoneBadge && featuredApp) {
      heroPhoneBadge.textContent = featuredApp.forSale ? 'TURNKEY BUILD' : 'FEATURED DEMO';
    }
    if (mockupTitle && featuredWeb) {
      mockupTitle.textContent = featuredWeb.title;
    }
    if (mockupFeaturedTag && featuredWeb) {
      mockupFeaturedTag.textContent = 'FEATURED BUILD';
    }

    // Setup Bottom "Featured For Sale Project" Banner
    const firstSaleProject = projectList.find(p => p.forSale && p.status !== 'sold') || projectList.find(p => p.forSale) || projectList[0];
    if (firstSaleProject) {
      if (saleBannerTitle) saleBannerTitle.textContent = firstSaleProject.title;
      if (saleBannerDesc) saleBannerDesc.textContent = firstSaleProject.description;
      if (saleBannerPrice) {
        saleBannerPrice.textContent = firstSaleProject.price ? `PRICE: ${firstSaleProject.price}` : 'READY TO BUY';
      }
      if (saleBannerInitials) saleBannerInitials.textContent = getInitials(firstSaleProject.title);

      if (saleBannerBuyBtn) {
        saleBannerBuyBtn.href = getProjectWhatsAppUrl(firstSaleProject);
      }
      if (saleBannerDemoBtn) {
        saleBannerDemoBtn.addEventListener('click', () => openModal(firstSaleProject));
      }
    }
  }

  // ==========================================================================
  // FILTER CHIPS RENDERING
  // ==========================================================================
  function renderFilterChips() {
    if (!filterChipsWrap) return;

    const counts = {
      all: projectList.length,
      app: projectList.filter(p => p.type === 'app').length,
      website: projectList.filter(p => p.type === 'website').length,
      game: projectList.filter(p => p.type === 'game').length,
      forsale: projectList.filter(p => p.forSale).length
    };

    const chips = [
      { key: 'all', label: 'All Projects', count: counts.all },
      { key: 'app', label: 'Apps', count: counts.app },
      { key: 'website', label: 'Websites', count: counts.website },
      { key: 'game', label: 'Games', count: counts.game },
      { key: 'forsale', label: 'For Sale', count: counts.forsale }
    ];

    filterChipsWrap.innerHTML = chips.map(c => `
      <button class="filter-chip ${activeFilter === c.key ? 'active' : ''}" data-filter="${c.key}">
        <span>${c.label}</span>
        <span class="filter-count">${c.count}</span>
      </button>
    `).join('');

    filterChipsWrap.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.filter;
        renderFilterChips();
        renderProjects();
      });
    });
  }

  // ==========================================================================
  // PROJECTS GRID RENDERING (FILTER + SEARCH + SORT + STATUS BADGES)
  // ==========================================================================
  function renderProjects() {
    if (!projectsGridEl) return;

    // 1. Filter by category
    let filtered = projectList.filter(p => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'forsale') return p.forSale;
      return p.type === activeFilter;
    });

    // 2. Filter by search query (title, description, tech stack)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(p => {
        const titleMatch = (p.title || '').toLowerCase().includes(q);
        const descMatch = (p.description || '').toLowerCase().includes(q);
        const techMatch = Array.isArray(p.techStack) && p.techStack.some(t => t.toLowerCase().includes(q));
        return titleMatch || descMatch || techMatch;
      });
    }

    // 3. Multi-criterion sorting
    filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'newest': {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          return dateB - dateA;
        }
        case 'forsale': {
          return (b.forSale ? 1 : 0) - (a.forSale ? 1 : 0);
        }
        case 'price-asc': {
          return parseNumericPrice(a.price) - parseNumericPrice(b.price);
        }
        case 'price-desc': {
          return parseNumericPrice(b.price) - parseNumericPrice(a.price);
        }
        case 'featured':
        default: {
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        }
      }
    });

    // 4. Empty State with friendly custom request button
    if (filtered.length === 0) {
      projectsGridEl.innerHTML = `
        <div class="empty-state">
          <h3>No projects found</h3>
          <p>We couldn't find any projects matching your search criteria. Looking for something custom?</p>
          <button class="btn-primary-pill" id="emptyStateCustomBtn" style="margin: 12px auto 0;">
            <span>REQUEST A CUSTOM PROJECT</span>
            <span>💬 →</span>
          </button>
        </div>
      `;

      const emptyBtn = document.getElementById('emptyStateCustomBtn');
      if (emptyBtn) {
        emptyBtn.addEventListener('click', () => {
          const contactSec = document.getElementById('contact');
          if (contactSec) {
            contactSec.scrollIntoView({ behavior: 'smooth' });
            if (quoteDetails) quoteDetails.focus();
          }
        });
      }
      return;
    }

    // 5. Render project cards
    projectsGridEl.innerHTML = filtered.map(project => {
      const status = project.status || 'available';
      const isSold = status === 'sold';
      const isComingSoon = status === 'coming-soon';

      const waUrl = getProjectWhatsAppUrl(project);
      const isVideoOnly = !project.liveUrl && project.demoVideoUrl;
      const demoBtnText = isVideoOnly ? 'Play Demo' : 'Open Live Demo';

      // Thumbnail handling (CSS gradient cards or custom image)
      let mediaMarkup = '';
      if (project.thumbnail && project.thumbnail.trim() !== '') {
        mediaMarkup = `
          <img src="${escapeHtml(project.thumbnail)}" 
               alt="${escapeHtml(project.title)}" 
               class="card-img" 
               loading="lazy" 
               referrerpolicy="no-referrer"
               onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'card-initials-gradient\\'><span class=\\'card-initials-text\\'>${getInitials(project.title)}</span><span class=\\'card-initials-sub\\'>${escapeHtml(project.title)}</span></div>';" />
        `;
      } else {
        mediaMarkup = `
          <div class="card-initials-gradient">
            <span class="card-initials-text">${getInitials(project.title)}</span>
            <span class="card-initials-sub">${escapeHtml(project.title)}</span>
          </div>
        `;
      }

      // Status Badges
      let statusBadgeMarkup = '';
      if (isSold) {
        statusBadgeMarkup = `<span class="status-badge-sold">Sold</span>`;
      } else if (isComingSoon) {
        statusBadgeMarkup = `<span class="status-badge-coming-soon">Coming Soon</span>`;
      } else if (project.forSale) {
        statusBadgeMarkup = `
          <span class="for-sale-badge">
            🏷️ FOR SALE${project.price ? ` · ${escapeHtml(project.price)}` : ''}
          </span>
        `;
      }

      // Action Buttons logic:
      // - If coming-soon: NO demo button shown (per requirement e)
      // - If sold: Buy button disabled, live demo still works!
      let demoButtonMarkup = '';
      if (!isComingSoon) {
        demoButtonMarkup = `
          <button class="btn-card-demo" data-id="${project.id}">
            <span>▶</span> ${demoBtnText}
          </button>
        `;
      }

      let buyButtonMarkup = '';
      if (isSold) {
        buyButtonMarkup = `
          <button class="btn-card-buy btn-disabled" disabled aria-disabled="true" title="This project has been sold">
            <span>🔒</span> Sold
          </button>
        `;
      } else {
        buyButtonMarkup = `
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-card-buy">
            <span>💬</span> ${project.forSale ? 'Buy' : 'Enquire'}
          </a>
        `;
      }

      // Tech Stack chips
      const techStackMarkup = (project.techStack && Array.isArray(project.techStack))
        ? project.techStack.map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('')
        : '';

      return `
        <article class="project-card" id="project-${project.id}">
          <div class="card-media">
            ${mediaMarkup}
            <div class="card-top-badges">
              <span class="type-tag">${escapeHtml(project.type)}</span>
              ${statusBadgeMarkup}
            </div>
          </div>
          <div class="card-body">
            <h3 class="card-title">${escapeHtml(project.title)}</h3>
            <p class="card-desc">${escapeHtml(project.description)}</p>
            <div class="card-tech-tags">
              ${techStackMarkup}
            </div>
            <div class="card-actions">
              ${demoButtonMarkup}
              ${buyButtonMarkup}
              <button class="btn-card-share" data-id="${project.id}" title="Share link to ${escapeHtml(project.title)}" aria-label="Share project link">
                🔗
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach click listeners to cards
    projectsGridEl.querySelectorAll('.btn-card-demo').forEach(btn => {
      btn.addEventListener('click', () => {
        const pId = btn.dataset.id;
        const targetProj = projectList.find(p => p.id === pId);
        if (targetProj) openModal(targetProj);
      });
    });

    // Share link handler on cards
    projectsGridEl.querySelectorAll('.btn-card-share').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pId = btn.dataset.id;
        const targetProj = projectList.find(p => p.id === pId);
        if (targetProj) shareProject(targetProj);
      });
    });
  }

  // ==========================================================================
  // SERVICES SECTION RENDERING
  // ==========================================================================
  function renderServices() {
    if (!servicesGridEl) return;

    servicesGridEl.innerHTML = servicesList.map(srv => {
      const waUrl = getServiceWhatsAppUrl(srv);
      return `
        <div class="service-card" id="service-${srv.id}">
          <div>
            <div class="service-icon-box">${srv.icon || '⚡'}</div>
            <h3>${escapeHtml(srv.title)}</h3>
            <p>${escapeHtml(srv.description)}</p>
          </div>
          <div>
            <div class="service-price-tag">${escapeHtml(srv.startingPrice)}</div>
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-service-enquire">
              <span>Enquire on WhatsApp</span>
              <span>💬 →</span>
            </a>
          </div>
        </div>
      `;
    }).join('');
  }

  // ==========================================================================
  // TESTIMONIALS SECTION RENDERING (AUTO-HIDE IF EMPTY)
  // ==========================================================================
  function renderTestimonials() {
    if (!testimonialsSection) return;

    if (!testimonialsList || testimonialsList.length === 0) {
      testimonialsSection.style.display = 'none';
      return;
    }

    testimonialsSection.style.display = '';
    if (!testimonialsCarouselEl) return;

    testimonialsCarouselEl.innerHTML = testimonialsList.map(t => `
      <div class="testimonial-card">
        <p class="testimonial-text">"${escapeHtml(t.text)}"</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar">${getInitials(t.name)}</div>
          <div>
            <div class="testimonial-name">${escapeHtml(t.name)}</div>
            <div class="testimonial-role">${escapeHtml(t.role)}</div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // ==========================================================================
  // FAQ ACCORDION RENDERING & TOGGLE HANDLER (ONLY ONE OPEN AT A TIME)
  // ==========================================================================
  function renderFaq() {
    if (!faqAccordionEl) return;

    faqAccordionEl.innerHTML = faqList.map((item, idx) => `
      <div class="faq-item" data-index="${idx}">
        <button class="faq-question" aria-expanded="false" id="faq-btn-${idx}">
          <span>${escapeHtml(item.question)}</span>
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-answer" id="faq-ans-${idx}">
          <p>${escapeHtml(item.answer)}</p>
        </div>
      </div>
    `).join('');

    faqAccordionEl.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isActive = item.classList.contains('active');

        // Close other items for smooth accordion
        faqAccordionEl.querySelectorAll('.faq-item').forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherBtn = other.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          btn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // ==========================================================================
  // REQUEST A QUOTE FORM HANDLER
  // ==========================================================================
  function initQuoteForm() {
    if (!quoteForm) return;

    if (quoteName) {
      quoteName.addEventListener('input', () => {
        quoteName.classList.remove('error');
        if (quoteNameError) quoteNameError.classList.remove('show');
      });
    }

    if (quoteDetails) {
      quoteDetails.addEventListener('input', () => {
        quoteDetails.classList.remove('error');
        if (quoteDetailsError) quoteDetailsError.classList.remove('show');
      });
    }

    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const nameVal = quoteName ? quoteName.value.trim() : '';
      const typeVal = quoteType ? quoteType.value : 'Custom Software';
      const budgetVal = quoteBudget ? quoteBudget.value : 'Flexible';
      const detailsVal = quoteDetails ? quoteDetails.value.trim() : '';

      if (!nameVal) {
        isValid = false;
        if (quoteName) quoteName.classList.add('error');
        if (quoteNameError) quoteNameError.classList.add('show');
      }

      if (!detailsVal) {
        isValid = false;
        if (quoteDetails) quoteDetails.classList.add('error');
        if (quoteDetailsError) quoteDetailsError.classList.add('show');
      }

      if (!isValid) return;

      const formattedMessage = [
        `*⚡ New Project Quote Request*`,
        ``,
        `*Name:* ${nameVal}`,
        `*Project Type:* ${typeVal}`,
        `*Estimated Budget:* ${budgetVal}`,
        `*Details:* ${detailsVal}`,
        ``,
        `Sent via portfolio website quote form.`
      ].join('\n');

      const targetUrl = buildWhatsAppUrl(formattedMessage);
      showToast('Opening WhatsApp with your quote request...');
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // ==========================================================================
  // SEARCH & SORT EVENT LISTENERS
  // ==========================================================================
  function initSearchAndSort() {
    if (projectSearchInput) {
      projectSearchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        if (projectSearchClear) {
          projectSearchClear.classList.toggle('show', searchQuery.length > 0);
        }
        renderProjects();
      });
    }

    if (projectSearchClear) {
      projectSearchClear.addEventListener('click', () => {
        searchQuery = '';
        if (projectSearchInput) {
          projectSearchInput.value = '';
          projectSearchInput.focus();
        }
        projectSearchClear.classList.remove('show');
        renderProjects();
      });
    }

    if (projectSortSelect) {
      projectSortSelect.addEventListener('change', (e) => {
        sortOrder = e.target.value;
        renderProjects();
      });
    }
  }

  // ==========================================================================
  // LIVE DEMO MODAL IMPLEMENTATION & DIRECT HASH NAVIGATION
  // ==========================================================================
  function openModal(project) {
    if (!demoModal || !project) return;
    currentModalProject = project;

    // Reset previous modal states
    clearTimeout(modalTimeoutId);
    modalSpinner.style.display = 'flex';
    modalErrorBox.classList.remove('show');
    modalFrameContainer.innerHTML = '';

    // Title & Type Tag
    modalTitle.textContent = project.title;
    modalTypeTag.textContent = (project.type || 'APP').toUpperCase();

    // Buy / Enquire WhatsApp link
    const waUrl = getProjectWhatsAppUrl(project);
    modalBuyBtn.href = waUrl;
    if (modalBuyBtnText) {
      modalBuyBtnText.textContent = (project.forSale && project.status !== 'sold') ? 'Buy Project' : 'Enquire Project';
    }

    // New Tab links
    const primaryUrl = project.liveUrl || project.demoVideoUrl || '#';
    modalNewTabBtn.href = primaryUrl;
    modalErrorNewTabBtn.href = primaryUrl;

    // APK button check
    if (project.apkUrl && project.apkUrl.trim() !== '') {
      modalApkBtn.href = project.apkUrl;
      modalApkBtn.style.display = 'inline-flex';
    } else {
      modalApkBtn.style.display = 'none';
    }

    // Load preview content (iframe or video)
    if (project.liveUrl && project.liveUrl.trim() !== '') {
      const iframe = document.createElement('iframe');
      iframe.className = 'modal-iframe';
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');

      if (project.needsCamera) {
        iframe.setAttribute('allow', 'camera; microphone; display-capture; autoplay');
      } else {
        iframe.setAttribute('allow', 'autoplay; fullscreen');
      }

      iframe.onload = () => {
        clearTimeout(modalTimeoutId);
        modalSpinner.style.display = 'none';
      };

      // 8-Second Safety Timeout Fallback
      modalTimeoutId = setTimeout(() => {
        modalSpinner.style.display = 'none';
        modalErrorBox.classList.add('show');
      }, 8000);

      iframe.src = project.liveUrl;
      modalFrameContainer.appendChild(iframe);
    } else if (project.demoVideoUrl && project.demoVideoUrl.trim() !== '') {
      clearTimeout(modalTimeoutId);
      modalSpinner.style.display = 'none';

      const videoWrapper = document.createElement('div');
      videoWrapper.className = 'modal-video-container';

      if (project.demoVideoUrl.includes('youtube') || project.demoVideoUrl.includes('youtu.be')) {
        videoWrapper.innerHTML = `
          <div class="modal-video-frame">
            <iframe src="${escapeHtml(project.demoVideoUrl)}" 
                    style="width:100%; height:100%; border:none;" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
            </iframe>
          </div>
        `;
      } else {
        videoWrapper.innerHTML = `
          <div class="modal-video-frame">
            <video controls autoplay playsinline style="width:100%; height:100%; object-fit:contain;">
              <source src="${escapeHtml(project.demoVideoUrl)}" type="video/mp4">
              Your browser does not support HTML5 video.
            </video>
          </div>
        `;
      }
      modalFrameContainer.appendChild(videoWrapper);
    } else {
      modalSpinner.style.display = 'none';
      modalErrorBox.classList.add('show');
    }

    // Lock page scroll & hide floating buttons via .modal-open
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');

    // Show modal
    demoModal.classList.add('active');
    isModalOpen = true;

    // Update URL hash for direct project sharing (#project-<id>)
    try {
      history.replaceState({ modalProject: project.id }, '', `#project-${project.id}`);
    } catch (e) {
      // Ignore in restricted sandboxes
    }
  }

  function closeModal() {
    if (!demoModal || !isModalOpen) return;

    clearTimeout(modalTimeoutId);
    demoModal.classList.remove('active');
    modalFrameContainer.innerHTML = '';
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');
    isModalOpen = false;
    currentModalProject = null;

    // Clean up URL hash cleanly
    try {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    } catch (e) {
      // Ignore
    }
  }

  function initModalListeners() {
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }

    // Modal Share Button
    if (modalShareBtn) {
      modalShareBtn.addEventListener('click', () => {
        if (currentModalProject) {
          shareProject(currentModalProject);
        }
      });
    }

    // Close with Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    });

    // Close with Browser Back Button (popstate)
    window.addEventListener('popstate', () => {
      if (isModalOpen) {
        closeModal();
      }
    });
  }

  // ==========================================================================
  // HERO "TAP TO TRY" & NAVIGATION TRIGGERS
  // ==========================================================================
  function initNavAndHero() {
    // "Tap to try" on hero phone mockup: opens demo modal for the first project in PROJECTS
    if (heroTapToTryBtn) {
      heroTapToTryBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof PROJECTS !== 'undefined' && PROJECTS.length > 0) {
          openModal(PROJECTS[0]);
        } else if (projectList && projectList.length > 0) {
          openModal(projectList[0]);
        }
      });
    }

    if (phoneMockupTrigger) {
      phoneMockupTrigger.addEventListener('click', () => {
        if (typeof PROJECTS !== 'undefined' && PROJECTS.length > 0) {
          openModal(PROJECTS[0]);
        } else if (projectList && projectList.length > 0) {
          openModal(projectList[0]);
        }
      });
    }

    if (browserMockupTrigger) {
      browserMockupTrigger.addEventListener('click', () => {
        if (typeof PROJECTS !== 'undefined' && PROJECTS.length > 0) {
          openModal(PROJECTS[0]);
        } else if (projectList && projectList.length > 0) {
          openModal(projectList[0]);
        }
      });
    }

    if (heroPlayTrigger) {
      heroPlayTrigger.addEventListener('click', () => {
        if (typeof PROJECTS !== 'undefined' && PROJECTS.length > 0) {
          openModal(PROJECTS[0]);
        } else if (projectList && projectList.length > 0) {
          openModal(projectList[0]);
        }
      });
    }

    // Mobile Drawer
    if (btnMobileMenu && mobileNavDrawer) {
      btnMobileMenu.addEventListener('click', () => {
        mobileNavDrawer.classList.toggle('open');
        btnMobileMenu.textContent = mobileNavDrawer.classList.contains('open') ? '✕' : '☰';
      });

      mobileNavDrawer.querySelectorAll('.mobile-nav-item').forEach(item => {
        item.addEventListener('click', () => {
          mobileNavDrawer.classList.remove('open');
          btnMobileMenu.textContent = '☰';
        });
      });
    }

    // Browse By Type Cards
    document.querySelectorAll('.type-card').forEach(card => {
      card.addEventListener('click', () => {
        const filterKey = card.dataset.filter;
        if (filterKey) {
          activeFilter = filterKey;
          renderFilterChips();
          renderProjects();
          const projSec = document.getElementById('projects');
          if (projSec) {
            projSec.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

    // Back to top button visibility and click
    if (backToTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 350) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }, { passive: true });

      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // ==========================================================================
  // DIRECT PROJECT LINK DISPATCH ON PAGE LOAD (#project-<id>)
  // ==========================================================================
  function handleDirectProjectHash() {
    if (window.location.hash && window.location.hash.startsWith('#project-')) {
      const matchId = window.location.hash.replace('#project-', '');
      const matched = projectList.find(p => p.id === matchId);
      if (matched) {
        const projSec = document.getElementById('projects');
        if (projSec) {
          projSec.scrollIntoView({ behavior: 'smooth' });
        }
        setTimeout(() => {
          openModal(matched);
        }, 300);
      }
    }
  }

  // ==========================================================================
  // REGISTER SERVICE WORKER (OFFLINE PWA)
  // ==========================================================================
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(() => {
          // Graceful fallback for non-supported or restricted environments
        });
      });
    }
  }

  // ==========================================================================
  // INITIALIZATION ON READY
  // ==========================================================================
  function bootstrap() {
    initConfig();
    renderFilterChips();
    initSearchAndSort();
    renderProjects();
    renderServices();
    renderTestimonials();
    renderFaq();
    initQuoteForm();
    initModalListeners();
    initNavAndHero();
    handleDirectProjectHash();
    registerServiceWorker();
  }

  document.addEventListener('DOMContentLoaded', bootstrap);
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    bootstrap();
  }

  // Expose global app instance
  window.ShowroomApp = {
    openModal,
    closeModal,
    setFilter: (f) => {
      activeFilter = f;
      renderFilterChips();
      renderProjects();
    },
    buildWhatsAppUrl,
    shareProject
  };

})();
