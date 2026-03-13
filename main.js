// =========================================================
// Enhanced Header System with Smart Hide/Show on Scroll
// =========================================================
const mainHeader = document.querySelector('.main-header');
let lastScrollY = 0;
let scrollTicking = false;
let scrollDirection = 'up';
let scrollTimeout;

function updateHeaderScroll() {
  const currentScrollY = window.scrollY;
  const scrollDelta = currentScrollY - lastScrollY;
  
  // Determine scroll direction
  if (scrollDelta > 5) {
    scrollDirection = 'down';
  } else if (scrollDelta < -5) {
    scrollDirection = 'up';
  }
  
  // Add/remove scrolled class for styling changes
  if (currentScrollY > 50) {
    mainHeader.classList.add('scrolled');
  } else {
    mainHeader.classList.remove('scrolled');
  }
  
  // Smart hide/show logic
  if (currentScrollY > 200) {
    if (scrollDirection === 'down' && currentScrollY > lastScrollY) {
      // Scrolling down - hide header
      mainHeader.classList.add('header-hidden');
      mainHeader.classList.remove('header-visible');
    } else if (scrollDirection === 'up') {
      // Scrolling up - show header
      mainHeader.classList.remove('header-hidden');
      mainHeader.classList.add('header-visible');
    }
  } else {
    // At top of page - always show header
    mainHeader.classList.remove('header-hidden');
    mainHeader.classList.add('header-visible');
  }
  
  lastScrollY = currentScrollY;
  scrollTicking = false;
}

if (mainHeader) {
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateHeaderScroll);
      scrollTicking = true;
    }
    
    // Clear timeout for scroll end detection
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // When scroll stops, ensure header is visible
      mainHeader.classList.remove('header-hidden');
      mainHeader.classList.add('header-visible');
    }, 150);
  }, { passive: true });
}

// Mobile Navigation Toggle with proper state management
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const mobileNavClose = document.querySelector('.mobile-nav-close');
const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');

// Safe function to open mobile navigation
function openMobileNav() {
  if (!mobileNav || !mobileNavToggle) return;
  
  mobileNav.classList.add('active');
  mobileNavToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  
  // Focus management for accessibility
  const firstFocusable = mobileNav.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (firstFocusable) {
    setTimeout(() => firstFocusable.focus(), 100);
  }
}

// Safe function to close mobile navigation
function closeMobileNav() {
  if (!mobileNav || !mobileNavToggle) return;
  
  mobileNav.classList.remove('active');
  mobileNavToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  
  // Return focus to toggle button
  mobileNavToggle.focus();
}

// Initialize mobile navigation
if (mobileNavToggle && mobileNav) {
  mobileNavToggle.addEventListener('click', (e) => {
    e.preventDefault();
    const isOpen = mobileNav.classList.contains('active');
    isOpen ? closeMobileNav() : openMobileNav();
  });
}

if (mobileNavClose && mobileNav) {
  mobileNavClose.addEventListener('click', (e) => {
    e.preventDefault();
    closeMobileNav();
  });
}

// Close mobile nav when clicking outside (with proper event delegation)
document.addEventListener('click', (e) => {
  if (mobileNav && mobileNav.classList.contains('active')) {
    if (!mobileNav.contains(e.target) && !mobileNavToggle.contains(e.target)) {
      closeMobileNav();
    }
  }
});

// Keyboard navigation for mobile menu
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('active')) {
    closeMobileNav();
  }
});

// Trap focus within mobile menu when open
if (mobileNav) {
  mobileNav.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      const focusableElements = mobileNav.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  });
}

