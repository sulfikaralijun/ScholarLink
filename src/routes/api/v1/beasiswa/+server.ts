import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { sendEmail, renderNewBeasiswaAnnouncement } from '$lib/server/email/resend';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { requireAuth } from '$lib/server/auth';
import { trimObject, isNonEmpty, parseIsoDate, isURL, maxLength } from '$lib/server/validation';

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


export async function POST(event) {
  const { request, url } = event as any;
  const user = requireAuth(event as any);
	try {
    const dataRaw = await request.json();
    const data = trimObject(dataRaw);
		
		// Validate required fields
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

    const beasiswa = await prisma.beasiswa.create({
			data: {
				judul: data.judul,
				penyelenggara: data.penyelenggara,
				lokasi: data.lokasi || '',
				kategori: data.kategori || '',
        deadline: deadlineDate,
				tipe_pendanaan: data.tipe_pendanaan || '',
				deskripsi: data.deskripsi || '',
				link_pendaftaran: data.link_pendaftaran || '',
        id_admin: user.id
      }
		});

    // Broadcast ke seluruh subscribers
    ;(async () => {
      try {
        const subscribers = await prisma.subscription.findMany({ select: { email_user: true } });
        const toList = subscribers.map((s) => s.email_user);
        if (toList.length === 0) return;

        const baseItem = {
          judul: beasiswa.judul,
          penyelenggara: beasiswa.penyelenggara,
          kategori: beasiswa.kategori,
          deadline: beasiswa.deadline?.toISOString?.(),
          link_detail: `${url.origin}/beasiswa/${beasiswa.id_beasiswa}`,
          deskripsi: beasiswa.deskripsi
        } as const;

        // Kirim satu-per-penerima (agar bisa menyertakan unsubscribe token personal)
        for (const email of toList) {
          const token = jwt.sign({ email, action: 'unsubscribe' }, JWT_SECRET as string, { expiresIn: '90d' });
          const unsubscribeUrl = `${url.origin}/api/v1/subscriptions/unsubscribe?token=${encodeURIComponent(token)}`;
          const html = renderNewBeasiswaAnnouncement(baseItem, unsubscribeUrl);
          await sendEmail({ to: email, subject: `Beasiswa Baru: ${beasiswa.judul}`, html });
        }
      } catch (e) {
        console.error('Broadcast beasiswa failed:', e);
      }
    })();

    return json(beasiswa, { status: 201 });
	} catch (error) {
		console.error('Error creating beasiswa:', error);
		return json({ error: 'Failed to create beasiswa' }, { status: 500 });
	}
}
