<script lang="ts">
    import FileCard from "$lib/components/thread/file-card.svelte";
    import MemberCard from "$lib/components/thread/member-card.svelte";
    import { onMount } from "svelte";

    let tab_active: boolean[] = [true, false, false];

    function reset_tabs(): void
    {
        for(let i: number = 0; i < tab_active.length; ++i)
        {
            tab_active[i] = false;
        }
    }

    function show_tab1(): void
    {
        reset_tabs();

        tab_active[0] = true;
    }

    function show_tab2(): void
    {
        reset_tabs();

        tab_active[1] = true;
    }

    function show_tab3(): void
    {
        reset_tabs();

        tab_active[2] = true;
    }
    
    onMount((): void =>
    {
        
    });
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<div class="thread-info block bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <ul class="thread-tabs flex flex-wrap justify-center items-center text-sm font-medium text-center text-gray-500 dark:text-gray-400">
        <li class="me-2">
            {#if tab_active[0]}
                <a href="javascript:" class="inline-block px-4 py-3 text-white bg-blue-600 rounded-lg active">Details</a>
            {:else}
                <a on:click={show_tab1} href="javascript:" class="inline-block px-4 py-3 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white">Details</a>
            {/if}
        </li>
        <li class="me-2">
            {#if tab_active[1]}
                <a href="javascript:" class="inline-block px-4 py-3 text-white bg-blue-600 rounded-lg active">Files</a>
            {:else}
                <a on:click={show_tab2} href="javascript:" class="inline-block px-4 py-3 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white">Files</a>
            {/if}
        </li>
        <li class="me-2">
            {#if tab_active[2]}
                <a href="javascript:" class="inline-block px-4 py-3 text-white bg-blue-600 rounded-lg active">Members</a>
            {:else}
                <a on:click={show_tab3} href="javascript:" class="inline-block px-4 py-3 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white">Members</a>
            {/if}
        </li>
    </ul>
    <div class="tab-item-data mx-6 mb-6">
        {#if tab_active[0]}
            <p class="text-4xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Thread 1</p>
            <p class="text-xl font-medium text-gray-400 dark:text-gray-500 mb-2">Moderator</p>
            <div class="flex items-center mb-4">
                <img class="w-8 h-8 rounded-full me-2" src="/pochita.webp" alt="Rounded avatar">
                <p class="text-2xl font-medium text-gray-700 dark:text-gray-200">Mustafa Siam Ur Rafique</p>
            </div>
            <p class="text-xl font-medium text-gray-400 dark:text-gray-500 mb-2">Current Custodian</p>
            <div class="flex items-center mb-4">
                <img class="w-8 h-8 rounded-full me-2" src="/pochita.webp" alt="Rounded avatar">
                <p class="text-2xl font-medium text-gray-700 dark:text-gray-200">Abdoollah Al Mohaemen</p>
            </div>
            <div class="grid grid-cols-4 mb-4">
                <p class="text-xl font-medium text-gray-400 dark:text-gray-500 mb-2">Files</p>
                <p class="text-xl font-medium text-gray-400 dark:text-gray-500 mb-2">Team</p>
                <p class="text-xl font-medium text-gray-400 dark:text-gray-500 mb-2">Started At</p>
                <p class="text-xl font-medium text-gray-400 dark:text-gray-500 mb-2">Members</p>
                <div class="flex items-center">
                    <svg class="w-6 h-6 text-blue-500 dark:text-blue-400 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M10 3v4c0 .6-.4 1-1 1H5m14-4v16c0 .6-.4 1-1 1H6a1 1 0 0 1-1-1V8c0-.4.1-.6.3-.8l4-4 .6-.2H18c.6 0 1 .4 1 1Z"/>
                    </svg>
                    <p class="text-base font-medium text-gray-700 dark:text-gray-200 me-1">9</p>
                    <p class="text-base font-medium text-red-500 dark:text-red-400 me-2">[5 Unsigned]</p>
                </div>
                <div class="flex items-center">
                    <svg class="w-6 h-6 text-green-500 dark:text-green-400 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3a2.5 2.5 0 1 1 2-4.5M19.5 17h.5c.6 0 1-.4 1-1a3 3 0 0 0-3-3h-1m0-3a2.5 2.5 0 1 0-2-4.5m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3c0 .6-.4 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/>
                    </svg>
                    <p class="text-base font-medium text-gray-700 dark:text-gray-200 me-1">Team 1</p>
                </div>
                <div class="flex items-center">
                    <svg class="w-6 h-6 text-red-500 dark:text-red-400 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 10h16M8 14h8m-4-7V4M7 7V4m10 3V4M5 20h14c.6 0 1-.4 1-1V7c0-.6-.4-1-1-1H5a1 1 0 0 0-1 1v12c0 .6.4 1 1 1Z"/>
                    </svg>
                    <p class="text-base font-medium text-gray-700 dark:text-gray-200 me-1">01 February 2024</p>
                </div>
                <div class="flex items-center">
                    <svg class="w-6 h-6 text-indigo-500 dark:text-indigo-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-width="2" d="M7 17v1c0 .6.4 1 1 1h8c.6 0 1-.4 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                    </svg>
                    <p class="text-base font-medium text-gray-700 dark:text-gray-200 me-1">69</p>
                </div>
            </div>
            <p class="text-xl font-medium text-gray-400 dark:text-gray-500 mb-2">Description</p>
        {:else if tab_active[1]}
            <p class="list-title text-2xl font-bold text-gray-700 dark:text-gray-200">Files</p>
            <ul class="list-elements space-y-2 mt-2 pb-1">
                <li>
                    <FileCard file_name={"Shundor File"} file_type={"pdf"} file_status={1}/>
                </li>
                <li>
                    <FileCard file_name={"Shundor File"} file_type={"png"} file_status={1}/>
                </li>
                <li>
                    <FileCard file_name={"Shundor File"} file_type={"png"} file_status={1}/>
                </li>
                <li>
                    <FileCard file_name={"Shundor File"} file_type={"pdf"} file_status={1}/>
                </li>
                <li>
                    <FileCard file_name={"Shundor File"} file_type={"png"} file_status={1}/>
                </li>
                <li>
                    <FileCard file_name={"Shundor File"} file_type={"pdf"} file_status={1}/>
                </li>
            </ul>
        {:else if tab_active[2]}
            <p class="list-title text-2xl font-bold text-gray-700 dark:text-gray-200">Members</p>
            <ul class="list-elements space-y-2 mt-2 pb-1">
                <li>
                    <MemberCard />
                </li>
            </ul>
        {/if}
    </div>
</div>

<div class="thread-extra-button flex justify-end">
    <button type="button" class="text-white self-end bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Close Thread</button>
</div>

<style>
    .thread-info
    {
        position: absolute;
        top: 0;
        bottom: 3.5rem;
        left: 0;
        right: 0;
    }
    .thread-tabs
    {
        position: absolute;
        top: 0;
        height: 3.5rem;
        left: 0;
        right: 0;
    }
    .tab-item-data
    {
        position: absolute;
        top: 3.5rem;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .thread-extra-button
    {
        position: absolute;
        height: 3.5rem;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .list-title
    {
        position: absolute;
        height: 2rem;
        top: 0;
        left: 0;
        right: 0;
    }
    .list-elements
    {
        position: absolute;
        top: 2rem;
        bottom: 0;
        left: 0;
        right: 0;
        overflow-y: auto;
    }
</style>