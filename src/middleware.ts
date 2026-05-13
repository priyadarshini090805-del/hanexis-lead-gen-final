export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/api/leads/:path*', '/api/ai/:path*', '/api/prompts/:path*'],
};
