<script lang="ts">
    import { page } from "$app/stores";
    import { common_fetch } from "$lib/fetch_func";
    import { onMount } from "svelte";

    let file_name: string = "";
    let file_type: number = 0;
    let download_anchor: HTMLAnchorElement;

    let file_view_link: string ="";
    let file_download_link: string="";

    onMount(async (): Promise<void> =>
    {
        let request_obj: any =
        {
            fileid: $page.params.id,
            user_id: $page.data.session?.user?.name
        };
        common_fetch("/api/files/getfilelink", request_obj,
        async (response: Response): Promise<void> =>
        {
            let response_obj: any = await response.json();
            console.log(response_obj);
             file_name = response_obj.file_data.filename;
             file_type = response_obj.file_data.file_mimetype;

             console.log(file_name);

            let mime_text: string = "Application/octet-stream";

            if(file_type === 1)
            {
                mime_text = "image/*";
            }
            else if(file_type === 2)
            {
                mime_text = "Application/pdf";
            }
            
             file_view_link =response_obj.file_link_preview;
             file_download_link = response_obj.file_link_download;
             console.log(file_view_link)
             console.log(file_download_link)
             download_anchor.download = file_download_link;
        });

    });
</script>

<div class="preview-root">
    <div class="preview-body block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-2">
        {#if file_type === 0}
            <div></div>
        {:else if file_type === 1}
            <img class="img-preview rounded" src={file_view_link} alt="img-placeholder" />
        {:else if file_type === 2}
            <embed class="pdf-preview rounded" src={file_view_link} />
        {/if}
    </div>
    <div class="preview-meta flex flex-col justify-between block p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div class="meta-data">
            <p class="text-2xl font-medium text-gray-900 dark:text-white mb-2">{file_name}</p>
            <div class="grid grid-cols-6 gap-1 me-6">
                <div>
                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Uploader</p>
                </div>
                <div>
                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Signed By</p>
                </div>
                <div>
                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Uploaded On</p>
                </div>
                <div>
                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Current Custody</p>
                </div>
                <div>
                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Current State</p>
                </div>
                <div>
                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Current Work Thread</p>
                </div>
                <div class="flex items-center">
                    <img class="w-5 h-5 rounded-full me-2" src="/pochita.webp" alt="Rounded avatar">
                    <p class="text-xs font-medium text-gray-900 dark:text-white">Mohaemen</p>
                </div>
                <div class="flex -space-x-2 rtl:space-x-reverse items-center">
                    <img class="w-5 h-5 border-2 border-white rounded-full dark:border-gray-800" src="/pochita.webp" alt="">
                    <img class="w-5 h-5 border-2 border-white rounded-full dark:border-gray-800" src="/pochita.webp" alt="">
                    <img class="w-5 h-5 border-2 border-white rounded-full dark:border-gray-800" src="/pochita.webp" alt="">
                    <!-- svelte-ignore a11y-invalid-attribute -->
                    <a class="flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800" href="javascript:">+69</a>
                </div>
                <div class="flex flex-col justify-center">
                    <p class="text-xs font-medium text-gray-900 dark:text-white">29 November 2023</p>
                    <p class="text-xs font-medium text-gray-900 dark:text-white">07:45 PM</p>
                </div>
                <div class="flex items-center">
                    <img class="w-5 h-5 rounded-full me-2" src="/pochita.webp" alt="Rounded avatar">
                    <p class="text-xs font-medium text-gray-900 dark:text-white">Mohaemen</p>
                </div>
                <div class="flex items-center">
                    <p class="text-xs font-medium text-gray-900 dark:text-white">Viewed</p>
                </div>
                <div class="flex items-center">
                    <p class="text-xs font-medium text-gray-900 dark:text-white">Thread 2 @ Team 4</p>
                </div>
            </div>
        </div>
        <div class="flex justify-end">
            <!-- certificate button -->
            <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">View Certificate</button>
            <!-- download button -->
            <a download={file_name} href={file_download_link} bind:this={download_anchor} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 ms-2">Download</a>
        </div>
    </div>
</div>

<style>
    .preview-root
    {
        position: absolute;
        top: 12vh;
        bottom: 2vh;
        left: 20%;
        right: 20%;
    }
    .preview-body
    {
        position: absolute;
        top: 0;
        bottom: 30%;
        left: 0;
        right: 0;
    }
    .preview-meta
    {
        position: absolute;
        top: 70%;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .img-preview
    {
        height: 100%;
        margin-left: auto;
        margin-right: auto;
    }
    .pdf-preview
    {
        width: 100%;
        height: 100%;
    }
</style>