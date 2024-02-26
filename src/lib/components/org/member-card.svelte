<script lang="ts">
    import { initModals } from "flowbite";
    import { onMount } from "svelte";

    export let id: string;
    export let name: string;
    export let type: string;
    export let serial: number;
    export let joined: Date;
    let joined_date_text: string;
    let joined_time_text: string;

    $: joined_date_text = joined?.toLocaleDateString();
    $: joined_time_text = joined?.toLocaleTimeString();

    onMount((): void =>
    {
        initModals();

        if('a'.charCodeAt(0) <= type.charCodeAt(0) && type.charCodeAt(0) <= 'z'.charCodeAt(0))
        {
            type = String.fromCharCode(type.charCodeAt(0) - 'a'.charCodeAt(0) + 'A'.charCodeAt(0)) + type.substring(1);
        }
    })
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<button data-modal-target="member-modal-{id}" data-modal-toggle="member-modal-{id}" class="block text-start flex space-x-2 p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700" style="width: 100%;">
    <img class="w-10 h-10 rounded-full" src="/pochita.webp" alt="Rounded avatar">
    <div class="grow">
        <p class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{name}</p>
        <div class="flex justify-between items-end">
            <p class="text-base font-semibold text-blue-500 dark:text-blue-400 me-2">{type}</p>
        </div>
    </div>
</button>

<div id="member-modal-{id}" data-modal-backdrop="static" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-2xl max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <!-- Modal body -->
            <div class="p-4 md:p-5 space-y-4">
                <div class="flex justify-end">
                    <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="member-modal-{id}">
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <div class="flex flex-col items-center">
                    <img class="w-24 h-24 rounded-full mb-4" src="/pochita.webp" alt="Rounded avatar">
                    <p class="text-2xl font-semibold text-gray-700">{name}</p>
                    <p class="text-xl font-medium text-gray-500">{type}</p>
                    <p class="text-lg font-medium text-gray-500">Added on: {joined_date_text}</p>
                    <p class="text-lg font-medium text-gray-500">Viewed 4 out of 5 files, Signed 2 out of 5 files</p>
                </div>
                <div class="flex justify-end">
                    <div class="flex items-center">
                        <p class="text-gray-600 me-1">Siging Serial</p>
                        <input bind:value={serial} type="number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 me-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" style="max-width: 5em;">
                    </div>
                    <!-- Make Moderator -->
                    {#if type === "Member"}
                        <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Make Moderator</button>
                    {/if}
                    <!-- Remove -->
                    <button type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Remove</button>
                </div>
            </div>
        </div>
    </div>
</div>