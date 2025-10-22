<script lang="ts">
	import type { PageProps } from "./$types";
	import { Mail } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let {data}: PageProps = $props();
	
	// Type assertion untuk admin data
	const admin = (data as any)?.admin || {};
	let stats = $state({
		totalSubscribers: 0
	});
	let subscribersList = $state<any[]>([]);

	async function loadStats() {
		try {
			const response = await fetch('/api/v1/dashboard/stats');
			const data = await response.json();
			stats = data;
		} catch (error) {
			console.error('Error loading stats:', error);
		}
	}

	async function loadSubscribers() {
		try {
			const response = await fetch('/api/v1/subscriptions');
			const data = await response.json();
			subscribersList = data;
		} catch (error) {
			console.error('Error loading subscribers:', error);
		}
	}

	onMount(() => {
		loadStats();
		loadSubscribers();
	});
</script>

<svelte:head>
	<title>Email Management - ScholarLink Dashboard</title>
</svelte:head>

<!-- Email Management Content -->
<div class="space-y-6">
	<div class="flex justify-between items-center">
		<h2 class="text-2xl font-bold text-gray-900">Kelola Email</h2>
		<button class="btn btn-primary">
			<Mail size={16} class="mr-2" />
			Kirim Email
		</button>
	</div>

	<div class="bg-white rounded-xl shadow-sm border p-6">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
			<div class="text-center">
				<div class="text-3xl font-bold text-primary">{stats.totalSubscribers}</div>
				<div class="text-sm text-gray-500">Total Subscribers</div>
			</div>
			<div class="text-center">
				<div class="text-3xl font-bold text-green-600">0</div>
				<div class="text-sm text-gray-500">Email Terkirim</div>
			</div>
			<div class="text-center">
				<div class="text-3xl font-bold text-blue-600">0%</div>
				<div class="text-sm text-gray-500">Open Rate</div>
			</div>
		</div>

		{#if subscribersList.length === 0}
			<div class="text-center py-8">
				<Mail size={48} class="mx-auto text-gray-400 mb-4" />
				<h3 class="text-lg font-medium text-gray-900 mb-2">Belum ada subscribers</h3>
				<p class="text-gray-500">Email subscribers akan muncul di sini</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Daftar</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						{#each subscribersList as subscriber}
							<tr class="hover:bg-gray-50">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm font-medium text-gray-900">{subscriber.email_user}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-900">
										{new Date(subscriber.tanggal_daftar).toLocaleDateString('id-ID')}
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
										Aktif
									</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