// Enhanced Mobile Dropdown Toggles with smooth animations
mobileDropdownToggles.forEach(toggle => {
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    const dropdown = toggle.closest('.mobile-nav-dropdown');
    const isOpen = dropdown.classList.contains('open');
    
    // Close all other dropdowns with animation
    mobileDropdownToggles.forEach(otherToggle => {
      const otherDropdown = otherToggle.closest('.mobile-nav-dropdown');
      if (otherDropdown !== dropdown && otherDropdown.classList.contains('open')) {
        otherDropdown.classList.remove('open');
        otherToggle.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Toggle current dropdown with smooth animation
    if (isOpen) {
      dropdown.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    } else {
      dropdown.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
    }
  });
});

// Enhanced Desktop Dropdown Menus with modern positioning
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

dropdownToggles.forEach(toggle => {
  const dropdown = toggle.closest('.nav-dropdown');
  const menu = dropdown.querySelector('.dropdown-menu');
  
  // Desktop hover behavior (min-width: 1025px)
  dropdown.addEventListener('mouseenter', () => {
    if (window.innerWidth > 1024) {
      dropdown.setAttribute('aria-expanded', 'true');
    }
  });
  
  dropdown.addEventListener('mouseleave', () => {
    if (window.innerWidth > 1024) {
      setTimeout(() => {
        dropdown.setAttribute('aria-expanded', 'false');
      }, 100);
    }
  });
  
  // Click/touch behavior for all devices
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    const isExpanded = dropdown.getAttribute('aria-expanded') === 'true';
    
    // Close all other dropdowns
    dropdownToggles.forEach(otherToggle => {
      const otherDropdown = otherToggle.closest('.nav-dropdown');
      if (otherDropdown !== dropdown) {
        otherDropdown.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Toggle current dropdown
    dropdown.setAttribute('aria-expanded', String(!isExpanded));
  });
  
  // Enhanced keyboard navigation
  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      toggle.click();
      if (dropdown.getAttribute('aria-expanded') === 'true') {
        // Focus first menu item
        const firstMenuItem = menu.querySelector('[role="menuitem"]');
        if (firstMenuItem) setTimeout(() => firstMenuItem.focus(), 100);
      }
    }
    
    // Arrow key navigation within dropdown
    if (e.key === 'ArrowDown' && dropdown.getAttribute('aria-expanded') === 'true') {
      const menuItems = menu.querySelectorAll('[role="menuitem"]');
      const currentIndex = Array.from(menuItems).indexOf(document.activeElement);
      
      if (currentIndex < menuItems.length - 1) {
        e.preventDefault();
        menuItems[currentIndex + 1].focus();
      }
    }
    
    if (e.key === 'ArrowUp' && dropdown.getAttribute('aria-expanded') === 'true') {
      const menuItems = menu.querySelectorAll('[role="menuitem"]');
      const currentIndex = Array.from(menuItems).indexOf(document.activeElement);
      
      if (currentIndex > 0) {
        e.preventDefault();
        menuItems[currentIndex - 1].focus();
      }
    }
    
    if (e.key === 'Escape') {
      dropdown.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
});

// Mobile sidebar close functionality
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 1024) {
    // Check if clicking on the close button (created via CSS ::after)
    if (e.target.classList.contains('dropdown-menu') && 
        e.clientX > window.innerWidth - 60 && 
        e.clientY < 80) {
      // Close all dropdowns
      document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
        dropdown.setAttribute('aria-expanded', 'false');
      });
    }
    
    // Close dropdown when clicking outside
    const activeDropdowns = document.querySelectorAll('.nav-dropdown[aria-expanded="true"]');
    activeDropdowns.forEach(dropdown => {
      const menu = dropdown.querySelector('.dropdown-menu');
      if (!dropdown.contains(e.target) && !menu.contains(e.target)) {
        dropdown.setAttribute('aria-expanded', 'false');
      }
    });
  }
});

// Close mobile dropdowns on window resize to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 1024) {
    document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
      dropdown.setAttribute('aria-expanded', 'false');
    });
  }
});

