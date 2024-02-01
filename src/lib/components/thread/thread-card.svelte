<script lang="ts">
    import { onMount } from "svelte";

    export let thread_name: string;
    export let selected: boolean = false;
    const all_colors: string[] = ["red", "green", "blue", "purple"];
    let color: string;
    let bg_color_class: string;

    onMount(() : void =>
    {
        if(selected)
        {
            bg_color_class = "bg-gray-200 dark:bg-gray-600";
        }
        else
        {
            bg_color_class = "bg-white dark:bg-gray-800";
        }

        color = all_colors[Math.round(Math.random() * (all_colors.length - 1))];
    });
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<a href="javascript:" class="block p-6 {bg_color_class} hover:bg-gray-100 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700">
    <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-paperclip w-7 h-7 text-{color}-500 dark:text-{color}-400" viewBox="0 0 16 16">
            <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0z"/>
        </svg>
        <p class="text-2xl font-semibold text-gray-900 dark:text-white">{thread_name}</p>
    </div>
</a>