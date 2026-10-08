import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd());
const required = ['NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY','CLERK_SECRET_KEY','DATABASE_URL'];
let missing = false;
for (const key of required) {
 const present = !!process.env[key]?.trim();
 console.log(`${key}: ${present ? 'present (value hidden)' : 'MISSING'}`);
 if (!present) missing = true;
}
try {
 const base = new URL(process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434');
 if (!['127.0.0.1','localhost','[::1]'].includes(base.hostname) || base.protocol !== 'http:') throw Error();
 const response = await fetch(new URL('/api/tags',base),{signal:AbortSignal.timeout(5000)});
 const data = await response.json();
 const model = process.env.OLLAMA_MODEL || 'qwen3:4b';
 const found = data.models?.some(m => m.name === model);
 console.log(`Ollama: ${found ? 'ready; configured local model is installed' : 'configured model not found'}`);
 if (!found) missing = true;
} catch { console.log('Ollama: not reachable. Open the Ollama app.'); missing=true; }
if (missing) process.exitCode=1;
