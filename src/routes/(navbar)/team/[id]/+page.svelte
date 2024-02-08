<script lang="ts">
    import { onMount } from "svelte";
    import ThreadCard from "$lib/components/team/thread-card.svelte";
    
    onMount((): void =>
    {
        
    });
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<div class="team-info block bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <div class="flex m-6">
        <div class="grow">
            <p class="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Team 1</p>
            <div class="grid grid-cols-4 gap-4">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Leader</p>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Members</p>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Threads</p>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Files</p>
                <div class="flex flex-wrap items-center">
                    <img class="w-6 h-6 rounded-full me-2" src="/pochita.webp" alt="Rounded avatar">
                    <p class="text-sm font-medium text-gray-700">Mustafa Siam</p>
                </div>
                <div class="flex -space-x-4 rtl:space-x-reverse">
                    <img class="w-6 h-6 border-2 border-white rounded-full dark:border-gray-800" src="/pochita.webp" alt="">
                    <img class="w-6 h-6 border-2 border-white rounded-full dark:border-gray-800" src="/pochita.webp" alt="">
                    <img class="w-6 h-6 border-2 border-white rounded-full dark:border-gray-800" src="/pochita.webp" alt="">
                    <img class="w-6 h-6 border-2 border-white rounded-full dark:border-gray-800" src="/pochita.webp" alt="">
                    <a class="flex items-center justify-center w-6 h-6 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800" href="#">+69</a>
                </div>
                <div class="flex flex-wrap items-center">
                    <svg class="w-6 h-6 text-blue-500 dark:text-blue-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8v8a5 5 0 1 0 10 0V6.5a3.5 3.5 0 1 0-7 0V15a2 2 0 0 0 4 0V8"/>
                    </svg>
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-200 me-1">9</p>
                    <p class="text-sm font-medium text-green-500 dark:text-green-400">(4 Active)</p>
                </div>
                <div class="flex flex-wrap items-center">
                    <svg class="w-6 h-6 text-blue-500 dark:text-blue-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M10 3v4c0 .6-.4 1-1 1H5m14-4v16c0 .6-.4 1-1 1H6a1 1 0 0 1-1-1V8c0-.4.1-.6.3-.8l4-4 .6-.2H18c.6 0 1 .4 1 1Z"/>
                    </svg>
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-200 me-1">9</p>
                    <p class="text-sm font-medium text-red-500 dark:text-red-400">(4 Unsigned)</p>
                </div>
            </div>
        </div>
        <div class="flex flex-wrap items-end">
            <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1c0 .6-.4 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                </svg>
            </button>
            <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.8 5.5 10.4 3m.4 2.4a5.3 5.3 0 0 1 6 4.3l.4 1.8c.4 2.3 2.4 2.6 2.6 3.7.1.6.2 1.2-.3 1.3L6.8 19c-.5 0-.7-.5-.8-1.1-.2-1.2 1.5-2.1 1.1-4.4l-.3-1.8a5.3 5.3 0 0 1 4-6.2Zm-7 4.4a8 8 0 0 1 2-4.9m2.7 13.7a3.5 3.5 0 0 0 6.7-.8l.1-.5-6.8 1.3Z"/>
                </svg>
            </button>
            <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 4h3c.6 0 1 .4 1 1v15c0 .6-.4 1-1 1H6a1 1 0 0 1-1-1V5c0-.6.4-1 1-1h3m0 3h6m-6 5h6m-6 4h6M10 3v4h4V3h-4Z"/>
                </svg>
            </button>
        </div>
    </div>
</div>

<div class="thread-list-card block bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-2">
    <p class="thread-list-title text-2xl font-semibold text-gray-700 mx-6 mt-6">Threads</p>
    <ul class="thread-elements space-y-2 mt-2 pb-1 mx-6 mb-6">
        <li>
            <ThreadCard thread_name={"Thread 1"} />
        </li>
        <li>
            <ThreadCard thread_name={"Thread 1"} />
        </li>
        <li>
            <ThreadCard thread_name={"Thread 1"} />
        </li>
        <li>
            <ThreadCard thread_name={"Thread 1"} />
        </li>
        <li>
            <ThreadCard thread_name={"Thread 1"} />
        </li>
        <li>
            <ThreadCard thread_name={"Thread 1"} />
        </li>
        <li>
            <ThreadCard thread_name={"Thread 1"} />
        </li>
        <li>
            <ThreadCard thread_name={"Thread 1"} />
        </li>
        <li>
            <ThreadCard thread_name={"Thread 1"} />
        </li>
        <li>
            <ThreadCard thread_name={"Thread 1"} />
        </li>
        <li>
            <ThreadCard thread_name={"Thread 1"} />
        </li>
        <li>
            <ThreadCard thread_name={"Thread 1"} />
        </li>
    </ul>
</div>
<div class="thread-button flex justify-end items-end">
    <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Create Thread</button>
</div>

<style>
    .team-info
    {
        position: absolute;
        top: 0;
        height: 10rem;
        left: 0;
        right: 0;
    }
    .thread-list-card
    {
        position: absolute;
        top: 10rem;
        bottom: 3.5rem;
        left: 0;
        right: 0;
    }
    .thread-list-title
    {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .thread-button
    {
        position: absolute;
        height: 3.5rem;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .thread-elements
    {
        position: absolute;
        top: 3rem;
        bottom: 0;
        left: 0;
        right: 0;
        overflow-y: auto;
    }
</style>