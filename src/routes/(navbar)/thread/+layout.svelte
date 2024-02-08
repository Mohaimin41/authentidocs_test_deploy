<script lang="ts">
    import FileCard from "$lib/components/thread/file-card.svelte";
    import ThreadCard from "$lib/components/thread/thread-card.svelte";
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
            <ul class="thread-list space-y-2 mx-6 mb-6 pb-1" style="overflow-y: auto;">
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
        <slot></slot>
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
</style>