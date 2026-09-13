# No-key portfolio chat

The chatbot no longer calls Gemini, OpenAI, or `/api/chat`. There is no backend or API key requirement. It can be hosted with the rest of the static Vite site.

## How it works

- The welcome reads: “Hello! How can I assist you today?” The connection bar and provider footer are removed.
- Greetings respond immediately. For other questions, supported browsers run SmolLM2-360M locally through WebLLM in a web worker. Messages stay on the visitor's device.
- First use downloads model files from Hugging Face and a runtime from WebLLM's distribution host; this can take time and hundreds of megabytes. Browser caching can speed up later visits. Loading starts only after a message, not when opening the portfolio.
- Loading progress offers “Use a quick portfolio answer,” which cancels the worker and switches to the built-in guide for the rest of the page session.
- Unsupported WebGPU devices, download errors, and timeouts use the same offline portfolio guide. It matches topics from public facts; it is not a generative model. Those responses are labeled “Portfolio guide.” Generated responses are labeled “On-device AI.”
- Local models can make mistakes and are less capable than hosted models. Browser AI requires HTTPS (or localhost), WebGPU, enough graphics memory, and a successful initial download. The basic guide works without those requirements, including on older phones.
- Model loading/generation has a two-minute deadline. Conversation context is bounded. Text is rendered safely, never interpreted as HTML.

## Development and deployment

Run `npm.cmd run dev` on Windows, or `npm run dev` elsewhere. No `.env` settings are needed; previous local API keys are ignored. For deployment, build with `npm run build` and publish `dist` as a static site. No Vercel function is required.

Public facts: `src/chat/portfolio-context.js`. Basic guide topics: `src/chat/guide.js`. Update both when portfolio facts change.

`npm test` checks basic guide behavior. Browser smoke checks should verify no chat API requests, no key configuration, the greeting, fallback labels, navigation, and mobile layout. Model inference must be checked separately on WebGPU hardware; mocked replies do not validate it.

References: [WebLLM](https://webllm.mlc.ai/docs/user/basic_usage.html), [Web workers](https://webllm.mlc.ai/docs/user/advanced_usage.html#using-web-workers).
