<script lang="ts">
	import type { PageProps } from "./$types";
	import { User, Shield, BarChart3, Settings } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let {data}: PageProps = $props();
	
	// Type assertion untuk admin data
	const admin = (data as any)?.admin || {};
	let adminList = $state<any[]>([]);
	let showAdminForm = $state(false);
	let adminFormData = $state({
		nama: '',
		email: '',
		password: '',
		role: 'admin'
	});
	let adminFormLoading = $state(false);
	let adminFormError = $state('');
	let editingAdmin = $state<any>(null);

	async function loadAdmins() {
		try {
			const response = await fetch('/api/v1/admin');
			const data = await response.json();
			adminList = data;
		} catch (error) {
			console.error('Error loading admins:', error);
		}
	}

	async function submitAdminForm() {
		adminFormLoading = true;
		adminFormError = '';
		
		try {
			// Validate required fields
			if (!adminFormData.nama || !adminFormData.email || !adminFormData.password) {
				adminFormError = 'Nama, Email, dan Password harus diisi';
				return;
			}

			const url = editingAdmin ? `/api/v1/admin/${editingAdmin.id_admin}` : '/api/v1/admin';
			const method = editingAdmin ? 'PUT' : 'POST';
			
			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(adminFormData)
			});

			if (response.ok) {
				// Reset form
				adminFormData = {
					nama: '',
					email: '',
					password: '',
					role: 'admin'
				};
				showAdminForm = false;
				editingAdmin = null;
				
				// Reload admin list
				await loadAdmins();
			} else {
				const errorData = await response.json();
				adminFormError = errorData.error || 'Terjadi kesalahan saat menyimpan admin';
			}
		} catch (error) {
			console.error('Error submitting admin:', error);
			adminFormError = 'Terjadi kesalahan saat menyimpan admin';
		} finally {
			adminFormLoading = false;
		}
	}

	function openAdminForm(adminItem: any = null) {
		editingAdmin = adminItem;
		if (adminItem) {
			adminFormData = {
				nama: adminItem.nama || '',
				email: adminItem.email || '',
				password: '',
				role: adminItem.role || 'admin'
			};
		} else {
			adminFormData = {
				nama: '',
				email: '',
				password: '',
				role: 'admin'
			};
		}
		showAdminForm = true;
		adminFormError = '';
	}

	function closeAdminForm() {
		showAdminForm = false;
		editingAdmin = null;
		adminFormError = '';
		adminFormData = {
			nama: '',
			email: '',
			password: '',
			role: 'admin'
		};
	}

	async function deleteAdmin(adminId: number) {
		if (confirm('Yakin ingin menghapus admin ini?')) {
			try {
				const response = await fetch(`/api/v1/admin/${adminId}`, {
					method: 'DELETE'
				});

				if (response.ok) {
					await loadAdmins();
				} else {
					const errorData = await response.json();
					alert(errorData.error || 'Gagal menghapus admin');
				}
			} catch (error) {
				console.error('Error deleting admin:', error);
				alert('Terjadi kesalahan saat menghapus admin');
			}
		}
	}

	onMount(() => {
		loadAdmins();
	});
</script>

<svelte:head>
	<title>System Management - ScholarLink Dashboard</title>
</svelte:head>

