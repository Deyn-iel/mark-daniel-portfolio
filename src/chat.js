import './chat.css';
import profileImage from '../img/profile-enhanced.png';
import { answerLocally, useQuickAnswers } from './chat/local-ai.js';

// Answers run on the visitor's device. No account, API key, or chat server.
const icons = {
  sparkle: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-8 8H5l-3 2v-10a9 9 0 0 1 18 0Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M7 10h8M7 14h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};
const prompts = [
  { text: 'What does Mark build?' },
  { text: 'Show me his projects', href: '#works', link: 'Explore projects' },
  { text: 'How can I contact him?', href: '#contact', link: 'Contact Mark' },
];
const widget = document.createElement('aside');
widget.className = 'chat-widget';
widget.setAttribute('aria-label', 'Portfolio assistant');
widget.innerHTML = `
  <section class="chat-panel" id="portfolio-chat" role="dialog" aria-labelledby="chat-title" aria-hidden="true" inert>
    <header class="chat-header">
      <span class="chat-avatar"><img src="${profileImage}" alt="Mark Daniel Alindayu" /></span>
      <div class="chat-heading"><h2 id="chat-title">Mark’s assistant</h2></div>
      <button class="chat-close" type="button" aria-label="Close chat">${icons.close}</button>
    </header>
    <div class="chat-scroll">
      <div class="chat-intro">
        <h3>Hello!<br><span>How can I assist<br>you today?</span></h3>
      </div>
      <div class="chat-messages" role="log" aria-live="polite" aria-relevant="additions" aria-label="Conversation"></div>
      <div class="chat-suggestions" aria-label="Suggested questions">
        ${prompts.map((prompt, index) => `<button type="button" data-prompt="${index}">${prompt.text}<span aria-hidden="true">↗</span></button>`).join('')}
      </div>
    </div>
    <form class="chat-form">
      <label class="chat-sr-only" for="chat-input">Your message</label>
      <div class="chat-composer"><textarea id="chat-input" rows="1" maxlength="1000" placeholder="Ask something about Mark…"></textarea><button class="chat-send" type="submit" aria-label="Send message" disabled>${icons.send}</button></div>
    </form>
  </section>
  <button class="chat-launcher" type="button" aria-label="Open portfolio assistant" aria-expanded="false" aria-controls="portfolio-chat"><span class="chat-launcher-icon"><span class="chat-symbol-bubble">${icons.chat}</span><span class="chat-symbol-close">${icons.close}</span></span><span class="chat-launcher-label">Ask about Mark</span><span class="chat-launcher-sparkle">${icons.sparkle}</span></button>`;
document.body.append(widget);

const panel = widget.querySelector('.chat-panel');
const launcher = widget.querySelector('.chat-launcher');
const input = widget.querySelector('textarea');
const send = widget.querySelector('.chat-send');
const messages = widget.querySelector('.chat-messages');
const scroll = widget.querySelector('.chat-scroll');
let busy = false;
let history = [];
function setOpen(open, focus = true) {
  panel.inert = !open;
  panel.setAttribute('aria-hidden', String(!open));
  launcher.setAttribute('aria-expanded', String(open));
  launcher.setAttribute('aria-label', open ? 'Close portfolio assistant' : 'Open portfolio assistant');
  widget.classList.toggle('is-open', open);
  if (focus) (open ? widget.querySelector('.chat-close') : launcher).focus();
}
launcher.addEventListener('click', () => setOpen(!widget.classList.contains('is-open')));
widget.querySelector('.chat-close').addEventListener('click', () => setOpen(false));
widget.addEventListener('keydown', event => {
  if (event.key === 'Escape' && widget.classList.contains('is-open')) { event.stopPropagation(); setOpen(false); }
});
// The mobile navigation dialog takes priority over the chat panel.
const drawer = document.getElementById('drawer');
new MutationObserver(() => {
  const open = drawer.classList.contains('open');
  if (open) setOpen(false, false);
  widget.inert = open;
  widget.hidden = open;
}).observe(drawer, { attributes: true, attributeFilter: ['class'] });

function addMessage(text, from, prompt) {
  const message = document.createElement('div');
  message.className = `chat-message chat-message-${from}`;
  const name = document.createElement('span');
  name.className = 'chat-message-name';
  name.textContent = from === 'user' ? 'You' : 'Mark’s assistant';
  const bubble = document.createElement('p');
  bubble.textContent = text;
  message.append(name, bubble);
  if (prompt?.href) {
    const link = document.createElement('a');
    link.href = prompt.href;
    if (prompt.href.startsWith('https://')) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    link.textContent = `${prompt.link} ↗`;
    link.addEventListener('click', () => setOpen(false, false));
    message.append(link);
  }
  messages.append(message);
  return message;
}
async function submitMessage(text) {
  text = text.trim();
  if (busy || !text || text.length > 1000) return;
  busy = true;
  widget.querySelector('.chat-intro').hidden = true;
  widget.querySelector('.chat-suggestions').hidden = true;
  addMessage(text, 'user');
  input.value = '';
  send.disabled = true;
  input.focus();
  const pending = addMessage('Thinking…', 'assistant');
  pending.classList.add('chat-message-pending');
  scroll.scrollTop = scroll.scrollHeight;
  const conversation = [...history.slice(-4), { role: 'user', content: text }];
  const quickButton = document.createElement('button');
  quickButton.className = 'chat-quick-answer';
  quickButton.type = 'button';
  quickButton.textContent = 'Use a quick portfolio answer';
  quickButton.hidden = true;
  quickButton.addEventListener('click', useQuickAnswers);
  pending.append(quickButton);
  try {
    const data = await answerLocally(conversation, progress => {
      pending.querySelector('p').textContent = progress;
      quickButton.hidden = false;
    });
    pending.remove();
    const prompt = prompts.find(prompt => prompt.text.toLowerCase() === text.toLowerCase());
    const message = addMessage(data.reply, 'assistant', data.href ? data : prompt);
    message.querySelector('.chat-message-name').textContent = data.mode === 'ai' ? 'On-device AI' : 'Portfolio guide';
    history = [...conversation, { role: 'assistant', content: data.reply.slice(0, 1000) }].slice(-4);
  } catch {
    pending.remove();
    addMessage('Please ask about Mark’s projects, skills, education, or contact details.', 'assistant', { href: '#contact', link: 'Contact Mark' });
  } finally {
    busy = false;
    send.disabled = !input.value.trim();
    scroll.scrollTop = scroll.scrollHeight;
  }
}
widget.querySelector('.chat-form').addEventListener('submit', event => { event.preventDefault(); submitMessage(input.value); });
input.addEventListener('input', () => { send.disabled = busy || !input.value.trim(); });
input.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); submitMessage(input.value); }
});
widget.querySelectorAll('[data-prompt]').forEach(button => button.addEventListener('click', () => submitMessage(prompts[Number(button.dataset.prompt)].text)));
