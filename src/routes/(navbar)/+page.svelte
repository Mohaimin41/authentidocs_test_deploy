<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { logged_in_store } from "$lib/stores";

    onMount(async (): Promise<void> =>
    {
        if($page.data.session)
        {
            logged_in_store.set(true);
            goto("/home");
        }
    });
</script>