<!-- System Management Content (Super Admin Only) -->
<div class="space-y-6">
	<div class="flex justify-between items-center">
		<h2 class="text-2xl font-bold text-gray-900">System Management</h2>
		<button onclick={() => openAdminForm()} class="btn btn-primary">
			<Settings size={16} class="mr-2" />
			Tambah Admin
		</button>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		<div class="bg-white rounded-xl shadow-sm border p-6">
			<div class="flex items-center">
				<div class="p-3 bg-blue-100 rounded-lg">
					<User size={24} class="text-blue-600" />
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-500">Total Admin</p>
					<p class="text-2xl font-semibold text-gray-900">{adminList.length}</p>
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border p-6">
			<div class="flex items-center">
				<div class="p-3 bg-green-100 rounded-lg">
					<Shield size={24} class="text-green-600" />
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-500">System Status</p>
					<p class="text-2xl font-semibold text-gray-900">Healthy</p>
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border p-6">
			<div class="flex items-center">
				<div class="p-3 bg-purple-100 rounded-lg">
					<BarChart3 size={24} class="text-purple-600" />
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-500">Uptime</p>
					<p class="text-2xl font-semibold text-gray-900">99.9%</p>
				</div>
			</div>
		</div>
	</div>

	<div class="bg-white rounded-xl shadow-sm border p-6">
		<h3 class="text-lg font-semibold mb-4">Admin List</h3>
		{#if adminList.length === 0}
			<div class="text-center py-8">
				<User size={48} class="mx-auto text-gray-400 mb-4" />
				<h3 class="text-lg font-medium text-gray-900 mb-2">Belum ada admin</h3>
				<p class="text-gray-500 mb-4">Mulai dengan menambahkan admin pertama</p>
				<button onclick={() => openAdminForm()} class="btn btn-primary">Tambah Admin</button>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Dibuat</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						{#each adminList as adminItem}
							<tr class="hover:bg-gray-50">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm font-medium text-gray-900">{adminItem.nama}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-900">{adminItem.email}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
										{adminItem.role === 'super_admin' 
											? 'bg-purple-100 text-purple-800' 
											: 'bg-blue-100 text-blue-800'}"
									>
										{adminItem.role}
									</span>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-900">
										{new Date(adminItem.createdAt).toLocaleDateString('id-ID')}
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
									<button 
										onclick={() => openAdminForm(adminItem)}
										class="text-indigo-600 hover:text-indigo-900 mr-3"
									>
										Edit
									</button>
									{#if adminItem.id_admin !== admin.id_admin}
										<button 
											onclick={() => deleteAdmin(adminItem.id_admin)}
											class="text-red-600 hover:text-red-900"
										>
											Delete
										</button>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>

<!-- Admin Form Modal -->
{#if showAdminForm}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-xl shadow-xl max-w-lg w-full">
			<div class="p-6 border-b border-gray-200">
				<div class="flex justify-between items-center">
					<h3 class="text-xl font-semibold text-gray-900">
						{editingAdmin ? 'Edit Admin' : 'Tambah Admin Baru'}
					</h3>
					<button onclick={closeAdminForm} class="btn btn-ghost btn-sm" aria-label="Tutup modal">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</button>
				</div>
			</div>

			<form onsubmit={(e) => { e.preventDefault(); submitAdminForm(); }} class="p-6 space-y-6">
				{#if adminFormError}
					<div class="alert alert-error">
						<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
						<span>{adminFormError}</span>
					</div>
				{/if}

				<!-- Nama -->
				<div class="form-control">
					<label for="admin_nama" class="label">
						<span class="label-text font-medium">Nama Admin *</span>
					</label>
					<input
						id="admin_nama"
						type="text"
						bind:value={adminFormData.nama}
						placeholder="Masukkan nama admin"
						class="input input-bordered w-full"
						required
					/>
				</div>

				<!-- Email -->
				<div class="form-control">
					<label for="admin_email" class="label">
						<span class="label-text font-medium">Email *</span>
					</label>
					<input
						id="admin_email"
						type="email"
						bind:value={adminFormData.email}
						placeholder="admin@example.com"
						class="input input-bordered w-full"
						required
					/>
				</div>

				<!-- Password -->
				<div class="form-control">
					<label for="admin_password" class="label">
						<span class="label-text font-medium">
							Password {editingAdmin ? '(kosongkan jika tidak ingin mengubah)' : '*'}
						</span>
					</label>
					<input
						id="admin_password"
						type="password"
						bind:value={adminFormData.password}
						placeholder="Masukkan password"
						class="input input-bordered w-full"
						required={!editingAdmin}
					/>
				</div>

				<!-- Role -->
				<div class="form-control">
					<label for="admin_role" class="label">
						<span class="label-text font-medium">Role *</span>
					</label>
					<select id="admin_role" bind:value={adminFormData.role} class="select select-bordered w-full bg-white">
						<option value="admin">Admin</option>
						<option value="super_admin">Super Admin</option>
					</select>
				</div>

				<!-- Form Actions -->
				<div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
					<button
						type="button"
						onclick={closeAdminForm}
						class="btn btn-ghost"
						disabled={adminFormLoading}
					>
						Batal
					</button>
					<button
						type="submit"
						class="btn btn-primary"
						disabled={adminFormLoading}
					>
						{#if adminFormLoading}
							<span class="loading loading-spinner loading-sm"></span>
							Menyimpan...
						{:else}
							{editingAdmin ? 'Update Admin' : 'Simpan Admin'}
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
