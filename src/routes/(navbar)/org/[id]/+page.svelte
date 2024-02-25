<script lang="ts">
    import { onMount } from "svelte";
    import { Modal, initModals } from "flowbite";
    import { page } from "$app/stores";
    import TeamCard from '$lib/components/org/team-card.svelte';
    import { Entity, type Member } from '$lib/containers';
    import Notice from "$lib/components/notice.svelte";
    import { common_fetch } from "$lib/fetch_func";

    class AddableMemberObj
    {
        public id: string = "";
        public name: string = "";
        public checked: boolean = false;
    }

    let teams: Entity[] = [];
    let notices: Entity[] = [];
    let id: string;
    let team_name_input: string;
    let team_description_input: string;
    let org_name:string = "স্বদীপের org";  // remove the names, আপাতত এমনে দিসি কারণ undefined লেখা দেখলে কেমন জানি লাগে :3
    let org_leader:string = "স্বদীপ আহমেদ";
    let create_team_modal_elem: HTMLDivElement;
    let notifications_modal_elem: HTMLDivElement;
    let create_team_modal: Modal;
    let notifications_modal: Modal;
    let addable_members: AddableMemberObj[] = [];
    let team_count:number=0;
    let member_count:number=0;



    function create_team(): void
    {
        let temp_desc: string | undefined = team_description_input;

        if(temp_desc === undefined)
        {
            temp_desc = "";
        }

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
                teamname: team_name_input,
                description: temp_desc
            })
        }).then(async (response: Response): Promise<void> =>
        {
            let response_obj: any = await response.json();
            create_team_modal.hide();
            get_teams();
        });
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

    function show_create_team_modal(): void
    {
        create_team_modal.show();
    }

    function hide_create_thread_modal(): void
    {
        create_team_modal.hide();
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
        });

        // // delete everything below this when connecting api
        // teams = new Array(10);

        // for(let i = 0; i < 10; ++i)
        // {
        //     teams[i] = new Entity();
        //     teams[i].name = "Team " + (i + 1);
        //     teams[i].uid = (i + 1).toString();
        // }
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
            notices[i].name = response_obj[i].f_content;
            if(notices[i].name.length>10) notices[i].name = notices[i].name.substring(0,10) + "...."
        }
    });
    }
             
        
       

        

    onMount((): void =>
    {
        create_team_modal = new Modal(create_team_modal_elem);
        notifications_modal = new Modal(notifications_modal_elem);

        initModals();

        id = $page.params.id;

        get_teams();
        get_org_details();
        get_notices();
        get_addable_members();
    });
</script>
<svelte:head>
    <title>{org_name} preview</title> 
</svelte:head>

