<script lang="ts">
    import { afterNavigate, goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { logged_in_store } from "../../stores";

    afterNavigate(async (): Promise<void> =>
    {
        if($page.data.session)
        {
            logged_in_store.set(true);
            goto("/home");
        }
    });
</script>