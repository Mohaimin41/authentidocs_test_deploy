<script lang="ts">
    import Anavbar from "$lib/components/a-navbar.svelte";
    import PageRoot from "$lib/components/page-root.svelte";
    import ThreadCard from "$lib/components/thread-card.svelte";
    import { Avatar, Button } from "flowbite-svelte";
    import { onMount } from "svelte";

    let selected_thread_name: string;

    onMount((): void =>
    {
        selected_thread_name = "Thread 1";
    });
</script>

<Anavbar/>

<PageRoot>
    <div class="pg-center flex justify-between">
        <div class="pg-left">
            <div class="thread-list block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <span class="text-2xl font-bold text-gray-900 dark:text-white ms-1">Active Thread</span>
                <ul class="space-y-1 mt-2 pb-2" style="overflow-y: auto;">
                    <li>
                        <ThreadCard thread_name={"Thread 1"} selected={true}/>
                    </li>
                    <li>
                        <ThreadCard thread_name={"Thread 2"}/>
                    </li>
                    <li>
                        <ThreadCard thread_name={"Thread 3"}/>
                    </li>
                </ul>
            </div>
            <div class="add-thread flex flex-row-reverse pt-2">
                <Button>Add Thread</Button>
            </div>
        </div>
        <div class="pg-right">
            <div class="thread-info flex flex-col block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <span class="text-2xl font-medium text-gray-900 dark:text-white">{selected_thread_name}</span>
                <div class="flex flex-grow pt-3">
                    <div class="flex flex-col me-5">
                        <span class="text-xs font-medium text-gray-400 dark:text-white">Moderator</span>
                        <div class="flex pt-2">
                            <Avatar size={"sm"} src="pochita.webp" />
                            <span class="text-lg font-medium text-gray-900 dark:text-white ps-1 my-auto">Mustafa Siam</span>
                        </div>
                    </div>
                    <div class="flex flex-col me-5">
                        <span class="text-xs font-medium text-gray-400 dark:text-white">Members</span>
                        <div class="flex pt-2">
                            <div class="flex -space-x-4 rtl:space-x-reverse ps-4">
                                <Avatar stacked size={"sm"} src="pochita.webp" />
                                <Avatar stacked size={"sm"} src="pochita.webp" />
                                <Avatar stacked size={"sm"} src="pochita.webp" />
                                <Avatar stacked size={"sm"} href="/" class="bg-gray-700 text-white hover:bg-gray-600 text-sm">
                                    <span class="text-xs font-medium">+69</span>
                                </Avatar>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col me-5">
                        <span class="text-xs font-medium text-gray-400 dark:text-white">Files</span>
                        <div class="flex align-center pt-2">
                            <svg class="w-7 h-7 text-blue-500 dark:text-white my-auto" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 20">
                                <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M6 1v4a1 1 0 0 1-1 1H1m14-4v16a.97.97 0 0 1-.933 1H1.933A.97.97 0 0 1 1 18V5.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 5.828 1h8.239A.97.97 0 0 1 15 2Z"/>
                            </svg>
                            <span class="text-lg font-medium text-gray-900 dark:text-white ps-1 my-auto">9</span>
                            <span class="text-lg font-medium text-red-500 dark:text-white ps-1 my-auto">{"["}4 Unsigned{"]"}</span>
                        </div>
                    </div>
                    <div class="flex flex-col me-5">
                        <span class="text-xs font-medium text-gray-400 dark:text-white">Team</span>
                        <div class="flex align-center pt-2">
                            <svg class="w-7 h-7 text-green-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.333 6.764a3 3 0 1 1 3.141-5.023M2.5 16H1v-2a4 4 0 0 1 4-4m7.379-8.121a3 3 0 1 1 2.976 5M15 10a4 4 0 0 1 4 4v2h-1.761M13 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-4 6h2a4 4 0 0 1 4 4v2H5v-2a4 4 0 0 1 4-4Z"/>
                            </svg>
                            <span class="text-lg font-medium text-gray-900 dark:text-white ps-1 my-auto">Team 1</span>
                        </div>
                    </div>
                </div>
                <div class="flex flex-row-reverse items-end">
                    <Button size={"xs"}>Add Member</Button>
                    <div class="pe-1">
                        <Button size={"xs"}>Notify</Button>
                    </div>
                </div>
            </div>
            <div class="thread-files block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                Files
            </div>
            <div class="add-thread flex flex-row-reverse pt-2">
                <div class="ps-2">
                    <Button>Add File</Button>
                </div>
                <Button color={"green"}>Close</Button>
            </div>
        </div>
    </div>
</PageRoot>

<style>
    .pg-center
    {
        position: absolute;
        top: 10vh;
        bottom: 10vh;
        left: 10%;
        right: 10%;
    }
    .pg-left
    {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 75%;
    }
    .thread-list
    {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 7.5%;
    }
    .add-thread
    {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .pg-right
    {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 30%;
        right: 0;
    }
    .thread-info
    {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 70%;
    }
    .thread-files
    {
        position: absolute;
        top: 32.5%;
        left: 0;
        right: 0;
        bottom: 7.5%;
    }
</style>