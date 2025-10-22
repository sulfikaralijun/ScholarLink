<script lang="ts">
	import type { PageProps } from "./$types";
	import { Shield, BarChart3, BookOpen, Mail } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let {data}: PageProps = $props();
	
	// Type assertion untuk admin data
	const admin = (data as any)?.admin || {};
	let stats = $state({
		totalBeasiswa: 0,
		activeBeasiswa: 0,
		expiredBeasiswa: 0,
		totalSubscribers: 0
	});

	async function loadStats() {
		try {
			const response = await fetch('/api/v1/dashboard/stats');
			const data = await response.json();
			stats = data;
		} catch (error) {
			console.error('Error loading stats:', error);
		}
	}

	onMount(() => {
		loadStats();
	});
</script>

<svelte:head>
	<title>Overview - ScholarLink Dashboard</title>
</svelte:head>

<!-- Overview Content -->
<div class="space-y-6">
	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center">
				<div class="p-3 bg-blue-100 rounded-lg">
					<BookOpen size={24} class="text-blue-600" />
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-500">Total Beasiswa</p>
					<p class="text-2xl font-semibold text-gray-900">{stats.totalBeasiswa}</p>
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center">
				<div class="p-3 bg-green-100 rounded-lg">
					<Shield size={24} class="text-green-600" />
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-500">Aktif</p>
					<p class="text-2xl font-semibold text-gray-900">{stats.activeBeasiswa}</p>
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center">
				<div class="p-3 bg-red-100 rounded-lg">
					<BarChart3 size={24} class="text-red-600" />
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-500">Expired</p>
					<p class="text-2xl font-semibold text-gray-900">{stats.expiredBeasiswa}</p>
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center">
				<div class="p-3 bg-purple-100 rounded-lg">
					<Mail size={24} class="text-purple-600" />
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-500">Subscribers</p>
					<p class="text-2xl font-semibold text-gray-900">{stats.totalSubscribers}</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Welcome Card -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
		<div class="flex items-center gap-3">
			<div class="p-3 bg-primary/10 rounded-lg">
				<Shield size={24} class="text-primary" />
			</div>
			<div>
				<h3 class="text-lg font-semibold">Selamat Datang, {admin.nama}!</h3>
				<p class="text-gray-500">Kelola informasi beasiswa dengan mudah</p>
			</div>
		</div>
		<p class="mt-4 text-gray-600">
			Dashboard ScholarLink memberikan Anda kontrol penuh untuk mengelola informasi beasiswa, 
			email subscribers, dan sistem. Gunakan navigasi di atas untuk mengakses fitur-fitur yang tersedia.
		</p>
	</div>
</div>