import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { hashPassword } from '$lib/server/utils/passport';
import { requireRole } from '$lib/server/auth';
import { isEmail, trimObject, maxLength } from '$lib/server/validation';

export async function GET(event) {
    requireRole(event as any, ['admin', 'super_admin']);
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

export async function POST(event) {
    requireRole(event as any, ['super_admin']);
    const { request } = event as any;
	try {
        const raw = await request.json();
        const data = trimObject(raw);
		
		// Validate required fields
        if (!data.nama || !data.email || !data.password) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}
        if (!isEmail(data.email)) {
            return json({ error: 'Invalid email' }, { status: 400 });
        }
        if (!maxLength(data.nama, 120)) {
            return json({ error: 'Nama terlalu panjang' }, { status: 400 });
        }
        if (String(data.password).length < 6) {
            return json({ error: 'Password minimal 6 karakter' }, { status: 400 });
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
