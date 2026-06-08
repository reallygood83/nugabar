import { User } from 'firebase/auth';
import { getLocalGeminiApiKey } from './local-gemini-api-key';

const GEMINI_API_ROUTES = [
  '/api/behavior-characteristics/generate',
  '/api/cumulative-records/generate',
  '/api/creative-activities/generate-records',
];

function shouldAttachGeminiApiKey(input: RequestInfo | URL) {
  const url = typeof input === 'string' ? input : input.toString();
  return GEMINI_API_ROUTES.some((route) => url.includes(route));
}

export async function authenticatedFetch(
  user: User | null | undefined,
  isDevMode: boolean,
  input: RequestInfo | URL,
  init: RequestInit = {}
) {
  const headers = new Headers(init.headers);

  if (isDevMode) {
    if (user?.uid) {
      headers.set('X-Dev-User', user.uid);
    }
  } else {
    const token = await user?.getIdToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const geminiApiKey = shouldAttachGeminiApiKey(input) ? getLocalGeminiApiKey() : '';
  if (geminiApiKey) {
    headers.set('X-Gemini-API-Key', geminiApiKey);
  }

  return fetch(input, {
    ...init,
    headers,
  });
}
