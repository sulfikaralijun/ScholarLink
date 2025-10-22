import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { verifyToken } from "$lib/server/utils/jwt";

export const load: PageServerLoad = async ({ cookies}) => {
    const token = cookies.get('token');
    if (!token) {
        throw redirect(303, '/login');
    }
    const payload = verifyToken(token);
    if (!payload) {
        throw redirect(303, '/login');
    }

    if (payload.role !== 'super_admin') {
        throw redirect(303, '/dashboard');
    }
}