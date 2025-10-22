<script lang="ts">
	import { Search, Building2, MapPin, Calendar, ExternalLink, Loader2, Filter, SortAsc, SortDesc, X, History, Clock, TrendingUp } from 'lucide-svelte';
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
	let filteredBeasiswa: Beasiswa[] = $state([]);
	
	// Filter states
	let selectedKategori = $state('');
	let selectedTipePendanaan = $state('');
	let selectedDeadline = $state('');
	let showFilters = $state(false);
	
	// Sort states
	let sortBy = $state('deadline'); // 'deadline', 'judul', 'penyelenggara'
	let sortOrder = $state('asc'); // 'asc', 'desc'
	
	// Enhanced search states
	let showSearchSuggestions = $state(false);
	let searchHistory: string[] = $state([]);
	let popularSearches: string[] = $state([]);
	let searchSuggestions: string[] = $state([]);
	let isSearching = $state(false);

	async function loadBeasiswa() {
		loading = true;
		error = '';
		try {
			const response = await fetch('/api/v1/beasiswa');
			if (!response.ok) {
				throw new Error('Failed to fetch beasiswa');
			}
			const data = await response.json();
			// Filter only active scholarships (not expired)
			beasiswaList = data.filter((beasiswa: Beasiswa) => 
				new Date(beasiswa.deadline) >= new Date()
			);
		} catch (err) {
			console.error('Error loading beasiswa:', err);
			error = 'Gagal memuat data beasiswa. Silakan coba lagi.';
		} finally {
			loading = false;
		}
	}

	// Get unique values for filter options
	let uniqueKategori: string[] = $state([]);
	let uniqueTipePendanaan: string[] = $state([]);
	
	$effect(() => {
		const kategoris = [...new Set(beasiswaList.map(b => b.kategori).filter(k => k))];
		uniqueKategori = kategoris.sort();
		
		const tipePendanaans = [...new Set(beasiswaList.map(b => b.tipe_pendanaan).filter(t => t))];
		uniqueTipePendanaan = tipePendanaans.sort();
	});

	// Enhanced search functionality
	function generateSearchSuggestions(query: string) {
		if (!query || query.length < 2) {
			searchSuggestions = [];
			return;
		}

		const suggestions = new Set<string>();
		
		// Add matching titles
		beasiswaList.forEach(beasiswa => {
			if (beasiswa.judul.toLowerCase().includes(query.toLowerCase())) {
				suggestions.add(beasiswa.judul);
			}
		});
		
		// Add matching organizers
		beasiswaList.forEach(beasiswa => {
			if (beasiswa.penyelenggara.toLowerCase().includes(query.toLowerCase())) {
				suggestions.add(beasiswa.penyelenggara);
			}
		});
		
		// Add matching categories
		beasiswaList.forEach(beasiswa => {
			if (beasiswa.kategori.toLowerCase().includes(query.toLowerCase())) {
				suggestions.add(beasiswa.kategori);
			}
		});
		
		// Add matching funding types
		beasiswaList.forEach(beasiswa => {
			if (beasiswa.tipe_pendanaan.toLowerCase().includes(query.toLowerCase())) {
				suggestions.add(beasiswa.tipe_pendanaan);
			}
		});
		
		searchSuggestions = Array.from(suggestions).slice(0, 5);
	}

	function handleSearchInput(event: Event) {
		const target = event.target as HTMLInputElement;
		searchQuery = target.value;
		showSearchSuggestions = searchQuery.length > 0;
		generateSearchSuggestions(searchQuery);
	}

	function selectSuggestion(suggestion: string) {
		searchQuery = suggestion;
		showSearchSuggestions = false;
		addToSearchHistory(suggestion);
	}

	function addToSearchHistory(query: string) {
		if (!query.trim()) return;
		
		// Remove if already exists
		searchHistory = searchHistory.filter(item => item !== query);
		// Add to beginning
		searchHistory = [query, ...searchHistory].slice(0, 5);
		
		// Save to localStorage
		localStorage.setItem('beasiswa-search-history', JSON.stringify(searchHistory));
	}

	function clearSearchHistory() {
		searchHistory = [];
		localStorage.removeItem('beasiswa-search-history');
	}

	function handleSearchFocus() {
		showSearchSuggestions = true;
	}

	function handleSearchBlur() {
		// Delay hiding to allow clicking on suggestions
		setTimeout(() => {
			showSearchSuggestions = false;
		}, 200);
	}

	// Initialize popular searches and search history
	$effect(() => {
		// Popular searches based on common terms
		popularSearches = [
			'Beasiswa S1',
			'Beasiswa S2', 
			'Full Funding',
			'Kemendikbud',
			'Beasiswa Luar Negeri'
		];
		
		// Load search history from localStorage
		const savedHistory = localStorage.getItem('beasiswa-search-history');
		if (savedHistory) {
			try {
				searchHistory = JSON.parse(savedHistory);
			} catch (e) {
				searchHistory = [];
			}
		}
	});

	// Apply filters and sorting
	$effect(() => {
		let filtered = [...beasiswaList];
		
		// Apply search filter
		if (searchQuery) {
			filtered = filtered.filter((beasiswa: Beasiswa) => 
				beasiswa.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
				beasiswa.penyelenggara.toLowerCase().includes(searchQuery.toLowerCase()) ||
				beasiswa.kategori.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}
		
		// Apply category filter
		if (selectedKategori) {
			filtered = filtered.filter(beasiswa => beasiswa.kategori === selectedKategori);
		}
		
		// Apply funding type filter
		if (selectedTipePendanaan) {
			filtered = filtered.filter(beasiswa => beasiswa.tipe_pendanaan === selectedTipePendanaan);
		}
		
		// Apply deadline filter
		if (selectedDeadline) {
			const now = new Date();
			const filterDate = new Date();
			
			switch (selectedDeadline) {
				case 'week':
					filterDate.setDate(now.getDate() + 7);
					break;
				case 'month':
					filterDate.setMonth(now.getMonth() + 1);
					break;
				case '3months':
					filterDate.setMonth(now.getMonth() + 3);
					break;
			}
			
			filtered = filtered.filter(beasiswa => {
				const deadline = new Date(beasiswa.deadline);
				return deadline <= filterDate;
			});
		}
		
		// Apply sorting
		filtered.sort((a, b) => {
			let comparison = 0;
			
			switch (sortBy) {
				case 'deadline':
					comparison = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
					break;
				case 'judul':
					comparison = a.judul.localeCompare(b.judul);
					break;
				case 'penyelenggara':
					comparison = a.penyelenggara.localeCompare(b.penyelenggara);
					break;
			}
			
			return sortOrder === 'asc' ? comparison : -comparison;
		});
		
		filteredBeasiswa = filtered;
	});

	function formatDate(date: Date) {
		return new Date(date).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	function isExpired(deadline: Date) {
		return new Date(deadline) < new Date();
	}

	// Filter and sort helper functions
	function clearFilters() {
		selectedKategori = '';
		selectedTipePendanaan = '';
		selectedDeadline = '';
		searchQuery = '';
	}

	function toggleSort(field: string) {
		if (sortBy === field) {
			sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = field;
			sortOrder = 'asc';
		}
	}

	function getSortIcon(field: string) {
		if (sortBy !== field) return null;
		return sortOrder === 'asc' ? SortAsc : SortDesc;
	}

	function getActiveFiltersCount() {
		let count = 0;
		if (selectedKategori) count++;
		if (selectedTipePendanaan) count++;
		if (selectedDeadline) count++;
		if (searchQuery) count++;
		return count;
	}

	// Search result highlighting
	function highlightSearchTerm(text: string, query: string) {
		if (!query || query.length < 2) return text;
		
		const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
		return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
	}

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
		<!-- Enhanced Search Bar -->
		<div class="flex justify-center mb-6 relative">
			<div class="relative min-w-3xl">
				<label class="input input-primary w-full">
					<Search />
					<input 
						type="text" 
						placeholder="Cari beasiswa, penyelenggara, atau kategori..." 
						value={searchQuery}
						oninput={handleSearchInput}
						onfocus={handleSearchFocus}
						onblur={handleSearchBlur}
						class="w-full"
					/>
					{#if searchQuery}
						<button 
							onclick={() => { searchQuery = ''; showSearchSuggestions = false; }}
							class="btn btn-ghost btn-sm"
						>
							<X size={16} />
						</button>
					{/if}
				</label>
				
				<!-- Search Suggestions Dropdown -->
				{#if showSearchSuggestions}
					<div class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
						{#if searchSuggestions.length > 0}
							<!-- Search Suggestions -->
							<div class="p-2">
								<div class="text-xs font-medium text-gray-500 px-3 py-2">Saran Pencarian</div>
								{#each searchSuggestions as suggestion}
									<button 
										onclick={() => selectSuggestion(suggestion)}
										class="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2"
									>
										<Search size={14} class="text-gray-400" />
										<span>{suggestion}</span>
									</button>
								{/each}
							</div>
						{:else if searchHistory.length > 0}
							<!-- Search History -->
							<div class="p-2">
								<div class="flex items-center justify-between px-3 py-2">
									<div class="text-xs font-medium text-gray-500 flex items-center gap-1">
										<History size={14} />
										Riwayat Pencarian
									</div>
									<button 
										onclick={clearSearchHistory}
										class="text-xs text-gray-400 hover:text-gray-600"
									>
										Hapus
									</button>
								</div>
								{#each searchHistory as history}
									<button 
										onclick={() => selectSuggestion(history)}
										class="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2"
									>
										<Clock size={14} class="text-gray-400" />
										<span>{history}</span>
									</button>
								{/each}
							</div>
						{:else}
							<!-- Popular Searches -->
							<div class="p-2">
								<div class="text-xs font-medium text-gray-500 px-3 py-2 flex items-center gap-1">
									<TrendingUp size={14} />
									Pencarian Populer
								</div>
								{#each popularSearches as popular}
									<button 
										onclick={() => selectSuggestion(popular)}
										class="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2"
									>
										<TrendingUp size={14} class="text-gray-400" />
										<span>{popular}</span>
									</button>
								{/each}
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
		
		<!-- Filter and Sort Controls -->
		<div class="flex flex-wrap items-center justify-between gap-4 px-20">
			<!-- Filter Toggle -->
			<div class="flex items-center gap-4">
				<button 
					onclick={() => showFilters = !showFilters}
					class="btn btn-outline btn-sm flex items-center gap-2"
				>
					<Filter size={16} />
					Filter
					{#if getActiveFiltersCount() > 0}
						<span class="badge badge-primary badge-sm">{getActiveFiltersCount()}</span>
					{/if}
				</button>
				
				{#if getActiveFiltersCount() > 0}
					<button 
						onclick={clearFilters}
						class="btn btn-ghost btn-sm flex items-center gap-2"
					>
						<X size={16} />
						Hapus Filter
					</button>
				{/if}
			</div>
			
			<!-- Sort Options -->
			<div class="flex items-center gap-2">
				<span class="text-sm text-gray-600">Urutkan:</span>
				<div class="flex gap-1">
					<button 
						onclick={() => toggleSort('deadline')}
						class="btn btn-sm {sortBy === 'deadline' ? 'btn-primary' : 'btn-outline'}"
					>
						Deadline
						{#if getSortIcon('deadline')}
							{@const SortIcon = getSortIcon('deadline')}
							<SortIcon size={14} />
						{/if}
					</button>
					<button 
						onclick={() => toggleSort('judul')}
						class="btn btn-sm {sortBy === 'judul' ? 'btn-primary' : 'btn-outline'}"
					>
						Judul
						{#if getSortIcon('judul')}
							{@const SortIcon = getSortIcon('judul')}
							<SortIcon size={14} />
						{/if}
					</button>
					<button 
						onclick={() => toggleSort('penyelenggara')}
						class="btn btn-sm {sortBy === 'penyelenggara' ? 'btn-primary' : 'btn-outline'}"
					>
						Organizer
						{#if getSortIcon('penyelenggara')}
							{@const SortIcon = getSortIcon('penyelenggara')}
							<SortIcon size={14} />
						{/if}
					</button>
				</div>
			</div>
		</div>
		
		<!-- Filter Panel -->
		{#if showFilters}
			<div class="mt-6 px-20">
				<div class="bg-gray-50 rounded-lg p-6">
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<!-- Category Filter -->
						<div class="form-control">
							<label for="kategori-filter" class="label">
								<span class="label-text font-medium">Kategori</span>
							</label>
							<select 
								id="kategori-filter"
								bind:value={selectedKategori}
								class="select select-bordered bg-white"
							>
								<option value="">Semua Kategori</option>
								{#each uniqueKategori as kategori}
									<option value={kategori}>{kategori}</option>
								{/each}
							</select>
						</div>
						
						<!-- Funding Type Filter -->
						<div class="form-control">
							<label for="tipe-pendanaan-filter" class="label">
								<span class="label-text font-medium">Tipe Pendanaan</span>
							</label>
							<select 
								id="tipe-pendanaan-filter"
								bind:value={selectedTipePendanaan}
								class="select select-bordered bg-white"
							>
								<option value="">Semua Tipe</option>
								{#each uniqueTipePendanaan as tipe}
									<option value={tipe}>{tipe}</option>
								{/each}
							</select>
						</div>
						
						<!-- Deadline Filter -->
						<div class="form-control">
							<label for="deadline-filter" class="label">
								<span class="label-text font-medium">Deadline</span>
							</label>
							<select 
								id="deadline-filter"
								bind:value={selectedDeadline}
								class="select select-bordered bg-white"
							>
								<option value="">Semua Deadline</option>
								<option value="week">1 Minggu</option>
								<option value="month">1 Bulan</option>
								<option value="3months">3 Bulan</option>
							</select>
						</div>
					</div>
				</div>
			</div>
		{/if}
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
			
			{#if searchQuery && filteredBeasiswa.length > 0}
				<div class="flex items-center gap-2 text-sm text-gray-500">
					<Search size={16} />
					<span>Ditemukan {filteredBeasiswa.length} hasil</span>
				</div>
			{/if}
		</div>
		
		{#if loading}
			<!-- Loading State -->
			<div class="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each Array(6) as _, i}
					<div class="rounded-xl border border-gray-200 bg-white p-6 animate-pulse">
						<!-- Header Skeleton -->
						<div class="flex items-start justify-between gap-2 mb-4">
							<div class="h-6 bg-gray-200 rounded w-3/4"></div>
							<div class="h-5 bg-gray-200 rounded-full w-16"></div>
						</div>

						<!-- Info List Skeleton -->
						<div class="space-y-2 border-b border-gray-300 py-4">
							<div class="flex items-center gap-2">
								<div class="h-4 w-4 bg-gray-200 rounded"></div>
								<div class="h-4 bg-gray-200 rounded w-2/3"></div>
							</div>
							<div class="flex items-center gap-2">
								<div class="h-4 w-4 bg-gray-200 rounded"></div>
								<div class="h-4 bg-gray-200 rounded w-1/2"></div>
							</div>
							<div class="flex items-center gap-2">
								<div class="h-4 w-4 bg-gray-200 rounded"></div>
								<div class="h-4 bg-gray-200 rounded w-1/3"></div>
							</div>
						</div>

						<!-- Description Skeleton -->
						<div class="border-b border-gray-300 pb-5 pt-3">
							<div class="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
							<div class="space-y-2">
								<div class="h-3 bg-gray-200 rounded w-full"></div>
								<div class="h-3 bg-gray-200 rounded w-4/5"></div>
								<div class="h-3 bg-gray-200 rounded w-3/5"></div>
							</div>
						</div>

						<!-- Button Skeleton -->
						<div class="pt-4">
							<div class="h-10 bg-gray-200 rounded-xl w-full"></div>
						</div>
					</div>
				{/each}
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
							<h3 class="text-xl font-semibold">
								{@html highlightSearchTerm(beasiswa.judul, searchQuery)}
							</h3>
							<span class="bg-secondary rounded-full px-2.5 py-0.5 text-xs shrink-0">
								{beasiswa.kategori || 'Umum'}
							</span>
						</div>

						<!-- Info List -->
						<ul class="space-y-2 border-b border-gray-300 py-4 text-sm text-gray-500">
							<li class="flex items-center gap-2">
								<Building2 size={18} /> 
								<span>{@html highlightSearchTerm(beasiswa.penyelenggara, searchQuery)}</span>
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
									{@html highlightSearchTerm(beasiswa.tipe_pendanaan, searchQuery)}
								</h4>
							{/if}
							{#if beasiswa.deskripsi}
								<p class="text-sm text-gray-500">
									{@html highlightSearchTerm(beasiswa.deskripsi, searchQuery)}
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
