/**
 * AI BY FARAZ - Interactive Quote Calculator & Scope Builder
 */
(function () {
  const serviceCheckboxes = document.querySelectorAll('input[name="calc-service"]');
  const timelineRadios = document.querySelectorAll('input[name="calc-timeline"]');
  const addonCheckboxes = document.querySelectorAll('input[name="calc-addon"]');

  const amountDisplay = document.getElementById('calculated-amount');
  const timelineDisplay = document.getElementById('calculated-timeline');
  const breakdownList = document.getElementById('quote-breakdown-list');

  const quoteForm = document.getElementById('quote-submit-form');
  const quoteFeedback = document.getElementById('quote-form-feedback');
  const whatsappQuoteBtn = document.getElementById('whatsapp-quote-btn');
  const emailQuoteBtn = document.getElementById('email-quote-btn');

  // Service Pricing Table (CAD)
  const PRICING = {
    services: {
      webdev: { name: 'Full-Stack Web Dev', price: 1200, time: 14 },
      aiagent: { name: 'AI Agents & Automation', price: 1500, time: 12 },
      graphic: { name: 'Brand & Graphic Design', price: 600, time: 7 },
      video: { name: 'Video Editing & Motion', price: 500, time: 5 }
    },
    addons: {
      seo: { name: 'Ultra SEO & Rich Schema', price: 350 },
      cms: { name: 'CMS / Admin Portal', price: 400 },
      ecommerce: { name: 'E-Commerce Gateway', price: 650 },
      cloudDeploy: { name: 'Cloud Deployment & SSL', price: 300 },
      maintenance: { name: '30-Day Support Retainer', price: 250 }
    }
  };

  let currentEstimate = {
    total: 1200,
    services: ['webdev'],
    timeline: 'standard',
    addons: [],
    turnaround: '10-14 Business Days'
  };

  function calculateQuote() {
    let subtotal = 0;
    const selectedServices = [];
    const breakdownItems = [];

    // 1. Services
    serviceCheckboxes.forEach((cb) => {
      if (cb.checked && PRICING.services[cb.value]) {
        const item = PRICING.services[cb.value];
        subtotal += item.price;
        selectedServices.push(cb.value);
        breakdownItems.push({ name: item.name, price: item.price });
      }
    });

    // Default fallback if nothing selected
    if (selectedServices.length === 0) {
      subtotal = 950;
      breakdownItems.push({ name: 'Custom Project Starter', price: 950 });
    }

    // 2. Add-ons
    const selectedAddons = [];
    addonCheckboxes.forEach((cb) => {
      if (cb.checked && PRICING.addons[cb.value]) {
        const item = PRICING.addons[cb.value];
        subtotal += item.price;
        selectedAddons.push(cb.value);
        breakdownItems.push({ name: '+ ' + item.name, price: item.price });
      }
    });

    // 3. Timeline
    let selectedTimeline = 'standard';
    timelineRadios.forEach((rb) => {
      if (rb.checked) selectedTimeline = rb.value;
    });

    let finalTotal = subtotal;
    let turnaroundText = '10-14 Business Days';

    if (selectedTimeline === 'express') {
      finalTotal = Math.round(subtotal * 1.3);
      turnaroundText = '3-7 Business Days (Priority Express)';
      breakdownItems.push({ name: '⚡ Express Surcharge (+30%)', price: Math.round(subtotal * 0.3) });
    } else if (selectedTimeline === 'flexible') {
      finalTotal = Math.round(subtotal * 0.9);
      turnaroundText = '3-4 Weeks (Flexible Savings)';
      breakdownItems.push({ name: 'Flexible Timeline Discount (-10%)', price: -Math.round(subtotal * 0.1) });
    }

    currentEstimate = {
      total: finalTotal,
      services: selectedServices,
      timeline: selectedTimeline,
      addons: selectedAddons,
      turnaround: turnaroundText
    };

    // Update UI Displays
    if (amountDisplay) {
      amountDisplay.textContent = finalTotal.toLocaleString();
    }
    if (timelineDisplay) {
      timelineDisplay.textContent = turnaroundText;
    }

    // Update Breakdown
    if (breakdownList) {
      breakdownList.innerHTML = breakdownItems
        .map(
          (b) => `
        <div class="breakdown-item">
          <span>${b.name}</span>
          <strong>${b.price > 0 ? '$' + b.price.toLocaleString() + ' CAD' : '-$' + Math.abs(b.price) + ' CAD'}</strong>
        </div>
      `
        )
        .join('');
    }
  }

  // Attach listeners to calculator inputs
  serviceCheckboxes.forEach((cb) => cb.addEventListener('change', calculateQuote));
  timelineRadios.forEach((rb) => rb.addEventListener('change', calculateQuote));
  addonCheckboxes.forEach((cb) => cb.addEventListener('change', calculateQuote));

  // Connect "Add to Quote" buttons on services section
  document.querySelectorAll('.select-service-trigger').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceKey = btn.getAttribute('data-service');
      const targetCheckbox = document.getElementById(`svc-${serviceKey}`);
      if (targetCheckbox) {
        targetCheckbox.checked = true;
        calculateQuote();
        // Smooth scroll to calculator
        document.getElementById('quote-calculator').scrollIntoView({ behavior: 'smooth' });
        // Visual flash feedback
        targetCheckbox.parentElement.classList.add('pulse-highlight');
        setTimeout(() => targetCheckbox.parentElement.classList.remove('pulse-highlight'), 1200);
      }
    });
  });

  // Direct WhatsApp Quote Helper
  if (whatsappQuoteBtn) {
    whatsappQuoteBtn.addEventListener('click', () => {
      const name = document.getElementById('quote-client-name').value.trim() || 'Potential Client';
      const servicesList = currentEstimate.services.join(', ') || 'Custom Solution';
      const text = encodeURIComponent(
        `Hi Faraz Ahmed! My name is ${name}. I just built a project scope on "AI by Faraz":\n\n` +
          `• Services: ${servicesList}\n` +
          `• Estimated Investment: $${currentEstimate.total.toLocaleString()} CAD\n` +
          `• Delivery: ${currentEstimate.turnaround}\n\n` +
          `Could we schedule a consultation to discuss this?`
      );
      window.open(`https://wa.me/14374348789?text=${text}`, '_blank');
    });
  }

  // Direct Email Quote Helper
  if (emailQuoteBtn) {
    emailQuoteBtn.addEventListener('click', () => {
      const name = document.getElementById('quote-client-name').value.trim() || 'Prospective Client';
      const email = document.getElementById('quote-client-email').value.trim() || '';
      const notes = document.getElementById('quote-client-notes').value.trim() || 'No additional notes.';
      const subject = encodeURIComponent(`Project Quote Request: ${name} (AI by Faraz)`);
      const body = encodeURIComponent(
        `Hi Faraz Ahmed,\n\n` +
          `I would like to lock in this project scope:\n\n` +
          `Name: ${name}\n` +
          `Email: ${email}\n` +
          `Selected Services: ${currentEstimate.services.join(', ')}\n` +
          `Estimated Investment: $${currentEstimate.total.toLocaleString()} CAD\n` +
          `Turnaround: ${currentEstimate.turnaround}\n\n` +
          `Project Brief / Notes:\n${notes}\n\n` +
          `Looking forward to hearing from you,\n${name}`
      );
      window.location.href = `mailto:faraz.ahmed4723@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  // Handle Form Submission to Node.js Backend API
  if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('quote-submit-btn');
      const originalText = submitBtn.innerHTML;

      const name = document.getElementById('quote-client-name').value.trim();
      const email = document.getElementById('quote-client-email').value.trim();
      const phone = document.getElementById('quote-client-phone').value.trim();
      const notes = document.getElementById('quote-client-notes').value.trim();

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Processing Quote...</span>';

      try {
        const response = await fetch('/api/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            phone,
            services: currentEstimate.services,
            timeline: currentEstimate.timeline,
            addons: currentEstimate.addons,
            projectDetails: notes
          })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          quoteFeedback.className = 'form-feedback success';
          quoteFeedback.innerHTML = `
            <strong><i class="fa-solid fa-circle-check"></i> Quote #${data.quoteId} Generated!</strong><br>
            Estimated Investment: <strong>$${data.estimatedPriceCAD.toLocaleString()} CAD</strong> (${data.estimatedTurnaround}).<br>
            Faraz Ahmed will email you at <strong>${email}</strong> or call within 2-4 business hours.
          `;
          quoteForm.reset();
          calculateQuote();
        } else {
          throw new Error(data.message || 'Error processing quote.');
        }
      } catch (err) {
        quoteFeedback.className = 'form-feedback error';
        quoteFeedback.innerHTML = `
          <i class="fa-solid fa-triangle-exclamation"></i> Note: We saved your preferences locally. 
          You can also reach Faraz directly via WhatsApp at 
          <a href="https://wa.me/14374348789" target="_blank" style="color: #ffffff; text-decoration: underline;">+1 (437) 434-8789</a> 
          or email <a href="mailto:faraz.ahmed4723@gmail.com" style="color: #ffffff; text-decoration: underline;">faraz.ahmed4723@gmail.com</a>.
        `;
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // Initial Calculation
  calculateQuote();
})();
