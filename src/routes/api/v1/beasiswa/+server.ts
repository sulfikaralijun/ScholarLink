import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export async function GET() {
	try {
		const beasiswa = await prisma.beasiswa.findMany({
			orderBy: { createdAt: 'desc' },
			include: {
				admin: {
					select: {
						nama: true,
						email: true
					}
				}
			}
		});
		return json(beasiswa);
	} catch (error) {
		console.error('Error fetching beasiswa:', error);
		return json({ error: 'Failed to fetch beasiswa' }, { status: 500 });
	}
}

export async function POST({ request }) {
	try {
		const data = await request.json();
		
		// Validate required fields
		if (!data.judul || !data.penyelenggara || !data.deadline) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		const beasiswa = await prisma.beasiswa.create({
			data: {
				judul: data.judul,
				penyelenggara: data.penyelenggara,
				lokasi: data.lokasi || '',
				kategori: data.kategori || '',
				deadline: new Date(data.deadline),
				tipe_pendanaan: data.tipe_pendanaan || '',
				deskripsi: data.deskripsi || '',
				link_pendaftaran: data.link_pendaftaran || '',
				id_admin: data.id_admin || 1 // TODO: Get from session
			}
		});

		return json(beasiswa, { status: 201 });
	} catch (error) {
		console.error('Error creating beasiswa:', error);
		return json({ error: 'Failed to create beasiswa' }, { status: 500 });
	}
}