// Close dropdowns when clicking outside (desktop only)
document.addEventListener('click', (e) => {
  if (window.innerWidth > 1024) {
    const activeDropdowns = document.querySelectorAll('.nav-dropdown[aria-expanded="true"]');
    activeDropdowns.forEach(dropdown => {
      if (!dropdown.contains(e.target)) {
        dropdown.setAttribute('aria-expanded', 'false');
      }
    });
  }
});

// Enhanced Scroll Reveal with Intersection Observer
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

if (revealElements.length > 0) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add stagger delay for list items
        const staggerClass = entry.target.classList.contains('stagger-1') ? 100 :
                            entry.target.classList.contains('stagger-2') ? 200 :
                            entry.target.classList.contains('stagger-3') ? 300 :
                            entry.target.classList.contains('stagger-4') ? 400 :
                            entry.target.classList.contains('stagger-5') ? 500 : 0;
        
        setTimeout(() => {
          entry.target.classList.add('vis');
        }, staggerClass);
        
        // Unobserve after revealing
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

// Parallax effect for hero sections
const heroSections = document.querySelectorAll('.hero, .pg-hero');
if (heroSections.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    heroSections.forEach(hero => {
      const heroBg = hero.querySelector('.hero-bg');
      if (heroBg) {
        heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
    });
  }, { passive: true });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Enhanced Active Navigation State Management
function setActiveNavigation() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // Remove existing active classes
    link.classList.remove('active');
    
    // Smart active state detection
    if (href === currentPath || 
        (currentPath === '/' && href === 'index.html') ||
        (href !== 'index.html' && currentPath.includes(href))) {
      link.classList.add('active');
    }
  });
}

// Set active navigation on page load and handle navigation changes
setActiveNavigation();

// Handle mobile navigation auto-close on link clicks
mobileNav?.addEventListener('click', (e) => {
  if (e.target.classList.contains('mobile-nav-link')) {
    closeMobileNav();
  }
});

// Enhanced keyboard accessibility for mobile navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('active')) {
    closeMobileNav();
  }
});

// Touch-friendly dropdown behavior for tablets with better detection
if ('ontouchstart' in window) {
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('touchstart', (e) => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      if (!isExpanded) {
        e.preventDefault();
        toggle.setAttribute('aria-expanded', 'true');
      }
    }, { passive: false });
  });
}

// Enhanced focus management for better accessibility
dropdownToggles.forEach(toggle => {
  toggle.addEventListener('focus', () => {
    toggle.setAttribute('aria-expanded', 'true');
  });
  
  toggle.addEventListener('blur', (e) => {
    // Only close if focus is not moving to a dropdown item
    if (!e.relatedTarget || !e.relatedTarget.closest('.dropdown-menu')) {
      setTimeout(() => {
        if (!toggle.matches(':focus-within')) {
          toggle.setAttribute('aria-expanded', 'false');
        }
      }, 100);
    }
  });
});

// Performance optimization: Debounce resize events
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Reset mobile nav state on resize
    if (window.innerWidth > 1024 && mobileNav?.classList.contains('active')) {
      closeMobileNav();
    }
  }, 250);
});

// =========================================================
// Global interactive behavior shared across all pages
// - Scroll reveal animations
// - Portfolio filtering
// - Blog listing & pagination
// - Contact form feedback
// - 3D visualization demo & before/after slider
// =========================================================

// Scroll reveal using IntersectionObserver
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('vis');
        revealObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => revealObs.observe(el));

// Portfolio filter (only attaches on portfolio page)
const portFilter = document.getElementById('portFilter');
if (portFilter) {
  portFilter.addEventListener('click', (e) => {
    const btn = e.target.closest('.fbtn');
    if (!btn) return;
    document
      .querySelectorAll('#portFilter .fbtn')
      .forEach((b) => b.classList.remove('act'));
    btn.classList.add('act');
    const f = btn.dataset.f;
    document.querySelectorAll('#portGrid .port-item').forEach((item) => {
      item.style.display = f === 'all' || item.dataset.cat === f ? '' : 'none';
    });
  });
}

