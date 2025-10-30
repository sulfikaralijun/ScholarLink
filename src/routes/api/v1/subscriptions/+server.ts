import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { sendEmail, renderSubscriptionConfirmation } from '$lib/server/email/resend';
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from "$env/static/private"
import { requireRole } from '$lib/server/auth';
import { isEmail, trimObject, maxLength } from '$lib/server/validation';

export async function GET(event) {
  requireRole(event as any, ['admin', 'super_admin']);
	try {
		const subscriptions = await prisma.subscription.findMany({
			orderBy: { createdAt: 'desc' }
		});
		return json(subscriptions);
	} catch (error) {
		console.error('Error fetching subscriptions:', error);
		return json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
	}
}

export async function POST({ request, url }) {
	try {
    const raw = await request.json();
    const data = trimObject(raw);
		
		// Validate email
    if (!data.email_user) {
      return json({ error: 'Email is required' }, { status: 400 });
    }
    if (!isEmail(data.email_user)) {
      return json({ error: 'Email is invalid' }, { status: 400 });
    }
    if (!maxLength(data.email_user, 254)) {
      return json({ error: 'Email too long' }, { status: 400 });
    }

		// Check if email already exists
		const existingSubscription = await prisma.subscription.findFirst({
			where: { email_user: data.email_user }
		});

		if (existingSubscription) {
			return json({ error: 'Email already subscribed' }, { status: 400 });
		}

    // Generate confirmation token (24h expiry)
    const token = jwt.sign(
      { email: data.email_user, action: 'subscribe_confirm' },
      JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    const confirmUrl = `${url.origin}/api/v1/subscriptions/confirm?token=${encodeURIComponent(token)}`;
    const html = renderSubscriptionConfirmation(data.email_user, confirmUrl);

    // Fire-and-forget email send
    sendEmail({
      to: data.email_user,
      subject: 'Konfirmasi Berlangganan – ScholarLink',
      html
    }).catch((e) => console.error('Send confirmation failed:', e));

    return json({ message: 'Confirmation email sent' }, { status: 200 });
	} catch (error) {
		console.error('Error creating subscription:', error);
		return json({ error: 'Failed to create subscription' }, { status: 500 });
	}
}