<!-- svelte-ignore a11y-invalid-attribute -->
<div class="pg-center flex justify-between">
    <div class="team-info block bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div class="flex m-6">
            <div class="grow">
                <p class="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">{org_name}</p>
                <div class="grid grid-cols-3 gap-4">
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Leader</p>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Members</p>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Teams</p>
                    <div class="flex flex-wrap items-center">
                        <img class="w-6 h-6 rounded-full me-2" src="/pochita.webp" alt="Rounded avatar">
                        <p class="text-sm font-medium text-gray-700">{org_leader}</p>
                    </div>
                    <div class="flex -space-x-4 rtl:space-x-reverse">
                        <img class="w-6 h-6 border-2 border-white rounded-full dark:border-gray-800" src="/pochita.webp" alt="">
                        <img class="w-6 h-6 border-2 border-white rounded-full dark:border-gray-800" src="/pochita.webp" alt="">
                        <img class="w-6 h-6 border-2 border-white rounded-full dark:border-gray-800" src="/pochita.webp" alt="">
                        <img class="w-6 h-6 border-2 border-white rounded-full dark:border-gray-800" src="/pochita.webp" alt="">
                        <a class="flex items-center justify-center w-6 h-6 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800" href="#">{member_count}</a>
                    </div>
                    <div class="flex flex-wrap items-center">
                        <svg class="w-6 h-6 text-blue-500 dark:text-blue-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3a2.5 2.5 0 1 1 2-4.5M19.5 17h.5c.6 0 1-.4 1-1a3 3 0 0 0-3-3h-1m0-3a2.5 2.5 0 1 0-2-4.5m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3c0 .6-.4 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/>
                        </svg>
                        <p class="text-sm font-medium text-gray-700 dark:text-gray-200 me-1">{team_count}</p>
                    </div>
                </div>
            </div>
            <div class="flex flex-wrap items-end">
                <!-- add member -->
                <button data-modal-target="add-member-modal" data-modal-toggle="add-member-modal" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1c0 .6-.4 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                    </svg>
                </button>
                <!-- Notifications -->
                <button on:click={() => {notifications_modal.show();}} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.8 5.5 10.4 3m.4 2.4a5.3 5.3 0 0 1 6 4.3l.4 1.8c.4 2.3 2.4 2.6 2.6 3.7.1.6.2 1.2-.3 1.3L6.8 19c-.5 0-.7-.5-.8-1.1-.2-1.2 1.5-2.1 1.1-4.4l-.3-1.8a5.3 5.3 0 0 1 4-6.2Zm-7 4.4a8 8 0 0 1 2-4.9m2.7 13.7a3.5 3.5 0 0 0 6.7-.8l.1-.5-6.8 1.3Z"/>
                    </svg>
                </button>
                <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 4h3c.6 0 1 .4 1 1v15c0 .6-.4 1-1 1H6a1 1 0 0 1-1-1V5c0-.6.4-1 1-1h3m0 3h6m-6 5h6m-6 4h6M10 3v4h4V3h-4Z"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
    <div class="team-list-card block bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-2">
        <p class="team-list-title text-2xl font-semibold text-gray-700 mx-6 mt-6">Teams</p>
        <ul class="team-elements space-y-2 mt-2 pb-1 mx-6 mb-6">
            {#each teams as team}
                <li>
                    <TeamCard uid={team.uid} team_name={team.name} />
                </li>
            {/each}
        </ul>
    </div>
    <div class="team-button flex justify-end items-end">
        <button on:click={show_create_team_modal} type="button" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Create Team</button>
    </div>
</div>

<div bind:this={create_team_modal_elem} data-modal-backdrop="static" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-2xl max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    Create Team
                </h3>
                <button on:click={hide_create_thread_modal} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <div class="p-4 md:p-5 space-y-4">
                <form on:submit={create_team} class="mx-auto">
                    <div class="mb-5">
                      <label for="create-team-name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Team Name</label>
                      <input bind:value={team_name_input} type="text" id="create-team-name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" autocomplete="off" required>
                    </div>
                    <label for="create-team-description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Team Description</label>
                    <textarea bind:value={team_description_input} id="create-team-description" rows="3" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" autocomplete="off"></textarea>
                    <div class="flex justify-end">
                        <button type="submit" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Confirm</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div id="add-member-modal" data-modal-backdrop="static" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-2xl max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    Add Member
                </h3>
                <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="add-member-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <div class="p-4 md:p-5 space-y-4">
                <form on:submit={add_member} class="mx-auto">
                    {#each addable_members as member}
                        <div class="flex items-center mb-4">
                            <input bind:checked={member.checked} id="checkbox-{member.id}" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" >
                            <label for="checkbox-{member.id}" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{member.name}</label>
                        </div>
                    {/each}
                    <div class="flex justify-end">
                        <button type="submit" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Confirm</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div bind:this={notifications_modal_elem} data-modal-backdrop="static" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-2xl max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    Notices
                </h3>
                <button on:click={() => {notifications_modal.hide();}} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <div class="p-4 md:p-5 space-y-4">
                <ul class="notice-elements space-y-2">
                    {#each notices as notice}
                        <li>
                            <Notice uid={notice.uid} title={notice.name} />
                        </li>
                    {/each}
                </ul>
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
    .team-info
    {
        position: absolute;
        top: 0;
        height: 10rem;
        left: 0;
        right: 0;
    }
    .team-list-card
    {
        position: absolute;
        top: 10rem;
        bottom: 3.5rem;
        left: 0;
        right: 0;
    }
    .team-list-title
    {
        position: absolute;
        top: 0;
        height: 2rem;
        left: 0;
        right: 0;
    }
    .team-button
    {
        position: absolute;
        height: 3.5rem;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .team-elements
    {
        position: absolute;
        top: 3.5rem;
        bottom: 0;
        left: 0;
        right: 0;
        overflow-y: auto;
    }
</style>