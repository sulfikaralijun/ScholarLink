<script lang="ts">
	import { formatDate, isExpired } from '$lib/utils/date';
	import { Search, Building2, MapPin, Calendar, ExternalLink } from 'lucide-svelte';
	import { onMount } from 'svelte';

	type Beasiswa = {
		id_beasiswa: string;
		id_admin: number;
		judul: string;
		penyelenggara: string;
		lokasi: string;
		kategori: string;
		deadline: Date;
		tipe_pendanaan: string;
		deskripsi: string;
		link_pendaftaran: string;
		createdAt: Date;
		updatedAt: Date;
		admin: {
			nama: string;
			email: string;
		};
	};

	let beasiswaList: Beasiswa[] = $state([]);
	let loading = $state(true);
	let error = $state('');
	let searchQuery = $state('');
	let debouncedQuery = $state('');
	let filteredBeasiswa: Beasiswa[] = $state([]);

	// Simple filters
	let selectedKategori = $state('');
	let selectedTipePendanaan = $state('');
	let uniqueKategori: string[] = $state([]);
	let uniqueTipePendanaan: string[] = $state([]);

	async function loadBeasiswa() {
		loading = true;
		error = '';
		try {
			const response = await fetch('/api/v1/beasiswa');
			if (!response.ok) {
				throw new Error('Failed to fetch beasiswa');
			}
			const data = await response.json();
			
			// Hanya beasiswa yang belum lewat deadline
			beasiswaList = data.filter((beasiswa: Beasiswa) => new Date(beasiswa.deadline) >= new Date());
			// Derive filter options
			uniqueKategori = [...new Set(beasiswaList.map((b) => b.kategori).filter(Boolean))].sort();
			uniqueTipePendanaan = [...new Set(beasiswaList.map((b) => b.tipe_pendanaan).filter(Boolean))].sort();
		} catch (err) {
			console.error('Error loading beasiswa:', err);
			error = 'Gagal memuat data beasiswa. Silakan coba lagi.';
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		let filtered = [...beasiswaList];
		if (debouncedQuery) {
			const q = debouncedQuery.toLowerCase();
			filtered = filtered.filter((b) =>
				b.judul.toLowerCase().includes(q) ||
				b.penyelenggara.toLowerCase().includes(q) ||
				b.kategori.toLowerCase().includes(q)
			);
		}
		if (selectedKategori) {
			filtered = filtered.filter((b) => b.kategori === selectedKategori);
		}
		if (selectedTipePendanaan) {
			filtered = filtered.filter((b) => b.tipe_pendanaan === selectedTipePendanaan);
		}
		filteredBeasiswa = filtered;
	});

	// Debounce search input (300ms)
	$effect(() => {
		const q = searchQuery;
		const handle = setTimeout(() => {
			debouncedQuery = q;
		}, 300);
		return () => clearTimeout(handle);
	});

	

	onMount(() => {
		loadBeasiswa();
	});
</script>

<svelte:head>
	<title>Beasiswa - ScholarLink</title>
</svelte:head>

<section class="bg-primary/95 flex flex-col items-center gap-5 py-20 text-white">
	<h1 class="text-5xl font-bold">Daftar Beasiswa</h1>
	<p class="text-xl text-gray-200">
		Jelajahi berbagai peluang beasiswa untuk mewujudkan impian pendidikanmu
	</p>
</section>

