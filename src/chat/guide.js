// An honest, offline fallback: these are portfolio facts, not generated AI replies.
const topics = [
  { id: 'careers', words: ['careers', 'career', 'recruitment', 'applicant', 'hiring portal'], answer: 'Mark developed the Pinnacle Global Careers System for job postings, applicant submissions, and recruitment workflows.', href: 'https://careers.pinnacleglobalfranchising.com/', link: 'Visit Careers' },
  { id: 'poultry', words: ['poultry', 'chicken', 'temperature', 'humidity', 'environment'], answer: 'The Poultry Environment Monitoring System tracks temperature, humidity, and environmental conditions affecting poultry health, with a real-time web dashboard.', href: '#works', link: 'View project' },
  { id: 'trash', words: ['trash', 'waste', 'biodegradable', 'garbage'], answer: 'Mark’s Smart Automated Trash Can detects biodegradable and non-biodegradable materials using sensors and triggers the appropriate disposal mechanism.', href: '#works', link: 'View project' },
  { id: 'staple', words: ['staple', 'transformer', 'pole', 'post leaning', 'safety', 'alert'], answer: 'STAPLE is a sensor safety alert system designed to detect post-leaning and early warning signs of potential transformer failures, with monitoring and alert notifications.', href: '#works', link: 'View project' },
  { id: 'aisu', words: ['aisu', 'chatbot', 'chat bot', 'university chatbot'], answer: 'Chat AISU is Mark’s AI chatbot concept for Isabela State University – Cauayan. It focuses on campus information, conversation flow, and interface design; it is not a deployed AI system.', href: '#works', link: 'View concept' },
  { id: 'payroll', words: ['payroll', 'attendance'], answer: 'Mark developed an Attendance and Payroll System to support employee attendance monitoring and payroll-related processing.', href: '#services', link: 'Explore services' },
  { id: 'franchise', words: ['franchise', 'franchising flow'], answer: 'Mark contributed to the development of a Franchise Flow System to manage and monitor franchise processes and transactions at Pinnacle Global.', href: '#services', link: 'Explore services' },
  { id: 'experience', words: ['experience', 'pinnacle', 'company', 'ticketing', 'exam', 'portals', 'worked'], answer: 'At Pinnacle Global Franchising Group Inc., Mark developed systems for examinations, ticketing, careers, attendance and payroll, application processing, supplies management, and company portals. He also contributed to Franchise Flow.', href: '#services', link: 'Explore services' },
  { id: 'skills', words: ['skills', 'skill', 'stack', 'technology', 'technologies', 'language', 'framework', 'php', 'laravel', 'javascript', 'react', 'vue', 'arduino', 'mysql'], answer: 'Mark lists JavaScript, Vue, React, Angular, HTML, CSS, Tailwind CSS, Bootstrap, PHP, Laravel, MySQL, Firebase, Arduino, and C++. His tools include Git, GitHub, VS Code, and Vercel.', href: '#skills', link: 'View skills' },
  { id: 'education', words: ['education', 'school', 'college', 'degree', 'graduate', 'studied', 'study', 'university'], answer: 'Mark graduated with a BS in Information Technology from Isabela State University – Cauayan Campus (2021–2025), focusing on web development, IoT systems, and dashboards.', href: '#education', link: 'View education' },
  { id: 'contact', words: ['contact', 'email', 'phone', 'hire', 'reach', 'available', 'availability', 'salary', 'rate', 'resume', 'cv'], answer: 'You can contact Mark at atchoyalindayu@gmail.com or +639937259373. His CV is available on the Home page. Please contact him directly to confirm availability or discuss an opportunity.', href: '#contact', link: 'Contact Mark' },
  { id: 'projects', words: ['projects', 'project', 'build', 'built', 'work', 'portfolio', 'services', 'iot'], answer: 'Mark builds web applications and IoT systems. His featured projects are Poultry Environment Monitoring, a Smart Automated Trash Can, STAPLE Safety Alerts, Pinnacle Enterprise Web Systems, Pinnacle Careers, and the Chat AISU concept.', href: '#works', link: 'Explore projects' },
  { id: 'about', words: ['who', 'about', 'location', 'where', 'mark', 'yourself'], answer: 'Mark Daniel Alindayu is a Web and IoT Developer based in Isabela, Philippines. He builds responsive web systems, sensor integrations, dashboards, and automation solutions.', href: '#about', link: 'About Mark' },
];

export function quickReply(text, previousTopic) {
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  if (/^(hi|hello|hey|hiya|good morning|good afternoon|good evening|kumusta|hello there)$/.test(normalized)) return { reply: 'Hello! How can I assist you today?', mode: 'guide', topic: previousTopic };
  if (/^(thanks|thank you|thank you so much|salamat|thank you po)$/.test(normalized)) return { reply: 'You’re welcome! Feel free to ask about Mark’s projects, skills, or experience.', mode: 'guide', topic: previousTopic };
  const ranked = topics.map(topic => ({ ...topic, score: topic.words.reduce((score, word) => score + (` ${normalized} `.includes(` ${word} `) ? (topic.id === 'about' ? 0.1 : 1) : 0), 0) })).sort((a, b) => b.score - a.score);
  let match = ranked[0].score ? ranked[0] : null;
  if ((!match || (match.id === 'about' && !/\bmark\b/.test(normalized))) && /\b(it|that|more|details|link)\b/.test(normalized)) match = topics.find(topic => topic.id === previousTopic) || match;
  if (!match) return { reply: 'I can help with Mark’s projects, skills, experience, education, or contact details. What would you like to know?', mode: 'guide' };
  return { reply: match.answer, mode: 'guide', topic: match.id, href: match.href, link: match.link };
}

export function isGreeting(text) {
  return /^(hi|hello|hey|hiya|good morning|good afternoon|good evening|kumusta|hello there|thanks|thank you|salamat)[!.?\s]*$/i.test(text.trim());
}
