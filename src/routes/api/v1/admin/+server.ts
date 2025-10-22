import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { hashPassword } from '$lib/server/utils/passport';

export async function GET() {
	try {
		const admins = await prisma.admin.findMany({
			select: {
				id_admin: true,
				nama: true,
				email: true,
				role: true,
				createdAt: true
			},
			orderBy: { createdAt: 'desc' }
		});
		return json(admins);
	} catch (error) {
		console.error('Error fetching admins:', error);
		return json({ error: 'Failed to fetch admins' }, { status: 500 });
	}
}

export async function POST({ request }) {
	try {
		const data = await request.json();
		
		// Validate required fields
		if (!data.nama || !data.email || !data.password) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		// Check if email already exists
		const existingAdmin = await prisma.admin.findUnique({
			where: { email: data.email }
		});

		if (existingAdmin) {
			return json({ error: 'Email already exists' }, { status: 400 });
		}

		// Hash password
		const hashedPassword = await hashPassword(data.password);

		const admin = await prisma.admin.create({
			data: {
				nama: data.nama,
				email: data.email,
				password: hashedPassword,
				role: data.role || 'admin'
			},
			select: {
				id_admin: true,
				nama: true,
				email: true,
				role: true,
				createdAt: true
			}
		});

		return json(admin, { status: 201 });
	} catch (error) {
		console.error('Error creating admin:', error);
		return json({ error: 'Failed to create admin' }, { status: 500 });
	}
}
