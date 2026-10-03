// Mobile nav toggle
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  nav.classList.toggle('open');
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

// Back to top button + header scroll shadow
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 400);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Animated stat counters
const statItems = document.querySelectorAll('.stat-item h3');
let countersStarted = false;

function animateCounters() {
  statItems.forEach(item => {
    const target = parseInt(item.getAttribute('data-count'), 10);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 60));

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      item.textContent = current;
    }, 25);
  });
}

const statsSection = document.querySelector('.stats');
if (statsSection) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        animateCounters();
      }
    });
  }, { threshold: 0.4 });
  observer.observe(statsSection);
}

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Admission form validation
const form = document.getElementById('admissionForm');
const formSuccess = document.getElementById('formSuccess');

function setFieldError(group, message) {
  group.classList.add('invalid');
  const errorEl = group.querySelector('.error-msg');
  if (errorEl) errorEl.textContent = message;
}

function clearFieldError(group) {
  group.classList.remove('invalid');
}

function validateField(field) {
  const group = field.closest('.form-group');
  if (!group) return true;

  if (field.type === 'checkbox') {
    if (!field.checked) {
      setFieldError(group, 'You must accept the terms to continue.');
      return false;
    }
    clearFieldError(group);
    return true;
  }

  if (field.hasAttribute('required') && !field.value.trim()) {
    setFieldError(group, 'This field is required.');
    return false;
  }

  if (field.type === 'email' && field.value.trim()) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(field.value.trim())) {
      setFieldError(group, 'Please enter a valid email address.');
      return false;
    }
  }

  if (field.type === 'tel' && field.value.trim()) {
    const phonePattern = /^[0-9+\-\s]{7,15}$/;
    if (!phonePattern.test(field.value.trim())) {
      setFieldError(group, 'Please enter a valid phone number.');
      return false;
    }
  }

  clearFieldError(group);
  return true;
}

if (form) {
  const fieldsToValidate = form.querySelectorAll('[required]');

  fieldsToValidate.forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => validateField(field));
    field.addEventListener('change', () => validateField(field));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formSuccess.classList.remove('show');

    let isValid = true;
    fieldsToValidate.forEach(field => {
      if (!validateField(field)) isValid = false;
    });

    if (!isValid) {
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // No backend configured yet — show confirmation locally.
    formSuccess.classList.add('show');
    form.reset();
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}
