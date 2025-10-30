<script lang="ts">
	import { goto } from '$app/navigation';
	import { Search, Bell, Shield, BookOpen, Mail, Phone, MapPin } from 'lucide-svelte';
	const features = [
		{
			icon: Search,
			title: 'Pencarian Mudah',
			desc: 'Temukan beasiswa yang sesuai dengan kriteria dan impianmu dengan mudah.'
		},
		{
			icon: Bell,
			title: 'Notifikasi Real-time',
			desc: 'Dapatkan pemberitahuan langsung untuk beasiswa baru dan deadline penting.'
		},
		{
			icon: Shield,
			title: 'Informasi Terpercaya',
			desc: 'Semua informasi beasiswa telah diverifikasi dan terupdate.'
		},
		{
			icon: BookOpen,
			title: 'Panduan Lengkap',
			desc: 'Akses panduan dan tips untuk meningkatkan peluang mendapatkan beasiswa.'
		}
	];
</script>

<svelte:head>
	<title>Beranda - ScholarLink</title>
</svelte:head>

<section id="hero" class="bg-primary/95 flex flex-col items-center">
	<h1 class="mt-35 text-center text-6xl font-bold text-white">
		Temukan Beasiswa Sesuai <br /> Impianmu
	</h1>
	<p class="mt-5 text-center text-2xl text-white">
		Platform terpercaya untuk menemukan dan mengajukan <br /> beasiswa yang tepat untukmu
	</p>

	<div class="mt-10 mb-15 flex items-center gap-5">
		<button
			onclick={() => goto('/beasiswa')}
			class="bg-secondary hover:bg-secondary/90 cursor-pointer rounded-xl px-8 py-6 text-lg font-medium"
			>Lihat Beasiswa</button>
		<button
			onclick={() => goto('/subscription')}
			class="cursor-pointer rounded-xl bg-white/10 px-8 py-6 text-lg font-medium text-white outline outline-gray-400 hover:bg-white/20"
			>Daftar Sekarang</button>
	</div>
	<div class="h-15 w-full bg-white/20"></div>
</section>
<section id="about" class="bg-white py-20">
	<h1 class="mb-5 text-center text-4xl font-bold">Tentang ScholarLink</h1>
	<p class="mx-auto mb-20 max-w-3xl text-center text-lg text-gray-500">
		Kami adalah platform yang berkomitmen untuk membantu mahasiswa Indonesia menemukan peluang
		beasiswa terbaik untuk mencapai impian pendidikan mereka.
	</p>
</section>
<section id="fitur" class="bg-gray-50 px-20 py-20">
	<div>
		<h1 class="mb-5 text-center text-4xl font-bold">Fitur Unggulan</h1>
		<p class="mx-auto mb-20 max-w-3xl text-center text-lg text-gray-500">
			Berbagai fitur yang memudahkan pencarian dan aplikasi beasiswa
		</p>
	</div>
	<div class="grid grid-cols-4 gap-5">
		{#each features as { icon: Icon, title, desc }}
			<div
				class="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow">
				<div class="text-primary rounded-full bg-gray-200 p-5">
					<Icon size={24} />
				</div>
				<h3 class="text-xl font-semibold">{title}</h3>
				<p class="text-center text-gray-500">{desc}</p>
			</div>
		{/each}
	</div>
</section>
<section
	id="cta"
	class="bg-primary/95 flex flex-col items-center gap-8 border-b border-gray-200 pt-20">
	<h1 class="text-4xl font-bold text-white">Siap Memulai Perjalanan Beasiswamu?</h1>
	<p class="text-xl text-white">Daftar sekarang dan temukan beasiswa yang tepat untukmu</p>
	<div class="mb-15 flex items-center gap-5">
		<button
			onclick={() => goto('/subscription')}
			class="bg-secondary hover:bg-secondary/90 cursor-pointer rounded-xl px-8 py-6 text-lg font-medium"
			>Daftar Gratis</button>
		<button
			onclick={() => goto('/beasiswa')}
			class="cursor-pointer rounded-xl bg-white/10 px-8 py-6 text-lg font-medium text-white outline outline-gray-400 hover:bg-white/20"
			>Jelajah Beasiswa</button>
	</div>
	<div class="h-15 w-full bg-gray-50"></div>
</section>
