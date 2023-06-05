import { asJsonResponse, handleOAuthErrorResponse } from "./fetch-utils";

export interface AccessTokenResponse {
  access_token: string,
  refresh_token?: string,
  token_type: string,
  expires_in: number,
  refresh_expires_in?: number,
  scope?: string,
  session_state?: string,
  id_token?: string
}

export interface DeviceAuthorizationResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  interval: number;
  expires_in: number;
}

export type StartAuthorizationFlowArgs = {
  authorizationUrl: string;
  clientId: string;
  redirectUri: string;
  scope?: string;
  codeChallenge?: string;
  state?: string;
};

export function startAuthorizationFlow({ authorizationUrl, clientId, redirectUri, scope, codeChallenge, state }: StartAuthorizationFlowArgs): string {
  const params = new URLSearchParams();
  params.set('response_type', 'code');
  params.set('client_id', clientId);
  if (scope) params.set('scope', scope);
  if (state) params.set('state', state);
  if (codeChallenge) {
    params.set('code_challenge_method', 'S256');
    params.set('code_challenge', codeChallenge);
  }
  params.set('redirect_uri', redirectUri);
  return `${authorizationUrl}?${params.toString()}`;
}

export type StartDeviceAuthorizationFlow = {
  deviceUrl: string;
  clientId: string;
}

export async function startDeviceAuthorizationFlow({ clientId, deviceUrl }: StartDeviceAuthorizationFlow): Promise<DeviceAuthorizationResponse> {
  const body = new URLSearchParams();
  body.set('client_id', clientId);
  return fetch(deviceUrl, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body,
    method: 'POST'
  })
    .then(handleOAuthErrorResponse)
    .then(asJsonResponse);
}

export type FetchAccessTokenByRefreshToken = {
  tokenUrl: string;
  clientId: string;
  refreshToken: string;
};

export async function fetchAccessTokenByRefreshToken({ clientId, refreshToken, tokenUrl }: FetchAccessTokenByRefreshToken): Promise<AccessTokenResponse> {
  const body = new URLSearchParams();
  
  body.set('client_id', clientId);
  body.set('grant_type', 'refresh_token');
  body.set('refresh_token', refreshToken);
  
  return fetch(tokenUrl, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body,
    method: 'POST'
  })
    .then(handleOAuthErrorResponse)
    .then(asJsonResponse);
}

export type FetchAccessTokenByAuthCore = {
  tokenUrl: string;
  authCode: string;
  redirectUri: string;
  codeVerifier: string;
  clientId: string;
};

export async function fetchAccessTokenByAuthCode({ authCode, clientId, codeVerifier, redirectUri, tokenUrl }: FetchAccessTokenByAuthCore): Promise<AccessTokenResponse> {
  const body = new URLSearchParams();
  
  body.set('client_id', clientId);
  body.set('grant_type', 'authorization_code');
  body.set('code', authCode);

  if (codeVerifier) {
    body.set('code_verifier', codeVerifier);
  }

  body.set('redirect_uri', redirectUri);
  
  return fetch(tokenUrl, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body,
    method: 'POST'
  })
    .then(handleOAuthErrorResponse)
    .then(asJsonResponse);
}

export type FetchAccessTokenByDeviceCode = {
  tokenUrl: string;
  clientId: string;
  deviceCode: string;
}

export async function fetchAccessTokenByDeviceCode({ clientId, deviceCode, tokenUrl }: FetchAccessTokenByDeviceCode): Promise<AccessTokenResponse> {
  const body = new URLSearchParams();

  body.set('client_id', clientId);
  body.set('grant_type', 'urn:ietf:params:oauth:grant-type:device_code');
  body.set('device_code', deviceCode);

  return fetch(tokenUrl, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body,
    method: 'POST'
  })
    .then(handleOAuthErrorResponse)
    .then(asJsonResponse);
}