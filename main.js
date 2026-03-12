// =========================================================
// Global interactive behavior shared across all pages
// - Scroll reveal animations
// - Portfolio filtering
// - Blog listing & pagination
// - Contact form feedback
// - 3D visualization demo & before/after slider
// =========================================================

// Mobile navigation: right-to-left full-height sidebar + overlay
const nav = document.getElementById('nav');
const burger = document.querySelector('.burger');
if (nav && burger) {
  // Inject overlay (so we don't duplicate in every HTML)
  let overlay = document.getElementById('navOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.id = 'navOverlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-label', 'Close menu');
    document.querySelector('header .wrap')?.appendChild(overlay);
  }
  function openNav() {
    document.body.classList.add('nav-open');
    overlay.setAttribute('aria-hidden', 'false');
  }
  function closeNav() {
    document.body.classList.remove('nav-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.querySelectorAll('.drop.open').forEach((d) => d.classList.remove('open'));
  }
  burger.addEventListener('click', () => {
    if (document.body.classList.contains('nav-open')) closeNav();
    else openNav();
  });
  overlay.addEventListener('click', closeNav);
  // Close when a nav link (anchor) is clicked
  nav.querySelectorAll('a[href]').forEach((a) => {
    a.addEventListener('click', () => {
      const href = a.getAttribute('href');
      if (href && href !== '#' && !a.classList.contains('drop')) closeNav();
    });
  });
  // Mobile: toggle Services submenu
  const dropTrigger = nav.querySelector('.drop > a');
  if (dropTrigger) {
    dropTrigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 960) {
        e.preventDefault();
        dropTrigger.closest('.drop')?.classList.toggle('open');
      }
    });
  }
}

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
