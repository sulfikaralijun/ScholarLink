import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { verifyPassword } from '$lib/server/utils/passport';
import { createToken } from '$lib/server/utils/jwt';

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('token');
	if (token) {
		throw redirect(303, '/dashboard');
	}
	return {
		session: { token }
	};
};

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const remember: boolean = formData.get('remember') === 'on';

		// Validation
		if (!email || !password) {
			return fail(400, { error: 'Email dan password harus diisi' });
		}

		try {
			// Check if admin exists
			const admin = await prisma.admin.findUnique({ 
				where: { email },
				select: {
					id_admin: true,
					nama: true,
					email: true,
					password: true,
					role: true
				}
			});

			if (!admin) {
				return fail(401, { error: 'Email atau password salah' });
			}

			// Verify password
			const valid = await verifyPassword(password, admin.password);
			if (!valid) {
				return fail(401, { error: 'Email atau password salah' });
			}

			// Create JWT token
			const token = createToken({ 
				id: admin.id_admin, 
				email: admin.email,
				role: admin.role,
				nama: admin.nama
			});

			// Set cookie
			cookies.set('token', token, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				...(remember ? { maxAge: 60 * 60 * 24 * 7 } : {})
			});

			// Redirect to dashboard
			throw redirect(303, '/dashboard');
		} catch (error) {
			console.error('Login error:', error);
			return fail(500, { error: 'Terjadi kesalahan server' });
		}
	}
} satisfies Actions;
