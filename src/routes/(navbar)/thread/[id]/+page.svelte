<script lang="ts">
    import { page } from "$app/stores";
    import AddMember from "$lib/components/add-member.svelte";
    import List from "$lib/components/list.svelte";
    import FileCard from "$lib/components/thread/file-card.svelte";
    import MemberCard from "$lib/components/thread/member-card.svelte";
    import { MemberObj, AddableMemberObj, FileObj, Tab } from "$lib/containers";
    import { Modal, initModals } from "flowbite";
    import { onMount } from "svelte";

    let tabs: Tab[] =
    [
        {
            name: "Details",
            active: true
        },
        {
            name: "Files",
            active: false
        },
        {
            name: "Members",
            active: false
        }
    ];
    let id: string;
    let thread_name: string;
    let team_name: string;
    let description: string;
    let moderator: string;
    let current_custodian: string;
    let started_at: Date;
    let date_text: string;
    let time_text: string;
    let files: FileObj[] = [];
    let members: MemberObj[] = [];
    let is_active: boolean;
    let can_forward: boolean;
    let can_close: boolean;
    let can_add_file: boolean
    let closing_comment: string;
    let member_count: number;
    let members_empty: boolean;
    let file_count: number;
    let files_empty: boolean;
    let close_thread_modal_elem: HTMLDivElement;
    let file_uploading_modal_elem: HTMLDivElement;
    let file_upload_progress: HTMLDivElement;
    let close_thread_modal: Modal;
    let add_member_modal: Modal;
    let file_uploading_modal: Modal;
    let details_loading: boolean;
    let files_loaded: boolean = false;
    let members_loading: boolean;

    $: date_text = started_at?.toLocaleDateString();
    $: time_text = started_at?.toLocaleTimeString();
    $:
    {
        id = $page.params.id;

        init();
    }

    $: files_empty = files.length === 0;
    $: members_empty = members.length === 0;
    $: file_count = files.length;
    $: member_count = members.length;

    function reset_tabs(): void
    {
        for(let i: number = 0; i < tabs.length; ++i)
        {
            tabs[i].active = false;
        }
    }

    function show_tab(idx: number): void
    {
        reset_tabs();

        tabs[idx].active = true;
    }

    function get_members(): void
    {
        fetch("/api/thread/getmembers",
        {
            method: "POST",
            headers:
            {
                "content-type": "application/json"
            },
            body: JSON.stringify(
            {
                given_threadid: id
            })
        }).then(async (response: Response): Promise<void> =>
        {
            let response_obj: any = await response.json();
            members = new Array(response_obj.length);

            for(let i: number = 0; i < members.length; ++i)
            {
                members[i] = new MemberObj();
                members[i].id = response_obj[i].f_userid;
                members[i].name = response_obj[i].f_username;
                members[i].role = response_obj[i].f_user_role;
                members[i].serial = response_obj[i].f_signing_serial;
                members[i].pubkey = response_obj[i].f_publickey;
                members[i].joined = new Date(response_obj[i].f_joined_at);
            }

            // let test_count: number = 0;
            // members = new Array(test_count);

            // for(let i: number = 0; i < test_count; ++i)
            // {
            //     members[i] = new MemberObj();
            //     members[i].id = (i + 1).toString();
            //     members[i].name = "Member " + (i + 1);
            // }

            members_loading = false;
        });
    }

    async function get_addable_members(): Promise<AddableMemberObj[]>
    {
        let response: Response = await fetch("/api/thread/getaddablemembers",
        {
            method: "POST",
            headers:
            {
                "content-type": "application/json"
            },
            body: JSON.stringify(
            {
                given_threadid: id
            })
        });
        let response_obj: any = await response.json();
        let addable_members: AddableMemberObj[] = new Array(response_obj.length);

        for(let i: number = 0; i < addable_members.length; ++i)
        {
            addable_members[i] = new AddableMemberObj();
            addable_members[i].id = response_obj[i].f_userid;
            addable_members[i].name = response_obj[i].f_username;
        }

        return addable_members;
    }

    function add_member(id: string, members: AddableMemberObj[]): any
    {
        
    }

    function add_file(): void
    {
        let file_input_elem: HTMLInputElement = document.createElement("input");
        file_input_elem.type = "file";

        file_input_elem.onchange = async (event: Event): Promise<void> =>
        {
            file_uploading_modal.show();

            let file: File | null | undefined = file_input_elem.files?.item(0);

            if(file === null || file === undefined)
            {
                return;
            }

            let file_buffer: ArrayBuffer = await file.arrayBuffer();
            let success: boolean = true;
            let file_success_response_obj: any = {};

            for (let i: number = 0; i < file_buffer.byteLength; i += 1048576) {
                file_upload_progress.style.width = Math.round(i * 100 / file_buffer.byteLength) + "%";
                let smallbuffer: ArrayBuffer = file_buffer.slice(i, i + 1048576);
                let small_array: number[] = Array.from(new Uint8Array(smallbuffer));
                let response: Response = await fetch(
                    "/api/thread/addthreadchunkfile/continue?filename=" + file.name,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            data: small_array,
                        })
                    }
                );

                let response_obj: any = await response.json();

                console.log(response_obj);

                if (response_obj.success === false) {
                    console.error("dhuru");

                    success = false;

                    break;
                }
            }

            if (success) {
                file_upload_progress.style.width = "100%";

                await fetch("/api/thread/addthreadchunkfile/finish?filename=" + file.name + "&threadid=" + id, {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify({}),
                }).then(async (response: Response): Promise<void> => {
                    file_success_response_obj = await response.json();

                    file_uploading_modal.hide();
                    init();
                });
            }
            else
            {
                file_uploading_modal.hide();
            }
        };

        file_input_elem.click();
    }

    function forward(): void
    {
        fetch("/api/thread/forward",
        {
            method: "POST",
            headers:
            {
                "content-type": "application/json"
            },
            body: JSON.stringify(
            {
                threadid: id
            })
        }).then(async (response: Response): Promise<void> =>
        {
            let response_obj: any = await response.json();

            console.log(response_obj);
            init();
        });
    }

    function show_close_thread_modal(): void
    {
        close_thread_modal.show();
    }

    function hide_close_thread_modal(): void
    {
        close_thread_modal.hide();
    }

    function close_thread(): void
    {
        let temp_comment: string = closing_comment;

        if(temp_comment === undefined)
        {
            temp_comment = "";
        }

        fetch("/api/thread/makearchive",
        {
            method: "POST",
            headers:
            {
                "content-type": "application/json"
            },
            body: JSON.stringify(
            {
                closing_comment: temp_comment,
                threadid: id
            })
        }).then(async (response: Response): Promise<void> =>
        {
            let response_obj: any = await response.json();

            console.log(response_obj);
            close_thread_modal.hide();
            init();
        });
    }

    function init(): void
    {
        details_loading = true;
        members_loading = true;
        files_loaded = false;

        fetch("/api/thread/getdetails",
        {
            method: "POST",
            headers:
            {
                "content-type": "application/json"
            },
            body: JSON.stringify(
            {
                threadid: id
            })
        }).then(async (response: Response): Promise<void> =>
        {
            let response_obj: any = await response.json();
            thread_name = response_obj.thread_detail.threadname;
            team_name = response_obj.thread_detail.list_of_teams.slice(1);
            started_at = new Date(response_obj.thread_detail.created_at);
            moderator = response_obj.thread_mod_detail.f_username;

            if(response_obj.thread_current_custodian_detail !== undefined)
            {
                current_custodian = response_obj.thread_current_custodian_detail.f_username;
            }

            description = response_obj.thread_detail.description;
            closing_comment = response_obj.thread_detail.closing_comment;
            is_active = response_obj.thread_detail.is_active;
            let thread_current_custodian_detail: any = response_obj.thread_current_custodian_detail;

            fetch("/api/thread/getfiles",
            {
                method: "POST",
                headers:
                {
                    "content-type": "application/json"
                },
                body: JSON.stringify(
                {
                    thread_id: id
                })
            }).then(async (response: Response): Promise<void> =>
            {
                let response_obj: any = await response.json();
                files = new Array(response_obj.length);

                for(let i: number = 0; i < files.length; ++i)
                {
                    files[i] = new FileObj();
                    files[i].id = response_obj[i].f_fileid;
                    files[i].name = response_obj[i].f_filename;
                    files[i].type = response_obj[i].f_file_extension;

                    if(thread_current_custodian_detail === undefined || thread_current_custodian_detail.f_userid !== $page.data.session?.user?.name)
                    {
                        files[i].status = 3;
                    }
                    else
                    {
                        files[i].status = response_obj[i].f_current_state;
                    }
                }

                // let test_count: number = 10;
                // files = new Array(test_count);

                // for(let i: number = 0; i < test_count; ++i)
                // {
                //     files[i] = new FileObj();
                //     files[i].id = (i + 1).toString();
                //     files[i].name = "File " + (i + 1);
                //     files[i].status = "hehe";
                //     files[i].type = "png";
                // }

                files_loaded = true;
            });
        });

        fetch("/api/thread/canforward",
        {
            method: "POST",
            headers:
            {
                "content-type": "application/json"
            },
            body: JSON.stringify(
            {
                given_threadid: id
            })
        }).then(async (response: Response): Promise<void> =>
        {
            let response_obj: any = await response.json();
            can_forward = response_obj;
        });

        fetch("/api/thread/canclose",
        {
            method: "POST",
            headers:
            {
                "content-type": "application/json"
            },
            body: JSON.stringify(
            {
                given_threadid: id
            })
        }).then(async (response: Response): Promise<void> =>
        {
            let response_obj: any = await response.json();
            can_close = response_obj;
        });

        fetch("/api/thread/canaddfile",
        {
            method: "POST",
            headers:
            {
                "content-type": "application/json"
            },
            body: JSON.stringify(
            {
                given_threadid: id,
                given_userid: $page.data.session?.user?.name
            })
        }).then(async (response: Response): Promise<void> =>
        {
            let response_obj: any = await response.json();
            can_add_file = response_obj;
        });

        get_members();
        get_addable_members();
    }
    
    onMount((): void =>
    {
        initModals();

        // id = $page.params.id;
        close_thread_modal = new Modal(close_thread_modal_elem);
        file_uploading_modal = new Modal(file_uploading_modal_elem);

        init();
    });
