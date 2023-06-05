const PKCE_DICT = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';

export async function generateRandomString(size: number = 128) {
  const buffer = new Uint8Array(128);
  crypto.getRandomValues(buffer);
  return Array.from(buffer).map(x => PKCE_DICT[x % 64]).join('');
}

export function base64URLEncode(buffer: ArrayBuffer) {
  return btoa(Array.from(new Uint8Array(buffer)).map(bytes => String.fromCharCode(bytes)).join(''))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function sha256(phrase: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const buffer = encoder.encode(phrase);
  return crypto.subtle.digest('SHA-256', buffer);
}

export async function generatePkcePair(): Promise<[string, string]> {
  const codeVerifier = await generateRandomString();
  const codeVerifierHash = await sha256(codeVerifier).then(buffer => base64URLEncode(buffer));
  return [codeVerifier, codeVerifierHash];
}