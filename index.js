/* ========================================
   SRI SHYAM ENTERPRISE — Interactions & Animations
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Mobile hamburger toggle ----
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  const mobileCloseBtn = document.getElementById('mobileCloseBtn');
  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ---- Scroll-reveal (IntersectionObserver) ----
  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Animated Counter for Stats (0 to Target on Scroll) ----
  const statNumbers = document.querySelectorAll('.about__stat-number');
  let hasAnimatedStats = false;

  function animateCounters() {
    statNumbers.forEach(stat => {
      const targetAttr = stat.getAttribute('data-target');
      if (!targetAttr) return;
      const target = parseInt(targetAttr, 10);
      const suffix = stat.getAttribute('data-suffix') || '';
      const duration = 1800; // ms
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutExpo for ultra smooth ending
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = Math.floor(ease * target);

        stat.textContent = currentVal + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          stat.textContent = target + suffix;
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }

  const statsSection = document.querySelector('.about__stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimatedStats) {
            hasAnimatedStats = true;
            animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    statsObserver.observe(statsSection);
  }

  // ---- Smooth scroll for anchor links ----
  const siteHeader = document.getElementById('siteHeader');

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      
      if (!targetId || targetId === '#' || targetId === '#hero') {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = siteHeader ? siteHeader.offsetHeight : 70;
        const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---- Active nav link on scroll ----
  const sections = document.querySelectorAll('section[id], header[id]');

  const updateActiveLink = () => {
    const navHeight = siteHeader ? siteHeader.offsetHeight : 70;
    const scrollY = window.scrollY;

    // Special case for Home at the top
    if (scrollY < 300) {
      document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
      const homeLink = document.querySelector('.nav-link[href="#hero"]');
      if (homeLink) homeLink.classList.add('active');
      return;
    }

    sections.forEach(section => {
      const top = section.offsetTop - navHeight - 50;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (id && id !== 'hero') {
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (link) {
          if (scrollY >= top && scrollY < top + height) {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        }
      }
    });
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ---- Smooth 3D Showcase Carousel Engine ----
  const showcaseLineup = document.getElementById('showcaseLineup');
  const showcasePrev = document.getElementById('showcasePrev');
  const showcaseNext = document.getElementById('showcaseNext');

  if (showcaseLineup && showcasePrev && showcaseNext) {
    const items = Array.from(showcaseLineup.children);
    const total = items.length;
    let activeIndex = 3; // Center initial index for 7 brand products

    const update3DCarousel = () => {
      const isMobile = window.innerWidth <= 768;
      const isSmallMobile = window.innerWidth <= 480;
      const maxVisible = isMobile ? 3 : 4;
      const spacing = isSmallMobile ? 36 : (isMobile ? 44 : 68); // balanced continuous zero-gap spacing

      items.forEach((item, index) => {
        let offset = index - activeIndex;

        // Wrap around for continuous loop
        if (offset > total / 2) offset -= total;
        if (offset < -total / 2) offset += total;

        const absOffset = Math.abs(offset);

        if (absOffset > maxVisible) {
          item.style.opacity = '0';
          item.style.pointerEvents = 'none';
          item.style.transform = `translate(-50%, 0) translateX(${offset * spacing}px) scale(0.3)`;
          item.style.zIndex = '0';
          return;
        }

        item.style.pointerEvents = 'auto';
        item.style.opacity = '1';
        
        const translateX = offset * spacing;
        const baseScale = isSmallMobile ? 1.04 : (isMobile ? 1.08 : 1.14);
        const scaleStep = isMobile ? 0.12 : 0.11;
        const scale = Math.max(0.62, baseScale - absOffset * scaleStep);
        const translateY = Math.max(-6, (isMobile ? 12 : 14) - absOffset * (isMobile ? 5.5 : 6));
        const zIndex = 100 - absOffset * 10;

        item.style.zIndex = zIndex;
        item.style.transform = `translate(-50%, 0) translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`;
      });
    };

    showcaseNext.addEventListener('click', () => {
      activeIndex = (activeIndex + 1) % total;
      update3DCarousel();
    });

    showcasePrev.addEventListener('click', () => {
      activeIndex = (activeIndex - 1 + total) % total;
      update3DCarousel();
    });

    // Also make clicking any side bag smoothly bring it to the center!
    items.forEach((item, index) => {
      item.addEventListener('click', () => {
        activeIndex = index;
        update3DCarousel();
      });
    });

    window.addEventListener('resize', update3DCarousel);
    update3DCarousel();
  }

  // ---- Product Catalogue Category Filtering ----
  const filterBtns = document.querySelectorAll('.products__filter-btn');
  const productCards = document.querySelectorAll('.product-card[data-brand]');

  function filterCategory(category) {
    filterBtns.forEach(btn => {
      if (btn.getAttribute('data-filter') === category) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    productCards.forEach(card => {
      const cardBrand = card.getAttribute('data-brand');
      if (category === 'all' || cardBrand === category) {
        card.style.display = 'flex';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');
      filterCategory(category);
    });
  });

  // Link Our Partners Brand Cards directly to their catalogue filter
  document.querySelectorAll('.brand-card').forEach(brandCard => {
    brandCard.addEventListener('click', () => {
      const title = (brandCard.getAttribute('title') || '').toLowerCase();
      let cat = 'all';
      if (title.includes('jsw')) cat = 'jsw';
      else if (title.includes('ultratech')) cat = 'ultratech';
      else if (title.includes('ambuja')) cat = 'ambuja';
      else if (title.includes('acc')) cat = 'acc';
      else if (title.includes('nuvoco')) cat = 'nuvoco';
      else if (title.includes('dalmia')) cat = 'dalmia';
      else if (title.includes('konark')) cat = 'konark';
      else cat = 'all';

      filterCategory(cat);
    });
  });

  // Link Footer Brand Catalogue links directly to product filter
  document.querySelectorAll('[data-footer-brand]').forEach(link => {
    link.addEventListener('click', () => {
      const brand = link.getAttribute('data-footer-brand');
      if (brand) {
        filterCategory(brand);
      }
    });
  });

  // ========================================
  // PRODUCT QUICK ORDER MODAL POPUP
  // ========================================
  const productModal = document.getElementById('productModal');
  const modalBackdrop = document.getElementById('productModalBackdrop');
  const modalClose = document.getElementById('productModalClose');
  const modalProductImg = document.getElementById('modalProductImg');
  const modalProductBrand = document.getElementById('modalProductBrand');
  const modalProductName = document.getElementById('modalProductName');
  const modalProductType = document.getElementById('modalProductType');
  const modalBagsCount = document.getElementById('modalBagsCount');
  const modalLocation = document.getElementById('modalLocation');
  const modalOrderWhatsappBtn = document.getElementById('modalOrderWhatsappBtn');
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  const qtyValue = document.getElementById('qtyValue');
  const qtyChips = document.querySelectorAll('.qty-chip');
  const customQtyBox = document.getElementById('customQtyBox');
  const customTonsInput = document.getElementById('customTonsInput');
  const qtyStepperWrap = document.getElementById('qtyStepperWrap');

  const brandNamesMap = {
    'jsw': 'JSW Cement',
    'ultratech': 'UltraTech Cement',
    'ambuja': 'Ambuja Cement',
    'acc': 'ACC Cement',
    'nuvoco': 'Nuvoco Cement',
    'dalmia': 'Dalmia Cement',
    'konark': 'Konark Cement'
  };

  let currentProduct = {
    name: '',
    type: '',
    brand: '',
    imgSrc: '',
    tons: 5,
    isCustom: false
  };

  const updateModalState = () => {
    if (!productModal) return;

    qtyValue.textContent = currentProduct.tons;
    const totalBags = Math.round(currentProduct.tons * 20); // 1 Ton = 20 bags of 50kg
    modalBagsCount.textContent = `Approx. ${totalBags.toLocaleString()} Bags (50kg each)`;

    // Update active preset chips
    qtyChips.forEach(chip => {
      const chipVal = chip.getAttribute('data-tons');
      if (currentProduct.isCustom) {
        if (chipVal === 'custom') chip.classList.add('active');
        else chip.classList.remove('active');
      } else {
        const chipTons = parseInt(chipVal, 10);
        if (chipTons === currentProduct.tons) {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      }
    });

    // Generate WhatsApp Order Message
    const locationVal = (modalLocation ? modalLocation.value.trim() : '');
    const customTag = currentProduct.isCustom ? ' (Custom Quantity)' : '';
    let msg = `Hello Sri Shyam Enterprise,\nI would like to order/enquire for:\n\n* Product: ${currentProduct.name} (${currentProduct.brand})\n* Quantity: ${currentProduct.tons} Tons${customTag} (${totalBags.toLocaleString()} Bags)`;
    if (locationVal) {
      msg += `\n* Delivery Location: ${locationVal}`;
    }

    // Add photo preview link if running on live domain
    if (window.location.protocol !== 'file:' && currentProduct.imgSrc) {
      const fullImgUrl = `${window.location.origin}/${currentProduct.imgSrc}`;
      msg += `\n* Product Image: ${fullImgUrl}`;
    }

    msg += `\n\nPlease provide your best price quote and delivery schedule.`;

    const encodedMsg = encodeURIComponent(msg);
    modalOrderWhatsappBtn.href = `https://wa.me/919830755409?text=${encodedMsg}`;
  };

  const openProductModal = (card) => {
    if (!productModal) return;

    const nameEl = card.querySelector('.product-card__name');
    const typeEl = card.querySelector('.product-card__type');
    const imgEl = card.querySelector('.product-card__image img');
    const brandCode = (card.getAttribute('data-brand') || '').toLowerCase();

    currentProduct.name = nameEl ? nameEl.textContent.trim() : 'Cement Product';
    currentProduct.type = typeEl ? typeEl.textContent.trim() : 'High Grade Cement';
    currentProduct.brand = brandNamesMap[brandCode] || 'Premium Cement';
    currentProduct.imgSrc = imgEl ? imgEl.getAttribute('src') : '';
    currentProduct.tons = 5; // Default minimum 5 Tons
    currentProduct.isCustom = false;

    modalProductName.textContent = currentProduct.name;
    modalProductType.textContent = currentProduct.type;
    modalProductBrand.textContent = currentProduct.brand;
    modalProductImg.src = currentProduct.imgSrc;
    modalProductImg.alt = currentProduct.name;

    if (customQtyBox) customQtyBox.style.display = 'none';
    if (customTonsInput) customTonsInput.value = '';
    if (modalLocation) modalLocation.value = '';

    updateModalState();

    productModal.classList.add('is-open');
    productModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  };

  const closeProductModal = () => {
    if (!productModal) return;
    productModal.classList.remove('is-open');
    productModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };

  // Attach click listeners to all product cards
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      openProductModal(card);
    });
  });

  // Quantity Stepper Handlers (Min: 5 Tons, Max: 30 Tons)
  if (qtyMinus) {
    qtyMinus.addEventListener('click', () => {
      currentProduct.isCustom = false;
      if (customQtyBox) customQtyBox.style.display = 'none';
      if (currentProduct.tons > 5) {
        currentProduct.tons = Math.max(5, currentProduct.tons - 5);
        updateModalState();
      }
    });
  }

  if (qtyPlus) {
    qtyPlus.addEventListener('click', () => {
      currentProduct.isCustom = false;
      if (customQtyBox) customQtyBox.style.display = 'none';
      if (currentProduct.tons < 30) {
        currentProduct.tons = Math.min(30, currentProduct.tons + 5);
        updateModalState();
      }
    });
  }

  // Quick Preset Chips & Custom Chip Handlers
  qtyChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const chipVal = chip.getAttribute('data-tons');
      if (chipVal === 'custom') {
        currentProduct.isCustom = true;
        if (customQtyBox) customQtyBox.style.display = 'block';
        if (customTonsInput) {
          if (!customTonsInput.value) {
            customTonsInput.value = currentProduct.tons;
          }
          customTonsInput.focus();
          customTonsInput.select();
        }
        updateModalState();
      } else {
        currentProduct.isCustom = false;
        if (customQtyBox) customQtyBox.style.display = 'none';
        const tons = parseInt(chipVal, 10);
        if (tons >= 5 && tons <= 30) {
          currentProduct.tons = tons;
          updateModalState();
        }
      }
    });
  });

  // Custom Tons live input handler
  if (customTonsInput) {
    customTonsInput.addEventListener('input', () => {
      const val = parseFloat(customTonsInput.value);
      if (!isNaN(val) && val > 0) {
        currentProduct.tons = val;
      }
      updateModalState();
    });
  }

  // Location input live message update
  if (modalLocation) {
    modalLocation.addEventListener('input', updateModalState);
  }

  // Web Share API Image Attachment for WhatsApp (on supported devices/mobiles)
  if (modalOrderWhatsappBtn) {
    modalOrderWhatsappBtn.addEventListener('click', async (e) => {
      if (navigator.canShare && currentProduct.imgSrc) {
        try {
          const response = await fetch(currentProduct.imgSrc);
          const blob = await response.blob();
          const file = new File([blob], `${currentProduct.name.replace(/\s+/g, '_')}.png`, { type: blob.type || 'image/png' });

          const totalBags = Math.round(currentProduct.tons * 20);
          const locationVal = (modalLocation ? modalLocation.value.trim() : '');
          const customTag = currentProduct.isCustom ? ' (Custom Quantity)' : '';
          let shareText = `Hello Sri Shyam Enterprise,\nI would like to order/enquire for:\n\n* Product: ${currentProduct.name} (${currentProduct.brand})\n* Quantity: ${currentProduct.tons} Tons${customTag} (${totalBags.toLocaleString()} Bags)`;
          if (locationVal) {
            shareText += `\n* Delivery Location: ${locationVal}`;
          }
          shareText += `\n\nPlease provide your best price quote and delivery schedule.`;

          if (navigator.canShare({ files: [file] })) {
            e.preventDefault();
            await navigator.share({
              files: [file],
              title: `${currentProduct.name} — Order Enquiry`,
              text: shareText
            });
            return;
          }
        } catch (err) {
          // If user cancels share or browser fails, fall back to default wa.me href
          console.log('Web share fallback to WhatsApp link');
        }
      }
    });
  }

  // Close modal events
  if (modalClose) modalClose.addEventListener('click', closeProductModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProductModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && productModal && productModal.classList.contains('is-open')) {
      closeProductModal();
    }
  });

});
