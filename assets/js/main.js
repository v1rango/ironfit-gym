/**
 * IRONFIT Gym Landing Page
 * Developed by: Arad Vafaee (https://aradvafaee.ir)
 * Interactive UI & Micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initModals();
  initStatsCounter();
  initHeroSlider();
  initScrollEffects();
  initClassCards();
  initPricingSelection();
});

/* ====================================================
   1. Mobile Navigation
   ==================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-menu-overlay');
  const navLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  if (!toggleBtn || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.remove('translate-x-full');
    overlay.classList.remove('hidden', 'opacity-0');
    overlay.classList.add('opacity-100');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.add('translate-x-full');
    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0');
    setTimeout(() => {
      overlay.classList.add('hidden');
      document.body.style.overflow = '';
    }, 300);
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ====================================================
   2. Modals (Membership, Search, Video)
   ==================================================== */
function initModals() {
  // Membership Modal
  const memberModal = document.getElementById('membership-modal');
  const openMemberBtns = document.querySelectorAll('.open-membership-btn');
  const closeMemberBtn = document.getElementById('close-membership-btn');
  const memberForm = document.getElementById('membership-form');
  const planSelectInput = document.getElementById('modal-plan-select');

  openMemberBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const plan = btn.getAttribute('data-plan') || 'طلایی (پیشنهادی)';
      if (planSelectInput) {
        planSelectInput.value = plan;
      }
      openModal(memberModal);
    });
  });

  if (closeMemberBtn) {
    closeMemberBtn.addEventListener('click', () => closeModal(memberModal));
  }

  if (memberForm) {
    memberForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = memberForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-black inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        در حال ثبت اطلاعات...
      `;
      submitBtn.disabled = true;

      setTimeout(() => {
        closeModal(memberModal);
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        memberForm.reset();
        showToast('درخواست عضویت شما با موفقیت ثبت شد! کارشناسان ما به زودی با شما تماس می‌گیرند.', 'success');
      }, 1200);
    });
  }

  // Search Modal
  const searchModal = document.getElementById('search-modal');
  const openSearchBtn = document.getElementById('open-search-btn');
  const closeSearchBtn = document.getElementById('close-search-btn');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  if (openSearchBtn && searchModal) {
    openSearchBtn.addEventListener('click', () => {
      openModal(searchModal);
      setTimeout(() => searchInput && searchInput.focus(), 100);
    });
  }

  if (closeSearchBtn) {
    closeSearchBtn.addEventListener('click', () => closeModal(searchModal));
  }

  if (searchInput && searchResults) {
    const searchableItems = [
      { title: 'کلاس بدنسازی (Bodybuilding)', link: '#classes', category: 'کلاس ورزشی' },
      { title: 'کلاس کراس‌فیت (CrossFit)', link: '#classes', category: 'کلاس ورزشی' },
      { title: 'کلاس یوگا و مدیتیشن (Yoga)', link: '#classes', category: 'کلاس ورزشی' },
      { title: 'کلاس تمرینات هوازی (Cardio)', link: '#classes', category: 'کلاس ورزشی' },
      { title: 'پلن عضویت برنزی (۱ ماهه)', link: '#pricing', category: 'طرح عضویت' },
      { title: 'پلن عضویت طلایی (۳ ماهه ویژه)', link: '#pricing', category: 'طرح عضویت' },
      { title: 'پلن عضویت پلاتینیوم (۶ ماهه VIP)', link: '#pricing', category: 'طرح عضویت' },
      { title: 'مربی شخصی و برنامه اختصاصی', link: '#personal-training', category: 'خدمات' },
      { title: 'امکانات و تجهیزات مدرن باشگاه', link: '#facilities', category: 'امکانات' }
    ];

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (!query) {
        searchResults.innerHTML = `
          <div class="p-4 text-center text-sm text-neutral-400">عبارتی مانند «بدنسازی»، «طلایی» یا «مربی» را جستجو کنید...</div>
        `;
        return;
      }

      const filtered = searchableItems.filter(item => 
        item.title.toLowerCase().includes(query) || item.category.toLowerCase().includes(query)
      );

      if (filtered.length === 0) {
        searchResults.innerHTML = `
          <div class="p-6 text-center text-sm text-neutral-400">موردی متناسب با «${escapeHtml(query)}» پیدا نشد.</div>
        `;
      } else {
        searchResults.innerHTML = filtered.map(item => `
          <a href="${item.link}" class="search-result-item flex items-center justify-between p-3.5 rounded-xl hover:bg-neutral-800/80 transition-colors border border-transparent hover:border-neutral-700">
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-[#bef202]"></span>
              <span class="text-white font-medium text-sm">${item.title}</span>
            </div>
            <span class="text-xs px-2.5 py-1 rounded-md bg-neutral-800 text-neutral-400 border border-neutral-700">${item.category}</span>
          </a>
        `).join('');

        searchResults.querySelectorAll('.search-result-item').forEach(el => {
          el.addEventListener('click', () => closeModal(searchModal));
        });
      }
    });
  }

  // Video / Program Preview Modal
  const videoModal = document.getElementById('video-modal');
  const openVideoBtn = document.getElementById('open-video-btn');
  const closeVideoBtn = document.getElementById('close-video-btn');

  if (openVideoBtn && videoModal) {
    openVideoBtn.addEventListener('click', () => openModal(videoModal));
  }

  if (closeVideoBtn) {
    closeVideoBtn.addEventListener('click', () => closeModal(videoModal));
  }

  // Close modals on backdrop click or Escape
  document.querySelectorAll('.app-modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.app-modal:not(.hidden)').forEach(modal => closeModal(modal));
    }
  });

  function openModal(modal) {
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }
}

/* ====================================================
   3. Animated Numbers / Stats Counter
   ==================================================== */
function initStatsCounter() {
  const statsSection = document.getElementById('stats-counter-section');
  if (!statsSection) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateNumber('counter-members', 0, 2000, 1800, '+', 'K');
        animateNumber('counter-years', 0, 5, 1200, '+', '');
        animateNumber('counter-satisfaction', 0, 98, 1500, '', '%');
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);

  function animateNumber(elementId, start, end, duration, prefix = '', suffix = '') {
    const el = document.getElementById(elementId);
    if (!el) return;

    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * easeProgress);

      if (suffix === 'K') {
        const kVal = (current / 1000).toFixed(current >= 1000 ? 0 : 1);
        el.textContent = `${prefix}${kVal > 0 ? kVal : 2}K`;
      } else {
        el.textContent = `${prefix}${current}${suffix}`;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `${prefix}${suffix === 'K' ? (end / 1000) + 'K' : end + suffix}`;
      }
    }

    requestAnimationFrame(update);
  }
}

/* ====================================================
   4. Hero Slider Indicator
   ==================================================== */
function initHeroSlider() {
  const slides = [
    {
      subtitle: 'STRONGER • HEALTHIER • BETTER',
      title1: 'YOUR FITNESS',
      title2: 'OUR MISSION',
      desc1: 'بدن سالم، ذهن قوی، زندگی بهتر',
      desc2: 'در باشگاه ما فقط یک ورزشگاه نیست؛ یک مسیر برای رسیدن به بهترین نسخه خودت هست.',
      image: 'assets/images/hero-athlete.jpg'
    },
    {
      subtitle: 'DISCIPLINE • POWER • ENERGY',
      title1: 'UNLEASH YOUR',
      title2: 'POTENTIAL',
      desc1: 'فراتر از محدودیت‌ها، با انگیزه و هدفمند',
      desc2: 'تمرینات ساختاریافته با متدولوژی علمی جهت تغییر چشمگیر فرم بدنی و ارتقای توان فیزیکی.',
      image: 'assets/images/class-crossfit.jpg'
    },
    {
      subtitle: 'COMMUNITY • PASSION • RESULTS',
      title1: 'TRANSFORM YOUR',
      title2: 'LIFESTYLE',
      desc1: 'انرژی بی‌نهایت در کنار بهترین مربیان',
      desc2: 'تجهیزات به‌روز دنیا در کنار برنامه‌های تغذیه و بدنسازی اختصاصی متناسب با اهداف شما.',
      image: 'assets/images/class-bodybuilding.jpg'
    }
  ];

  let currentIndex = 0;
  const slideIndicators = document.querySelectorAll('.slider-indicator-btn');
  const heroBg = document.getElementById('hero-bg-image');
  const heroBadge = document.getElementById('hero-badge-text');
  const heroT1 = document.getElementById('hero-title-1');
  const heroT2 = document.getElementById('hero-title-2');
  const heroD1 = document.getElementById('hero-desc-1');
  const heroD2 = document.getElementById('hero-desc-2');
  const heroCurrentNum = document.getElementById('hero-slide-num');

  if (!slideIndicators.length) return;

  function setSlide(index) {
    currentIndex = index;
    const slide = slides[index];

    // Update active state in vertical indicator
    slideIndicators.forEach((btn, idx) => {
      if (idx === index) {
        btn.classList.add('text-[#bef202]', 'font-bold');
        btn.classList.remove('text-neutral-500');
      } else {
        btn.classList.remove('text-[#bef202]', 'font-bold');
        btn.classList.add('text-neutral-500');
      }
    });

    if (heroCurrentNum) {
      heroCurrentNum.textContent = `0${index + 1}`;
    }

    // Smooth fade effect for text & image
    if (heroBg && slide.image) {
      heroBg.style.opacity = '0.3';
      setTimeout(() => {
        heroBg.style.backgroundImage = `url('${slide.image}')`;
        heroBg.style.opacity = '1';
      }, 200);
    }

    if (heroBadge) heroBadge.textContent = slide.subtitle;
    if (heroT1) heroT1.textContent = slide.title1;
    if (heroT2) heroT2.textContent = slide.title2;
    if (heroD1) heroD1.textContent = slide.desc1;
    if (heroD2) heroD2.textContent = slide.desc2;
  }

  slideIndicators.forEach((btn, idx) => {
    btn.addEventListener('click', () => setSlide(idx));
  });

  // Auto rotate every 8 seconds
  setInterval(() => {
    const nextIdx = (currentIndex + 1) % slides.length;
    setSlide(nextIdx);
  }, 8000);
}

/* ====================================================
   5. Interactive Class Cards
   ==================================================== */
function initClassCards() {
  const cards = document.querySelectorAll('.class-card');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't trigger if clicked on a specific link
      const title = card.getAttribute('data-class-name') || 'کلاس ورزشی';
      const desc = card.getAttribute('data-class-desc') || '';
      
      // Highlight card subtly
      cards.forEach(c => c.classList.remove('ring-2', 'ring-[#bef202]'));
      card.classList.add('ring-2', 'ring-[#bef202]');

      showToast(`کلاس «${title}» انتخاب شد. ${desc}`, 'info');
    });
  });
}

/* ====================================================
   6. Pricing Plan Interactive Selection
   ==================================================== */
function initPricingSelection() {
  const planCards = document.querySelectorAll('.pricing-card');
  planCards.forEach(card => {
    const selectBtn = card.querySelector('.pricing-select-btn');
    if (selectBtn) {
      selectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const planName = card.getAttribute('data-plan-name') || 'طلایی';
        const price = card.getAttribute('data-plan-price') || '';

        // Open membership modal with pre-selected plan
        const planSelectInput = document.getElementById('modal-plan-select');
        const memberModal = document.getElementById('membership-modal');
        if (planSelectInput) {
          planSelectInput.value = `${planName} (${price})`;
        }
        if (memberModal) {
          memberModal.classList.remove('hidden');
          memberModal.classList.add('flex');
          document.body.style.overflow = 'hidden';
        }
      });
    }
  });
}

/* ====================================================
   7. Scroll Effects (Navbar backdrop blur & Back-To-Top)
   ==================================================== */
function initScrollEffects() {
  const navbar = document.getElementById('main-navbar');
  const backToTopBtn = document.getElementById('back-to-top-btn');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('bg-black/90', 'border-b', 'border-neutral-800/80', 'shadow-2xl');
        navbar.classList.remove('bg-transparent');
      } else {
        navbar.classList.remove('bg-black/90', 'border-b', 'border-neutral-800/80', 'shadow-2xl');
        navbar.classList.add('bg-transparent');
      }
    }

    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.remove('opacity-0', 'invisible', 'translate-y-4');
        backToTopBtn.classList.add('opacity-100', 'visible', 'translate-y-0');
      } else {
        backToTopBtn.classList.add('opacity-0', 'invisible', 'translate-y-4');
        backToTopBtn.classList.remove('opacity-100', 'visible', 'translate-y-0');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ====================================================
   8. Developer Badge Toggle & Info
   ==================================================== */
window.toggleDevCard = function() {
  const card = document.getElementById('dev-info-popup');
  if (!card) return;
  card.classList.toggle('hidden');
};

/* ====================================================
   9. Toast Notification System
   ==================================================== */
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-5 left-5 z-[9999] flex flex-col gap-2 max-w-sm pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `
    pointer-events-auto transform transition-all duration-300 translate-y-3 opacity-0
    flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border text-sm
    ${type === 'success' 
      ? 'bg-neutral-900/95 border-[#bef202]/50 text-white shadow-[#bef202]/10' 
      : 'bg-neutral-900/95 border-neutral-700 text-white'}
  `;

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `
      <div class="w-7 h-7 rounded-full bg-[#bef202]/20 flex items-center justify-center flex-shrink-0 text-[#bef202]">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
    `;
  } else {
    iconSvg = `
      <div class="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0 text-[#bef202]">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </div>
    `;
  }

  toast.innerHTML = `
    ${iconSvg}
    <div class="flex-1 text-right text-xs sm:text-sm font-medium leading-relaxed">${escapeHtml(message)}</div>
  `;

  toastContainer.appendChild(toast);

  // Trigger enter animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-3', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  // Auto remove after 4.5 seconds
  setTimeout(() => {
    toast.classList.add('translate-y-3', 'opacity-0');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 4500);
}

function escapeHtml(string) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(string).replace(/[&<>"']/g, (m) => map[m]);
}
