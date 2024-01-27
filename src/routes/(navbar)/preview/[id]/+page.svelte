<script lang="ts">
    import { page } from "$app/stores";
    import { common_fetch } from "$lib/fetch_func";
    import { Modal } from "flowbite";
    import { onMount } from "svelte";

    let file_name: string = "";
    let file_type: number = 0;
    let download_anchor: HTMLAnchorElement;
    let file_view_link: string;
    let file_download_link: string;
    let modal_elem: HTMLDivElement;
    let modal_show: boolean = false;
    let modal_obj: Modal;

    function hide_modal(): void
    {
        modal_obj.hide();
    }

    function show_modal(): void
    {
        modal_obj.show();
    }

    onMount(async (): Promise<void> =>
    {
        modal_obj = new Modal(modal_elem,
        {
            onHide: (): void =>
            {
                modal_show = false;
            },
            onShow: (): void =>
            {
                modal_show = false;
            }
        });

        let request_obj: any =
        {
            fileid: $page.params.id,
            user_id: $page.data.session?.user?.name
        };

        common_fetch("/api/files/getfilelink", request_obj,
        async (response: Response): Promise<void> =>
        {
            let response_obj: any = await response.json();
            file_name = response_obj.file_data.filename;
            file_type = response_obj.file_data.file_mimetype;
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
             download_anchor.download = file_download_link;
        });

        common_fetch("/api/files/getfilesigns", request_obj,
        async (response: Response): Promise<void> =>
        {
            let response_obj: any = await response.json();

            console.log(response_obj);
        });
    });
</script>

<div class="preview-root flex flex-col">
    <div class="preview-body flex-grow block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-2">
        {#if file_type === 0}
            <div></div>
        {:else if file_type === 1}
            <img class="img-preview rounded" src={file_view_link} alt="img-placeholder" />
        {:else if file_type === 2}
            <embed class="pdf-preview rounded" src={file_view_link} />
        {/if}
    </div>
    <div class="flex flex-col justify-between block p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
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
        <div class="flex justify-end mt-3">
            <!-- certificate button -->
            <button on:click={show_modal} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">View Certificate</button>
            <!-- download button -->
            <a download={file_name} href={file_download_link} bind:this={download_anchor} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 ms-2">Download</a>
        </div>
    </div>
</div>

<div
  bind:this={modal_elem}
  tabindex="-1"
  aria-hidden="true"
  class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
>
  <div class="relative p-4 w-full max-w-2xl max-h-full">
    <!-- Modal content -->
    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
      <!-- Modal header -->
      <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
          File Certificate
        </h3>
        <button on:click={hide_modal} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="static-modal">
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
      </div>
      <!-- Modal body -->
      <div class="p-4 md:p-5 space-y-4">
        <div class="w-full">
          <p class="text-base font-semibold text-gray-500 dark:text-gray-400">Signed By</p>
          <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">123</p>
          <p class="text-base font-semibold text-gray-500 dark:text-gray-400">Signed On</p>
          <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">123</p>
          <p class="text-base font-semibold text-gray-500 dark:text-gray-400">Signature</p>
          <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">123</p>
          <p class="text-base font-semibold text-gray-500 dark:text-gray-400">Public Key</p>
          <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">123</p>
        </div>
      </div>
    </div>
  </div>
</div>

{#if modal_show}
  <div class="bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40" />
{/if}

<style>
    .preview-root
    {
        position: absolute;
        top: 5.25rem;
        bottom: 1rem;
        left: 20%;
        right: 20%;
    }
    .preview-body
    {
        max-height: 70%;
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