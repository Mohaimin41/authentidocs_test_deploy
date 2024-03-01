<script lang="ts">
    import type { ForumMessage } from "$lib/containers";
    import ForumPost from "$lib/components/forum-post.svelte";

    export let message: ForumMessage;
    let children: ForumMessage[];
    let reply_mode: boolean = false;

    $: children = message.children;
</script>

<div class="flex items-start gap-2.5 p-2">
    <img class="w-8 h-8 rounded-full" src="/pochita.webp" alt="alt-img">
    <div class="w-full">
        <div class="flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
            <div class="flex items-center space-x-2 rtl:space-x-reverse">
                <span class="text-sm font-semibold text-gray-900 dark:text-white">{message.sender}</span>
                <span class="text-sm font-normal text-gray-500 dark:text-gray-400">11:46</span>
            </div>
            <p class="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{message.content}</p>
            <div class="flex justify-end">
                {#if reply_mode}
                    <div class="w-full">
                        <textarea rows="1" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" autocomplete="off"></textarea>
                        <div class="flex justify-end mt-2">
                            <button type="button" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Post</button>
                            <button on:click={() => {reply_mode = false;}} type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Cancel</button>
                        </div>
                    </div>
                {:else}
                    <button on:click={() => {reply_mode = true;}} class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Reply</button>
                {/if}
            </div>
        </div>
        {#each children as message}
            <ForumPost message={message} />
        {/each}
    </div>
</div>