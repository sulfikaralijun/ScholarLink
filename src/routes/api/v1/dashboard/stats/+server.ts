import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { requireRole } from '$lib/server/auth';

export async function GET(event) {
    requireRole(event as any, ['admin', 'super_admin']);
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
