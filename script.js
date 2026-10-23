const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) { navbar.classList.add('scrolled'); }
  else { navbar.classList.remove('scrolled'); }
});

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) current = section.id;
  });
  if (!current) return;
  navLinks.forEach(link => {
    if (link.getAttribute('href').startsWith('#')) link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
});

const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
function toggleMobileNav() {
  hamburger.classList.toggle('active');
  mobileNav.classList.toggle('open');
  document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
}
function closeMobileNav() {
  hamburger.classList.remove('active');
  mobileNav.classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobileNav(); });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const testimonialCarousel = document.querySelector('[data-testimonial-carousel]');
if (testimonialCarousel) {
  const testimonialTrack = testimonialCarousel.querySelector('[data-testimonial-track]');
  const testimonialSlides = Array.from(testimonialTrack.children);
  const testimonialControls = testimonialCarousel.querySelector('[data-testimonial-controls]');
  const testimonialPosition = testimonialCarousel.querySelector('[data-testimonial-position]');
  const testimonialDots = Array.from(testimonialCarousel.querySelectorAll('[data-testimonial-slide]'));
  let activeTestimonial = 0;

  const showTestimonial = (index) => {
    activeTestimonial = (index + testimonialSlides.length) % testimonialSlides.length;
    testimonialTrack.style.setProperty('--slide-index', activeTestimonial);

    testimonialSlides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeTestimonial;
      slide.setAttribute('aria-hidden', String(!isActive));
      if (isActive) { slide.removeAttribute('inert'); }
      else { slide.setAttribute('inert', ''); }
    });

    testimonialDots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeTestimonial;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-current', String(isActive));
    });

    testimonialPosition.innerHTML = String(activeTestimonial + 1).padStart(2, '0') +
      ' <span>/</span> ' + String(testimonialSlides.length).padStart(2, '0');
  };

  testimonialCarousel.querySelector('[data-testimonial-prev]').addEventListener('click', () => {
    showTestimonial(activeTestimonial - 1);
  });
  testimonialCarousel.querySelector('[data-testimonial-next]').addEventListener('click', () => {
    showTestimonial(activeTestimonial + 1);
  });
  testimonialDots.forEach(dot => {
    dot.addEventListener('click', () => showTestimonial(Number(dot.dataset.testimonialSlide)));
  });
  testimonialCarousel.addEventListener('keydown', (event) => {
    if (event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showTestimonial(activeTestimonial - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      showTestimonial(activeTestimonial + 1);
    }
  });

  const testimonialViewport = testimonialCarousel.querySelector('[data-testimonial-viewport]');
  let touchStartX = null;
  testimonialViewport.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse') return;
    touchStartX = event.clientX;
  });
  testimonialViewport.addEventListener('pointerup', (event) => {
    if (touchStartX === null) return;
    const swipeDistance = event.clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(swipeDistance) < 48) return;
    showTestimonial(activeTestimonial + (swipeDistance < 0 ? 1 : -1));
  });
  testimonialViewport.addEventListener('pointercancel', () => { touchStartX = null; });

  testimonialCarousel.classList.add('is-ready');
  testimonialControls.hidden = false;
  showTestimonial(0);
}

function filterGallery(category, btn) {
  document.querySelectorAll('.gallery-tab').forEach(tab => {
    const isActive = tab === btn;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-pressed', String(isActive));
  });
  btn.classList.add('active');
  const items = document.querySelectorAll('#gallery .gallery-item');
  items.forEach(item => {
    item.classList.toggle('is-filtered-out', category !== 'all' && item.dataset.category !== category);
  });
}

function handleQuotationSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('quotation-submit');
  const name = document.getElementById('q-name').value.trim();
  const org = document.getElementById('q-org').value.trim();
  const phone = document.getElementById('q-phone').value.trim();
  const email = document.getElementById('q-email').value.trim();
  const category = document.getElementById('q-category').value;
  const qty = document.getElementById('q-qty').value.trim();
  const req = document.getElementById('q-requirements').value.trim();
  if (!name || !org || !phone || !category || !qty) {
    showFormAlert('Please fill in all required fields.', 'error', btn);
    return;
  }
  const msg = 'Bulk Uniform Enquiry - Uni-Boy Uniforms\n\nName: ' + name + '\nOrganisation: ' + org + '\nPhone: ' + phone + '\nEmail: ' + (email || 'Not provided') + '\nCategory: ' + category + '\nQuantity: ' + qty + '\nRequirements: ' + (req || 'Not specified');
  const waUrl = 'https://wa.me/919876543210?text=' + encodeURIComponent(msg);
  btn.innerHTML = '<i class="fas fa-check"></i>&nbsp; Enquiry Submitted!';
  btn.style.background = '#25D366';
  btn.style.color = '#fff';
  setTimeout(() => {
    window.open(waUrl, '_blank');
    document.getElementById('quotationForm').reset();
    btn.innerHTML = '<i class="fas fa-paper-plane"></i>&nbsp; Continue to WhatsApp';
    btn.style.background = '';
    btn.style.color = '';
  }, 1200);
}

function handleContactSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('contact-submit');
  const name = document.getElementById('c-name').value.trim();
  const phone = document.getElementById('c-phone').value.trim();
  const email = document.getElementById('c-email').value.trim();
  const subject = document.getElementById('c-subject').value;
  const message = document.getElementById('c-message').value.trim();
  if (!name || !phone || !subject || !message) {
    showFormAlert('Please fill in all required fields.', 'error', btn);
    return;
  }
  const msg = 'Contact Form - Uni-Boy Uniforms\n\nName: ' + name + '\nPhone: ' + phone + '\nEmail: ' + (email || 'Not provided') + '\nSubject: ' + subject + '\nMessage: ' + message;
  const waUrl = 'https://wa.me/919876543210?text=' + encodeURIComponent(msg);
  btn.innerHTML = '<i class="fas fa-check"></i>&nbsp; Message Sent!';
  btn.style.background = '#25D366';
  setTimeout(() => {
    window.open(waUrl, '_blank');
    document.getElementById('contactForm').reset();
    btn.innerHTML = '<i class="fas fa-paper-plane"></i>&nbsp; Send via WhatsApp';
    btn.style.background = '';
  }, 1200);
}

function showFormAlert(msg, type, btn) {
  const orig = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i>&nbsp; ' + msg;
  btn.style.background = type === 'error' ? '#e74c3c' : '#25D366';
  setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 2500);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