// Blog listing & pagination (only attaches on blog page)
const blogGrid = document.getElementById('blogGrid');
const blogPag = document.getElementById('blogPag');
if (blogGrid && blogPag) {
  const blogPosts = [
    {
      slug: 'sustainable-architecture',
      tag: 'Sustainable',
      title: 'Sustainable Architecture: Building Green Homes in Bangladesh',
      desc: 'Explore how modern Bangladeshi architects are incorporating solar panels, rainwater harvesting, cross-ventilation, and locally sourced materials to create energy-efficient homes that reduce environmental impact.',
      img: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=600&q=80&fm=webp',
      author: 'Ar. Rahul Chakraborty',
      date: 'Feb 28, 2026',
      time: '8 min read'
    },
    {
      slug: 'hire-architect-guide',
      tag: 'Guide',
      title: 'How to Hire an Architect: A Complete Guide for Bangladeshi Homeowners',
      desc: 'From checking credentials and reviewing portfolios to understanding fee structures and RAJUK requirements — everything you need to know before hiring an architect in Bangladesh.',
      img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80&fm=webp',
      author: 'Team Editorial',
      date: 'Feb 15, 2026',
      time: '10 min read'
    },
    {
      slug: 'modern-kitchen-design-2026',
      tag: 'Interior',
      title: 'Modern Kitchen Design Trends for 2026: Bangladesh Edition',
      desc: 'Open-plan layouts, modular cabinets, quartz countertops, and smart appliances — the top kitchen design trends reshaping Bangladeshi homes this year.',
      img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80&fm=webp',
      author: 'Priya Sen',
      date: 'Feb 2, 2026',
      time: '6 min read'
    },
    {
      slug: 'nrb-property-investment-guide',
      tag: 'NRB',
      title: 'NRB Property Investment: Your Complete Bangladesh Guide for 2026',
      desc: 'Legal requirements, financing options, RAJUK regulations, land verification, and step-by-step guidance for Non-Resident Bangladeshis looking to invest in property back home.',
      img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80&fm=webp',
      author: 'Ar. Rahul Chakraborty',
      date: 'Jan 20, 2026',
      time: '12 min read'
    },
    {
      slug: '3d-visualization-architecture',
      tag: 'Technology',
      title: 'The Rise of 3D Visualization in Bangladeshi Architecture',
      desc: 'How photorealistic 3D renders, VR walkthroughs, and real-time interactive models are transforming client presentations and reducing costly design changes during construction.',
      img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80&fm=webp',
      author: 'Digital Team',
      date: 'Jan 8, 2026',
      time: '7 min read'
    },
    {
      slug: 'vastu-shastra-modern-design',
      tag: 'Culture',
      title: 'Vastu Shastra vs Modern Design: Finding the Balance',
      desc: 'Many Bangladeshi homeowners want both Vastu-compliant and contemporary design. Learn how top architects harmonise traditional principles with modern aesthetics.',
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80&fm=webp',
      author: 'Ar. Rahul Chakraborty',
      date: 'Dec 22, 2025',
      time: '9 min read'
    },
    {
      slug: 'rajuk-building-regulations',
      tag: 'Construction',
      title: 'Understanding RAJUK Building Regulations: What Every Homeowner Must Know',
      desc: 'FAR calculations, setback rules, height restrictions, and approval timelines — a plain-language guide to navigating RAJUK building permits in Dhaka.',
      img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80&fm=webp',
      author: 'Team Editorial',
      date: 'Dec 10, 2025',
      time: '11 min read'
    },
    {
      slug: 'lighting-design-secrets',
      tag: 'Interior',
      title: 'Lighting Design Secrets: How to Transform Any Room in Your Home',
      desc: 'From ambient and task to accent lighting — professional techniques for creating mood, enhancing functionality, and making your spaces feel larger.',
      img: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600&q=80&fm=webp',
      author: 'Priya Sen',
      date: 'Nov 28, 2025',
      time: '7 min read'
    },
    {
      slug: 'custom-furniture-bangladesh',
      tag: 'Furniture',
      title: 'Bangladeshi Craftsmanship: Why Custom Furniture is Worth the Investment',
      desc: 'The art of bespoke furniture making in Bangladesh — how skilled artisans create heirloom-quality pieces at a fraction of international prices.',
      img: 'https://images.unsplash.com/photo-1555041469-a586c1ea9ce5?w=600&q=80&fm=webp',
      author: 'Ar. Rahul Chakraborty',
      date: 'Nov 15, 2025',
      time: '8 min read'
    }
  ];

  const BLOG_PER_PAGE = 3;
  let blogPage = 1;

  const renderBlog = () => {
    const totalPages = Math.ceil(blogPosts.length / BLOG_PER_PAGE);
    const start = (blogPage - 1) * BLOG_PER_PAGE;
    const visible = blogPosts.slice(start, start + BLOG_PER_PAGE);

    blogGrid.innerHTML = visible
      .map(
        (p) => {
          const detailUrl = 'blog-' + p.slug + '.html';
          return `<article class="blog-card reveal vis">
    <a href="${detailUrl}" class="blog-card-link" aria-label="Read: ${p.title}">
    <img src="${p.img}" alt="${p.title}" width="600" height="375" loading="lazy" decoding="async" class="blog-img">
    <div class="blog-body">
      <span class="blog-tag">${p.tag}</span>
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <div class="blog-meta">
        <span>${p.author} · ${p.date} · ${p.time}</span>
        <div class="blog-share">
          <button type="button" class="share-btn" title="Share on Facebook" data-share="fb" data-url="${detailUrl}">f</button>
          <button type="button" class="share-btn" title="Share on X" data-share="x" data-url="${detailUrl}">𝕏</button>
          <button type="button" class="share-btn" title="Share on LinkedIn" data-share="li" data-url="${detailUrl}">in</button>
          <button type="button" class="share-btn" title="Copy link" data-share="copy" data-url="${detailUrl}">🔗</button>
        </div>
      </div>
    </div>
    </a>
  </article>`;
        }
      )
      .join('');

    let pagHtml = `<button class="pg-btn" data-page="prev" ${
      blogPage === 1 ? 'disabled' : ''
    }>&laquo;</button>`;
    const totalPagesInt = totalPages;
    for (let i = 1; i <= totalPagesInt; i++) {
      pagHtml += `<button class="pg-btn${
        i === blogPage ? ' act' : ''
      }" data-page="${i}">${i}</button>`;
    }
    pagHtml += `<button class="pg-btn" data-page="next" ${
      blogPage === totalPages ? 'disabled' : ''
    }>&raquo;</button>`;
    blogPag.innerHTML = pagHtml;
  };

  blogPag.addEventListener('click', (e) => {
    const btn = e.target.closest('.pg-btn');
    if (!btn) return;
    const val = btn.getAttribute('data-page');
    const totalPages = Math.ceil(blogPosts.length / BLOG_PER_PAGE);
    if (val === 'prev') blogPage = Math.max(1, blogPage - 1);
    else if (val === 'next') blogPage = Math.min(totalPages, blogPage + 1);
    else blogPage = Number(val) || 1;
    renderBlog();
    blogGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  blogGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.share-btn');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const kind = btn.getAttribute('data-share');
    const card = btn.closest('.blog-card');
    const link = card ? card.querySelector('.blog-card-link') : null;
    const url = link ? (new URL(link.getAttribute('href'), window.location.href)).href : window.location.href;
    if (kind === 'fb') {
      window.open(
        'https://facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url),
        '_blank'
      );
    } else if (kind === 'x') {
      window.open(
        'https://x.com/intent/tweet?text=' + encodeURIComponent(document.title) +
          '&url=' + encodeURIComponent(url),
        '_blank'
      );
    } else if (kind === 'li') {
      window.open(
        'https://linkedin.com/sharing/share-offsite/?url=' +
          encodeURIComponent(url),
        '_blank'
      );
    } else if (kind === 'copy') {
      if (navigator.clipboard) navigator.clipboard.writeText(url);
      btn.textContent = '✓';
      setTimeout(() => {
        btn.textContent = '🔗';
      }, 1500);
    }
  });

  renderBlog();
}

