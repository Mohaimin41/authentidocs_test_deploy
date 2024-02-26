<script lang="ts">
    import { onMount } from "svelte";
    import { Modal } from "flowbite";
    import { page } from "$app/stores";
    import { AddableMemberObj, Entity, FileObj, MemberObj, Tab } from '$lib/containers';
    import { common_fetch } from "$lib/fetch_func";
    import List from "$lib/components/list.svelte";
    import MemberCard from "$lib/components/team/member-card.svelte";
    import FileCard from "$lib/components/team/file-card.svelte";
    import ThreadCard from "$lib/components/team/thread-card.svelte";

    let tabs: Tab[] =
    [
        {
            name: "Details",
            active: true
        },
        {
            name: "Threads",
            active: false
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
    let threads: Entity[] = [];
    let notices: Entity[] = [];
    let id: string;
    let team_name_input: string;
    let team_description_input: string;
    let team_name:string = "স্বদীপের team";  // remove the names, আপাতত এমনে দিসি কারণ undefined লেখা দেখলে কেমন জানি লাগে :3
    let team_leader:string = "স্বদীপ আহমেদ";
    let create_team_modal: Modal;
    let addable_members: AddableMemberObj[] = [];
    let files: FileObj[] = [];
    let members: MemberObj[] = [];
    let threads_loaded: boolean = false;
    let files_loaded: boolean = false;
    let members_loaded: boolean = false;
    let thread_count:number=0;
    let file_count: number;
    let thread_empty: boolean;
    let member_count:number=0;
    let files_empty: boolean;
    let members_empty: boolean;

    $: thread_empty = threads.length === 0;
    $: files_empty = files.length === 0;
    $: members_empty = members.length === 0;

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

    function get_addable_members(): void
    {
        fetch("/api/org/getaddablemembers",
        {
            method: "POST",
            headers:
            {
                "content-type": "application/json"
            },
            body: JSON.stringify(
            {
                orgid: id
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
            console.log(addable_members)
        });
    }

    function add_member(): void
    {
        let addable_member_ids: string[] = [];

        for(let i: number = 0; i < addable_members.length; ++i)
        {
            if(addable_members[i].checked)
            {
                addable_member_ids.push(addable_members[i].id);
            }
        }

        fetch("/api/org/addmember",
        {
            method: "POST",
            headers:
            {
                "content-type": "application/json"
            },
            body: JSON.stringify(
            {
                orgid: id,
                uid_list: addable_member_ids
            })
        }).then(async (response: Response): Promise<void> =>
        {
            let response_obj: any = await response.json();

            console.log(response_obj);
            get_addable_members();
        });
        
    }

    function get_threads(): void
    {
        fetch("/api/team/getthreads",
        {
            method: "POST",
            headers:
            {
                "content-type": "application/json"
            },
            body: JSON.stringify(
            {
                teamid: id
            })
        }).then(async (response: Response): Promise<void> =>
        {
            let response_obj: any = await response.json();
            threads = new Array(response_obj.length);

            for(let i: number = 0; i < threads.length; ++i)
            {
                threads[i] = new Entity();
                threads[i].uid = response_obj[i].f_threadid;
                threads[i].name = response_obj[i].f_threadname;
            }

            threads_loaded = true;
        });
    }

    function get_team_details(): void {
        let request_obj: any = {
            teamid: id
        };

        common_fetch(
        "/api/team/getdetails",
        request_obj,
        async (response: Response): Promise<void> => {
            let response_obj: any = await response.json();

            if (response_obj === null) {
            return;
            }

            let team_info=response_obj;
            team_name=team_info.team_detail.f_team_name;
            team_leader=team_info.team_mod_detail.f_username;
            member_count=team_info.team_detail.f_member_count;
            thread_count=team_info.team_detail.f_thread_count;
            file_count=team_info.team_detail.f_file_count;
        });
    }

    function get_notices(): void
    {
        // let request_obj: any = {
        //     orgid: id,
        // };

        // common_fetch(
        // "/api/org/getnotices",
        // request_obj,
        // async (response: Response): Promise<void> => {
        //     let response_obj: any = await response.json();

        //     if (response_obj === null) {
        //     return;
        //     }
        //     console.log(response_obj)
        //     notices = new Array((response_obj.length));
        //     for(let i = 0; i < notices.length; ++i)
        //     {
        //         notices[i] = new Entity();
        //         notices[i].uid = response_obj[i].f_noticeid;
        //         notices[i].name = response_obj[i].f_content;
        //         if(notices[i].name.length>10) notices[i].name = notices[i].name.substring(0,10) + "...."
        //     }
        // });
    }
    function get_files(): void
    {
        let request_obj: any = {
            teamid: id,
        };

        common_fetch(
        "/api/team/getfiles",
        request_obj,
        async (response: Response): Promise<void> => {
            let response_obj: any = await response.json();

            if (response_obj === null) {
            return;
            }
            console.log(response_obj);
            files = new Array(response_obj.length);

            for(let i: number = 0; i < response_obj.length; ++i)
            {
                files[i] = new FileObj();
                files[i].id = response_obj[i].f_fileid;
                files[i].name = response_obj[i].f_filename;
                files[i].type = response_obj[i].f_file_extension;
            }
            console.log(files)
            files_loaded = true;
        });
    }
    function get_members(): void
    {
        let request_obj: any = {
            teamid: id,
        };

        common_fetch(
        "/api/team/getmembers",
        request_obj,
        async (response: Response): Promise<void> => {
            let response_obj: any = await response.json();

            if (response_obj === null) {
            return;
            }
            console.log(response_obj)
            members = new Array(response_obj.length);

            for(let i: number = 0; i < response_obj.length; ++i)
            {
                members[i] = new MemberObj();
                members[i].id = response_obj[i].f_userid;
                members[i].name = response_obj[i].f_username;
            }

            members_loaded = true;
        });
    }


    onMount((): void =>
    {
        id = $page.params.id;

        get_threads();
        get_team_details();
        get_notices();
        get_addable_members();
        get_members();
        get_files();
    });
</script>

<svelte:head>
    <title>{team_name} preview</title> 
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
                <p class="text-4xl font-semibold text-gray-700 dark:text-gray-200 mb-4">{team_name}</p>
                <div class="grid grid-cols-3 mb-4">
                    <p class="text-xl font-medium text-gray-400 dark:text-gray-500 mb-2">Files</p>
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
                        <svg class="w-6 h-6 text-red-500 dark:text-red-400 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 10h16M8 14h8m-4-7V4M7 7V4m10 3V4M5 20h14c.6 0 1-.4 1-1V7c0-.6-.4-1-1-1H5a1 1 0 0 0-1 1v12c0 .6.4 1 1 1Z"/>
                        </svg>
                        <p class="text-base font-medium text-gray-700 dark:text-gray-200 me-1">
                            <span>__date__</span>
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
                <p class="text-base font-medium text-gray-700 dark:text-gray-200 mb-4">__description__</p>
            {:else if tabs[1].active}
                <p class="list-title text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">Threads</p>
                <List loaded={threads_loaded} empty={thread_empty}>
                    {#each threads as thread}
                        <li>
                            <ThreadCard id={thread.uid} name={thread.name} />
                        </li>
                    {/each}
                </List>
            {:else if tabs[2].active}
                <p class="list-title text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">Files</p>
                <List loaded={files_loaded} empty={files_empty}>
                    {#each files as file}
                        <li>
                            <FileCard file_id={file.id} file_name={file.name} file_type={file.type} file_status={file.status}/>
                        </li>
                    {/each}
                </List>
            {:else if tabs[3].active}
                <p class="list-title text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">Members</p>
                <List loaded={members_loaded} empty={members_empty}>
                    {#each members as member}
                        <li>
                            <MemberCard id={member.id} name={member.name} type={member.role} serial={member.serial} />
                        </li>
                    {/each}
                </List>
            {/if}
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
    @media(max-width: 1099px)
    {
        .pg-center
        {
            margin-left: 1rem;
            margin-right: 1rem;
        }
        .thread-info
        {
            width: 100%;
        }
    }
</style>