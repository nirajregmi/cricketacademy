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

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Admission announcement
const admissionPopup = document.getElementById('admissionPopup');
const closePopup = document.getElementById('closePopup');
const popupApply = document.getElementById('popupApply');

if (admissionPopup instanceof HTMLDialogElement) {
  admissionPopup.showModal();

  closePopup.addEventListener('click', () => admissionPopup.close());
  popupApply.addEventListener('click', () => admissionPopup.close());
  admissionPopup.addEventListener('click', (event) => {
    if (event.target === admissionPopup) admissionPopup.close();
  });
}

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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formSuccess.classList.remove('show');
    formSuccess.classList.remove('error');

    let isValid = true;
    fieldsToValidate.forEach(field => {
      if (!validateField(field)) isValid = false;
    });

    if (!isValid) {
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      const result = await response.json();

      if (!response.ok || String(result.success).toLowerCase() !== 'true') {
        throw new Error(result.message || 'The application could not be sent. Please try again.');
      }

      form.reset();
      formSuccess.textContent = '✅ Thank you! Your admission application has been submitted successfully. Our team will contact you soon.';
      formSuccess.classList.add('show');
    } catch (error) {
      console.error('Admission application submission failed:', error);
      formSuccess.textContent = error instanceof Error
        ? `Could not send your application: ${error.message}`
        : 'Could not send your application. Please check your connection and try again.';
      formSuccess.classList.add('show', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}
