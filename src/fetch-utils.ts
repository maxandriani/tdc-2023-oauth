export async function asJsonResponse(res: Response): Promise<any> {
  if (res.ok) return res.json();
  return res;
}

export async function handleOAuthErrorResponse(res: Response): Promise<any> {
  if (res.ok) return res;
  const body = await res.json();
  throw new OAuthError(body);
}

export interface OAuthErrorResponse {
  error: string,
  error_description?: string,
  error_uri?: string,
  state?: string
}

export class OAuthError extends Error {
  type: string;
  description?: string;
  uri?: string;
  state?: string;

  constructor(response: OAuthErrorResponse) {
    super(`${response.error}: ${response.error_description}`);
    this.name = 'OAuthError';
    this.type = response.error;
    this.description = response.error_description;
    this.uri = response.error_uri;
    this.state = response.state;
  }
}