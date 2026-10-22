const express = require('express');
const path = require('path');
const cors = require('cors');

const apiRouter = require('./routes/api');
const seoRouter = require('./routes/seo');

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Performance Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom header for SEO / Performance
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'AI by Faraz (Node.js High-Performance Engine)');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

// SEO routes (sitemap.xml, robots.txt)
app.use('/', seoRouter);

// API Endpoints
app.use('/api', apiRouter);

// Static assets with cache control
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  etag: true
}));

// Fallback to index.html for Single Page Application navigation
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
  next();
});

// Centralized error handling
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err);
  res.status(500).json({
    success: false,
    message: 'An internal server error occurred.'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`
=============================================================
  ⚡ AI BY FARAZ - Next-Gen Agency & Digital Studio Platform
=============================================================
  🌐 Server running at: http://localhost:${PORT}
  📍 Location: Toronto, Ontario, Canada
  💼 Founder: Faraz Ahmed (BS IT & Computer Science)
  📞 Direct Contact: +1 (437) 434-8789
  📧 Email: faraz.ahmed4723@gmail.com
  🚀 Services: Web Dev | AI Agents | Graphic Design | Video
=============================================================
`);
});

module.exports = app;
