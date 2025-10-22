<script lang="ts">
	import type { PageProps } from "./$types";
	import { BookOpen } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let {data}: PageProps = $props();
	
	// Type assertion untuk admin data
	const admin = (data as any)?.admin || {};
	let beasiswaList = $state<any[]>([]);
	let loading = $state(false);
	let showBeasiswaForm = $state(false);
	let formData = $state({
		judul: '',
		penyelenggara: '',
		lokasi: '',
		kategori: '',
		deadline: '',
		tipe_pendanaan: '',
		deskripsi: '',
		link_pendaftaran: ''
	});
	let formLoading = $state(false);
	let formError = $state('');

	async function loadBeasiswa() {
		loading = true;
		try {
			const response = await fetch('/api/v1/beasiswa');
			const data = await response.json();
			beasiswaList = data;
		} catch (error) {
			console.error('Error loading beasiswa:', error);
		} finally {
			loading = false;
		}
	}

	async function submitBeasiswaForm() {
		formLoading = true;
		formError = '';
		
		try {
			// Validate required fields
			if (!formData.judul || !formData.penyelenggara || !formData.deadline) {
				formError = 'Judul, Penyelenggara, dan Deadline harus diisi';
				return;
			}

			const response = await fetch('/api/v1/beasiswa', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				// Reset form
				formData = {
					judul: '',
					penyelenggara: '',
					lokasi: '',
					kategori: '',
					deadline: '',
					tipe_pendanaan: '',
					deskripsi: '',
					link_pendaftaran: ''
				};
				showBeasiswaForm = false;
				
				// Reload beasiswa list
				await loadBeasiswa();
			} else {
				const errorData = await response.json();
				formError = errorData.error || 'Terjadi kesalahan saat menyimpan beasiswa';
			}
		} catch (error) {
			console.error('Error submitting beasiswa:', error);
			formError = 'Terjadi kesalahan saat menyimpan beasiswa';
		} finally {
			formLoading = false;
		}
	}

	function openBeasiswaForm() {
		showBeasiswaForm = true;
		formError = '';
	}

	function closeBeasiswaForm() {
		showBeasiswaForm = false;
		formError = '';
		// Reset form
		formData = {
			judul: '',
			penyelenggara: '',
			lokasi: '',
			kategori: '',
			deadline: '',
			tipe_pendanaan: '',
			deskripsi: '',
			link_pendaftaran: ''
		};
	}

	onMount(() => {
		loadBeasiswa();
	});
</script>

<svelte:head>
	<title>Beasiswa Management - ScholarLink Dashboard</title>
</svelte:head>