// Contact form success message (only attaches on contact page)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('formMsg');
    if (msg) {
      msg.style.display = 'block';
      msg.style.color = 'var(--c-pri)';
      msg.textContent =
        '✓ Thank you! Your message has been sent. We will contact you within 24 hours.';
    }
    contactForm.reset();
  });
}

// Consultation booking form (contact page)
var consultForm = document.getElementById('consultForm');
if (consultForm) {
  consultForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var msg = document.getElementById('consultMsg');
    if (msg) {
      msg.style.display = 'block';
      msg.textContent = 'Thank you! We will confirm your consultation slot within 24 hours via email or WhatsApp.';
    }
    consultForm.reset();
  });
}

// 3D visualization controls (only attach on viz page)
const vizShowcase = document.getElementById('vizShowcase');
const house3d = document.getElementById('house3d');
if (vizShowcase && house3d) {
  let vizMode = 'rotate';
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let rotX = -15;
  let rotY = 0;

  const setVizMode = (mode, btn) => {
    vizMode = mode;
    document
      .querySelectorAll('.viz-ctrl-btn')
      .forEach((b) => b.classList.remove('act'));
    if (btn) btn.classList.add('act');

    if (mode === 'rotate') {
      house3d.style.animation = 'houseRotate 20s linear infinite';
      house3d.style.transform = '';
    } else if (mode === 'drag') {
      house3d.style.animation = 'none';
    } else if (mode === 'explode') {
      house3d.style.animation = 'none';
      house3d.style.transform = 'rotateX(-20deg) rotateY(-30deg)';
      const walls = house3d.querySelectorAll('.wall');
      walls.forEach((w, i) => {
        w.style.transition = 'transform 0.8s cubic-bezier(0.16,1,0.3,1)';
        const offsets = [
          'translateZ(140px)',
          'translateZ(-140px)',
          'translateX(-40px)',
          'translateX(40px)'
        ];
        if (i < offsets.length) {
          w.style.transform += ' ' + offsets[i];
        }
      });
      setTimeout(() => {
        walls.forEach((w) => {
          w.style.transition = 'transform 0.8s cubic-bezier(0.16,1,0.3,1)';
          w.style.transform = '';
        });
      }, 2000);
    }
  };

  document.querySelectorAll('.viz-ctrl-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode') || 'rotate';
      setVizMode(mode, btn);
    });
  });

  const onPointerMove = (clientX, clientY) => {
    if (!isDragging || vizMode !== 'drag') return;
    const dx = clientX - startX;
    const dy = clientY - startY;
    rotY += dx * 0.5;
    rotX += dy * 0.3;
    house3d.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    startX = clientX;
    startY = clientY;
  };

  vizShowcase.addEventListener('mousedown', (e) => {
    if (vizMode === 'drag') {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
    }
  });
  window.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY));
  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  vizShowcase.addEventListener(
    'touchstart',
    (e) => {
      if (vizMode === 'drag') {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    },
    { passive: true }
  );
  window.addEventListener(
    'touchmove',
    (e) => {
      if (!isDragging || vizMode !== 'drag') return;
      onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    },
    { passive: true }
  );
  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}

