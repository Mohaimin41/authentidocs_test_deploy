<script lang="ts">
    import { page } from "$app/stores";
    import FileCard from "$lib/components/thread/file-card.svelte";
    import MemberCard from "$lib/components/thread/member-card.svelte";
    import { Modal, initModals } from "flowbite";
    import { onMount } from "svelte";

    class FileObj
    {
        public id: string = "";
        public name: string = "";
        public type: string = "";
        public status: string = "";
    }

    class MemberObj
    {
        public id: string = "";
        public name: string = "";
        public role: string = "";
        public serial: number = -1;
        public pubkey: string = "";
        public joined: Date = new Date();
    }

    class AddableMemberObj
    {
        public id: string = "";
        public name: string = "";
        public checked: boolean = false;
    }

    let id: string;
    let thread_name: string;
    let team_name: string;
    let description: string;
    let moderator: string;
    let current_custodian: string;
    let started_at: Date;
    let date_text: string;
    let time_text: string;
    let tab_active: boolean[] = [true, false, false];
    let files: FileObj[] = [];
    let members: MemberObj[] = [];
    let addable_members: AddableMemberObj[] = [];
    let is_active: boolean;
    let can_forward: boolean;
    let can_close: boolean;
    let can_add_file: boolean
    let closing_comment: string;
    let member_count: number;
    let file_count: number;
    let close_thread_modal_elem: HTMLDivElement;
    let add_member_modal_elem: HTMLDivElement;
    let file_uploading_modal_elem: HTMLDivElement;
    let file_upload_progress: HTMLDivElement;
    let close_thread_modal: Modal;
    let add_member_modal: Modal;
    let file_uploading_modal: Modal;
    let details_loading: boolean;
    let files_loading: boolean;
    let members_loading: boolean;

    $: date_text = started_at?.toLocaleDateString();
    $: time_text = started_at?.toLocaleTimeString();
    $:
    {
        id = $page.params.id;

        init();
    }

    function reset_tabs(): void
    {
        for(let i: number = 0; i < tab_active.length; ++i)
        {
            tab_active[i] = false;
        }
    }

    function show_tab1(): void
    {
        reset_tabs();

        tab_active[0] = true;
    }

    function show_tab2(): void
    {
        reset_tabs();

        tab_active[1] = true;
    }

    function show_tab3(): void
    {
        reset_tabs();

        tab_active[2] = true;
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

            member_count = members.length;
            members_loading = false;
        });
    }

    function get_addable_members(): void
    {
        fetch("/api/thread/getaddablemembers",
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
            addable_members = new Array(response_obj.length);

            for(let i: number = 0; i < addable_members.length; ++i)
            {
                addable_members[i] = new AddableMemberObj();
                addable_members[i].id = response_obj[i].f_userid;
                addable_members[i].name = response_obj[i].f_username;
            }
        });
    }

    function add_members(): void
    {
        let addable_member_ids: string[] = [];

        for(let i: number = 0; i < addable_members.length; ++i)
        {
            if(addable_members[i].checked)
            {
                addable_member_ids.push(addable_members[i].id);
            }
        }

        fetch("/api/thread/addmember",
        {
            method: "POST",
            headers:
            {
                "content-type": "application/json"
            },
            body: JSON.stringify(
            {
                threadid: id,
                uid_list: addable_member_ids
            })
        }).then(async (response: Response): Promise<void> =>
        {
            let response_obj: any = await response.json();

            console.log(response_obj);
            add_member_modal.hide();
            get_members();
            get_addable_members();
        });
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

    function show_add_member_modal(): void
    {
        add_member_modal.show();
    }

    function hide_add_member_modal(): void
    {
        add_member_modal.hide();
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
        files_loading = true;
        members_loading = true;

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
            team_name = response_obj.thread_detail.team_name;
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
                        files[i].status = "3";
                    }
                    else
                    {
                        files[i].status = response_obj[i].f_current_state;
                    }
                }

                file_count = files.length;
                files_loading = false;
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
        add_member_modal = new Modal(add_member_modal_elem);
        file_uploading_modal = new Modal(file_uploading_modal_elem);

        init();
    });
</script>
<svelte:head>
    <title>{thread_name} preview</title> 
