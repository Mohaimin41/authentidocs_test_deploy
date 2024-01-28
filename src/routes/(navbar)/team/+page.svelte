<script lang="ts">
    import FileCard from "$lib/components/team/file-card.svelte";
    import ThreadCard from "$lib/components/team/thread-card.svelte";
    import { Avatar, Button } from "flowbite-svelte";
    import { onMount } from "svelte";

    let selected_thread_name: string;

    onMount((): void =>
    {
        selected_thread_name = "Thread 1";
    });
</script>

<div class="pg-center flex justify-between">
    <div class="pg-left">
        <div class="thread-list-container block bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <p class="thread-list-title text-2xl font-bold text-gray-900 dark:text-white mx-6 mt-6 ps-1">Active Thread</p>
            <ul class="thread-list space-y-2 mx-6 mb-6 pb-2" style="overflow-y: auto;">
                <li>
                    <ThreadCard thread_name={"Thread 1"} selected={true}/>
                </li>
                <li>
                    <ThreadCard thread_name={"Thread 2"}/>
                </li>
                <li>
                    <ThreadCard thread_name={"Thread 3"}/>
                </li>
                <li>
                    <ThreadCard thread_name={"Thread 4"}/>
                </li>
                <li>
                    <ThreadCard thread_name={"Thread 5"}/>
                </li>
                <li>
                    <ThreadCard thread_name={"Thread 6"}/>
                </li>
                <li>
                    <ThreadCard thread_name={"Thread 7"}/>
                </li>
                <li>
                    <ThreadCard thread_name={"Thread 8"}/>
                </li>
                <li>
                    <ThreadCard thread_name={"Thread 9"}/>
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
                <div class="flex flex-col me-10">
                    <span class="text-sm font-medium text-gray-400 dark:text-white">Moderator</span>
                    <div class="flex pt-2">
                        <Avatar size={"sm"} src="pochita.webp" />
                        <span class="text-lg font-medium text-gray-800 dark:text-gray-100 ps-1 my-auto">Mustafa Siam</span>
                    </div>
                </div>
                <div class="flex flex-col me-10">
                    <span class="text-sm font-medium text-gray-400 dark:text-white">Members</span>
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
                <div class="flex flex-col me-10">
                    <span class="text-sm font-medium text-gray-400 dark:text-white">Files</span>
                    <div class="flex align-center pt-2">
                        <svg class="w-6 h-6 text-blue-500 dark:text-blue-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2Z"/>
                        </svg>
                        <span class="text-lg font-medium text-gray-800 dark:text-gray-100 ps-1 my-auto">9</span>
                        <span class="text-lg font-medium text-red-500 dark:text-red-400 ps-1 my-auto">{"["}4 Unsigned{"]"}</span>
                    </div>
                </div>
                <div class="flex flex-col me-10">
                    <span class="text-sm font-medium text-gray-400 dark:text-white">Team</span>
                    <div class="flex align-center pt-2">
                        <svg class="w-6 h-6 text-green-500 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 19">
                            <path d="M14.5 0A3.987 3.987 0 0 0 11 2.1a4.977 4.977 0 0 1 3.9 5.858A3.989 3.989 0 0 0 14.5 0ZM9 13h2a4 4 0 0 1 4 4v2H5v-2a4 4 0 0 1 4-4Z"/>
                            <path d="M5 19h10v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2ZM5 7a5.008 5.008 0 0 1 4-4.9 3.988 3.988 0 1 0-3.9 5.859A4.974 4.974 0 0 1 5 7Zm5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5-1h-.424a5.016 5.016 0 0 1-1.942 2.232A6.007 6.007 0 0 1 17 17h2a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5ZM5.424 9H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h2a6.007 6.007 0 0 1 4.366-5.768A5.016 5.016 0 0 1 5.424 9Z"/>
                        </svg>
                        <span class="text-lg font-medium text-gray-800 dark:text-gray-100 ps-1 my-auto">Team 1</span>
                    </div>
                </div>
            </div>
            <div class="flex flex-row-reverse items-end">
                <Button>Add Member</Button>
                <div class="pe-2">
                    <Button>Notify</Button>
                </div>
            </div>
        </div>
        <div class="thread-files block bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <p class="thread-files-title text-2xl font-bold text-gray-900 dark:text-white mx-6 mt-6 pb-3 ps-1">Files</p>
            <ul class="thread-files-list space-y-2 mb-6 mx-6 pb-2" style="overflow-y: auto;">
                <li>
                    <FileCard file_type={"png"} file_name={"File 1"} file_status={0}/>
                </li>
                <li>
                    <FileCard file_type={"jpg"} file_name={"File 2"} file_status={1}/>
                </li>
                <li>
                    <FileCard file_type={"pdf"} file_name={"File 3"} file_status={2}/>
                </li>
                <li>
                    <FileCard file_type={"pdf"} file_name={"File 4"} file_status={1}/>
                </li>
            </ul>
        </div>
        <div class="add-thread flex flex-row-reverse pt-2">
            <div class="ps-2">
                <Button>Add File</Button>
            </div>
            <Button color={"green"}>Close</Button>
        </div>
    </div>
</div>

<style>
    .pg-center
    {
        position: absolute;
        top: 12vh;
        bottom: 4vh;
        left: 10%;
        right: 10%;
    }
    .pg-left
    {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 70%;
    }
    .thread-list-container
    {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 7.5%;
    }
    .thread-list-title
    {
        position: absolute;
        top: 0;
        bottom: 92vh;
        left: 0;
        right: 0;
    }
    .thread-list
    {
        position: absolute;
        top: 8vh;
        bottom: 0;
        left: 0;
        right: 0;
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
        left: 32.5%;
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
    .thread-files-title
    {
        position: absolute;
        top: 0;
        bottom: 92vh;
        left: 0;
        right: 0;
    }
    .thread-files-list
    {
        position: absolute;
        top: 8vh;
        bottom: 0;
        left: 0;
        right: 0;
    }
</style>