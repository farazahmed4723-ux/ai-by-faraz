/**
 * AI BY FARAZ - Main Interactive JavaScript
 * 3D Tilt, Toronto Clock, Sticky Nav, FAQ, Portfolio Filtering, Contact API
 */
document.addEventListener('DOMContentLoaded', () => {

  // 1. Toronto Live Clock (Eastern Time)
  function updateTorontoTime() {
    const timeDisplay = document.getElementById('toronto-live-time');
    if (!timeDisplay) return;

    try {
      const options = {
        timeZone: 'America/Toronto',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const formatter = new Intl.DateTimeFormat([], options);
      timeDisplay.textContent = formatter.format(new Date()) + ' EDT';
    } catch (e) {
      const now = new Date();
      timeDisplay.textContent = now.toLocaleTimeString() + ' (Toronto)';
    }
  }
  updateTorontoTime();
  setInterval(updateTorontoTime, 1000);

  // 2. Cursor Glow Follower
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }

  // 3. Hero 3D Card Tilt Effect
  const tiltCard = document.getElementById('hero-tilt-card');
  if (tiltCard && window.matchMedia('(pointer: fine)').matches) {
    tiltCard.addEventListener('mousemove', (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    tiltCard.addEventListener('mouseleave', () => {
      tiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      tiltCard.style.transition = 'transform 0.5s ease';
    });

    tiltCard.addEventListener('mouseenter', () => {
      tiltCard.style.transition = 'none';
    });
  }

  // 4. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close when clicking nav links
    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 5. Sticky Header Effect
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 6. Portfolio Category Filtering
  const filterTabs = document.querySelectorAll('.filter-tab');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      portfolioCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.classList.add('fade-in-up');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 7. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
          other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
      } else {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      }
    });
  });

  // 8. Main Contact Form Submission
  const contactForm = document.getElementById('main-contact-form');
  const contactFeedback = document.getElementById('contact-form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('contact-submit-btn');
      const originalText = submitBtn.innerHTML;

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const phone = document.getElementById('contact-phone').value.trim();
      const service = document.getElementById('contact-service').value;
      const subject = document.getElementById('contact-subject').value.trim() || 'New Inquiry';
      const message = document.getElementById('contact-message').value.trim();

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending to Faraz...</span>';

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, service, subject, message })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          contactFeedback.className = 'form-feedback success';
          contactFeedback.innerHTML = `
            <strong><i class="fa-solid fa-check-circle"></i> Message Dispatched!</strong><br>
            Thank you, ${name}. Faraz Ahmed has received your message and will respond to <strong>${email}</strong> or <strong>${phone || 'phone'}</strong> within 2-4 hours.
          `;
          contactForm.reset();
        } else {
          throw new Error(data.message || 'Error submitting message.');
        }
      } catch (err) {
        contactFeedback.className = 'form-feedback error';
        contactFeedback.innerHTML = `
          Message captured. You can also chat directly with Faraz on WhatsApp: 
          <a href="https://wa.me/14374348789" target="_blank" style="color: #ffffff; text-decoration: underline;">+1 (437) 434-8789</a> 
          or email <a href="mailto:faraz.ahmed4723@gmail.com" style="color: #ffffff; text-decoration: underline;">faraz.ahmed4723@gmail.com</a>.
        `;
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // 9. Dynamic Year
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 10. Metric Counter Animation
  const metricValues = document.querySelectorAll('.metric-val[data-target]');
  const observerOptions = { threshold: 0.5 };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        let count = 0;
        const speed = Math.ceil(target / 40);

        const counter = setInterval(() => {
          count += speed;
          if (count >= target) {
            el.textContent = `${target}+`;
            clearInterval(counter);
          } else {
            el.textContent = `${count}+`;
          }
        }, 30);

        observer.unobserve(el);
      }
    });
  }, observerOptions);

  metricValues.forEach((el) => counterObserver.observe(el));
});
