import { quickReply, isGreeting } from './guide.js';
import { portfolioInstructions } from './portfolio-context.js';

let worker;
let engine;
let guideOnly = false;
let cancelCurrent;
let lastTopic;

export function useQuickAnswers() {
  guideOnly = true;
  worker?.terminate();
  worker = undefined;
  engine = undefined;
  cancelCurrent?.();
}

async function createEngine(progress) {
  if (engine) return engine;
  if (!navigator.gpu) throw new Error('unsupported');
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) throw new Error('unsupported');
  progress('Preparing on-device AI… First use downloads the model.');
  const { CreateWebWorkerMLCEngine } = await import('@mlc-ai/web-llm');
  if (guideOnly) throw new Error('cancelled');
  worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
  const model = adapter.features.has('shader-f16') ? 'SmolLM2-360M-Instruct-q4f16_1-MLC' : 'SmolLM2-360M-Instruct-q4f32_1-MLC';
  engine = await CreateWebWorkerMLCEngine(worker, model, {
    initProgressCallback: report => progress(`Loading on-device AI · ${Math.round(Math.max(0, Math.min(1, report.progress)) * 100)}%\nFirst use downloads the model. You can use a quick portfolio answer instead.`),
  });
  return engine;
}

export async function answerLocally(conversation, progress = () => {}) {
  const question = conversation.at(-1).content;
  const fallback = () => {
    const result = quickReply(question, lastTopic);
    lastTopic = result.topic;
    return result;
  };
  if (guideOnly || isGreeting(question)) return fallback();
  let timer;
  try {
    const cancelled = new Promise((_, reject) => { cancelCurrent = () => reject(new Error('cancelled')); });
    const timeout = new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('timeout')), 120_000); });
    const generate = async () => {
      const local = await createEngine(progress);
      if (guideOnly) throw new Error('cancelled');
      progress('Thinking on your device…');
      const recent = conversation.slice(-5).map(message => ({ ...message, content: message.content.slice(0, 1000) }));
      while (recent.reduce((sum, message) => sum + message.content.length, 0) > 2500 && recent.length > 1) recent.splice(0, 2);
      const response = await local.chat.completions.create({
        messages: [{ role: 'system', content: portfolioInstructions }, ...recent],
        max_tokens: 240,
        temperature: 0.2,
      });
      const reply = response.choices?.[0]?.message?.content?.trim();
      if (!reply) throw new Error('empty');
      lastTopic = quickReply(question, lastTopic).topic;
      return { reply, mode: 'ai' };
    };
    return await Promise.race([generate(), cancelled, timeout]);
  } catch {
    useQuickAnswers();
    return fallback();
  } finally {
    clearTimeout(timer);
    cancelCurrent = undefined;
  }
}
