<script lang="ts">
  import { Modal } from "flowbite";
  import { page } from "$app/stores";
  import FileCard from "$lib/components/home/file-card.svelte";
  import TeamCard from "$lib/components/home/team-card.svelte";
  import ThreadCard from "$lib/components/home/thread-card.svelte";
  import { afterNavigate, goto } from "$app/navigation";
  import { logged_in_store, priv_key, uid } from "../../../stores";
  import { get } from "svelte/store";
  import {common_fetch} from "$lib/fetch_func"

  let file_input_elem: HTMLInputElement;
  let modal_elem: HTMLDivElement;
  let modal_obj: Modal;

  /**
   * Decides which tab to show according to these values:
   *
   * 0 -> my personal files
   *
   * 1 -> my teams
   *
   * 2 -> active threads
   *
   * 3 -> archived threads
   *
   * 4 -> notices
   */
  let tab_index: number = 0;
  let color: string[] = new Array(5).fill("bg-white dark:bg-gray-800");

  function reset_color(): void {
    color.map((value: string, index: number, array: string[]): void => {
      array[index] = "bg-white dark:bg-gray-800";
    });
  }

  /**
   * tab list element data object
   */
  class Tab {
    public name!: string;
    /**
     * this callback is supposed to set tab_index
     */
    public callback!: () => void;
  }

  let tabs: Tab[] = new Array(5);

  for (let i: number = 0; i < tabs.length; ++i) {
    tabs[i] = new Tab();

    tabs[i].callback = (): void => {
      reset_color();

      color[i] = "bg-gray-200 dark:bg-gray-600";
      tab_index = i;
    };
  }

  tabs[0].name = "My Personal Files";
  tabs[1].name = "My Teams";
  tabs[2].name = "Active Threads";
  tabs[3].name = "Archived Threads";
  tabs[4].name = "Notices";

  /**
   * file list element data object
   */
  class File {
    public name!: string;
    public type!: string;
  }

  let personal_files: File[] = new Array(0);

  for (let i: number = 0; i < personal_files.length; ++i) {
    personal_files[i] = new File();
    personal_files[i].name = "Personal File " + (i + 1).toString();
    personal_files[i].type = ["png", "pdf", "jpg"][
      Math.round(Math.random() * 2)
    ];
  }

  /**
   * team list element data object
   */
  class Team {
    public name!: string;
  }

  let teams: Team[] = new Array(5);

  for (let i: number = 0; i < teams.length; ++i) {
    teams[i] = new Team();
    teams[i].name = "Team " + (i + 1).toString();
  }

  /**
   * thread list item
   */
  class Thread {
    public name!: string;
  }

  let act_threads: Thread[] = new Array(69);
  let arch_threads: Thread[] = new Array(12);

  function show_modal(): void {
    modal_obj.show();
  }

  function hide_modal(): void {
    modal_obj.hide();
  }

  afterNavigate((): void => {
    if($page.data.session === null) {
      goto("/");
    } else {
      logged_in_store.set(true);
    }

    file_input_elem.onchange = (event: Event): void => {
      modal_obj.hide();

      if (file_input_elem.files === null) {
        return;
      }

      let file: globalThis.File = file_input_elem.files[0];

      if (file === null) {
        return;
      }

      let file_reader: FileReader = new FileReader();

      file_reader.onload = async (
        event: ProgressEvent<FileReader>
      ): Promise<void> => {
        let file_buffer: ArrayBuffer = file_reader.result as ArrayBuffer;
        let subtle_crypto = window.crypto.subtle;
        let temp_priv_key = get(priv_key);

        if (temp_priv_key) {
          let signature: ArrayBuffer = await subtle_crypto.sign(
            {
              name: "ECDSA",
              hash: { name: "SHA-384" },
            },
            temp_priv_key,
            file_buffer
          );

          let request_obj: any = {
            filename: file.name,
            userid: $page.data.session?.user?.name,
            file: Array.from(new Uint8Array(file_buffer))
          };

          common_fetch("/api/files/addpersonalfile", request_obj,
          async (response: Response): Promise<void> =>
          {
            let response_obj: any = await response.json();
            let signature_hex: string = [...new Uint8Array(signature)].map(x => x.toString(16).padStart(2, '0')).join('');

            let pubkey_json: string | null = localStorage.getItem("pub_key");

            if(pubkey_json)
            {
              let jwk_key =<JsonWebKey> JSON.parse(pubkey_json);
                console.log(typeof jwk_key);
              let pub_key= await subtle_crypto.importKey(
                "jwk",
                jwk_key,
                {
                  name: "ECDSA",
                  namedCurve: "P-384",
                },
                true,
                ["verify"]
              );

              let request_obj: any =
              {
                fileid: response_obj,
                signature: signature_hex,
                key: pub_key,
                userid: $page.data.session?.user?.name
              };

              common_fetch("/api/files/addfilesignature", request_obj,
              async (response: Response): Promise<void> =>
              {
                let response_obj: any = await response.json();

                console.log(response_obj);
              });
            }
          });
        }
      };

      file_reader.readAsArrayBuffer(file);
    };

    modal_obj = new Modal(modal_elem);

    tabs[0].callback();

    for (let i: number = 0; i < act_threads.length; ++i) {
      act_threads[i] = new Thread();
      act_threads[i].name = "Thread " + (i + 1).toString();
    }

    for (let i: number = 0; i < arch_threads.length; ++i) {
      arch_threads[i] = new Thread();
      arch_threads[i].name = "Thread " + (i + 1).toString();
    }
    let request_obj: any = {
      given_userid: $page.data.session?.user?.name,
    };

    common_fetch(
      "/api/files/getpersonalfiles",
      request_obj,
      async (response: Response): Promise<void> => {
      let response_obj: any = await response.json();
      personal_files = [];

      for (let i: number = 0; i < response_obj.length; ++i) {
        personal_files[i] = new File();
        personal_files[i].name = response_obj[i].f_filename;
        personal_files[i].type = response_obj[i].f_file_extension;
      }
    }
    )

     });
