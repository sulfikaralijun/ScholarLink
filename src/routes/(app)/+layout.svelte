<script lang="ts">
  import "$lib/styles/app.css";
	import { goto } from "$app/navigation";
	import Logo from "$lib/components/Logo.svelte";
	import { LogOut } from "lucide-svelte";
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
	const { session } = data;

	function handleLogout() {
		goto("/api/v1/auth/logout")
	}
</script>

<div class="min-h-screen bg-gray-50 flex flex-col">
	<header class="bg-white shadow-sm border-b border-gray-200">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<div class="flex items-center gap-2">
					<Logo />
					<span class="text-sm text-gray-500">{session.role === 'super_admin' ? 'Super Admin' : 'Admin'}</span>
				</div>
				<div>
					<button onclick={handleLogout} class="btn btn-ghost btn-sm text-red-600 hover:bg-red-50">
						<LogOut size={16} />
						Logout
					</button>
				</div>
			</div>
		</div>
	</header>
	{@render children?.()}
</div>