</svelte:head>
<div class="pg-center flex justify-between">
    <!-- svelte-ignore a11y-invalid-attribute -->
    <div class="thread-info block bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <ul class="thread-tabs flex flex-wrap justify-center items-center text-sm font-medium text-center text-gray-500 dark:text-gray-400">
            <li class="me-2">
                {#if tab_active[0]}
                    <a href="javascript:" class="inline-block px-4 py-3 text-white bg-blue-600 rounded-lg active">Details</a>
                {:else}
                    <a on:click={show_tab1} href="javascript:" class="inline-block px-4 py-3 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white">Details</a>
                {/if}
            </li>
            <li class="me-2">
                {#if tab_active[1]}
                    <a href="javascript:" class="inline-block px-4 py-3 text-white bg-blue-600 rounded-lg active">Files</a>
                {:else}
                    <a on:click={show_tab2} href="javascript:" class="inline-block px-4 py-3 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white">Files</a>
                {/if}
            </li>
            <li class="me-2">
                {#if tab_active[2]}
                    <a href="javascript:" class="inline-block px-4 py-3 text-white bg-blue-600 rounded-lg active">Members</a>
                {:else}
                    <a on:click={show_tab3} href="javascript:" class="inline-block px-4 py-3 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white">Members</a>
                {/if}
            </li>
        </ul>
        <div class="tab-item-data mx-6 mb-6">
            {#if tab_active[0]}
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
            {:else if tab_active[1]}
                <p class="list-title text-2xl font-bold text-gray-700 dark:text-gray-200">Files</p>
                {#if files_loading}
                    <div class="loader flex justify-center items-center">
                        <div role="status">
                            <svg aria-hidden="true" class="w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                {:else}
                    <ul class="list-elements space-y-2 mt-2 pb-1">
                        {#each files as file}
                            <li>
                                <FileCard file_id={file.id} file_name={file.name} file_type={file.type} file_status={file.status}/>
                            </li>
                        {/each}
                    </ul>
                {/if}
            {:else if tab_active[2]}
                <p class="list-title text-2xl font-bold text-gray-700 dark:text-gray-200">Members</p>
                {#if members_loading}
                    <div class="loader flex justify-center items-center">
                        <div role="status">
                            <svg aria-hidden="true" class="w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                {:else}
                    <ul class="list-elements space-y-2 mt-2 pb-1">
                        {#each members as member}
                            <li>
                                <MemberCard id={member.id} name={member.name} type={member.role} serial={member.serial}  joined={member.joined} />
                            </li>
                        {/each}
                    </ul>
                {/if}
            {/if}
        </div>
    </div>

    <div class="thread-extra-button flex justify-end items-end">
        {#if tab_active[0]}
            <button on:click={forward} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" disabled={!can_forward}>Forward</button>
            <button on:click={show_close_thread_modal} type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" disabled={!can_close}>Close Thread</button>
        {:else if tab_active[1]}
            <!-- Add File -->
            <button on:click={add_file} type="button" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" disabled={!can_add_file}>Add File</button>
        {:else if tab_active[2]}
            <!-- Add Members -->
            <button on:click={show_add_member_modal} type="button" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Add Member</button>
        {/if}
    </div>
</div>

<div bind:this={add_member_modal_elem} data-modal-backdrop="static" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-2xl max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    Select Thread Members
                </h3>
                <button on:click={hide_add_member_modal} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <div class="p-4 md:p-5 space-y-4">
                <form on:submit={add_members} class="mx-auto">
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
        left: 20%;
        right: 20%;
    }
    .thread-info
    {
        position: absolute;
        top: 0;
        bottom: 3.5rem;
        left: 0;
        right: 0;
    }
    .thread-tabs
    {
        position: absolute;
        top: 0;
        height: 3.5rem;
        left: 0;
        right: 0;
    }
    .tab-item-data
    {
        position: absolute;
        top: 3.5rem;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .thread-extra-button
    {
        position: absolute;
        height: 3.5rem;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .list-title
    {
        position: absolute;
        height: 2rem;
        top: 0;
        left: 0;
        right: 0;
    }
    .list-elements
    {
        position: absolute;
        top: 2rem;
        bottom: 0;
        left: 0;
        right: 0;
        overflow-y: auto;
    }
    .loader
    {
        height: 100%;
    }
</style>