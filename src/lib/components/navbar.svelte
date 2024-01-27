<script lang="ts">
    import { Avatar, Dropdown, DropdownHeader, DropdownItem, Navbar, NavBrand, NavLi, NavUl } from 'flowbite-svelte';
    import { uid,useremail,username } from '../../stores';
    import { get } from 'svelte/store';
    import { signOut } from '@auth/sveltekit/client';
    import { db } from '$lib/db';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
  import { common_fetch } from '$lib/fetch_func';

    let logged_in_state: boolean = false;

    async function logout(): Promise<void>
    {
        await db.priv_key.delete(get(uid));
        await db.delete();

        signOut({callbackUrl: "/"});
    }

    onMount((): void =>
    {
        if($page.data.session)
        {
            logged_in_state = true;
            
            let request_obj: any = {
                userid: $page.data.session?.user?.name,
              };

                common_fetch(
                "/api/user/details",
                request_obj,
                async (response: Response): Promise<void> => {
                  let response_obj: any = await response.json();
                  username.set(response_obj.username)
                  //console.log(response_obj);

                }
              );
        }
        else
        {
            logged_in_state = false;
        }
    });
</script>

<Navbar fluid={false}>
    <NavBrand href="/">
        <img src="/favicon.png" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" /> <!-- apatoto -->
        <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Authentidocs</span>
    </NavBrand>
    <NavUl>
        <NavLi href="/">Files</NavLi>
        <NavLi href="/about">Organizations</NavLi>
        <NavLi href="/docs/components/navbar">Teams</NavLi>
        <NavLi href="/pricing">Work Threads</NavLi>
        <NavLi href="/contact">Upload & Sign</NavLi>
    </NavUl>
    {#if logged_in_state}
        <div class="flex items-center md:order-2">
            <a id="avatar-menu" role="button" data-dropdown-toggle="dropdown" class="text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <Avatar src="/pochita.webp" />
            </a>
            <Dropdown placement="bottom" triggeredBy="#avatar-menu">
                <DropdownHeader>
                <span class="block text-sm">{$username}</span>
                <span class="block truncate text-sm font-medium">{$useremail}</span>
                </DropdownHeader>
                <a href="/dashboard">
                <DropdownItem>Settings</DropdownItem>
                </a>
                <DropdownItem on:click={logout}>Logout</DropdownItem>
            </Dropdown>
        </div>
    {:else}
        <div class="flex">
            <a href="/signup" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 me-2">Sign Up</a>
            <a href="/login" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Login</a>
        </div>
    {/if}
</Navbar>