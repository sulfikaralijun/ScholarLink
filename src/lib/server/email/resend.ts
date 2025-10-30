import { env } from '$env/dynamic/private';
import { RESEND_API_KEY } from '$env/static/private';
import { Resend } from 'resend';

const resend = new Resend(RESEND_API_KEY);

export type SendEmailParams = {
  to: string | string[];
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is missing');
    return { error: 'Email service not configured' };
  }
  if (!env.RESEND_EMAIL_FROM) {
    console.error('EMAIL_FROM is missing');
    return { error: 'Sender not configured' };
  }
  try {
    const result = await resend.emails.send({
      from: env.RESEND_EMAIL_FROM as string,
      to,
      subject,
      html
    });
    return { id: (result as any)?.id };
  } catch (error) {
    console.error('Resend send error:', error);
    return { error: 'Failed to send email' };
  }
}

export function renderSubscriptionConfirmation(email: string, confirmUrl: string) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111">
    <h2>Konfirmasi Berlangganan</h2>
    <p>Hai ${escapeHtml(email)}, klik tombol di bawah ini untuk mengonfirmasi berlangganan informasi beasiswa dari ScholarLink.</p>
    <p style="margin:16px 0;">
      <a href="${escapeHtml(confirmUrl)}" style="background:#2563eb;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;display:inline-block">Konfirmasi Berlangganan</a>
    </p>
    <p>Jika Anda tidak merasa mendaftar, abaikan email ini.</p>
    <p style="font-size:12px;color:#666">Tautan ini akan kedaluwarsa dalam 24 jam.</p>
    ${renderFooter()}
  </div>`;
}

export type BeasiswaBrief = {
  judul: string;
  penyelenggara?: string;
  kategori?: string;
  deadline?: string; // ISO string
  link_detail?: string;
  deskripsi?: string;
};

export function renderNewBeasiswaAnnouncement(item: BeasiswaBrief, unsubscribeUrl?: string) {
  const deadline = item.deadline ? new Date(item.deadline) : null;
  const deadlineText = deadline
    ? deadline.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '-';
  const safe = escapeHtml;
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111">
    <h2>Beasiswa Baru: ${safe(item.judul)}</h2>
    <ul style="padding-left:16px">
      ${item.penyelenggara ? `<li>Penyelenggara: ${safe(item.penyelenggara)}</li>` : ''}
      ${item.kategori ? `<li>Kategori: ${safe(item.kategori)}</li>` : ''}
      ${item.deadline ? `<li>Deadline: ${safe(deadlineText)}</li>` : ''}
    </ul>
    ${item.deskripsi ? `<p>${safe(item.deskripsi)}</p>` : ''}
    ${item.link_detail ? `<p><a href="${safe(item.link_detail)}" target="_blank">Daftar sekarang</a></p>` : ''}
    ${renderFooter(unsubscribeUrl)}
  </div>`;
}

function escapeHtml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function renderFooter(unsubscribeUrl?: string) {
  const parts = [
    '<hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb"/>',
    '<div style="font-size:12px;color:#6b7280">',
    '<p>Anda menerima email ini karena berlangganan pembaruan beasiswa di ScholarLink.</p>',
    unsubscribeUrl ? `<p><a href="${escapeHtml(unsubscribeUrl)}">Berhenti berlangganan</a></p>` : '',
    '</div>'
  ];
  return parts.join('');
}


