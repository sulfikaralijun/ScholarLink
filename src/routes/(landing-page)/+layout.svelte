<script lang="ts">
	import '$lib/styles/app.css';
	import type { LayoutProps } from '../$types';
	import favicon from '$lib/assets/favicon.svg';
	import logo from '$lib/assets/logo.svg';
	import { Mail, MapPin, Phone } from 'lucide-svelte';
	import Logo from '$lib/components/Logo.svelte';
	let { data, children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex h-screen min-h-screen flex-col bg-white">
	<header class="flex items-center justify-between px-10 py-3 shadow-sm">
		<Logo />
		<nav class="[&>a]: text text-primary flex gap-6 text-lg">
			<a href="/">Beranda</a>
			<a href="/beasiswa">Beasiswa</a>
		</nav>
		<div>
			<a href="/subscriptions" class="btn btn-secondary">Daftar</a>
		</div>
	</header>
	<main class="flex-1 bg-inherit">
		{#if children}
			{@render children()}
		{/if}
	</main>
	<footer id="footer" class="border-t border-gray-200 bg-white px-20 py-10">
		<div class="grid grid-cols-4 border-b border-gray-200 pb-8">
			<div class="flex flex-col gap-3">
				<div class="flex items-center">
					<img src={logo} alt="logo" class="w-10" />
					<h3 class="text-xl font-bold">ScholarLink</h3>
				</div>
				<p class="text-sm text-gray-500">
					Platform informasi beasiswa terlengkap untuk mewujudkan impian pendidikanmu.
				</p>
			</div>
			<div class="flex flex-col gap-3">
				<h3 class="text-md font-semibold">Tautan Cepat</h3>
				<ul
					class="[&>li]: [&>li>a]:hover:text-primary flex cursor-pointer flex-col gap-2 text-sm text-gray-500">
					<li><a href="/">Beranda</a></li>
					<li><a href="/beasiswa">Beasiswa</a></li>
					<li><a href="/dashboard">Tentang Kami</a></li>
				</ul>
			</div>
			<div class="flex flex-col gap-3">
				<h3 class="text-md font-semibold">Dukungan</h3>
				<ul
					class="[&>li]: [&>li>a]:hover:text-primary flex cursor-pointer flex-col gap-2 text-sm text-gray-500">
					<li><a href="/">FAQ</a></li>
					<li><a href="/beasiswa">Panduan</a></li>
					<li><a href="/dashboard">Kontak</a></li>
				</ul>
			</div>
			<div class="flex flex-col gap-3">
				<h3 class="text-md font-semibold">Hubungi Kami</h3>
				<ul
					class="[&>li]: [&>li>a]:hover:text-primary flex cursor-pointer flex-col gap-2 text-sm text-gray-500">
					<li class="flex items-center gap-2">
						<Mail size={16} />
						<a href="mailto:info@scholarlink.id">info@scholarlink.id</a>
					</li>
					<li class="flex items-center gap-2">
						<Phone size={16} />
						<a href="/beasiswa">+62 123 456 789</a>
					</li>
					<li class="flex items-center gap-2">
						<MapPin size={16} />
						<a href="/dashboard">Kendari, Indonesia</a>
					</li>
				</ul>
			</div>
		</div>
		<div class="mt-5 text-center text-sm text-gray-500">
			<p>&copy; <span>{new Date().getFullYear()}</span> ScholarLink. All Rights Reserved.</p>
		</div>
	</footer>
</div>
