import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: '/:path*',
};

const BOT_USER_AGENTS = [
  'googlebot',
  'bingbot',
  'yandex',
  'baiduspider',
  'facebookexternalhit',
  'twitterbot',
  'rogerbot',
  'linkedinbot',
  'embedly',
  'quora link preview',
  'showyoubot',
  'outbrain',
  'pinterest',
  'developers.google.com',
  'slackbot',
  'vkshare',
  'w3c_validator',
  'redditbot',
  'applebot',
  'whatsapp',
  'flipboard',
  'tumblr',
  'bitlybot',
  'skypeuripreview',
  'nuzzel',
  'discordbot',
  'google page speed',
];

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  
  // Check if the request is from a bot
  const isBot = BOT_USER_AGENTS.some(bot => userAgent.includes(bot));
  
  if (isBot) {
    // Rewrite to Prerender.io with authentication
    const url = request.nextUrl.clone();
    const prerenderUrl = `https://service.prerender.io/https://bndbox.com${url.pathname}${url.search}`;
    
    return NextResponse.rewrite(new URL(prerenderUrl), {
      request: {
        headers: new Headers({
          ...Object.fromEntries(request.headers.entries()),
          'X-Prerender-Token': '1IPCCGeMvH5rJUhZGNdK',
        }),
      },
    });
  }
  
  // Regular users continue to the app
  return NextResponse.next();
}
