/* ============================================================
   SAVORIA RESTAURANT — Main JavaScript
   ============================================================ */

/* ========================
   NAVBAR SCROLL EFFECT
   ======================== */
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

/* ========================
   MOBILE MENU TOGGLE
   ======================== */
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
    hamburger.classList.toggle('active');
    navLinks.style.display = navLinks.classList.contains('mobile-open') ? 'flex' : '';
    if (navLinks.classList.contains('mobile-open')) {
      Object.assign(navLinks.style, {
        flexDirection: 'column', position: 'fixed', top: '0', right: '0',
        height: '100vh', width: '280px', background: '#fff',
        padding: '5rem 2rem 2rem', boxShadow: '0 0 40px rgba(0,0,0,.2)',
        zIndex: '999'
      });
    } else {
      navLinks.removeAttribute('style');
    }
  });
}

/* ========================
   ACTIVE NAV LINK
   ======================== */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* ========================
   TOAST NOTIFICATIONS
   ======================== */
function showToast(message, type = 'success', duration = 3500) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => { requestAnimationFrame(() => { toast.classList.add('show'); }); });
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

/* ========================
   FORM VALIDATION UTILITY
   ======================== */
const Validator = {
  rules: {
    required: val => val.trim() !== '' || 'This field is required.',
    email:    val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Please enter a valid email.',
    phone:    val => /^[\d\s\+\-\(\)]{7,15}$/.test(val.trim()) || 'Enter a valid phone number.',
    minLen:   n  => val => val.trim().length >= n || `Minimum ${n} characters required.`,
    maxLen:   n  => val => val.trim().length <= n || `Maximum ${n} characters allowed.`,
    future:   val => {
      const d = new Date(val);
      const today = new Date(); today.setHours(0,0,0,0);
      return d >= today || 'Date must be today or in the future.';
    },
    min: n => val => Number(val) >= n || `Minimum value is ${n}.`,
    max: n => val => Number(val) <= n || `Maximum value is ${n}.`,
  },
  validate(input, ...ruleList) {
    const val = input.value;
    for (const rule of ruleList) {
      const fn = typeof rule === 'function' ? rule : this.rules[rule];
      if (!fn) continue;
      const result = fn(val);
      if (result !== true) return result;
    }
    return null;
  },
  showError(input, msg) {
    input.classList.add('error');
    const errEl = input.parentElement.querySelector('.error-msg');
    if (errEl) { errEl.textContent = msg; errEl.classList.add('visible'); }
  },
  clearError(input) {
    input.classList.remove('error');
    const errEl = input.parentElement.querySelector('.error-msg');
    if (errEl) errEl.classList.remove('visible');
  },
  attachLiveValidation(input, ...rules) {
    input.addEventListener('blur', () => {
      const err = this.validate(input, ...rules);
      err ? this.showError(input, err) : this.clearError(input);
    });
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        const err = this.validate(input, ...rules);
        err ? this.showError(input, err) : this.clearError(input);
      }
    });
  }
};

/* ========================
   SHOPPING CART
   ======================== */
const Cart = {
  items: JSON.parse(localStorage.getItem('savoria_cart') || '[]'),

  save() {
    localStorage.setItem('savoria_cart', JSON.stringify(this.items));
    this.updateBadges();
  },
  total() { return this.items.reduce((s, i) => s + i.price * i.qty, 0); },
  count() { return this.items.reduce((s, i) => s + i.qty, 0); },
  add(id, name, price, emoji) {
    const existing = this.items.find(i => i.id === id);
    if (existing) existing.qty++;
    else this.items.push({ id, name, price, emoji, qty: 1 });
    this.save();
    this.renderSidebar();
    showToast(`${name} added to cart! 🍽️`);
  },
  remove(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.save();
    this.renderSidebar();
  },
  adjust(id, delta) {
    const item = this.items.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) this.remove(id);
    else { this.save(); this.renderSidebar(); }
  },
  updateBadges() {
    const c = this.count();
    document.querySelectorAll('.cart-badge').forEach(b => {
      b.textContent = c;
      b.style.display = c > 0 ? 'flex' : 'none';
    });
  },
  renderSidebar() {
    const sidebar = document.getElementById('cart-sidebar');
    if (!sidebar) return;
    const itemsEl = sidebar.querySelector('.cart-items');
    const footerEl = sidebar.querySelector('.cart-footer');
    if (!itemsEl) return;

    if (this.items.length === 0) {
      itemsEl.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>Your cart is empty</p><p style="font-size:.8rem;margin-top:.5rem;">Add some delicious items from our menu!</p></div>`;
      if (footerEl) footerEl.style.display = 'none';
    } else {
      itemsEl.innerHTML = this.items.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-emoji">${item.emoji}</div>
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">₹${(item.price * item.qty).toFixed(2)}</div>
          </div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="Cart.adjust('${item.id}',-1)">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="Cart.adjust('${item.id}',1)">+</button>
          </div>
        </div>
      `).join('');
      if (footerEl) {
        footerEl.style.display = '';
        footerEl.querySelector('.cart-total span:last-child').textContent = `₹${this.total().toFixed(2)}`;
      }
    }
    this.updateBadges();
  },
  openSidebar() {
    document.getElementById('cart-sidebar')?.classList.add('open');
    document.getElementById('cart-overlay')?.classList.add('open');
    document.body.classList.add('no-scroll');
    this.renderSidebar();
  },
  closeSidebar() {
    document.getElementById('cart-sidebar')?.classList.remove('open');
    document.getElementById('cart-overlay')?.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }
};

