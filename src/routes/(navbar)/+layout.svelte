<script lang="ts">
    import "../../app.pcss";
    import Navbar from "$lib/components/navbar.svelte";
    import { afterNavigate } from "$app/navigation";
    import { new_key, uid } from "../../stores";
    import { get } from "svelte/store";
    import { db } from "$lib/db";
    import { page } from "$app/stores";
    import { common_fetch } from "$lib/fetch_func";

    afterNavigate(async (): Promise<void> =>
    {
        let new_key_need: string | null = localStorage.getItem("new_key");

        if(new_key_need !== null && new_key_need === "1")
        {
            let subtle_crypto: SubtleCrypto = window.crypto.subtle;

            let keyPair = await subtle_crypto.generateKey(
              {
                name: "ECDSA",
                namedCurve: "P-384",
              },
              true,
              ["sign", "verify"],
            );

            let public_key = await subtle_crypto.exportKey(
              "jwk",
              keyPair.publicKey,
            );

            await db.priv_key.add({
              id: get(uid),
              key: keyPair.privateKey,
            });

            let request_obj: any = {
              user_id: $page.data.session?.user?.name,
              key: JSON.stringify(public_key),
            };
            common_fetch(
            "/api/user/addkey",
            request_obj,
            async (response: Response): Promise<void> => {
            // new_key.set(false);
            localStorage.setItem("new_key", "0");
            });
        }
    });
</script>

<Navbar />

<slot></slot>