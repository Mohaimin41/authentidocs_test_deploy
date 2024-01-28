<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { common_fetch } from "$lib/fetch_func";
    import { Modal } from "flowbite";
    import { onMount } from "svelte";
    import { logged_in_store, uid, useremail } from "../../../../stores";

    class Signature
    {
        public by: string = "";
        public on: string = "";
        public signature: string = "";
        public pubkey: string = "";
    };

    let certificates: Signature[] = [];
    let file_name: string = "";
    let file_type: number = 0;
    let download_anchor: HTMLAnchorElement;
    let file_view_link: string;
    let file_download_link: string;
    let modal_elem: HTMLDivElement;
    let modal_show: boolean = false;
    let modal_obj: Modal;
    let file_loaded: boolean = false;

    function hide_modal(): void
    {
        modal_obj.hide();
    }

    function show_modal(): void
    {
        modal_obj.show();
    }
    let response_obj:any={};
    let username:string;
    let current_custody:string;
    let upload_timestamp:string;
    let current_state:string;
    let upload_date:string|undefined;
    let upload_time:string|undefined;

    onMount(async (): Promise<void> =>
    {
        file_loaded = false;

        if ($page.data.session === null) {
            goto("/");
        } else {
            logged_in_store.set(true);
            uid.set($page.data.session?.user?.name as string)
            useremail.set($page.data.session?.user?.email as string)
        }

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
             response_obj = await response.json();
             file_name = response_obj.file_data.filename;
             file_type = response_obj.file_data.file_mimetype;
             username=response_obj.file_data.username;
             upload_timestamp=response_obj.file_data.created_at;
             current_state=response_obj.file_data.current_state;
             if(upload_timestamp!== undefined)
             {
             upload_date=upload_timestamp.split("T").reverse().pop();
             let temp_time:string|undefined;
             temp_time=upload_timestamp.split("T").pop();
             if(temp_time!=undefined)
             upload_time=temp_time.split(".").reverse().pop();
             }

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
             file_loaded = true;
        });

        common_fetch("/api/files/getfilesigns", request_obj,
        async (response: Response): Promise<void> =>
        {
            let response_obj: any = await response.json();
            certificates = [];

            for(let i: number = 0; i < response_obj.length; ++i)
            {
                let new_certificate: Signature = new Signature();
                new_certificate.by = response_obj[i].f_signing_username;
                new_certificate.on = response_obj[i].f_created_at;
                new_certificate.signature = response_obj[i].f_signature;
                new_certificate.pubkey = [...new Uint8Array(new TextEncoder().encode(JSON.stringify(response_obj[i].f_signing_key)))].map((x) => x.toString(16).padStart(2, "0")).join("");

                certificates.push(new_certificate);
            }
        });
    });
</script>

<div class="preview-root flex flex-col">
    <div class="preview-body flex-grow block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-2">
        {#if file_loaded}
            {#if file_type === 3}
                <!-- <div class="inline-block align-middle" ><center><h1>No preview available for this file type.</h1> </center></div> -->
                <img class="img-preview rounded" src={"/no_preview.jpg"} alt="No preview available for this file type." />
            {:else if file_type === 1}
                <img class="img-preview rounded" src={file_view_link} alt="img-placeholder" />
            {:else if file_type === 2}
                <embed class="pdf-preview rounded" src={file_view_link} />
            {:else}
                <div class="flex flex-col justify-center" style="height: 100%;">
                    <div class="flex items-center justify-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                        <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                        </svg>
                        <span class="sr-only">Info</span>
                        <div>
                            <p>No Preview Available T_T</p>
                        </div>
                    </div>
                </div>
            {/if}
        {:else}
            <div class="file-loader flex justify-center items-center">
                <div role="status">
                    <svg aria-hidden="true" class="w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        {/if}
    </div>
    <div class="flex flex-col justify-between block p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        {#if file_loaded}
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
                        <p class="text-xs font-medium text-gray-900 dark:text-white">{username}</p>
                    </div>
                    <div class="flex -space-x-2 rtl:space-x-reverse items-center">
                        <img class="w-5 h-5 border-2 border-white rounded-full dark:border-gray-800" src="/pochita.webp" alt="">
                        <img class="w-5 h-5 border-2 border-white rounded-full dark:border-gray-800" src="/pochita.webp" alt="">
                        <img class="w-5 h-5 border-2 border-white rounded-full dark:border-gray-800" src="/pochita.webp" alt="">
                        <!-- svelte-ignore a11y-invalid-attribute -->
                        <a class="flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800" href="javascript:">+69</a>
                    </div>
                    <div class="flex flex-col justify-center">
                        <p class="text-xs font-medium text-gray-900 dark:text-white">{upload_date}</p>
                        <p class="text-xs font-medium text-gray-900 dark:text-white">{upload_time}</p>
                    </div>
                    <div class="flex items-center">
                        <img class="w-5 h-5 rounded-full me-2" src="/pochita.webp" alt="Rounded avatar">
                        <p class="text-xs font-medium text-gray-900 dark:text-white">{username}</p>
                    </div>
                    <div class="flex items-center">
                        <p class="text-xs font-medium text-gray-900 dark:text-white">{current_state}</p>
                    </div>
                    <div class="flex items-center">
                        <p class="text-xs font-medium text-gray-900 dark:text-white">Thread 2 @ Team 4</p>
                    </div>
                </div>
            </div>
        {:else}
            <div class="meta-data">
                <div role="status" class="max-w-sm animate-pulse">
                    <div class="h-8 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-2"></div>
                </div>
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
                        <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-10"></div>
                    </div>
                    <div class="flex -space-x-2 rtl:space-x-reverse items-center">
                        <img class="w-5 h-5 border-2 border-white rounded-full dark:border-gray-800" src="/pochita.webp" alt="">
                        <img class="w-5 h-5 border-2 border-white rounded-full dark:border-gray-800" src="/pochita.webp" alt="">
                        <img class="w-5 h-5 border-2 border-white rounded-full dark:border-gray-800" src="/pochita.webp" alt="">
                        <!-- svelte-ignore a11y-invalid-attribute -->
                        <a class="flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800" href="javascript:">+69</a>
                    </div>
                    <div class="flex flex-col justify-center">
                        <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-10"></div>
                        <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-10"></div>
                    </div>
                    <div class="flex items-center">
                        <img class="w-5 h-5 rounded-full me-2" src="/pochita.webp" alt="Rounded avatar">
                        <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-10"></div>
                    </div>
                    <div class="flex items-center">
                        <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-10"></div>
                    </div>
                    <div class="flex items-center">
                        <p class="text-xs font-medium text-gray-900 dark:text-white">Thread 2 @ Team 4</p>
                    </div>
                </div>
            </div>
        {/if}
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
        {#each certificates as  certificate}
            <div class="w-full">
                <p class="text-base font-semibold text-gray-500 dark:text-gray-400">Signed By</p>
                <p class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">{certificate.by}</p>
                <p class="text-base font-semibold text-gray-500 dark:text-gray-400">Signed On</p>
                <p class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">{certificate.on}</p>
                <p class="text-base font-semibold text-gray-500 dark:text-gray-400">Signature</p>
                <div class="mb-2" style="max-width: 100%; overflow-x: auto">
                    <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">{certificate.signature}</p>
                </div>
                <p class="text-base font-semibold text-gray-500 dark:text-gray-400">Public Key</p>
                <div class="mb-2" style="max-width: 100%; overflow-x: auto">
                    <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">{certificate.pubkey}</p>
                </div>
            </div>
        {/each}
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
        height: 70%;
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
    .file-loader
    {
        height: 100%;
    }
</style>