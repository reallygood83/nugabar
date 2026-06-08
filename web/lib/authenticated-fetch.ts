import { User } from 'firebase/auth';

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

  return fetch(input, {
    ...init,
    headers,
  });
}
