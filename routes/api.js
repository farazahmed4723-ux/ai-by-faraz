const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Storage directory for incoming leads/quotes
const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const QUOTES_FILE = path.join(DATA_DIR, 'quotes.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

// Helper to safely append entries
function appendRecord(filePath, record) {
  try {
    let list = [];
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      list = content ? JSON.parse(content) : [];
    }
    list.unshift(record);
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error saving record to ${filePath}:`, err);
  }
}

// Service rates baseline (CAD / USD)
const SERVICE_RATES = {
  webdev: { name: 'Full-Stack Web Development', base: 1200, deliveryDays: 14 },
  aiagent: { name: 'Autonomous AI Agents & Automation', base: 1500, deliveryDays: 12 },
  graphic: { name: 'Brand Identity & UI/UX Design', base: 600, deliveryDays: 7 },
  video: { name: 'Cinematic Video Editing & Motion Graphics', base: 500, deliveryDays: 5 }
};

const ADDON_RATES = {
  seo: 350,
  cms: 400,
  ecommerce: 650,
  rush: 500,
  cloudDeploy: 300,
  maintenance: 250
};

/**
 * POST /api/quote
 * Receives project requirements and computes an instant estimate
 */
router.post('/quote', (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      services = [],
      timeline = 'standard',
      budgetRange = 'medium',
      projectDetails = '',
      addons = []
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required to generate a project quote.'
      });
    }

    // Compute estimate
    let calculatedTotal = 0;
    const selectedServiceDetails = [];

    services.forEach(serviceKey => {
      if (SERVICE_RATES[serviceKey]) {
        calculatedTotal += SERVICE_RATES[serviceKey].base;
        selectedServiceDetails.push(SERVICE_RATES[serviceKey].name);
      }
    });

    if (calculatedTotal === 0) {
      calculatedTotal = 950; // Minimum project starter
    }

    addons.forEach(addonKey => {
      if (ADDON_RATES[addonKey]) {
        calculatedTotal += ADDON_RATES[addonKey];
      }
    });

    if (timeline === 'express') {
      calculatedTotal = Math.round(calculatedTotal * 1.3);
    } else if (timeline === 'flexible') {
      calculatedTotal = Math.round(calculatedTotal * 0.9);
    }

    const quoteRecord = {
      id: 'Q-' + Date.now().toString(36).toUpperCase(),
      createdAt: new Date().toISOString(),
      name,
      email,
      phone: phone || 'Not provided',
      services: selectedServiceDetails,
      timeline,
      budgetRange,
      addons,
      projectDetails,
      estimatedPriceCAD: calculatedTotal,
      estimatedTurnaround: timeline === 'express' ? '3-7 Business Days' : '10-20 Business Days',
      status: 'new'
    };

    appendRecord(QUOTES_FILE, quoteRecord);

    console.log(`[Quote Received] ${quoteRecord.id} from ${name} (${email}) - Est: $${calculatedTotal} CAD`);

    return res.status(201).json({
      success: true,
      quoteId: quoteRecord.id,
      estimatedPriceCAD: calculatedTotal,
      estimatedTurnaround: quoteRecord.estimatedTurnaround,
      message: `Thank you ${name}! Your custom quote has been generated. Faraz Ahmed will reach out within 2-4 hours.`,
      quote: quoteRecord
    });
  } catch (error) {
    console.error('Quote API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process quote request. Please try again or reach out directly at faraz.ahmed4723@gmail.com'
    });
  }
});

/**
 * POST /api/contact
 * Direct contact form submission
 */
router.post('/contact', (req, res) => {
  try {
    const { name, email, phone, subject, message, service } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required.'
      });
    }

    const contactRecord = {
      id: 'MSG-' + Date.now().toString(36).toUpperCase(),
      createdAt: new Date().toISOString(),
      name,
      email,
      phone: phone || 'N/A',
      subject: subject || 'New Website Inquiry',
      service: service || 'General Consultation',
      message,
      status: 'unread'
    };

    appendRecord(MESSAGES_FILE, contactRecord);

    console.log(`[Message Received] From ${name} <${email}> - Subject: ${subject}`);

    return res.status(201).json({
      success: true,
      messageId: contactRecord.id,
      message: `Message sent successfully! Faraz Ahmed will reply to ${email} shortly.`
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send message. Please reach Faraz directly via WhatsApp or faraz.ahmed4723@gmail.com'
    });
  }
});

/**
 * POST /api/ai-chat
 * Smart AI Assistant simulation for "AI by Faraz"
 */
router.post('/ai-chat', (req, res) => {
  try {
    const { message = '' } = req.body;
    const lower = message.toLowerCase().trim();

    let reply = '';
    let suggestions = [];

    if (!lower || lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('salam')) {
      reply = "Hello and welcome to AI by Faraz! I am Faraz's virtual AI Assistant. Faraz is a Toronto-based Software Developer & AI Solutions Architect with a degree in Information Technology & Computer Science. How can we help elevate your business today?";
      suggestions = [
        "Web Development Services",
        "AI Agents & Automation",
        "Graphic Design & UI/UX",
        "Video Editing",
        "Get an Instant Quote"
      ];
    } else if (lower.includes('service') || lower.includes('what do you do') || lower.includes('kaam')) {
      reply = "Faraz specializes in 4 primary digital pillars:\n1. 🚀 Next-Gen Web Development (High-performance React/Node.js web apps, SaaS, modern UI/UX)\n2. 🤖 Autonomous AI Agents (Custom LLMs, customer support bots, workflow automation)\n3. 🎨 Graphic Design & Branding (Brand identity, vector graphics, marketing kits)\n4. 🎬 Video Editing & Motion Graphics (Commercial reels, cinematic cuts, YouTube/TikTok editing)";
      suggestions = ["Get a Quote", "Faraz's Background", "Contact on WhatsApp"];
    } else if (lower.includes('web') || lower.includes('website') || lower.includes('react') || lower.includes('frontend')) {
      reply = "Our Web Development services include custom responsive websites, high-speed single-page applications, Node.js backends, RESTful APIs, and full-stack SaaS MVPs built for conversion, 100/100 Lighthouse performance, and elite SEO.";
      suggestions = ["Estimate Web Project", "View Web Portfolio", "Book Consultation"];
    } else if (lower.includes('ai') || lower.includes('agent') || lower.includes('bot') || lower.includes('automation')) {
      reply = "Our AI Agent development focuses on autonomous workflow automation, multi-agent reasoning, RAG (Retrieval-Augmented Generation) with your company data, and intelligent CRM integrations that save your team dozens of hours weekly.";
      suggestions = ["Build Custom AI Agent", "View AI Demos", "Talk to Faraz"];
    } else if (lower.includes('video') || lower.includes('editing') || lower.includes('reel') || lower.includes('youtube')) {
      reply = "Our Video Editing suite delivers cinematic storytelling, color grading, sound design, dynamic captions, and motion graphics tailored for viral social media content, brand films, and ads.";
      suggestions = ["Request Video Quote", "See Video Samples", "Contact Faraz"];
    } else if (lower.includes('graphic') || lower.includes('design') || lower.includes('logo') || lower.includes('ui') || lower.includes('ux')) {
      reply = "From iconic brand identities and logos to intuitive Figma design systems, our graphic design craft combines modern 3D elements, typography, and psychology to make your brand unforgettable.";
      suggestions = ["Branding Package Quote", "See Design Portfolio"];
    } else if (lower.includes('faraz') || lower.includes('bio') || lower.includes('about') || lower.includes('degree') || lower.includes('education')) {
      reply = "Faraz Ahmed is a Canadian tech innovator based in Toronto with an academic background in Information Technology & Computer Science (IT/CS). With deep expertise across modern web engineering, autonomous AI workflows, visual branding, and motion media, Faraz helps businesses launch high-impact digital products.";
      suggestions = ["Contact Faraz", "Call (+1 437-434-8789)", "Email Faraz"];
    } else if (lower.includes('price') || lower.includes('cost') || lower.includes('rate') || lower.includes('quote') || lower.includes('kitna')) {
      reply = "Projects are customized to your exact requirements. Web development starts from $1,200 CAD, AI Agent systems from $1,500 CAD, Graphic Design packages from $600 CAD, and Video Editing from $500 CAD. You can use our interactive Quote Calculator on this page for an instant custom estimate!";
      suggestions = ["Open Quote Calculator", "Schedule a Discovery Call"];
    } else if (lower.includes('contact') || lower.includes('phone') || lower.includes('email') || lower.includes('location') || lower.includes('address') || lower.includes('toronto')) {
      reply = "You can contact Faraz directly:\n📍 Location: Toronto, Ontario, Canada\n📧 Email: faraz.ahmed4723@gmail.com\n📞 Phone / WhatsApp: +1 (437) 434-8789\nFaraz typically responds within 2-4 business hours!";
      suggestions = ["Call Now", "Open WhatsApp", "Send Email"];
    } else {
      reply = `Thank you for asking about "${message}". Faraz provides tailor-made solutions across Web Dev, AI Agents, Visual Design, and Video Production from Toronto, Canada. Would you like an instant quote or to speak with Faraz directly?`;
      suggestions = ["Instant Quote Calculator", "WhatsApp Chat", "Send a Message"];
    }

    return res.json({
      success: true,
      reply,
      suggestions,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    return res.status(500).json({
      success: false,
      reply: "I am temporarily processing another request. Please contact Faraz directly at faraz.ahmed4723@gmail.com or +1 437-434-8789."
    });
  }
});

/**
 * GET /api/stats
 */
router.get('/stats', (req, res) => {
  return res.json({
    success: true,
    stats: {
      projectsDelivered: '140+',
      aiAgentsDeployed: '45+',
      clientSatisfaction: '99.8%',
      countriesServed: '12+',
      averageTurnaroundDays: '10'
    }
  });
});

module.exports = router;