<section>
	<div class="border-b border-gray-200 py-10">
		<div class="flex justify-center">
			<div class="relative min-w-3xl">
				<label class="input input-primary w-full">
					<Search />
					<input 
						type="text" 
						placeholder="Cari beasiswa, penyelenggara, atau kategori..." 
						bind:value={searchQuery}
						class="w-full"
					/>
				</label>
			</div>
		</div>

		<!-- Filters Bar -->
		<div class="mt-6 flex flex-wrap items-center gap-3 px-20">
			<div class="form-control">
				<select bind:value={selectedKategori} class="select select-bordered bg-white min-w-60">
					<option value="">Semua Kategori</option>
					{#each uniqueKategori as kategori}
						<option value={kategori}>{kategori}</option>
					{/each}
				</select>
			</div>
			<div class="form-control">
				<select bind:value={selectedTipePendanaan} class="select select-bordered bg-white min-w-60">
					<option value="">Semua Tipe Pendanaan</option>
					{#each uniqueTipePendanaan as tipe}
						<option value={tipe}>{tipe}</option>
					{/each}
				</select>
			</div>
			<button class="btn btn-ghost btn-sm" onclick={() => { selectedKategori=''; selectedTipePendanaan=''; searchQuery=''; }}>Bersihkan</button>
		</div>
	</div>
	<div class="px-20 py-10">
		<div class="flex items-center justify-between mb-4">
			<div>
				<h2>Menampilkan {filteredBeasiswa.length} beasiswa</h2>
				{#if searchQuery}
					<p class="text-sm text-gray-500 mt-1">
						Hasil pencarian untuk "<span class="font-medium text-primary">{searchQuery}</span>"
					</p>
				{/if}
			</div>
		</div>
		
		{#if loading}
			<!-- Loading Spinner -->
			<div class="py-20 flex justify-center">
				<span class="loading loading-spinner loading-lg text-primary"></span>
			</div>
		{:else if error}
			<!-- Error State -->
			<div class="text-center py-12">
				<Building2 size={48} class="mx-auto text-red-400 mb-4" />
				<h3 class="text-lg font-medium text-gray-900 mb-2">Terjadi Kesalahan</h3>
				<p class="text-gray-500 mb-4">{error}</p>
				<button 
					onclick={loadBeasiswa}
					class="btn btn-primary"
				>
					Coba Lagi
				</button>
			</div>
		{:else if filteredBeasiswa.length === 0}
			<!-- Empty State -->
			<div class="text-center py-12">
				<Building2 size={48} class="mx-auto text-gray-400 mb-4" />
				<h3 class="text-lg font-medium text-gray-900 mb-2">Tidak ada beasiswa ditemukan</h3>
				<p class="text-gray-500">
					{searchQuery ? 'Coba kata kunci lain untuk mencari beasiswa' : 'Belum ada beasiswa yang tersedia saat ini'}
				</p>
			</div>
		{:else}
			<!-- Data State -->
			<div class="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each filteredBeasiswa as beasiswa (beasiswa.id_beasiswa)}
					<div
						class="rounded-xl border border-gray-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-in">
						<!-- Header -->
						<div class="flex items-start justify-between gap-2">
							<h3 class="text-xl font-semibold">{beasiswa.judul}</h3>
							<span class="bg-secondary rounded-full px-2.5 py-0.5 text-xs shrink-0">
								{beasiswa.kategori || 'Umum'}
							</span>
						</div>

						<!-- Info List -->
						<ul class="space-y-2 border-b border-gray-300 py-4 text-sm text-gray-500">
							<li class="flex items-center gap-2">
								<Building2 size={18} /> 
								<span>{beasiswa.penyelenggara}</span>
							</li>
							{#if beasiswa.lokasi}
								<li class="flex items-center gap-2"><MapPin size={18} /> {beasiswa.lokasi}</li>
							{/if}
							<li class="flex items-center gap-2">
								<Calendar size={18} /> 
								<span class={isExpired(beasiswa.deadline) ? 'text-red-500' : ''}>
									Deadline: {formatDate(beasiswa.deadline)}
								</span>
							</li>
						</ul>

						<!-- Deskripsi -->
						<div class="border-b border-gray-300 pb-5">
							{#if beasiswa.tipe_pendanaan}
								<h4 class="text-primary mb-2 pt-3 text-sm font-semibold">
									{beasiswa.tipe_pendanaan}
								</h4>
							{/if}
							{#if beasiswa.deskripsi}
								<p class="text-sm text-gray-500">
									{beasiswa.deskripsi}
								</p>
							{/if}
						</div>

						<!-- Tombol -->
						<div class="pt-4">
							{#if beasiswa.link_pendaftaran}
								<a 
									href={beasiswa.link_pendaftaran} 
									target="_blank" 
									rel="noopener noreferrer"
									class="btn btn-primary flex w-full gap-4 rounded-xl"
								>
									<span>Apply Sekarang</span>
									<ExternalLink size={18} />
								</a>
							{:else}
								<button 
									class="btn btn-primary flex w-full gap-4 rounded-xl"
									disabled
								>
									<span>Link Pendaftaran Belum Tersedia</span>
								</button>
							{/if}
							<a href={`/beasiswa/${beasiswa.id_beasiswa}`} class="btn btn-outline w-full mt-3 rounded-xl">Lihat Detail</a>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.5s ease-out;
	}
</style>