// Init cart on every page
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadges();

  // Cart open buttons
  document.querySelectorAll('.open-cart').forEach(btn => btn.addEventListener('click', () => Cart.openSidebar()));
  document.querySelector('.cart-close')?.addEventListener('click', () => Cart.closeSidebar());
  document.getElementById('cart-overlay')?.addEventListener('click', () => Cart.closeSidebar());
});

/* ========================
   SCROLL REVEAL
   ======================== */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    observer.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', initScrollReveal);

/* ========================
   MENU FILTER
   ======================== */
function initMenuFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.menu-card');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
        if (match) {
          card.style.animation = 'fadeUp .4s ease both';
          setTimeout(() => card.style.animation = '', 400);
        }
      });
    });
  });
}

/* ========================
   MENU SEARCH
   ======================== */
function initMenuSearch() {
  const searchInput = document.getElementById('menu-search');
  if (!searchInput) return;
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    document.querySelectorAll('.menu-card').forEach(card => {
      const name = card.querySelector('.menu-card-name')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.menu-card-desc')?.textContent.toLowerCase() || '';
      card.style.display = name.includes(q) || desc.includes(q) ? '' : 'none';
    });
  });
}

/* ========================
   RESERVATION FORM
   ======================== */
function initReservationForm() {
  const form = document.getElementById('reservation-form');
  if (!form) return;

  const fields = {
    name:  { rules: ['required', Validator.rules.minLen(2)] },
    email: { rules: ['required', 'email'] },
    phone: { rules: ['required', 'phone'] },
    date:  { rules: ['required', 'future'] },
    time:  { rules: ['required'] },
    guests: { rules: ['required', Validator.rules.min(1), Validator.rules.max(20)] },
  };

  Object.keys(fields).forEach(id => {
    const input = document.getElementById(id);
    if (input) Validator.attachLiveValidation(input, ...fields[id].rules);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    Object.entries(fields).forEach(([id, cfg]) => {
      const input = document.getElementById(id);
      if (!input) return;
      const err = Validator.validate(input, ...cfg.rules);
      if (err) { Validator.showError(input, err); valid = false; }
      else Validator.clearError(input);
    });

    if (!valid) { showToast('Please fix the errors above.', 'error'); return; }

    // Simulate saving
    const btn = form.querySelector('[type=submit]');
    btn.textContent = 'Confirming…';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Reserve Table';
      btn.disabled = false;
      const msg = form.querySelector('.success-msg');
      if (msg) msg.classList.add('visible');
      form.reset();
      showToast('🎉 Reservation confirmed! See you soon.');
      // Store in localStorage
      const reservations = JSON.parse(localStorage.getItem('savoria_reservations') || '[]');
      reservations.push({
        name: document.getElementById('name')?.value,
        email: document.getElementById('email')?.value,
        date: document.getElementById('date')?.value,
        time: document.getElementById('time')?.value,
        guests: document.getElementById('guests')?.value,
        notes: document.getElementById('notes')?.value,
        id: Date.now()
      });
      localStorage.setItem('savoria_reservations', JSON.stringify(reservations));
    }, 1500);
  });
}