<!-- Beasiswa Management Content -->
<div class="space-y-6">
	<div class="flex justify-between items-center">
		<h2 class="text-2xl font-bold text-gray-900">Kelola Beasiswa</h2>
		<button onclick={openBeasiswaForm} class="btn btn-primary">
			<BookOpen size={16} class="mr-2" />
			Tambah Beasiswa
		</button>
	</div>

	<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
		{#if loading}
			<div class="p-8 text-center">
				<div class="loading loading-spinner loading-lg text-primary"></div>
				<p class="mt-2 text-gray-500">Memuat data beasiswa...</p>
			</div>
		{:else if beasiswaList.length === 0}
			<div class="p-8 text-center">
				<BookOpen size={48} class="mx-auto text-gray-400 mb-4" />
				<h3 class="text-lg font-medium text-gray-900 mb-2">Belum ada beasiswa</h3>
				<p class="text-gray-500 mb-4">Mulai dengan menambahkan beasiswa pertama Anda</p>
				<button onclick={openBeasiswaForm} class="btn btn-primary">Tambah Beasiswa</button>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Penyelenggara</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deadline</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						{#each beasiswaList as beasiswa}
							<tr class="hover:bg-gray-50">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm font-medium text-gray-900">{beasiswa.judul}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-900">{beasiswa.penyelenggara}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-900">
										{new Date(beasiswa.deadline).toLocaleDateString('id-ID')}
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full
										{new Date(beasiswa.deadline) > new Date() 
											? 'bg-green-100 text-green-800' 
											: 'bg-red-100 text-red-800'}"
									>
										{new Date(beasiswa.deadline) > new Date() ? 'Aktif' : 'Expired'}
									</span>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
									<button class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
									<button class="text-red-600 hover:text-red-900">Delete</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>

<!-- Beasiswa Form Modal -->
{#if showBeasiswaForm}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
			<div class="p-6 border-b border-gray-200">
				<div class="flex justify-between items-center">
					<h3 class="text-xl font-semibold text-gray-900">Tambah Beasiswa Baru</h3>
					<button onclick={closeBeasiswaForm} class="btn btn-ghost btn-sm" aria-label="Tutup modal">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</button>
				</div>
			</div>

			<form onsubmit={(e) => { e.preventDefault(); submitBeasiswaForm(); }} class="p-6 space-y-6">
				{#if formError}
					<div class="alert alert-error">
						<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
						<span>{formError}</span>
					</div>
				{/if}

				<!-- Judul -->
				<div class="form-control">
					<label for="judul" class="label">
						<span class="label-text font-medium">Judul Beasiswa *</span>
					</label>
					<input
						id="judul"
						type="text"
						bind:value={formData.judul}
						placeholder="Masukkan judul beasiswa"
						class="input input-bordered w-full"
						required
					/>
				</div>

				<!-- Penyelenggara -->
				<div class="form-control">
					<label for="penyelenggara" class="label">
						<span class="label-text font-medium">Penyelenggara *</span>
					</label>
					<input
						id="penyelenggara"
						type="text"
						bind:value={formData.penyelenggara}
						placeholder="Masukkan nama penyelenggara"
						class="input input-bordered w-full"
						required
					/>
				</div>

				<!-- Lokasi dan Kategori -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div class="form-control">
						<label for="lokasi" class="label">
							<span class="label-text font-medium">Lokasi</span>
						</label>
						<input
							id="lokasi"
							type="text"
							bind:value={formData.lokasi}
							placeholder="Contoh: Jakarta, Indonesia"
							class="input input-bordered w-full"
						/>
					</div>

					<div class="form-control">
						<label for="kategori" class="label">
							<span class="label-text font-medium">Kategori</span>
						</label>
						<select id="kategori" bind:value={formData.kategori} class="select select-bordered w-full bg-white">
							<option value="">Pilih Kategori</option>
							<option value="S1">S1</option>
							<option value="S2">S2</option>
							<option value="S3">S3</option>
							<option value="D3">D3</option>
							<option value="D4">D4</option>
							<option value="Umum">Umum</option>
						</select>
					</div>
				</div>

				<!-- Deadline dan Tipe Pendanaan -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div class="form-control">
						<label for="deadline" class="label">
							<span class="label-text font-medium">Deadline *</span>
						</label>
						<input
							id="deadline"
							type="datetime-local"
							bind:value={formData.deadline}
							class="input input-bordered w-full"
							required
						/>
					</div>

					<div class="form-control">
						<label for="tipe_pendanaan" class="label">
							<span class="label-text font-medium">Tipe Pendanaan</span>
						</label>
						<select id="tipe_pendanaan" bind:value={formData.tipe_pendanaan} class="select select-bordered w-full bg-white">
							<option value="">Pilih Tipe Pendanaan</option>
							<option value="Full Funding">Full Funding</option>
							<option value="Partial Funding">Partial Funding</option>
							<option value="Tuition Waiver">Tuition Waiver</option>
							<option value="Living Allowance">Living Allowance</option>
						</select>
					</div>
				</div>

				<!-- Deskripsi -->
				<div class="form-control">
					<label for="deskripsi" class="label">
						<span class="label-text font-medium">Deskripsi</span>
					</label>
					<textarea
						id="deskripsi"
						bind:value={formData.deskripsi}
						placeholder="Masukkan deskripsi beasiswa"
						class="textarea textarea-bordered w-full h-24"
						rows="4"
					></textarea>
				</div>

				<!-- Link Pendaftaran -->
				<div class="form-control">
					<label for="link_pendaftaran" class="label">
						<span class="label-text font-medium">Link Pendaftaran</span>
					</label>
					<input
						id="link_pendaftaran"
						type="url"
						bind:value={formData.link_pendaftaran}
						placeholder="https://example.com/daftar"
						class="input input-bordered w-full"
					/>
				</div>

				<!-- Form Actions -->
				<div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
					<button
						type="button"
						onclick={closeBeasiswaForm}
						class="btn btn-ghost"
						disabled={formLoading}
					>
						Batal
					</button>
					<button
						type="submit"
						class="btn btn-primary"
						disabled={formLoading}
					>
						{#if formLoading}
							<span class="loading loading-spinner loading-sm"></span>
							Menyimpan...
						{:else}
							Simpan Beasiswa
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