</script>

<div class="pg-center flex">
  <!-- Select Tabs to see various lists -->
  <div
    class="pg-left block bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
  >
    <!-- svelte-ignore a11y-invalid-attribute -->
    <ul class="space-y-2 mx-6 mt-6 mb-6 pb-2" style="overflow-y: auto;">
      <!-- My personal files -->
      <li>
        <a
          href="javascript:"
          class="flex {color[0]} items-center block p-6 border border-gray-200 rounded-lg shadow dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          on:click={tabs[0].callback}
        >
          <svg
            class="w-8 h-8 text-blue-500 dark:text-blue-400 pe-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"
            />
          </svg>
          <p class="text-2xl font-semibold text-gray-900 dark:text-white">
            My Personal Files
          </p>
        </a>
      </li>
      <!-- My teams -->
      <li>
        <a
          href="javascript:"
          class="flex {color[1]} items-center block p-6 border border-gray-200 rounded-lg shadow dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          on:click={tabs[1].callback}
        >
          <svg
            class="w-8 h-8 text-green-500 dark:text-green-400 pe-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 19"
          >
            <path
              d="M14.5 0A3.987 3.987 0 0 0 11 2.1a4.977 4.977 0 0 1 3.9 5.858A3.989 3.989 0 0 0 14.5 0ZM9 13h2a4 4 0 0 1 4 4v2H5v-2a4 4 0 0 1 4-4Z"
            />
            <path
              d="M5 19h10v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2ZM5 7a5.008 5.008 0 0 1 4-4.9 3.988 3.988 0 1 0-3.9 5.859A4.974 4.974 0 0 1 5 7Zm5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5-1h-.424a5.016 5.016 0 0 1-1.942 2.232A6.007 6.007 0 0 1 17 17h2a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5ZM5.424 9H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h2a6.007 6.007 0 0 1 4.366-5.768A5.016 5.016 0 0 1 5.424 9Z"
            />
          </svg>
          <p class="text-2xl font-semibold text-gray-900 dark:text-white">
            My Teams
          </p>
        </a>
      </li>
      <!-- active threads -->
      <li>
        <a
          href="javascript:"
          class="flex {color[2]} items-center block p-6 border border-gray-200 rounded-lg shadow dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          on:click={tabs[2].callback}
        >
          <svg
            class="w-8 h-8 text-red-500 dark:text-red-400 pe-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 12 20"
          >
            <path
              stroke="currentColor"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 6v8a5 5 0 1 0 10 0V4.5a3.5 3.5 0 1 0-7 0V13a2 2 0 0 0 4 0V6"
            />
          </svg>
          <p class="text-2xl font-semibold text-gray-900 dark:text-white">
            Active Threads ({act_threads.length})
          </p>
        </a>
      </li>
      <!-- Archived Threads -->
      <li>
        <a
          href="javascript:"
          class="flex {color[3]} items-center block p-6 border border-gray-200 rounded-lg shadow dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          on:click={tabs[3].callback}
        >
          <svg
            class="w-8 h-8 text-yellow-500 dark:text-yellow-400 pe-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 18"
          >
            <path
              d="M18 5H0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-7.258-2L9.092.8a2.009 2.009 0 0 0-1.6-.8H2.049a2 2 0 0 0-2 2v1h10.693Z"
            />
          </svg>
          <p class="text-2xl font-semibold text-gray-900 dark:text-white">
            Archived Threads
          </p>
        </a>
      </li>
      <!-- Notices -->
      <li>
        <a
          href="javascript:"
          class="flex {color[4]} items-center block p-6 border border-gray-200 rounded-lg shadow dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          on:click={tabs[4].callback}
        >
          <svg
            class="w-8 h-8 text-red-500 dark:text-red-400 pe-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 14 20"
          >
            <path
              d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z"
            />
          </svg>
          <p class="text-2xl font-semibold text-gray-900 dark:text-white">
            Notices
          </p>
        </a>
      </li>
    </ul>
  </div>
  <div
    class="pg-right block bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
  >
    {#if tab_index === 0}
      <div class="list-container m-6">
        <p
          class="list-title text-2xl font-bold text-gray-900 dark:text-white pb-3 ps-1"
        >
          My Personal Files
        </p>
        <ul class="list-elements space-y-2 mb-2" style="overflow-y: auto;">
          {#each personal_files as file}
            <li>
              <FileCard file_name={file.name} file_type={file.type} />
            </li>
          {/each}
        </ul>
        <div class="list-upload flex justify-end">
          <button
            on:click={show_modal}
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 m-0 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >Upload</button
          >
        </div>
      </div>
    {:else if tab_index === 1}
      <div class="list-container m-6">
        <p
          class="list-title text-2xl font-bold text-gray-900 dark:text-white pb-3 ps-1"
        >
          My Teams
        </p>
        <ul class="list-elements space-y-2 pb-2" style="overflow-y: auto;">
          {#each teams as team}
            <li>
              <TeamCard team_name={team.name} />
            </li>
          {/each}
        </ul>
      </div>
    {:else if tab_index === 2}
      <div class="list-container m-6">
        <p
          class="list-title text-2xl font-bold text-gray-900 dark:text-white pb-3 ps-1"
        >
          Active Threads
        </p>
        <ul class="list-elements space-y-2 pb-2" style="overflow-y: auto;">
          {#each act_threads as thread}
            <li>
              <ThreadCard thread_name={thread.name} />
            </li>
          {/each}
        </ul>
      </div>
    {:else if tab_index === 3}
      <div class="list-container m-6">
        <p
          class="list-title text-2xl font-bold text-gray-900 dark:text-white pb-3 ps-1"
        >
          Archived Threads
        </p>
        <ul class="list-elements space-y-2 pb-2" style="overflow-y: auto;">
          {#each arch_threads as thread}
            <li>
              <ThreadCard thread_name={thread.name} />
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
</div>
<div
  bind:this={modal_elem}
  data-modal-backdrop="static"
  tabindex="-1"
  aria-hidden="true"
  class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
>
  <div class="relative p-4 w-full max-w-2xl max-h-full">
    <!-- Modal content -->
    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
      <!-- Modal header -->
      <div
        class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
      >
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
          File Upload
        </h3>
        <button
          on:click={hide_modal}
          type="button"
          class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          data-modal-hide="static-modal"
        >
          <svg
            class="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
      </div>
      <!-- Modal body -->
      <div class="p-4 md:p-5 space-y-4">
        <div class="flex items-center justify-center w-full">
          <label
            for="dropzone-file"
            class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span class="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
            </div>
            <input
              bind:this={file_input_elem}
              id="dropzone-file"
              type="file"
              class="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .pg-center {
    position: absolute;
    top: 12vh;
    bottom: 4vh;
    left: 10%;
    right: 10%;
  }
  .pg-left {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 70%;
  }
  .pg-right {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 32.5%;
    right: 0;
  }
  .list-container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .list-title {
    position: absolute;
    top: 0;
    bottom: 93%;
    left: 0;
    right: 0;
  }
  .list-elements {
    position: absolute;
    top: 7%;
    bottom: 7%;
    left: 0;
    right: 0;
  }
  .list-upload {
    position: absolute;
    top: 93%;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
