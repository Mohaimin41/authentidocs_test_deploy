<script lang="ts">
    import { onMount } from "svelte";
    import { Modal, initModals } from "flowbite";
    import { page } from "$app/stores";
    import { AddableMemberObj, Entity, FileObj, MemberObj, Tab } from '$lib/containers';
    import { common_fetch } from "$lib/fetch_func";
    import List from "$lib/components/list.svelte";
    import MemberCard from "$lib/components/org/member-card.svelte";
    import FileCard from "$lib/components/org/file-card.svelte";
    import TeamCard from "$lib/components/org/team-card.svelte";
    import SendNotice from "$lib/components/send-notice.svelte";
    import AddMember from "$lib/components/add-member.svelte";
    import Notice from "$lib/components/notice.svelte";
    import Create from "$lib/components/create.svelte"

    let tabs: Tab[] =
    [
        {
            name: "Details",
            active: true
        },
        {
            name: "Teams",
            active: false
        },
        {
            name: "Files",
            active: false
        },
        {
            name: "Members",
            active: false
        },
        {
            name: "Notices",
            active: false
        }
    ];
    let teams: Entity[] = [];
    let notices: Entity[] = [];
    let id: string;
    let team_name_input: string;
    let team_description_input: string;
    let org_name:string = "স্বদীপের org";  // remove the names, আপাতত এমনে দিসি কারণ undefined লেখা দেখলে কেমন জানি লাগে :3
    let org_leader:string = "স্বদীপ আহমেদ";
    let org_description:string = "demo description"
    let add_member_modal: Modal;
    let create_team_modal_elem: HTMLDivElement;
    let notifications_modal_elem: HTMLDivElement;
    let create_team_modal: Modal;
    let notifications_modal: Modal;
    let addable_members: AddableMemberObj[] = [];
    let files: FileObj[] = [];
    let members: MemberObj[] = [];
    let teams_loaded: boolean = false;
    let files_loaded: boolean = false;
    let members_loaded: boolean = false;
    let notices_loaded:boolean = false;
    let team_count:number=0;
    let file_count: number;
    let teams_empty: boolean;
    let member_count:number=0;
    let thread_count:number=0;
    let files_empty: boolean;
    let members_empty: boolean;
    let notices_empty: boolean;
    let send_notice_modal: Modal;
    let org_creation_date:Date;
    let date_text:string;

    $: teams_empty = teams.length === 0;
    $: files_empty = files.length === 0;
    $: members_empty = members.length === 0;
    $: notices_empty = notices.length === 0;

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

    async function get_addable_members(id: string): Promise<AddableMemberObj[]>
    {
        let response: Response = await fetch("/api/org/getaddablemembers",
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

    async function add_member(id: string, members: AddableMemberObj[]): Promise<any>
    {
        let adding_members = []
        let count = 0 ;
        for(let i=0;i<members.length;i++)
        {
            if(members[i].checked)
            {
                adding_members[count++]=members[i].id
            }
        }
        let response: Response = await fetch(
                    "/api/org/addmember",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                           uid_list:adding_members,
                           orgid:id,
                        })
                    }
                );
               
                let response_obj: any = await response.json();

                console.log(response_obj);

        
    }
    function create_team(id:string,name:string,description:string): void
    {
        fetch("/api/team/createteam",
        {
            method: "POST",
            headers:
            {
                "content-type": "application/json"
            },
            body: JSON.stringify(
            {
                parentorgid: id,
                teamname: name,
                description: description
            })
        }).then(async (response: Response): Promise<void> =>
        {
            let response_obj: any = await response.json();
            create_team_modal.hide();
            get_teams();
        });
    }


    function get_teams(): void
    {
        fetch("/api/org/getteams",
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
            teams = new Array(response_obj.length);
            console.log(response_obj)

            for(let i: number = 0; i < teams.length; ++i)
            {
                teams[i] = new Entity();
                teams[i].uid = response_obj[i].f_teamid;
                teams[i].name = response_obj[i].f_team_name;
            }

            // delete everything below this when connecting api
            // let test_count = 10;
            // teams = new Array(test_count);

            // for(let i = 0; i < test_count; ++i)
            // {
            //     teams[i] = new Entity();
            //     teams[i].name = "Team " + (i + 1);
            //     teams[i].uid = (i + 1).toString();
            // }

            teams_loaded = true;
        });
    }

    function get_org_details(): void
    {
        let request_obj: any = {
            orgid: id,
        };

        common_fetch(
        "/api/org/getdetails",
        request_obj,
        async (response: Response): Promise<void> => {
            let response_obj: any = await response.json();

            if (response_obj === null) {
            return;
            }
            console.log(response_obj)
            org_name=response_obj.org_detail.f_org_name;
            org_leader=response_obj.org_mod_detail.f_username;
            team_count=response_obj.org_detail.f_team_count;
            member_count=response_obj.org_detail.f_member_count;
            org_description=response_obj.org_detail.f_description;
            team_count=response_obj.org_detail.f_team_count;
            thread_count=response_obj.org_detail.f_thread_count;
            file_count = response_obj.org_detail.f_file_count;
            org_creation_date = new Date(response_obj.org_detail.f_created_at);
            date_text = org_creation_date.toLocaleDateString();
        });
    }
    function get_files(): void
    {
        let request_obj: any = {
            orgid: id,
        };

        common_fetch(
        "/api/org/getfiles",
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
            orgid: id,
        };

        common_fetch(
        "/api/org/getmembers",
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


    function get_notices(): void
    {
        let request_obj: any = {
            orgid: id,
        };

        common_fetch(
        "/api/org/getnotices",
        request_obj,
        async (response: Response): Promise<void> => {
            let response_obj: any = await response.json();

            if (response_obj === null) {
            return;
            }
            console.log(response_obj)
            notices = new Array((response_obj.length));
            for(let i = 0; i < notices.length; ++i)
            {
                notices[i] = new Entity();
                notices[i].uid = response_obj[i].f_noticeid;
                notices[i].name = response_obj[i].f_subject;
            }
            notices_loaded=true;
        });
    }
             
    async function send_notice_request(id: string, subject: string, content: string): Promise<any>
    {
        let response: Response = await fetch(
                    "/api/notice/addnotice",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            hierarchy_level:'org',
                            hierarchy_level_id:id,
                            content:content,
                            subject:subject,
                        })
                    }
                );
               
                let response_obj: any = await response.json();

                console.log(response_obj);
    }

    onMount((): void =>
    {
        initModals();

        id = $page.params.id;

        get_org_details();
        get_teams();
        get_notices();
        get_files();
        get_members();

    });
