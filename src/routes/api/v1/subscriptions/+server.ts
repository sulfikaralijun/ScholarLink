import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export async function GET() {
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

export async function POST({ request }) {
	try {
		const data = await request.json();
		
		// Validate email
		if (!data.email_user) {
			return json({ error: 'Email is required' }, { status: 400 });
		}

		// Check if email already exists
		const existingSubscription = await prisma.subscription.findFirst({
			where: { email_user: data.email_user }
		});

		if (existingSubscription) {
			return json({ error: 'Email already subscribed' }, { status: 400 });
		}

		const subscription = await prisma.subscription.create({
			data: {
				email_user: data.email_user,
				tanggal_daftar: new Date()
			}
		});

		return json(subscription, { status: 201 });
	} catch (error) {
		console.error('Error creating subscription:', error);
		return json({ error: 'Failed to create subscription' }, { status: 500 });
	}
}
