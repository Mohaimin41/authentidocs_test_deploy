<script lang="ts">
    import "../app.pcss";
    import { db, type PriveKey } from "$lib/db";
    import { get } from "svelte/store";
    import { priv_key, uid } from "../stores";
    import { page } from "$app/stores";
    import { afterNavigate } from "$app/navigation";

    afterNavigate(async (): Promise<void> =>
    {
        if($page.data.session)
        {
            let temp_key: PriveKey | undefined = await db.priv_key.get(get(uid));

            if(temp_key)
            {
                priv_key.set(temp_key.key);
            }
        }
    });
</script>

<slot></slot>