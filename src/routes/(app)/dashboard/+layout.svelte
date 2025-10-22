<script lang="ts">
	import { BookOpen, Home, Mail, Settings } from 'lucide-svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
	const { session } = data;
</script>

<div class="flex flex-1">
    <div class="w-64 bg-white shadow-sm border-r">
        <nav class="flex flex-col gap-2 p-4 text-primary h-full [&>a]:justify-start">
            <a href="/dashboard" class="btn btn-ghost text-primary hover:bg-primary/10">
                <Home size={16} /> Dashboard
            </a>
            <a href="/dashboard/beasiswa" class="btn btn-ghost text-primary hover:bg-primary/10">
                <BookOpen size={16} /> Beasiswa
            </a>
            <a href="/dashboard/email" class="btn btn-ghost text-primary hover:bg-primary/10">
                <Mail size={16} /> Subscribers
            </a>
            {#if session.role === 'super_admin'}
                <a href="/dashboard/system" class="btn btn-ghost text-primary hover:bg-primary/10">
                    <Settings size={16} /> System
                </a>
            {/if}
        </nav>
    </div>
    <div class="flex-1 p-4">
        {@render children?.()}
    </div>
</div>