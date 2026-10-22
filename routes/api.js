const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const supabase = require('../config/supabase');

// Storage directory for local fallback storage
const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const QUOTES_FILE = path.join(DATA_DIR, 'quotes.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

// Helper to safely append local records as backup
function appendLocalRecord(filePath, record) {
  try {
    let list = [];
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      list = content ? JSON.parse(content) : [];
    }
    list.unshift(record);
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error saving local backup to ${filePath}:`, err);
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
 * Receives project requirements, computes estimate, and saves to Supabase + local backup
 */
router.post('/quote', async (req, res) => {
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
      calculatedTotal = 950; // Starter project
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

    const quoteId = 'Q-' + Date.now().toString(36).toUpperCase();
    const turnaround = timeline === 'express' ? '3-7 Business Days' : '10-20 Business Days';

    const quoteRecord = {
      id: quoteId,
      name,
      email,
      phone: phone || 'Not provided',
      services: selectedServiceDetails,
      timeline,
      budgetRange,
      addons,
      projectDetails,
      estimatedPriceCAD: calculatedTotal,
      estimatedTurnaround: turnaround,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    // 1. Always save to local backup
    appendLocalRecord(QUOTES_FILE, quoteRecord);

    // 2. Insert into Supabase Postgres database
    let savedToSupabase = false;
    if (supabase) {
      try {
        const { error: dbError } = await supabase.from('quotes').insert([{
          id: quoteId,
          name,
          email,
          phone: phone || null,
          services: selectedServiceDetails,
          timeline,
          budget_range: budgetRange,
          addons,
          project_details: projectDetails,
          estimated_price_cad: calculatedTotal,
          estimated_turnaround: turnaround,
          status: 'new'
        }]);

        if (dbError) {
          console.warn('[Supabase Quotes Warning]:', dbError.message);
        } else {
          savedToSupabase = true;
          console.log(`[Supabase] Quote ${quoteId} synchronized to database successfully!`);
        }
      } catch (dbErr) {
        console.error('[Supabase Quotes Error]:', dbErr.message);
      }
    }

    console.log(`[Quote Received] ${quoteId} from ${name} (${email}) - Est: $${calculatedTotal} CAD (Supabase: ${savedToSupabase})`);

    return res.status(201).json({
      success: true,
      quoteId: quoteRecord.id,
      estimatedPriceCAD: calculatedTotal,
      estimatedTurnaround: turnaround,
      savedToSupabase,
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
 * Direct contact form submission - saves to Supabase + local backup
 */
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message, service } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required.'
      });
    }

    const messageId = 'MSG-' + Date.now().toString(36).toUpperCase();

    const contactRecord = {
      id: messageId,
      name,
      email,
      phone: phone || 'N/A',
      service: service || 'General Consultation',
      subject: subject || 'New Website Inquiry',
      message,
      status: 'unread',
      createdAt: new Date().toISOString()
    };

    // 1. Always save to local backup
    appendLocalRecord(MESSAGES_FILE, contactRecord);

    // 2. Insert into Supabase database
    let savedToSupabase = false;
    if (supabase) {
      try {
        const { error: dbError } = await supabase.from('messages').insert([{
          id: messageId,
          name,
          email,
          phone: phone || null,
          service: service || 'General Consultation',
          subject: subject || 'New Website Inquiry',
          message,
          status: 'unread'
        }]);

        if (dbError) {
          console.warn('[Supabase Messages Warning]:', dbError.message);
        } else {
          savedToSupabase = true;
          console.log(`[Supabase] Message ${messageId} synchronized to database successfully!`);
        }
      } catch (dbErr) {
        console.error('[Supabase Messages Error]:', dbErr.message);
      }
    }

    console.log(`[Message Received] From ${name} <${email}> - Subject: ${subject} (Supabase: ${savedToSupabase})`);

    return res.status(201).json({
      success: true,
      messageId,
      savedToSupabase,
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
 * GET /api/admin/leads
 * Helper endpoint to retrieve recent quotes and messages from Supabase or local backup
 */
router.get('/admin/leads', async (req, res) => {
  try {
    let quotes = [];
    let messages = [];

    if (supabase) {
      const { data: qData } = await supabase.from('quotes').select('*').order('created_at', { ascending: false }).limit(50);
      if (qData) quotes = qData;

      const { data: mData } = await supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(50);
      if (mData) messages = mData;
    }

    // Fallback to local files if Supabase is empty or tables not migrated yet
    if (quotes.length === 0 && fs.existsSync(QUOTES_FILE)) {
      quotes = JSON.parse(fs.readFileSync(QUOTES_FILE, 'utf8') || '[]');
    }
    if (messages.length === 0 && fs.existsSync(MESSAGES_FILE)) {
      messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf8') || '[]');
    }

    return res.json({
      success: true,
      supabaseConnected: !!supabase,
      totalQuotes: quotes.length,
      totalMessages: messages.length,
      quotes,
      messages
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
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