</script>

<svelte:head>
    <title>{org_name} preview</title> 
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
                <div class="details">
                    <div>
                        <p class="text-4xl font-semibold text-gray-700 dark:text-gray-200 mb-4">{org_name}</p>
                        <div class="grid grid-cols-5 mb-4">
                            <p class="text-xl font-medium text-gray-400 dark:text-gray-500 mb-2">Created At</p>
                            <p class="text-xl font-medium text-gray-400 dark:text-gray-500 mb-2">Files</p>
                            <p class="text-xl font-medium text-gray-400 dark:text-gray-500 mb-2">Members</p>
                            <p class="text-xl font-medium text-gray-400 dark:text-gray-500 mb-2">Teams</p>
                            <p class="text-xl font-medium text-gray-400 dark:text-gray-500 mb-2">Threads</p>
                            <div class="flex items-center">
                                <svg class="w-6 h-6 text-red-500 dark:text-red-400 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 10h16M8 14h8m-4-7V4M7 7V4m10 3V4M5 20h14c.6 0 1-.4 1-1V7c0-.6-.4-1-1-1H5a1 1 0 0 0-1 1v12c0 .6.4 1 1 1Z"/>
                                </svg>
                                <p class="text-base font-medium text-gray-700 dark:text-gray-200 me-1">
                                    <span>{date_text}</span>
                                </p>
                            </div>
                            <div class="flex items-center">
                                <svg class="w-6 h-6 text-blue-500 dark:text-blue-400 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M10 3v4c0 .6-.4 1-1 1H5m14-4v16c0 .6-.4 1-1 1H6a1 1 0 0 1-1-1V8c0-.4.1-.6.3-.8l4-4 .6-.2H18c.6 0 1 .4 1 1Z"/>
                                </svg>
                                <p class="text-base font-medium text-gray-700 dark:text-gray-200 me-1">{file_count}</p>
                                <!-- <p class="text-base font-medium text-red-500 dark:text-red-400 me-2">[5 Unsigned]</p> -->
                            </div>
         
                            <div class="flex items-center">
                                <svg class="w-6 h-6 text-indigo-500 dark:text-indigo-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-width="2" d="M7 17v1c0 .6.4 1 1 1h8c.6 0 1-.4 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                </svg>
                                <p class="text-base font-medium text-gray-700 dark:text-gray-200 me-1">{member_count}</p>
                            </div>
                            <div class="flex items-center">
                                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                    <path fill-rule="evenodd" d="M10 2a3 3 0 0 0-3 3v1H5a3 3 0 0 0-3 3v2.4l1.4.7a7.7 7.7 0 0 0 .7.3 21 21 0 0 0 16.4-.3l1.5-.7V9a3 3 0 0 0-3-3h-2V5a3 3 0 0 0-3-3h-4Zm5 4V5c0-.6-.4-1-1-1h-4a1 1 0 0 0-1 1v1h6Zm6.4 7.9.6-.3V19a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-5.4l.6.3a10 10 0 0 0 .7.3 23 23 0 0 0 18-.3h.1L21 13l.4.9ZM12 10a1 1 0 1 0 0 2 1 1 0 1 0 0-2Z" clip-rule="evenodd"/>
                                  </svg>
                                <p class="text-base font-medium text-gray-700 dark:text-gray-200 me-1">{team_count}</p>
                                <!-- <p class="text-base font-medium text-red-500 dark:text-red-400 me-2">[5 Unsigned]</p> -->
                            </div>
                            <div class="flex items-center">
                                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                    <path fill-rule="evenodd" d="M10 2a3 3 0 0 0-3 3v1H5a3 3 0 0 0-3 3v2.4l1.4.7a7.7 7.7 0 0 0 .7.3 21 21 0 0 0 16.4-.3l1.5-.7V9a3 3 0 0 0-3-3h-2V5a3 3 0 0 0-3-3h-4Zm5 4V5c0-.6-.4-1-1-1h-4a1 1 0 0 0-1 1v1h6Zm6.4 7.9.6-.3V19a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-5.4l.6.3a10 10 0 0 0 .7.3 23 23 0 0 0 18-.3h.1L21 13l.4.9ZM12 10a1 1 0 1 0 0 2 1 1 0 1 0 0-2Z" clip-rule="evenodd"/>
                                  </svg>
                                <p class="text-base font-medium text-gray-700 dark:text-gray-200 me-1">{thread_count}</p>
                                <!-- <p class="text-base font-medium text-red-500 dark:text-red-400 me-2">[5 Unsigned]</p> -->
                            </div>
                        </div>
                        <p class="text-xl font-medium text-gray-400 dark:text-gray-500 mb-2">Description</p>
                        <p class="text-base font-medium text-gray-700 dark:text-gray-200 mb-4">{org_description}</p>
                    </div>
                </div>
            {:else if tabs[1].active}
                <p class="list-title text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">Teams</p>
                <List loaded={teams_loaded} empty={teams_empty}>
                    {#each teams as team}
                        <li>
                            <TeamCard uid={team.uid} name={team.name} />
                        </li>
                    {/each}
                </List>
                <div class="flex justify-end">
                    <button on:click={() => {create_team_modal.show()}} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 ms-2 mb-2">Create Team</button>
                    </div>
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
                            <MemberCard id={member.id} name={member.name} type={member.role} serial={member.serial}  joined={member.joined} />
                        </li>
                    {/each}
                </List>
                <div class="flex justify-end">
                <button on:click={() => {add_member_modal.show()}} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 ms-2 mb-2">Add Member</button>
                </div>
                {:else if tabs[4].active}
                <p class="list-title text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">Notices</p>
                <List loaded={notices_loaded} empty={notices_empty}>
                    {#each notices as notice}
                        <li>
                            <Notice uid={notice.uid} title={notice.name}/>
                        </li>
                    {/each}
                </List>
                <div class="flex justify-end">
                <button on:click={() => {send_notice_modal.show();}} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mx-2 mb-2">Send Notice</button>
                </div>
                {/if}
        </div>
    </div>
</div>

<SendNotice bind:modal={send_notice_modal} id={id} send_notice_request={send_notice_request} />

<AddMember bind:modal={add_member_modal} get_addable_members={get_addable_members} add_member={add_member} />

<Create bind:modal={create_team_modal} id={id} creation_request={create_team} />


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
    .details
    {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
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