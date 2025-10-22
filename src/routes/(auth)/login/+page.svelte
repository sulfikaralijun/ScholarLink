<script lang="ts">
	import logo from '$lib/assets/logo.svg';
	import { Mail, Lock, Eye, EyeOff } from 'lucide-svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	console.log(form);

	let showPassword = $state(false);
	let loading = $state(false);

	function togglePassword() {
		showPassword = !showPassword;
	}

	// Handle form submission
	function handleSubmit() {
		loading = true;
	}
</script>

<div class="rounded-xl border border-gray-200 p-8 shadow-lg">
	<div class="mb-5 flex items-center justify-center">
		<img src={logo} alt="" class="h-10 w-10" />
		<span class="text-primary text-2xl font-bold"
			>Scholar<span class="text-secondary">Link</span></span>
	</div>
	<div class="text-center">
		<h1 class="text-3xl font-bold">Selamat Datang Kembali</h1>
		<p class="mt-2 text-gray-500">Masuk ke akun ScholarLink Anda</p>
	</div>

	<!-- Error Message -->
	{#if form?.error}
		<div class="alert alert-error mt-4">
			<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
			<span>{form.error}</span>
		</div>
	{/if}

	<form method="POST"
	 class="mt-8 flex flex-col gap-4">
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Email</legend>
			<label class="input w-full bg-gray-50">
				<Mail class="text-gray-500" size={20} />
				<input
					type="email"
					name="email"
					placeholder="Email"
					class="grow"
					required
					disabled={loading} />
			</label>
		</fieldset>

		<fieldset class="fieldset">
			<legend class="fieldset-legend">Password</legend>
			<label class="input w-full bg-gray-50">
				<Lock class="text-gray-500" size={20} />
				<input
					type={showPassword ? 'text' : 'password'}
					name="password"
					placeholder="Password"
					class="grow"
					required
					disabled={loading} />
				<button
					type="button"
					class="btn btn-ghost btn-sm"
					onclick={togglePassword}
					disabled={loading}>
					{#if showPassword}
						<EyeOff size={16} />
					{:else}
						<Eye size={16} />
					{/if}
				</button>
			</label>
		</fieldset>

		<div>
			<input
				type="checkbox"
				id="remember"
				name="remember"
				class="checkbox checkbox-primary checkbox-sm" />
			<label for="remember" class="ml-2 text-sm text-gray-500">Ingat saya</label>
		</div>

		<div>
			<button type="submit" class="btn btn-primary w-full rounded-xl" disabled={loading}>
				{#if loading}
					<span class="loading loading-spinner loading-sm"></span>
					Memproses...
				{:else}
					Masuk
				{/if}
			</button>
		</div>

		<div class="mt-2 text-center">
			<p class="text-sm text-gray-500">
				Platform informasi beasiswa untuk semua kalangan
			</p>
		</div>
	</form>
</div>
