import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { requireAuth } from '$lib/server/auth';
import { trimObject, isNonEmpty, parseIsoDate, isURL, maxLength } from '$lib/server/validation';

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

export async function PUT(event) {
    const { params, request } = event as any;
    requireAuth(event as any);
	try {
        const raw = await request.json();
        const data = trimObject(raw);

        if (!isNonEmpty(data.judul) || !isNonEmpty(data.penyelenggara) || !isNonEmpty(data.deadline)) {
            return json({ error: 'Missing required fields' }, { status: 400 });
        }
        if (!maxLength(data.judul, 200)) {
            return json({ error: 'Judul terlalu panjang (maks 200)' }, { status: 400 });
        }
        if (data.link_pendaftaran && !isURL(data.link_pendaftaran)) {
            return json({ error: 'Link pendaftaran harus URL yang valid' }, { status: 400 });
        }
        const deadlineDate = parseIsoDate(data.deadline);
        if (!deadlineDate) {
            return json({ error: 'Deadline tidak valid' }, { status: 400 });
        }
		
		const beasiswa = await prisma.beasiswa.update({
			where: { id_beasiswa: params.id },
			data: {
				judul: data.judul,
				penyelenggara: data.penyelenggara,
				lokasi: data.lokasi,
				kategori: data.kategori,
                deadline: deadlineDate,
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

export async function DELETE(event) {
    const { params } = event as any;
    requireAuth(event as any);
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
