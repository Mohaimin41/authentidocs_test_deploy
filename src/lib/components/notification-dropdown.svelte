<script lang="ts">
    import { initDropdowns } from "flowbite";
    import { onMount } from "svelte";

    onMount((): void =>
    {
        initDropdowns();
    });
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<a href="javascript:" id="notification-button" data-dropdown-toggle="notification-dropdown" class="text-gray-600 dark:text-gray-400 me-2">
    <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5.4V3m0 2.4a5.3 5.3 0 0 1 5.1 5.3v1.8c0 2.4 1.9 3 1.9 4.2 0 .6 0 1.3-.5 1.3h-13c-.5 0-.5-.7-.5-1.3 0-1.2 1.9-1.8 1.9-4.2v-1.8A5.3 5.3 0 0 1 12 5.4ZM8.7 18c.1.9.3 1.5 1 2.1a3.5 3.5 0 0 0 4.6 0c.7-.6 1.3-1.2 1.4-2.1h-7Z"/>
    </svg>
</a>

<!-- Dropdown menu -->
<div id="notification-dropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
    a
</div>