// Before/After slider (only attaches on viz page)
const baSlider = document.getElementById('baSlider');
const baHandle = document.getElementById('baHandle');
if (baSlider && baHandle) {
  let baActive = false;
  const updateBA = (x) => {
    const rect = baSlider.getBoundingClientRect();
    let pct = ((x - rect.left) / rect.width) * 100;
    pct = Math.max(5, Math.min(95, pct));
    baHandle.style.left = pct + '%';
    const afterImg = baSlider.querySelector('.ba-after');
    if (afterImg) {
      afterImg.style.clipPath = `inset(0 0 0 ${pct}%)`;
    }
  };
  baSlider.addEventListener('mousedown', (e) => {
    baActive = true;
    updateBA(e.clientX);
  });
  window.addEventListener('mousemove', (e) => {
    if (baActive) updateBA(e.clientX);
  });
  window.addEventListener('mouseup', () => {
    baActive = false;
  });
  baSlider.addEventListener(
    'touchstart',
    (e) => {
      baActive = true;
      updateBA(e.touches[0].clientX);
    },
    { passive: true }
  );
  window.addEventListener(
    'touchmove',
    (e) => {
      if (baActive) updateBA(e.touches[0].clientX);
    },
    { passive: true }
  );
  window.addEventListener('touchend', () => {
    baActive = false;
  });
}