</script>

<svelte:head>
    <title>{thread_name} preview</title> 
</svelte:head>

<div class="pg-center flex justify-between">
    <!-- svelte-ignore a11y-invalid-attribute -->
    <div class="thread-info block bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-6">
        <ul class="thread-tabs flex flex-wrap justify-center items-center text-sm font-medium text-center text-gray-500 dark:text-gray-400">
            {#each tabs as tab, index}
                <li class="mx-1">
                    {#if tab.active}
                        <a href="javascript:" class="inline-block px-4 py-3 text-white bg-blue-600 rounded-lg active">{tab.name}</a>
                    {:else}
                        <a on:click={() => {show_tab(index)}} href="javascript:" class="inline-block px-4 py-3 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white">{tab.name}</a>
                    {/if}
                </li>    
            {/each}
        </ul>
        <div class="tab-item-data">
            {#if tabs[0].active}
                <p class="text-4xl font-semibold text-gray-700 dark:text-gray-200 mb-4">{thread_name}</p>
                <p class="text-xl font-medium text-gray-400 dark:text-gray-500 mb-2">Moderator</p>
                <div class="flex items-center mb-4">
                    <img class="w-8 h-8 rounded-full me-2" src="/pochita.webp" alt="Rounded avatar">
                    <p class="text-2xl font-medium text-gray-700 dark:text-gray-200">{moderator}</p>
                </div>
                <p class="text-xl font-medium text-gray-400 dark:text-gray-500 mb-2">Current Custodian</p>
                {#if is_active}
                    <div class="flex items-center mb-4">
                        <img class="w-8 h-8 rounded-full me-2" src="/pochita.webp" alt="Rounded avatar">
                        <p class="text-2xl font-medium text-gray-700 dark:text-gray-200">{current_custodian}</p>
                    </div>
                {:else}
                    <p class="text-2xl font-medium text-red-500 dark:text-red-400 mb-4">Thread Closed</p>
                {/if}
                <div class="grid grid-cols-4 mb-4">
                    <p class="text-xl font-medium text-gray-400 dark:text-gray-500 mb-2">Files</p>
                    <p class="text-xl font-medium text-gray-400 dark:text-gray-500 mb-2">Team</p>
                    <p class="text-xl font-medium text-gray-400 dark:text-gray-500 mb-2">Started At</p>
                    <p class="text-xl font-medium text-gray-400 dark:text-gray-500 mb-2">Members</p>
                    <div class="flex items-center">
                        <svg class="w-6 h-6 text-blue-500 dark:text-blue-400 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M10 3v4c0 .6-.4 1-1 1H5m14-4v16c0 .6-.4 1-1 1H6a1 1 0 0 1-1-1V8c0-.4.1-.6.3-.8l4-4 .6-.2H18c.6 0 1 .4 1 1Z"/>
                        </svg>
                        <p class="text-base font-medium text-gray-700 dark:text-gray-200 me-1">{file_count}</p>
                        <!-- <p class="text-base font-medium text-red-500 dark:text-red-400 me-2">[5 Unsigned]</p> -->
                    </div>
                    <div class="flex items-center">
                        <svg class="w-6 h-6 text-green-500 dark:text-green-400 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3a2.5 2.5 0 1 1 2-4.5M19.5 17h.5c.6 0 1-.4 1-1a3 3 0 0 0-3-3h-1m0-3a2.5 2.5 0 1 0-2-4.5m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3c0 .6-.4 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/>
                        </svg>
                        <p class="text-base font-medium text-gray-700 dark:text-gray-200 me-1">{team_name}</p>
                    </div>
                    <div class="flex items-center">
                        <svg class="w-6 h-6 text-red-500 dark:text-red-400 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 10h16M8 14h8m-4-7V4M7 7V4m10 3V4M5 20h14c.6 0 1-.4 1-1V7c0-.6-.4-1-1-1H5a1 1 0 0 0-1 1v12c0 .6.4 1 1 1Z"/>
                        </svg>
                        <p class="text-base font-medium text-gray-700 dark:text-gray-200 me-1">
                            <span>{date_text}</span>
                        </p>
                    </div>
                    <div class="flex items-center">
                        <svg class="w-6 h-6 text-indigo-500 dark:text-indigo-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-width="2" d="M7 17v1c0 .6.4 1 1 1h8c.6 0 1-.4 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                        </svg>
                        <p class="text-base font-medium text-gray-700 dark:text-gray-200 me-1">{member_count}</p>
                    </div>
                </div>
                <p class="text-xl font-medium text-gray-400 dark:text-gray-500 mb-2">Description</p>
                <p class="text-base font-medium text-gray-700 dark:text-gray-200 mb-4">{description}</p>
                {#if !is_active}
                    <p class="text-xl font-medium text-gray-400 dark:text-gray-500 mb-2">Closing Comment</p>
                    <p class="text-base font-medium text-gray-700 dark:text-gray-200">{closing_comment}</p>
                {/if}
            {:else if tabs[1].active}
                <p class="list-title text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">Files</p>
                <List loaded={files_loaded} empty={files_empty}>
                    {#each files as file}
                        <li>
                            <FileCard file_id={file.id} file_name={file.name} file_type={file.type} file_status={file.status.toString()}/>
                        </li>
                    {/each}
                </List>
            {:else if tabs[2].active}
                <p class="list-title text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">Members</p>
                <List loaded={!members_loading} empty={members_empty}>
                    {#each members as member}
                        <li>
                            <MemberCard id={member.id} name={member.name} type={member.role} serial={member.serial}  joined={member.joined} />
                        </li>
                    {/each}
                </List>
            {/if}
        </div>
        <div class="thread-extra-button flex justify-end items-end mt-2">
            {#if tabs[0].active}
                <button on:click={forward} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" disabled={!can_forward}>Forward</button>
                <button on:click={show_close_thread_modal} type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" disabled={!can_close}>Close Thread</button>
            {:else if tabs[1].active}
                <!-- Add File -->
                <button on:click={add_file} type="button" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" disabled={!can_add_file}>Add File</button>
            {:else if tabs[2].active}
                <!-- Add Members -->
                <button on:click={() => {add_member_modal.show();}} type="button" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Add Member</button>
            {/if}
        </div>
    </div>
</div>

<AddMember bind:modal={add_member_modal} id={id} get_addable_members={get_addable_members} add_member={add_member} />

<div bind:this={close_thread_modal_elem} id="close-thread-modal" data-modal-backdrop="static" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-2xl max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    Closing Thread
                </h3>
                <button on:click={hide_close_thread_modal} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <div class="p-4 md:p-5 space-y-4">
                <form on:submit={close_thread} class="mx-auto">
                    <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Closing Comment</label>
                    <textarea bind:value={closing_comment} id="message" rows="3" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Leave a comment..." autocomplete="off"></textarea>
                    <div class="flex justify-end">
                        <button type="submit" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Confirm</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div bind:this={file_uploading_modal_elem} data-modal-backdrop="static" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-2xl max-h-full">
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    Uploading...
                </h3>
            </div>
            <div class="p-4 md:p-5 space-y-4">        
                <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div bind:this={file_upload_progress} class="bg-blue-600 h-2.5 rounded-full" style="width: 0%"></div>
                </div>  
            </div>
        </div>
    </div>
</div>

<style>
    .pg-center
    {
        position: absolute;
        top: 5.25rem;
        bottom: 1rem;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .thread-info
    {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 65rem;
        display: flex;
        flex-direction: column;
    }
    .tab-item-data
    {
        flex-grow: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
    }
</style>