/* ========================
   CONTACT FORM
   ======================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const cName  = document.getElementById('c-name');
  const cEmail = document.getElementById('c-email');
  const cSubj  = document.getElementById('c-subject');
  const cMsg   = document.getElementById('c-message');

  if (cName)  Validator.attachLiveValidation(cName, 'required', Validator.rules.minLen(2));
  if (cEmail) Validator.attachLiveValidation(cEmail, 'required', 'email');
  if (cSubj)  Validator.attachLiveValidation(cSubj, 'required');
  if (cMsg)   Validator.attachLiveValidation(cMsg, 'required', Validator.rules.minLen(10));

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    const checks = [
      [cName,  ['required', Validator.rules.minLen(2)]],
      [cEmail, ['required', 'email']],
      [cSubj,  ['required']],
      [cMsg,   ['required', Validator.rules.minLen(10)]],
    ];
    checks.forEach(([input, rules]) => {
      if (!input) return;
      const err = Validator.validate(input, ...rules);
      if (err) { Validator.showError(input, err); valid = false; }
      else Validator.clearError(input);
    });
    if (!valid) { showToast('Please fill all required fields.', 'error'); return; }

    const btn = form.querySelector('[type=submit]');
    btn.textContent = 'Sending…'; btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Send Message'; btn.disabled = false;
      form.reset();
      showToast('Message sent! We\'ll respond within 24 hours. 📧');
    }, 1400);
  });
}

/* ========================
   BILL CALCULATOR
   ======================== */
function initCalculator() {
  const calcForm = document.getElementById('calc-form');
  if (!calcForm) return;

  function recalc() {
    const starters  = Number(document.getElementById('calc-starters')?.value  || 0);
    const mains     = Number(document.getElementById('calc-mains')?.value     || 0);
    const desserts  = Number(document.getElementById('calc-desserts')?.value  || 0);
    const drinks    = Number(document.getElementById('calc-drinks')?.value    || 0);
    const subtotal  = starters + mains + desserts + drinks;
    const tax       = subtotal * 0.05;
    const gst       = subtotal * 0.12;
    const tip       = subtotal * (Number(document.getElementById('calc-tip')?.value || 0) / 100);
    const total     = subtotal + tax + gst + tip;

    const fmt = n => '₹' + n.toFixed(2);
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('c-subtotal', fmt(subtotal));
    set('c-tax', fmt(tax));
    set('c-gst', fmt(gst));
    set('c-tip', fmt(tip));
    set('c-total', fmt(total));
  }

  calcForm.querySelectorAll('input, select').forEach(el => el.addEventListener('input', recalc));
  recalc();
}

/* ========================
   RESERVATION TABLE DISPLAY
   ======================== */
function initReservationTable() {
  const tbody = document.getElementById('res-table-body');
  if (!tbody) return;
  const reservations = JSON.parse(localStorage.getItem('savoria_reservations') || '[]');
  if (reservations.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:2rem">No reservations yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = reservations.map((r, i) => `
    <tr>
      <td>${i+1}</td>
      <td><strong>${r.name}</strong></td>
      <td>${r.date}</td>
      <td>${r.time}</td>
      <td>${r.guests}</td>
      <td><span style="color:var(--sage);font-weight:600;">✓ Confirmed</span></td>
    </tr>
  `).join('');
}

/* ========================
   TESTIMONIAL SLIDER
   ======================== */
function initTestimonialSlider() {
  const slides = document.querySelectorAll('.tslide');
  const dots   = document.querySelectorAll('.tdot');
  if (!slides.length) return;
  let current = 0;

  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  document.querySelector('.tprev')?.addEventListener('click', () => goTo(current - 1));
  document.querySelector('.tnext')?.addEventListener('click', () => goTo(current + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
  setInterval(() => goTo(current + 1), 5000);
}

/* ========================
   STAR RATING
   ======================== */
function initStarRating() {
  const stars = document.querySelectorAll('.star-rating .star');
  const hidden = document.getElementById('rating-value');
  if (!stars.length) return;

  stars.forEach((star, i) => {
    star.addEventListener('mouseenter', () => {
      stars.forEach((s, j) => s.style.color = j <= i ? 'var(--gold)' : 'var(--border)');
    });
    star.addEventListener('mouseleave', () => {
      const sel = hidden ? Number(hidden.value) - 1 : -1;
      stars.forEach((s, j) => s.style.color = j <= sel ? 'var(--gold)' : 'var(--border)');
    });
    star.addEventListener('click', () => {
      if (hidden) hidden.value = i + 1;
      stars.forEach((s, j) => s.style.color = j <= i ? 'var(--gold)' : 'var(--border)');
    });
  });
}

/* ========================
   INIT ALL
   ======================== */
document.addEventListener('DOMContentLoaded', () => {
  initMenuFilter();
  initMenuSearch();
  initReservationForm();
  initContactForm();
  initCalculator();
  initReservationTable();
  initTestimonialSlider();
  initStarRating();
});
