import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export async function GET() {
	try {
		const [totalBeasiswa, activeBeasiswa, expiredBeasiswa, totalSubscribers] = await Promise.all([
			prisma.beasiswa.count(),
			prisma.beasiswa.count({
				where: { deadline: { gt: new Date() } }
			}),
			prisma.beasiswa.count({
				where: { deadline: { lte: new Date() } }
			}),
			prisma.subscription.count()
		]);

		return json({
			totalBeasiswa,
			activeBeasiswa,
			expiredBeasiswa,
			totalSubscribers
		});
	} catch (error) {
		console.error('Error fetching dashboard stats:', error);
		return json({ error: 'Failed to fetch stats' }, { status: 500 });
	}
}
