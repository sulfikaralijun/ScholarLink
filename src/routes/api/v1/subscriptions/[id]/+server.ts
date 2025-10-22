import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export async function DELETE({ params }) {
	try {
		await prisma.subscription.delete({
			where: { id_subscription: parseInt(params.id) }
		});

		return json({ message: 'Subscription deleted successfully' });
	} catch (error) {
		console.error('Error deleting subscription:', error);
		return json({ error: 'Failed to delete subscription' }, { status: 500 });
	}
}
