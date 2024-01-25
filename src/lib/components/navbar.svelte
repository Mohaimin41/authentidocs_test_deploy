<script lang="ts">
    import { Avatar, Button, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Navbar, NavBrand, NavLi, NavUl } from 'flowbite-svelte';
    import { logged_in_store, uid } from '../../stores';
    import { get } from 'svelte/store';
    import { signOut } from '@auth/sveltekit/client';
    import { afterNavigate } from '$app/navigation';
    import { db } from '$lib/db';

    let logged_in_state: boolean = false;

    async function logout(): Promise<void>
    {
        await db.priv_key.delete(get(uid));
        signOut({callbackUrl: "/"});
    }

    afterNavigate((): void =>
    {
        logged_in_state = get(logged_in_store);
    })
</script>

<Navbar fluid={false}>
    <NavBrand href="/">
        <img src="favicon.png" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" /> <!-- apatoto -->
        <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Authentidocs</span>
    </NavBrand>
    <NavUl >
        <NavLi href="/">Files</NavLi>
        <NavLi href="/about">Organizations</NavLi>
        <NavLi href="/docs/components/navbar">Teams</NavLi>
        <NavLi href="/pricing">Work Threads</NavLi>
        <NavLi href="/contact">Upload & Sign</NavLi>
    </NavUl>
    {#if logged_in_state}
        <div class="flex items-center md:order-2">
            <a id="avatar-menu" data-dropdown-toggle="dropdown" class="text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <Avatar src="pochita.webp" />
            </a>
            <Dropdown placement="bottom" triggeredBy="#avatar-menu">
                <DropdownHeader>
                <span class="block text-sm">Bonnie Green</span>
                <span class="block truncate text-sm font-medium">name@flowbite.com</span>
                </DropdownHeader>
                <DropdownItem>Dashboard</DropdownItem>
                <DropdownItem>Settings</DropdownItem>
                <DropdownItem>Earnings</DropdownItem>
                <DropdownDivider />
                <DropdownItem on:click={logout}>Sign out</DropdownItem>
            </Dropdown>
        </div>
    {:else}
        <div class="flex">
            <a href="/signup" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 me-2">Sign Up</a>
            <a href="/login" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Login</a>
        </div>
    {/if}
</Navbar>