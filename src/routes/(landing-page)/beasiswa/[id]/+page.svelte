<script lang="ts">
	import { formatDate, isExpired } from '$lib/utils/date';
	import type { PageData } from './$types';
	import { Calendar, Building2, MapPin, ExternalLink, ArrowLeft } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();
	const beasiswa = data.beasiswa as any;
</script>

<svelte:head>
	<title>{beasiswa.judul} - ScholarLink</title>
</svelte:head>

<section class="bg-primary/95 flex flex-col items-center gap-5 py-14 text-white">
	<div class="px-4 text-center">
		<h1 class="text-4xl font-bold">{beasiswa.judul}</h1>
		<p class="mt-2 text-gray-200">{beasiswa.kategori || 'Umum'}</p>
	</div>
</section>

<section class="px-20 py-10">
	<div class="mx-auto max-w-4xl">
		<a href="/beasiswa" class="btn btn-ghost btn-sm mb-4">
			<ArrowLeft size={16} />
			Kembali
		</a>

		<div class="rounded-2xl border border-gray-200 bg-white p-8 shadow">
			<!-- Info ringkas -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-200 pb-6">
				<div class="flex items-center gap-2 text-sm text-gray-600">
					<Building2 size={18} />
					<span>{beasiswa.penyelenggara}</span>
				</div>
				{#if beasiswa.lokasi}
					<div class="flex items-center gap-2 text-sm text-gray-600">
						<MapPin size={18} />
						<span>{beasiswa.lokasi}</span>
					</div>
				{/if}
				<div class="flex items-center gap-2 text-sm text-gray-600">
					<Calendar size={18} />
					<span class={isExpired(beasiswa.deadline) ? 'text-red-500' : ''}>Deadline: {formatDate(beasiswa.deadline)}</span>
				</div>
			</div>

			<!-- Deskripsi lengkap -->
			<div class="prose max-w-none py-6">
				{#if beasiswa.tipe_pendanaan}
					<h3 class="text-primary text-lg font-semibold">{beasiswa.tipe_pendanaan}</h3>
				{/if}
				{#if beasiswa.deskripsi}
					<p class="text-gray-700 whitespace-pre-line">{beasiswa.deskripsi}</p>
				{:else}
					<p class="text-gray-500">Deskripsi belum tersedia.</p>
				{/if}
			</div>

			<!-- Tombol aksi -->
			<div class="flex flex-col gap-3 pt-2">
				{#if beasiswa.link_pendaftaran}
					<a href={beasiswa.link_pendaftaran} target="_blank" rel="noopener noreferrer" class="btn btn-primary w-full">
						Apply Sekarang
						<ExternalLink size={18} />
					</a>
				{:else}
					<button class="btn btn-primary w-full" disabled>Link Pendaftaran Belum Tersedia</button>
				{/if}
			</div>

			<!-- Meta admin -->
			<div class="mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
				<p>Diposting oleh: <span class="font-medium">{beasiswa.admin?.nama}</span> ({beasiswa.admin?.email})</p>
			</div>
		</div>
	</div>
</section>


