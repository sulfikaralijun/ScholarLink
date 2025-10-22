import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { verifyToken } from '$lib/server/utils/jwt';
import { prisma } from '$lib/server/prisma';

export const load: LayoutServerLoad = async ({ cookies }) => {

		// Get token from cookies
	const token = cookies.get('token');
	
	if (!token) {
		throw redirect(303, '/login');
	}

	// Verify token
	const payload = verifyToken(token);
	if (!payload) {
		// Invalid token, clear cookie and redirect
		cookies.delete('token', { path: '/' });
		throw redirect(303, '/login');
	}

	// Get admin data from database
	const admin = await prisma.admin.findUnique({
		where: { id_admin: payload.id },
		select: {
			id_admin: true,
			nama: true,
			email: true,
			role: true,
			createdAt: true
		}
	});

	if (!admin) {
		// Admin not found, clear cookie and redirect
		cookies.delete('token', { path: '/' });
		throw redirect(303, '/login');
	}

	return {
		session: { ...admin }
	};
};
