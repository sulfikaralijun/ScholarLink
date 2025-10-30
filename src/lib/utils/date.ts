export function formatDate(date: Date) {
		return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
	}

export function isExpired(deadline: Date) {
		return new Date(deadline) < new Date();
	}