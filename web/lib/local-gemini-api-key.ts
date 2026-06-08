const GEMINI_API_KEY_STORAGE_KEY = 'nugabar.geminiApiKey';

export function getLocalGeminiApiKey(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY) || '';
}

export function saveLocalGeminiApiKey(apiKey: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, apiKey);
}

export function deleteLocalGeminiApiKey() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(GEMINI_API_KEY_STORAGE_KEY);
}
