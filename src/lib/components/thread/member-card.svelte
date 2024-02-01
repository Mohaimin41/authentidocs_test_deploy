<script lang="ts">
    let name: string = "Member 1";
    let type: string = "Member"
    let serial: number = 69;
    let pubkey: string = "0499cb82c6ebb2ae7d2bffb6071fa0499cb82c6ebb2ae7d2bffb6071fa0499cb82c6ebb2ae7d2bffb6071fa";
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<a href="#" class="block flex space-x-2 p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
    <img class="w-10 h-10 rounded-full" src="/pochita.webp" alt="Rounded avatar">
    <div class="grow">
        <p class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{name}</p>
        <div class="flex justify-between items-end">
            <p class="text-base font-semibold text-blue-500 dark:text-blue-400 me-2">{type}</p>
            <p class="text-sm font-semibold text-gray-500 dark:text-green-400">Siging Serial: {serial}</p>
        </div>
    </div>
</a>