<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { logged_in_store } from "../../stores";

    if($page.data.session)
    {
        logged_in_store.set(true);
        goto("/home");
    }
</script>