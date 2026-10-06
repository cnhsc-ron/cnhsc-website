/**
 * GitHub OAuth handler for Decap CMS on Cloudflare Pages.
 * Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in the Pages project environment.
 */

const SEND_MSG = `
function sendMsg(msg) {
  if (window.opener) {
    window.opener.postMessage(msg, '*');
    window.close();
  } else {
    document.body.textContent = msg;
  }
}`;

const htmlPage = (call) =>
  new Response(`<!doctype html><html><body><script>${SEND_MSG}; ${call}</script></body></html>`, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response('CMS OAuth is not configured (missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET).', {
      status: 500,
    });
  }

  const code = url.searchParams.get('code');

  if (code) {
    try {
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'User-Agent': 'cnhsc-website-cms-auth',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      });

      const data = await tokenRes.json();

      if (data.error) {
        const err = JSON.stringify(
          `authorization:github:error:${data.error_description || data.error}`
        );
        return htmlPage(`sendMsg(${err});`);
      }

      const payload = JSON.stringify({ token: data.access_token, provider: 'github' });
      const msg = JSON.stringify(`authorization:github:success:${payload}`);
      return htmlPage(`sendMsg(${msg});`);
    } catch (error) {
      const err = JSON.stringify(
        `authorization:github:error:${error instanceof Error ? error.message : 'Unknown error'}`
      );
      return htmlPage(`sendMsg(${err});`);
    }
  }

  const redirectUri = `${url.origin}/api/auth`;
  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', 'repo');

  return Response.redirect(authUrl.toString(), 302);
}
