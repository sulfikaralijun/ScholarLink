import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export async function GET({ params }) {
	try {
		const beasiswa = await prisma.beasiswa.findUnique({
			where: { id_beasiswa: params.id },
			include: {
				admin: {
					select: {
						nama: true,
						email: true
					}
				}
			}
		});

		if (!beasiswa) {
			return json({ error: 'Beasiswa not found' }, { status: 404 });
		}

		return json(beasiswa);
	} catch (error) {
		console.error('Error fetching beasiswa:', error);
		return json({ error: 'Failed to fetch beasiswa' }, { status: 500 });
	}
}

export async function PUT({ params, request }) {
	try {
		const data = await request.json();
		
		const beasiswa = await prisma.beasiswa.update({
			where: { id_beasiswa: params.id },
			data: {
				judul: data.judul,
				penyelenggara: data.penyelenggara,
				lokasi: data.lokasi,
				kategori: data.kategori,
				deadline: new Date(data.deadline),
				tipe_pendanaan: data.tipe_pendanaan,
				deskripsi: data.deskripsi,
				link_pendaftaran: data.link_pendaftaran
			}
		});

		return json(beasiswa);
	} catch (error) {
		console.error('Error updating beasiswa:', error);
		return json({ error: 'Failed to update beasiswa' }, { status: 500 });
	}
}

export async function DELETE({ params }) {
	try {
		await prisma.beasiswa.delete({
			where: { id_beasiswa: params.id }
		});

		return json({ message: 'Beasiswa deleted successfully' });
	} catch (error) {
		console.error('Error deleting beasiswa:', error);
		return json({ error: 'Failed to delete beasiswa' }, { status: 500 });
	}
}
