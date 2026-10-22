# ⚡ AI BY FARAZ — Official Studio & Agency Platform

> **Next-Generation Digital Architecture • Autonomous AI Agents • High-Performance Web Engineering • Luxury Brand Design • Cinematic Video Production**

📍 **Location:** Toronto, Ontario, Canada 🇨🇦  
👨‍💻 **Founder:** Faraz Ahmed (BS in Information Technology & Computer Science)  
📧 **Email:** [faraz.ahmed4723@gmail.com](mailto:faraz.ahmed4723@gmail.com)  
📞 **Direct Phone / WhatsApp:** [+1 (437) 434-8789](https://wa.me/14374348789)  

---

## 🚀 Overview

**AI by Faraz** is a cutting-edge, high-conversion agency platform engineered for modern businesses and visionary startups. Built on **Node.js** with an ultra-clean modular architecture, high-class **JSON-LD Schema SEO**, sleek cyberpunk/glassmorphic aesthetics, dynamic particle backgrounds, and real-time interactive tooling.

### 🌟 Key Features

1. **Interactive Instant Quote Builder & Estimator:**
   - Real-time CAD ($) cost calculation based on selected services, timeline speeds (Express, Standard, Flexible), and enhancement add-ons.
   - Generates pre-populated WhatsApp and Email dispatch links directly to Faraz.
   - Saves quote inquiries to `data/quotes.json` on the Node.js backend.

2. **Autonomous "AI by Faraz" Live Agent Assistant:**
   - Interactive terminal UI embedded on the page.
   - Answers client questions about services, Faraz's IT & CS background, turnaround times, and pricing.
   - Endpoint: `POST /api/ai-chat`.

3. **Curated Multi-Category Portfolio Showcase:**
   - Interactive filtering for **Web Development**, **Autonomous AI Agents**, **Graphic Design & UI/UX**, and **Cinematic Video Editing**.
   - High-fidelity preview mockups with live tags and direct quote triggers.

4. **High-Class Search Engine Optimization (SEO):**
   - Full OpenGraph & Twitter Cards metadata.
   - Microdata & JSON-LD Structured Data for `ProfessionalService`, `Organization`, `Person` (Faraz Ahmed), and `FAQPage` rich snippets.
   - Dynamic `sitemap.xml` and `robots.txt` endpoints generated via `routes/seo.js`.

5. **Motion Design & Micro-Interactions:**
   - Interactive 3D perspective tilt on the Founder Showcase Card.
   - Live Toronto clock (Eastern Time / EDT) synchronized in the top announcement bar.
   - Custom glowing ambient cursor follower.
   - Smooth animated counter for delivered projects and satisfaction metrics.
   - Floating quick-action WhatsApp button & AI Assistant launcher.

---

## 🛠️ Project Structure

```text
ai-by-faraz/
├── package.json               # Node.js dependencies & scripts
├── server.js                  # Main Express application server
├── routes/
│   ├── api.js                 # API endpoints (/quote, /contact, /ai-chat, /stats)
│   └── seo.js                 # Dynamic /sitemap.xml and /robots.txt generators
├── data/                      # Local JSON storage for incoming leads & quotes
│   ├── quotes.json
│   └── messages.json
├── public/
│   ├── index.html             # Semantic, SEO-rich modern single-page application
│   ├── css/
│   │   ├── style.css          # Design system, glassmorphism, responsive styles
│   │   └── animations.css     # Motion keyframes, particle effects, marquee loops
│   ├── js/
│   │   ├── main.js            # 3D tilt, Toronto clock, FAQ accordion, contact API
│   │   ├── quote-calculator.js# Instant quote estimator & proposal generator
│   │   ├── ai-agent-demo.js   # Live conversational AI assistant terminal
│   │   └── canvas-particles.js# Ambient cybernetic neural mesh background
│   └── assets/
│       ├── faraz-logo.jpg     # Official "AI by Faraz" circular brand logo
│       ├── faraz-portrait.jpg # Executive Toronto studio portrait of Faraz Ahmed
│       ├── project-webdev.jpg # Web development showcase
│       ├── project-aiagent.jpg# Autonomous AI agent showcase
│       ├── project-graphic.jpg# Graphic design & UI system showcase
│       └── project-video.jpg  # Video editing suite showcase
└── .gitignore                 # Standard node_modules & temporary files
```

---

## 💻 Getting Started Locally

### 1. Prerequisites
Ensure **Node.js** (v18 or higher) and **npm** are installed on your machine.

### 2. Start the Server
Run the production server:
```bash
npm start
```
Or run with auto-reload (watch mode):
```bash
npm run dev
```

### 3. Open in Browser
Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 Expanding the Backend

Faraz, this platform has been built cleanly so you can easily expand and attach any backend service:

- **Send Emails on Quote / Contact:**
  Install `nodemailer` or `resend`:
  ```bash
  npm install nodemailer
  ```
  In `routes/api.js`, replace the `appendRecord` fallback with your SMTP sender to forward incoming leads directly to `faraz.ahmed4723@gmail.com`.

- **Database Storage:**
  Connect **MongoDB (Mongoose)**, **PostgreSQL (Prisma/pg)**, or **Supabase** in `server.js` or `routes/api.js`.

- **Live OpenAI / Gemini AI Integration:**
  In `routes/api.js` under `router.post('/ai-chat')`, plug in the official Google Gemini SDK (`@google/genai`) or OpenAI SDK to make the AI agent query your live vector database.

---

## 🌐 Deploying to Production

You can deploy this Node.js app with one click to:
- **Render** / **Railway** / **Fly.io** (Simply connect your GitHub repository and set build command to `npm install` and start command to `npm start`).
- **DigitalOcean App Platform** or **AWS EC2 / Lightsail**.
- **Vercel** (Add a standard `vercel.json` rewrites configuration).

---

## 📬 Contact Faraz Ahmed
- **Founder:** Faraz Ahmed
- **Agency:** AI by Faraz
- **Location:** Toronto, Ontario, Canada
- **Email:** [faraz.ahmed4723@gmail.com](mailto:faraz.ahmed4723@gmail.com)
- **Phone / WhatsApp:** [+1 (437) 434-8789](https://wa.me/14374348789)