// Fresher architects form submission (only attaches on fresher page)
const fresherForm = document.getElementById('fresherForm');
if (fresherForm) {
  fresherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('fresherFormMsg');
    if (msg) {
      msg.style.display = 'block';
      msg.style.color = 'var(--c-pri)';
      msg.textContent = '✓ Thank you for your application! We have received your details and will contact you within 48 hours to discuss the next steps.';
    }
    fresherForm.reset();
  });
}

// FAQ accordion functionality
const faqItems = document.querySelectorAll('.faq-item');
if (faqItems.length > 0) {
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const toggle = item.querySelector('.faq-toggle');
    const answer = item.querySelector('.faq-answer');
    
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      
      // Close all other FAQ items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          otherItem.querySelector('.faq-toggle').textContent = '+';
          otherItem.querySelector('.faq-answer').style.maxHeight = '0';
        }
      });
      
      // Toggle current item
      if (isOpen) {
        item.classList.remove('open');
        toggle.textContent = '+';
        answer.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        toggle.textContent = '−';
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// =========================================================
// AI Chatbot widget — floating button + panel, WhatsApp handoff
// Simple rule-based replies; "Chat on WhatsApp" for human takeover
// =========================================================
(function () {
  const WHATSAPP_NUMBER = '8801700000000';
  const BOT_GREETING = "Hi! I'm the Sthitha Sthapatya assistant. Ask me about our services, pricing, or book a free consultation. Type 'human' or 'whatsapp' to chat with our team.";
  const FALLBACK = "I'm not sure about that. For detailed help, chat with our team on WhatsApp — we'll respond quickly!";
  const RULES = [
    { keys: ['price', 'cost', 'pricing', 'fee', 'how much', 'tk'], msg: "Our architectural consultancy starts from ৳8/sq ft (Essential) to ৳22/sq ft (Premium). Interior design from ৳12/sq ft. Construction management is 5–8% of project value. Want a custom quote? Chat with us on WhatsApp for a free consultation." },
    { keys: ['consultation', 'free', 'meeting', 'schedule', 'book'], msg: "You can book a free 30-minute consultation with our principal architect. Visit our Contact page or chat with us on WhatsApp to pick a time (we offer slots for NRB time zones too)." },
    { keys: ['nrb', 'abroad', 'overseas', 'uk', 'usa', 'dubai'], msg: "We have a dedicated NRB service: weekly video updates, progress reports, dual-currency billing (BDT/USD/GBP/EUR/AED), and a single point of contact. Over 200 NRB families have built with us. Chat on WhatsApp to get started." },
    { keys: ['rajuk', 'approval', 'permit'], msg: "We handle full RAJUK submission and approval process. Typical timeline is 3–6 months for residential projects in Dhaka. We'll keep you updated at every step." },
    { keys: ['service', 'what do you do', 'offer'], msg: "We offer Architectural Consultancy, Luxury Interior Design, Construction Management, 3D Visualization, Custom Furniture, and NRB Services. Check our Services page or ask me something specific!" },
    { keys: ['contact', 'email', 'phone', 'address'], msg: "Office: House 42, Road 12, Block E, Banani, Dhaka 1213. Phone: +880 1700-000000. Email: hello@sthithasthapatya.com. Fastest way: chat with us on WhatsApp!" },
    { keys: ['human', 'whatsapp', 'agent', 'person', 'real'], msg: "Sure! Click the green 'Chat on WhatsApp' button below to talk to our team. We're here to help." }
  ];
  function getReply(text) {
    if (!text || !text.trim()) return BOT_GREETING;
    const t = text.toLowerCase().trim();
    for (const r of RULES) {
      if (r.keys.some(function(k) { return t.includes(k); })) return r.msg;
    }
    return FALLBACK;
  }
  var root = document.getElementById('chatbot-widget');
  if (root) return;
  root = document.createElement('div');
  root.id = 'chatbot-widget';
  root.innerHTML = '<div class="chatbot-panel" id="chatbotPanel" role="dialog" aria-label="Chat" aria-hidden="true"><div class="chatbot-header"><span>Chat with us</span><button type="button" class="chatbot-close" aria-label="Close chat">×</button></div><div class="chatbot-messages" id="chatbotMessages"></div><div class="chatbot-input-wrap"><input type="text" id="chatbotInput" placeholder="Type your question..." maxlength="500" aria-label="Your message"><button type="button" class="chatbot-send" aria-label="Send">Send</button></div><a href="https://wa.me/' + WHATSAPP_NUMBER + '" target="_blank" rel="noopener noreferrer" class="chatbot-wa">💬 Chat on WhatsApp — talk to our team</a></div><button type="button" class="chatbot-fab" id="chatbotFab" aria-label="Open chat"><span class="chatbot-fab-icon">💬</span></button>';
  document.body.appendChild(root);
  var panel = document.getElementById('chatbotPanel');
  var messages = document.getElementById('chatbotMessages');
  var input = document.getElementById('chatbotInput');
  var fab = document.getElementById('chatbotFab');
  var closeBtn = root.querySelector('.chatbot-close');
  var sendBtn = root.querySelector('.chatbot-send');
  function openChat() {
    panel.setAttribute('aria-hidden', 'false');
    panel.classList.add('chatbot-panel-open');
    if (!messages.querySelector('.chatbot-msg')) {
      var d = document.createElement('div');
      d.className = 'chatbot-msg chatbot-msg-bot';
      d.innerHTML = '<p>' + BOT_GREETING + '</p>';
      messages.appendChild(d);
      messages.scrollTop = messages.scrollHeight;
    }
    input.focus();
  }
  function closeChat() {
    panel.setAttribute('aria-hidden', 'true');
    panel.classList.remove('chatbot-panel-open');
  }
  function appendMsg(text, who) {
    var div = document.createElement('div');
    div.className = 'chatbot-msg chatbot-msg-' + who;
    div.innerHTML = '<p>' + text.replace(/\n/g, '<br>') + '</p>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }
  function sendUser() {
    var text = (input.value || '').trim();
    if (!text) return;
    appendMsg(text, 'user');
    input.value = '';
    setTimeout(function() { appendMsg(getReply(text), 'bot'); }, 400);
  }
  fab.addEventListener('click', openChat);
  closeBtn.addEventListener('click', closeChat);
  sendBtn.addEventListener('click', sendUser);
  input.addEventListener('keydown', function(e) { if (e.key === 'Enter') sendUser(); });
  panel.addEventListener('click', function(e) { if (e.target === panel) closeChat(); });
})();
