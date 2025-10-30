<script lang="ts">
	import { Mail } from 'lucide-svelte';

	let email: string = $state('');
	let loading: boolean = $state(false);
	let success: boolean = $state(false);
	let errorMsg: string = $state('');

	function isValidEmail(value: string) {
		return /[^@\s]+@[^@\s]+\.[^@\s]+/.test(value);
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		success = false;
		errorMsg = '';

		if (!email || !isValidEmail(email)) {
			errorMsg = 'Masukkan email yang valid';
			return;
		}

		loading = true;
		try {
			const res = await fetch('/api/v1/subscriptions', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email_user: email })
			});

			const data = await res.json();
			if (!res.ok) {
				// Pesan khusus dari server (duplicate, dll)
				errorMsg = data?.error || 'Gagal mendaftar. Coba lagi.';
				return;
			}

			success = true;
			email = '';
		} catch (e) {
			errorMsg = 'Terjadi kesalahan jaringan. Coba lagi.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Daftar Subscription - ScholarLink</title>
</svelte:head>

<section class="bg-primary/95 flex flex-col items-center gap-5 py-20 text-white">
	<h1 class="text-5xl font-bold">Berlangganan Informasi Beasiswa</h1>
	<p class="text-xl text-gray-200">
		Dapatkan update beasiswa terbaru langsung ke email Anda
	</p>
</section>

<section class="px-20 py-12">
	<div class="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 shadow">
		<h2 class="mb-2 text-2xl font-semibold">Daftar Newsletter</h2>
		<p class="mb-6 text-gray-500">Masukkan email aktif untuk mendapatkan notifikasi peluang beasiswa.</p>

		{#if success}
			<div class="alert alert-success mb-6">
				<Mail />
				<span>Pendaftaran berhasil! Silakan cek email Anda untuk informasi selanjutnya.</span>
			</div>
		{/if}

		{#if errorMsg}
			<div class="alert alert-error mb-6">
				<span>{errorMsg}</span>
			</div>
		{/if}

		<form onsubmit={handleSubmit} class="space-y-4">
			<label class="input input-bordered w-full">
				<Mail />
				<input
					type="email"
					placeholder="Alamat email Anda"
					bind:value={email}
					autocomplete="email"
					class="w-full"
				/>
			</label>
			<div class="flex items-center justify-between">
				<p class="text-xs text-gray-500">Kami tidak akan membagikan email Anda ke pihak lain.</p>
				<button
					type="submit"
					class="btn btn-primary"
					disabled={loading || !email || !isValidEmail(email)}
				>
					{#if loading}
						<span class="loading loading-spinner loading-sm"></span>
						<span>Mendaftar...</span>
					{:else}
						<span>Daftar</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</section>


