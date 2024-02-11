<script lang="ts">
    import "../../app.pcss";
    import Navbar from "$lib/components/navbar.svelte";
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { source } from "sveltekit-sse";
    import { get, type Readable, type Subscriber } from "svelte/store";

    // let noti_json: Readable<any>;

    // $: console.log($noti_json);

    // onMount((): void => {
    //     if ($page.data.session) {
    //         let notification = source("/api/user/notificationevent");
    //         // let channel = notification.select("notifications");
            
    //         noti_json = notification.select('notifications').json(
    //         function or({error, raw, previous})
    //         {
    //             console.error(`Could not parse "${raw}" as json.`, error)
    //             return previous  // This will be the new value of the store
    //         });
    //     }
    // });
</script>

<Navbar />

<slot />
