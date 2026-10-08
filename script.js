/**
 * Personal Portfolio & Project Showroom Script
 * 
 * Handles dynamic rendering from projects.js, interactive filter chips,
 * category counters, WhatsApp prefilled link generation, and full-screen Live Demo Modal.
 */

(function () {
  'use strict';

  // 1. Validate data existence from projects.js
  const cfg = (typeof CONFIG !== 'undefined') ? CONFIG : {
    name: "Alex Rivera",
    tagline: "I build responsive web apps, high-performance websites & interactive games.",
    about: "Full-stack developer crafting high-performance digital products.",
    whatsappNumber: "15552345678",
    email: "alex.developer@example.com",
    skills: ["JavaScript", "React", "Node.js"]
  };

  const projectList = (typeof PROJECTS !== 'undefined' && Array.isArray(PROJECTS)) ? PROJECTS : [];

  // Active filter state
  let activeFilter = 'all';
  let modalTimeoutId = null;
  let isModalOpen = false;

  // DOM Elements
  const brandNameEls = document.querySelectorAll('.bind-brand-name');
  const taglineEls = document.querySelectorAll('.bind-tagline');
  const aboutTextEl = document.getElementById('aboutText');
  const skillsListEl = document.getElementById('skillsList');
  const projectsGridEl = document.getElementById('projectsGrid');
  const filterChipsWrap = document.getElementById('filterChipsWrap');
  const totalProjectsCountEls = document.querySelectorAll('.bind-total-projects');
  const forSaleCountEl = document.getElementById('forSaleCount');
  const liveDemosCountEl = document.getElementById('liveDemosCount');
  const currentYearEl = document.getElementById('currentYear');

  // Trust items counters
  const trustCountProjects = document.getElementById('trustCountProjects');
  const trustCountLive = document.getElementById('trustCountLive');
  const trustCountSale = document.getElementById('trustCountSale');

  // Type cards counters
  const typeCountApps = document.getElementById('typeCountApps');
  const typeCountWebsites = document.getElementById('typeCountWebsites');
  const typeCountGames = document.getElementById('typeCountGames');
  const typeCountSale = document.getElementById('typeCountSale');

  // Bottom Featured Sale Banner elements
  const saleBannerTitle = document.getElementById('saleBannerTitle');
  const saleBannerDesc = document.getElementById('saleBannerDesc');
  const saleBannerPrice = document.getElementById('saleBannerPrice');
  const saleBannerInitials = document.getElementById('saleBannerInitials');
  const saleBannerBuyBtn = document.getElementById('saleBannerBuyBtn');
  const saleBannerDemoBtn = document.getElementById('saleBannerDemoBtn');

  // Contact Links
  const headerWaBtn = document.getElementById('headerWaBtn');
  const heroWaBtn = document.getElementById('heroWaBtn');
  const contactWaBtn = document.getElementById('contactWaBtn');
  const contactEmailBtn = document.getElementById('contactEmailBtn');
  const githubLinkEl = document.getElementById('githubLink');
  const instaLinkEl = document.getElementById('instaLink');

  // Mobile Menu
  const btnMobileMenu = document.getElementById('btnMobileMenu');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');

  // Modal Elements
  const demoModal = document.getElementById('demoModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalTypeTag = document.getElementById('modalTypeTag');
  const modalNewTabBtn = document.getElementById('modalNewTabBtn');
  const modalApkBtn = document.getElementById('modalApkBtn');
  const modalBuyBtn = document.getElementById('modalBuyBtn');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalSpinner = document.getElementById('modalSpinner');
  const modalErrorBox = document.getElementById('modalErrorBox');
  const modalErrorNewTabBtn = document.getElementById('modalErrorNewTabBtn');
  const modalFrameContainer = document.getElementById('modalFrameContainer');

  // 2. Helper: Generate Title Initials (2 letters)
  function getInitials(title) {
    if (!title) return "PR";
    const words = title.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  // 3. Helper: WhatsApp Pre-filled URL Generator
  function getWhatsAppUrl(project = null) {
    const phone = cfg.whatsappNumber ? cfg.whatsappNumber.replace(/[^0-9]/g, '') : '';
    let msg = '';

    if (project) {
      if (project.forSale) {
        msg = `Hi, I saw ${project.title} on your portfolio and I want to buy it. Please share details.`;
      } else {
        msg = `Hi, I liked ${project.title} on your portfolio. I want something similar built.`;
      }
    } else {
      msg = `Hi ${cfg.name}, I checked your portfolio showroom and would like to discuss a project.`;
    }

    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }

  // 4. Initialize Config Data in UI
  function initConfig() {
    // Brand & Names
    brandNameEls.forEach(el => el.textContent = cfg.name || 'Developer');
    taglineEls.forEach(el => el.textContent = cfg.tagline || 'I build web apps, websites & interactive games.');

    if (aboutTextEl) {
      aboutTextEl.textContent = cfg.about || '';
    }

    // Skills
    if (skillsListEl && Array.isArray(cfg.skills)) {
      skillsListEl.innerHTML = cfg.skills.map(skill => 
        `<span class="skill-tag">${escapeHtml(skill)}</span>`
      ).join('');
    }

    // Stat counters
    const totalCount = projectList.length;
    const forSaleTotal = projectList.filter(p => p.forSale).length;
    const liveDemosTotal = projectList.filter(p => p.liveUrl).length;
    const appsTotal = projectList.filter(p => p.type === 'app').length;
    const websitesTotal = projectList.filter(p => p.type === 'website').length;
    const gamesTotal = projectList.filter(p => p.type === 'game').length;

    totalProjectsCountEls.forEach(el => el.textContent = totalCount);
    if (forSaleCountEl) forSaleCountEl.textContent = forSaleTotal;
    if (liveDemosCountEl) liveDemosCountEl.textContent = liveDemosTotal;

    // Trust items
    if (trustCountProjects) trustCountProjects.textContent = `${totalCount} Projects Built`;
    if (trustCountLive) trustCountLive.textContent = `${liveDemosTotal} Live Demos`;
    if (trustCountSale) trustCountSale.textContent = `${forSaleTotal} For Sale`;

    // Type cards
    if (typeCountApps) typeCountApps.textContent = `${appsTotal} Available`;
    if (typeCountWebsites) typeCountWebsites.textContent = `${websitesTotal} Available`;
    if (typeCountGames) typeCountGames.textContent = `${gamesTotal} Available`;
    if (typeCountSale) typeCountSale.textContent = `${forSaleTotal} Turnkey Builds`;

    // Contact Buttons
    const defaultWaUrl = getWhatsAppUrl(null);
    if (headerWaBtn) headerWaBtn.href = defaultWaUrl;
    if (heroWaBtn) heroWaBtn.href = defaultWaUrl;
    if (contactWaBtn) contactWaBtn.href = defaultWaUrl;

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

    // Setup Bottom "Featured For Sale Project" Banner
    const firstSaleProject = projectList.find(p => p.forSale) || projectList[0];
    if (firstSaleProject) {
      if (saleBannerTitle) saleBannerTitle.textContent = firstSaleProject.title;
      if (saleBannerDesc) saleBannerDesc.textContent = firstSaleProject.description;
      if (saleBannerPrice) saleBannerPrice.textContent = firstSaleProject.price ? `PRICE: ${firstSaleProject.price}` : 'READY TO BUY';
      if (saleBannerInitials) saleBannerInitials.textContent = getInitials(firstSaleProject.title);
      
      if (saleBannerBuyBtn) {
        saleBannerBuyBtn.href = getWhatsAppUrl(firstSaleProject);
      }
      if (saleBannerDemoBtn) {
        saleBannerDemoBtn.addEventListener('click', () => openModal(firstSaleProject));
      }
    }

    // Dynamic current year
    if (currentYearEl) {
      currentYearEl.textContent = new Date().getFullYear();
    }
  }

  // 5. Render Filter Chips with dynamic counts
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

    // Attach click listeners to filter chips
    filterChipsWrap.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.filter;
        renderFilterChips();
        renderProjects();
      });
    });
  }

  // 6. Render Projects Grid
  function renderProjects() {
    if (!projectsGridEl) return;

    // Filter projects
    let filtered = projectList.filter(p => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'forsale') return p.forSale;
      return p.type === activeFilter;
    });

    // Sort: featured projects first
    filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    if (filtered.length === 0) {
      projectsGridEl.innerHTML = `
        <div class="empty-state">
          <h3>No projects found in this filter</h3>
          <p>Try selecting another category or check back soon for new builds.</p>
        </div>
      `;
      return;
    }

    projectsGridEl.innerHTML = filtered.map(project => {
      const waUrl = getWhatsAppUrl(project);
      const isVideoOnly = !project.liveUrl && project.demoVideoUrl;
      const demoBtnText = isVideoOnly ? 'Watch Demo' : 'Open Live Demo';

      // Thumbnail handling: image if provided, else automated initials gradient card
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

      // For Sale badge (in lime/gold)
      const forSaleMarkup = project.forSale ? `
        <span class="for-sale-badge">
          🏷️ FOR SALE${project.price ? ` · ${escapeHtml(project.price)}` : ''}
        </span>
      ` : '';

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
              ${forSaleMarkup}
            </div>
          </div>
          <div class="card-body">
            <h3 class="card-title">${escapeHtml(project.title)}</h3>
            <p class="card-desc">${escapeHtml(project.description)}</p>
            <div class="card-tech-tags">
              ${techStackMarkup}
            </div>
            <div class="card-actions">
              <button class="btn-card-demo" data-id="${project.id}">
                <span>▶</span> ${demoBtnText}
              </button>
              <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-card-buy">
                <span>💬</span> ${project.forSale ? 'Buy' : 'Enquire'}
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach click events to card demo buttons
    projectsGridEl.querySelectorAll('.btn-card-demo').forEach(btn => {
      btn.addEventListener('click', () => {
        const pId = btn.dataset.id;
        const targetProj = projectList.find(p => p.id === pId);
        if (targetProj) openModal(targetProj);
      });
    });
  }

  // 7. Live Demo Modal Implementation (Core Feature)
  function openModal(project) {
    if (!demoModal || !project) return;

    // Reset previous modal states
    clearTimeout(modalTimeoutId);
    modalSpinner.style.display = 'flex';
    modalErrorBox.classList.remove('show');
    modalFrameContainer.innerHTML = '';

    // Title & Type Tag
    modalTitle.textContent = project.title;
    modalTypeTag.textContent = (project.type || 'APP').toUpperCase();

    // Buy / Enquire WhatsApp link
    const waUrl = getWhatsAppUrl(project);
    modalBuyBtn.href = waUrl;
    modalBuyBtn.textContent = project.forSale ? '💬 Buy This Project' : '💬 Enquire / Build Similar';

    // New Tab link
    const primaryUrl = project.liveUrl || project.demoVideoUrl || '#';
    modalNewTabBtn.href = primaryUrl;
    modalErrorNewTabBtn.href = primaryUrl;

    // APK download button check
    if (project.apkUrl && project.apkUrl.trim() !== '') {
      modalApkBtn.href = project.apkUrl;
      modalApkBtn.style.display = 'inline-flex';
    } else {
      modalApkBtn.style.display = 'none';
    }

    // Load either Iframe or Video
    if (project.liveUrl && project.liveUrl.trim() !== '') {
      const iframe = document.createElement('iframe');
      iframe.className = 'modal-iframe';
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');

      // Camera permission if needed
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

    // Lock page scroll
    document.body.style.overflow = 'hidden';

    // Show modal
    demoModal.classList.add('active');
    isModalOpen = true;

    // Push history state so browser back button closes modal smoothly
    try {
      history.pushState({ modalOpen: true }, '');
    } catch (e) {
      // Ignore security errors in restricted iframe environments
    }
  }

  function closeModal() {
    if (!demoModal || !isModalOpen) return;

    clearTimeout(modalTimeoutId);
    demoModal.classList.remove('active');
    modalFrameContainer.innerHTML = '';
    document.body.style.overflow = '';
    isModalOpen = false;
  }

  // 8. Event Listeners for Modal Closing
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
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

  // 9. "Browse By Type" Category Card Click Handlers
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

  // 10. Hero Interaction Triggers
  const heroPlayTrigger = document.getElementById('heroPlayTrigger');
  if (heroPlayTrigger) {
    heroPlayTrigger.addEventListener('click', () => {
      // Opens first featured project (Bazario or VELOCE)
      const featured = projectList.find(p => p.featured) || projectList[0];
      if (featured) openModal(featured);
    });
  }

  const phoneMockupTrigger = document.getElementById('phoneMockupTrigger');
  if (phoneMockupTrigger) {
    phoneMockupTrigger.addEventListener('click', () => {
      const bazario = projectList.find(p => p.id === 'bazario') || projectList[0];
      if (bazario) openModal(bazario);
    });
  }

  const browserMockupTrigger = document.getElementById('browserMockupTrigger');
  if (browserMockupTrigger) {
    browserMockupTrigger.addEventListener('click', () => {
      const veloce = projectList.find(p => p.id === 'veloce') || projectList[1] || projectList[0];
      if (veloce) openModal(veloce);
    });
  }

  // 11. Mobile Menu Toggle
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

  // Utility: HTML Escaping
  function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // 12. Run initialization on DOM load
  document.addEventListener('DOMContentLoaded', () => {
    initConfig();
    renderFilterChips();
    renderProjects();
  });

  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initConfig();
    renderFilterChips();
    renderProjects();
  }

  // Expose API for phone editors or testing
  window.ShowroomApp = {
    openModal,
    closeModal,
    setFilter: (f) => {
      activeFilter = f;
      renderFilterChips();
      renderProjects();
    }
  };

})();
