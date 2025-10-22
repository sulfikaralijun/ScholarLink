import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { hashPassword } from '$lib/server/utils/passport';

export async function GET({ params }) {
	try {
		const admin = await prisma.admin.findUnique({
			where: { id_admin: parseInt(params.id) },
			select: {
				id_admin: true,
				nama: true,
				email: true,
				role: true,
				createdAt: true
			}
		});

		if (!admin) {
			return json({ error: 'Admin not found' }, { status: 404 });
		}

		return json(admin);
	} catch (error) {
		console.error('Error fetching admin:', error);
		return json({ error: 'Failed to fetch admin' }, { status: 500 });
	}
}

export async function PUT({ params, request }) {
	try {
		const data = await request.json();
		
		const updateData: any = {
			nama: data.nama,
			email: data.email,
			role: data.role
		};

		// Only update password if provided
		if (data.password) {
			updateData.password = await hashPassword(data.password);
		}

		const admin = await prisma.admin.update({
			where: { id_admin: parseInt(params.id) },
			data: updateData,
			select: {
				id_admin: true,
				nama: true,
				email: true,
				role: true,
				createdAt: true
			}
		});

		return json(admin);
	} catch (error) {
		console.error('Error updating admin:', error);
		return json({ error: 'Failed to update admin' }, { status: 500 });
	}
}

export async function DELETE({ params }) {
	try {
		// Don't allow deleting the last super admin
		const superAdminCount = await prisma.admin.count({
			where: { role: 'super_admin' }
		});

		const admin = await prisma.admin.findUnique({
			where: { id_admin: parseInt(params.id) }
		});

		if (admin?.role === 'super_admin' && superAdminCount <= 1) {
			return json({ error: 'Cannot delete the last super admin' }, { status: 400 });
		}

		await prisma.admin.delete({
			where: { id_admin: parseInt(params.id) }
		});

		return json({ message: 'Admin deleted successfully' });
	} catch (error) {
		console.error('Error deleting admin:', error);
		return json({ error: 'Failed to delete admin' }, { status: 500 });
	}
}
