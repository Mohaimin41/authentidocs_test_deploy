<script lang="ts">
    import default_pfp from "$lib/assets/user.webp";
    import { initDropdowns } from "flowbite";
    import { onMount } from "svelte";
    import { uid, useremail, username } from "$lib/stores";
    import { db } from "$lib/db";
    import { get } from "svelte/store";
    import { signOut } from "@auth/sveltekit/client";
    import { page } from "$app/stores";
    import { make_pfp_url } from "$lib/helpers";

    let pfp_data: string = default_pfp;

    function get_pfp(): void
    {
      fetch(make_pfp_url($page.data.session?.user?.name),
      {
        method: "GET"
      }).then(async (response: Response): Promise<void> =>
      {
        if(response.status === 200)
        {
          pfp_data = URL.createObjectURL(await response.blob());
        }
      });
    }

    async function logout(): Promise<void>
    {
        await db.priv_key.delete(get(uid));
        await db.delete();

        signOut({callbackUrl: "/"});
    }

    onMount((): void =>
    {
        initDropdowns();
        get_pfp();
    });
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<a href="javascript:" data-dropdown-toggle="pfp-dropdown" class="text-white font-medium rounded-lg text-sm text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
    <img class="w-10 h-10 rounded-full" src={pfp_data} alt="Rounded avatar">
</a>

<div id="pfp-dropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
    <div class="px-4 py-3 text-sm text-gray-900 dark:text-white">
        <p class="text-xl font-semibold truncate text-gray-700 dark:text=gray-200">{$username}</p>
        <p class="font-medium truncate text-gray-700 dark:text=gray-200">{$useremail}</p>
    </div>
    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
      <li>
        <a href="/dashboard" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
      </li>
      <li>
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a on:click={logout} href="javascript:" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Logout</a>
      </li>
    </ul>
</div>