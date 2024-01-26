<script lang="ts">
    import "../../app.pcss";
    import Navbar from "$lib/components/navbar.svelte";
    import { uid } from "../../stores";
    import { get } from "svelte/store";
    import { db } from "$lib/db";
    import { page } from "$app/stores";
    import { common_fetch } from "$lib/fetch_func";
    import { onMount } from "svelte";

    onMount(async (): Promise<void> =>
    {
        
    });
</script>

<Navbar />

<slot></slot>