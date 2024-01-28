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
    <div class="flex">
        <svg class="w-8 h-8 text-{color}-500 dark:text-{color}-400 pe-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 20">
            <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M1 6v8a5 5 0 1 0 10 0V4.5a3.5 3.5 0 1 0-7 0V13a2 2 0 0 0 4 0V6"/>
        </svg>
        <p class="text-2xl font-semibold text-gray-900 dark:text-white">{thread_name}</p>
    </div>                  
</a>