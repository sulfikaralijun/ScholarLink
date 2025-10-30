import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  try {
    const beasiswa = await prisma.beasiswa.findUnique({
      where: { id_beasiswa: id },
      include: {
        admin: { select: { nama: true, email: true } }
      }
    });

    if (!beasiswa) {
      throw error(404, 'Beasiswa tidak ditemukan');
    }

    return { beasiswa };
  } catch (e) {
    throw error(500, 'Gagal memuat detail beasiswa');
  }
};


