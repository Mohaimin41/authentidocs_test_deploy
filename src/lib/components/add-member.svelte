<script lang="ts">
    import type { AddableMemberObj } from "$lib/containers";
    import { Modal } from "flowbite";
    import { onMount } from "svelte";

    export let id: string;
    let modal_elem: HTMLDivElement;
    let addable_members: AddableMemberObj[] = [];
    export let modal: Modal;
    export let get_addable_members: (id: string) => Promise<AddableMemberObj[]>;
    export let add_member: (id: string, members: AddableMemberObj[]) => any;

    onMount((): void =>
    {
        modal = new Modal(modal_elem);

        get_addable_members(id).then((value: AddableMemberObj[]): void =>
        {
            addable_members = Array.from(value);
        });
    });
</script>

<div bind:this={modal_elem} data-modal-backdrop="static" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-2xl max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    Select Thread Members
                </h3>
                <button on:click={() => {modal.hide();}} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <div class="p-4 md:p-5 space-y-4">
                <form on:submit={() => {add_member(id, addable_members);}} class="mx-auto">
                    {#each addable_members as member}
                        <div class="flex items-center mb-4">
                            <input bind:checked={member.checked} id="checkbox-{member.id}" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" >
                            <label for="checkbox-1" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{member.name}</label>
                        </div>
                    {/each}
                    <div class="flex justify-end">
                        <button type="submit" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Confirm</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>