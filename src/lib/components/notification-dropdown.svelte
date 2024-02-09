<script lang="ts">
    import { page } from "$app/stores";
    import { initDropdowns } from "flowbite";
    import { onMount } from "svelte";

    class Notification
    {
        public content: string = "";
        public seen: boolean = false;
    }

    let notifications: Notification[] = [];
    let available: boolean;

    $: available = notifications.length > 0;

    onMount((): void =>
    {
        initDropdowns();

        fetch("/api/user/getnotifications",
        {
            method: "POST",
            headers:
            {
                "content-type": "application/json"
            },
            body: JSON.stringify(
            {
                user_id: $page.data.session?.user?.name
            })
        }).then(async (response: Response): Promise<void> =>
        {
            let response_obj: any = await response.json();
            
            console.log(response_obj);

            notifications = new Array(response_obj.length);

            for(let i: number = 0; i < notifications.length; ++i)
            {
                notifications[i] = new Notification();
                notifications[i].content = response_obj[i].f_content;
                notifications[i].seen = response_obj[i].f_is_seen;
            }
        });
    });
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<button id="notification-button" data-dropdown-toggle="notification-dropdown" class="py-2 px-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 me-2">
    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5.4V3m0 2.4a5.3 5.3 0 0 1 5.1 5.3v1.8c0 2.4 1.9 3 1.9 4.2 0 .6 0 1.3-.5 1.3h-13c-.5 0-.5-.7-.5-1.3 0-1.2 1.9-1.8 1.9-4.2v-1.8A5.3 5.3 0 0 1 12 5.4ZM8.7 18c.1.9.3 1.5 1 2.1a3.5 3.5 0 0 0 4.6 0c.7-.6 1.3-1.2 1.4-2.1h-7Z"/>
    </svg>
</button>

<!-- Dropdown menu -->
<div id="notification-dropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-96 dark:bg-gray-700">
    <p class="text-2xl font-semibold text-gray-700 truncate dark:text-white my-2 mx-4">Notifications</p>
    <ul class="max-w-md divide-y divide-gray-200 dark:divide-gray-700 my-2 mx-4">
        {#each notifications as notification}
            <li class="py-3 sm:py-4">
                <div class="flex items-center justify-between space-x-4 rtl:space-x-reverse">
                    <p class="text-sm font-medium text-gray-700 truncate dark:text-white">
                        {notification.content}
                    </p>
                    <button type="button" class="py-2 px-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" disabled={notification.seen}>
                        <svg class="w-4 h-4 text-green-600 dark:text-green-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                        </svg>
                    </button>
                </div>
            </li>
        {/each}
    </ul>
    {#if available}
        <div class="flex justify-end">
            <!-- svelte-ignore a11y-invalid-attribute -->
            <a href="javascript:" class="font-medium text-blue-600 dark:text-blue-500 hover:underline my-2 mx-4">Mark All Read</a>
        </div>
    {/if}
</div>