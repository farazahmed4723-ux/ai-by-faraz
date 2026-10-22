/**
 * AI BY FARAZ - Live Autonomous Assistant Terminal Interface
 */
(function () {
  const chatForm = document.getElementById('ai-chat-form');
  const userInput = document.getElementById('ai-user-input');
  const chatMessages = document.getElementById('chat-messages');
  const quickPrompts = document.getElementById('quick-prompts');
  const floatingAiBtn = document.getElementById('floating-ai-btn');

  if (!chatForm || !chatMessages) return;

  function formatTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function appendUserMessage(text) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble user-bubble';
    bubble.innerHTML = `
      <div class="bubble-content">
        <div class="bubble-meta">
          <span class="bubble-sender">You</span>
          <span class="bubble-time">${formatTime()}</span>
        </div>
        <p>${escapeHTML(text)}</p>
      </div>
    `;
    chatMessages.appendChild(bubble);
    scrollChat();
  }

  function appendBotMessage(text, suggestions = []) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble bot-bubble';
    
    let suggestionsHtml = '';
    if (suggestions && suggestions.length > 0) {
      suggestionsHtml = `
        <div class="terminal-quick-prompts" style="padding: 0.5rem 0 0 0; background: transparent; border: none;">
          ${suggestions.map(s => `<button class="quick-btn sub-quick-btn" data-query="${s}">${s}</button>`).join('')}
        </div>
      `;
    }

    bubble.innerHTML = `
      <div class="bubble-avatar">
        <img src="/assets/faraz-logo.jpg" alt="AI by Faraz Assistant">
      </div>
      <div class="bubble-content">
        <div class="bubble-meta">
          <span class="bubble-sender">AI by Faraz Assistant</span>
          <span class="bubble-time">${formatTime()}</span>
        </div>
        <p>${escapeHTML(text)}</p>
        ${suggestionsHtml}
      </div>
    `;
    chatMessages.appendChild(bubble);
    scrollChat();

    // Attach click listeners to new suggestions
    bubble.querySelectorAll('.sub-quick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-query');
        sendMessage(query);
      });
    });
  }

  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'chat-typing-indicator';
    indicator.className = 'chat-bubble bot-bubble';
    indicator.innerHTML = `
      <div class="bubble-avatar">
        <img src="/assets/faraz-logo.jpg" alt="AI by Faraz Assistant">
      </div>
      <div class="bubble-content">
        <div class="bubble-meta">
          <span class="bubble-sender">AI by Faraz Assistant</span>
        </div>
        <p><i class="fa-solid fa-spinner fa-spin text-purple"></i> Analyzing query & querying knowledge base...</p>
      </div>
    `;
    chatMessages.appendChild(indicator);
    scrollChat();
  }

  function removeTypingIndicator() {
    const el = document.getElementById('chat-typing-indicator');
    if (el) el.remove();
  }

  function scrollChat() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  async function sendMessage(text) {
    if (!text || text.trim() === '') return;
    const query = text.trim();
    appendUserMessage(query);
    showTypingIndicator();

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });

      const data = await response.json();
      removeTypingIndicator();

      if (response.ok && data.success) {
        appendBotMessage(data.reply, data.suggestions);
      } else {
        appendBotMessage(data.reply || "Faraz is a Toronto-based full-stack developer and AI engineer. Contact him directly at faraz.ahmed4723@gmail.com or +1 (437) 434-8789.");
      }
    } catch (err) {
      removeTypingIndicator();
      // Graceful offline fallback
      appendBotMessage(
        "I am connected to Faraz's Toronto studio node. Faraz specializes in Full-Stack Web Dev (Node.js/React), Autonomous AI Agents, Luxury Graphic Design, and Cinematic Video Editing. You can reach him directly at +1 (437) 434-8789 or faraz.ahmed4723@gmail.com."
      );
    }
  }

  // Form submit
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = userInput.value;
    userInput.value = '';
    sendMessage(text);
  });

  // Preset prompts
  if (quickPrompts) {
    quickPrompts.querySelectorAll('.quick-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-query');
        sendMessage(query);
      });
    });
  }

  // Floating AI launcher scroll-to
  if (floatingAiBtn) {
    floatingAiBtn.addEventListener('click', () => {
      const demoSection = document.getElementById('ai-demo');
      if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'smooth' });
        userInput.focus();
      }
    });
  }
})();
