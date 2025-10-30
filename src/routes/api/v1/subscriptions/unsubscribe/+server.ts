import type { RequestHandler } from './$types';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { prisma } from '$lib/server/prisma';

export const GET: RequestHandler = async ({ url }) => {
  const token = url.searchParams.get('token');
  if (!token) {
    return new Response(renderHtml('Token tidak ditemukan.'), { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET as string) as any;
    if (payload?.action !== 'unsubscribe' || !payload?.email) {
      return new Response(renderHtml('Token tidak valid.'), { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    const email = String(payload.email);
    await prisma.subscription.deleteMany({ where: { email_user: email } });

    return new Response(renderHtml('Anda telah berhenti berlangganan. Terima kasih.'), {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  } catch (e) {
    return new Response(renderHtml('Token kedaluwarsa atau tidak valid.'), { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
};

function renderHtml(message: string) {
  return `<!doctype html>
  <html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Berhenti Berlangganan</title>
    <style>
      body{font-family:Arial,Helvetica,sans-serif;background:#f8fafc;color:#0f172a;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
      .card{background:#fff;border:1px solid #e2e8f0;border-radius:12px;max-width:480px;padding:24px;box-shadow:0 10px 20px rgba(0,0,0,0.05)}
      .title{font-size:20px;margin:0 0 8px}
      .desc{color:#475569;margin:0}
    </style>
  </head>
  <body>
    <div class="card">
      <h1 class="title">Unsubscribe</h1>
      <p class="desc">${message}</p>
    </div>
  </body>
  </html>`;
}


