<script lang="ts">
    import { gen_random_color } from "$lib/helpers";
    import { onMount } from "svelte";

    export let uid: string;
    export let title: string;

    let color: string;

    onMount(() : void =>
    {
        color = gen_random_color();
    });
</script>

<a href="/notice/{uid}" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
    <p class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{title}</p>
</a>    