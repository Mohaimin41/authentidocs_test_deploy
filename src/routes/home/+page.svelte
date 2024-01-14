<script lang="ts">
    import { onMount } from "svelte";
    import ANavbar from "$lib/components/a-navbar.svelte";
    import FileCard from "$lib/components/home/file-card.svelte"
    import TeamCard from "$lib/components/home/team-card.svelte"
    import ThreadCard from "$lib/components/home/thread-card.svelte"

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

    function reset_color(): void
    {
        color.map((value: string, index: number, array: string[]): void =>
        {
            array[index] = "bg-white dark:bg-gray-800";
        });
    }

    /**
     * tab list element data object
     */
    class Tab
    {
        public name!: string;
        /**
         * this callback is supposed to set tab_index
         */
        public callback!: () => void;
    }

    let tabs: Tab[] = new Array(5);

    for(let i: number = 0; i < tabs.length; ++i)
    {
        tabs[i] = new Tab();

        tabs[i].callback = (): void =>
        {
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
    class File
    {
        public name!: string;
        public type!: string;
    }

    let personal_files: File[] = new Array(3);

    for(let i: number = 0; i < personal_files.length; ++i)
    {
        personal_files[i] = new File();
        personal_files[i].name = "Personal File " + (i + 1).toString();
        personal_files[i].type = ["png", "pdf", "jpg"][Math.round(Math.random() * 2)];
    }

    /**
     * team list element data object
     */
    class Team
    {
        public name!: string;
    }

    let teams: Team[] = new Array(5);

    for(let i: number = 0; i < teams.length; ++i)
    {
        teams[i] = new Team();
        teams[i].name = "Team " + (i + 1).toString();
    }

    /**
     * thread list item
     */
    class Thread
    {
        public name!: string;
    }

    let act_threads: Thread[] = new Array(69);
    let arch_threads: Thread[] = new Array(12);

    onMount((): void =>
    {
        tabs[0].callback();

        for(let i: number = 0; i < act_threads.length; ++i)
        {
            act_threads[i] = new Thread();
            act_threads[i].name = "Thread " + (i + 1).toString();
        }

        for(let i: number = 0; i < arch_threads.length; ++i)
        {
            arch_threads[i] = new Thread();
            arch_threads[i].name = "Thread " + (i + 1).toString();
        }
    });    
</script>

<ANavbar />

<div class="pg-center flex">
    <!-- Select Tabs to see various lists -->
    <div class="pg-left block bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <!-- svelte-ignore a11y-invalid-attribute -->
        <ul class="space-y-2 mx-6 mt-6 mb-6 pb-2" style="overflow-y: auto;">
            <!-- My personal files -->
            <li>
                <a href="javascript:" class="flex {color[0]} items-center block p-6 border border-gray-200 rounded-lg shadow dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700" on:click={tabs[0].callback}>
                    <svg class="w-8 h-8 text-blue-500 dark:text-blue-400 pe-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                    </svg>
                    <p class="text-2xl font-semibold text-gray-900 dark:text-white">My Personal Files</p>
                </a>
            </li>
            <!-- My teams -->
            <li>
                <a href="javascript:" class="flex {color[1]} items-center block p-6 border border-gray-200 rounded-lg shadow dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700" on:click={tabs[1].callback}>
                    <svg class="w-8 h-8 text-green-500 dark:text-green-400 pe-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 19">
                        <path d="M14.5 0A3.987 3.987 0 0 0 11 2.1a4.977 4.977 0 0 1 3.9 5.858A3.989 3.989 0 0 0 14.5 0ZM9 13h2a4 4 0 0 1 4 4v2H5v-2a4 4 0 0 1 4-4Z"/>
                        <path d="M5 19h10v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2ZM5 7a5.008 5.008 0 0 1 4-4.9 3.988 3.988 0 1 0-3.9 5.859A4.974 4.974 0 0 1 5 7Zm5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5-1h-.424a5.016 5.016 0 0 1-1.942 2.232A6.007 6.007 0 0 1 17 17h2a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5ZM5.424 9H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h2a6.007 6.007 0 0 1 4.366-5.768A5.016 5.016 0 0 1 5.424 9Z"/>
                    </svg>
                    <p class="text-2xl font-semibold text-gray-900 dark:text-white">My Teams</p>
                </a>
            </li>
            <!-- active threads -->
            <li>
                <a href="javascript:" class="flex {color[2]} items-center block p-6 border border-gray-200 rounded-lg shadow dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700" on:click={tabs[2].callback}>
                    <svg class="w-8 h-8 text-red-500 dark:text-red-400 pe-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 20">
                        <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M1 6v8a5 5 0 1 0 10 0V4.5a3.5 3.5 0 1 0-7 0V13a2 2 0 0 0 4 0V6"/>
                    </svg>
                    <p class="text-2xl font-semibold text-gray-900 dark:text-white">Active Threads ({act_threads.length})</p>
                </a>
            </li>
            <!-- Archived Threads -->
            <li>
                <a href="javascript:" class="flex {color[3]} items-center block p-6 border border-gray-200 rounded-lg shadow dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700" on:click={tabs[3].callback}>
                    <svg class="w-8 h-8 text-yellow-500 dark:text-yellow-400 pe-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                        <path d="M18 5H0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-7.258-2L9.092.8a2.009 2.009 0 0 0-1.6-.8H2.049a2 2 0 0 0-2 2v1h10.693Z"/>
                    </svg>
                    <p class="text-2xl font-semibold text-gray-900 dark:text-white">Archived Threads</p>
                </a>
            </li>
            <!-- Notices -->
            <li>
                <a href="javascript:" class="flex {color[4]} items-center block p-6 border border-gray-200 rounded-lg shadow dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700" on:click={tabs[4].callback}>
                    <svg class="w-8 h-8 text-red-500 dark:text-red-400 pe-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 20">
                        <path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z"/>
                    </svg>
                    <p class="text-2xl font-semibold text-gray-900 dark:text-white">Notices</p>
                </a>
            </li>
        </ul>
    </div>
    <div class="pg-right block bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        {#if tab_index === 0}
            <div class="list-container m-6">
                <p class="list-title text-2xl font-bold text-gray-900 dark:text-white pb-3 ps-1">My Personal Files</p>
                <ul class="list-elements space-y-2 pb-2" style="overflow-y: auto;">
                    {#each personal_files as file}
                        <li>
                            <FileCard file_name={file.name} file_type={file.type} />
                        </li>
                    {/each}
                </ul>
            </div>
        {:else if tab_index === 1}
            <div class="list-container m-6">
                <p class="list-title text-2xl font-bold text-gray-900 dark:text-white pb-3 ps-1">My Teams</p>
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
                <p class="list-title text-2xl font-bold text-gray-900 dark:text-white pb-3 ps-1">Active Threads</p>
                <ul class="list-elements space-y-2 pb-2" style="overflow-y: auto;">
                    {#each act_threads as thread }
                        <li>
                            <ThreadCard thread_name={thread.name} />
                        </li>
                    {/each}
                </ul>
            </div>
        {:else if tab_index === 3}
            <div class="list-container m-6">
                <p class="list-title text-2xl font-bold text-gray-900 dark:text-white pb-3 ps-1">Archived Threads</p>
                <ul class="list-elements space-y-2 pb-2" style="overflow-y: auto;">
                    {#each arch_threads as thread }
                        <li>
                            <ThreadCard thread_name={thread.name} />
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
    </div>
</div>

<style>
    .pg-center
    {
        position: absolute;
        top: 12vh;
        bottom: 4vh;
        left: 10%;
        right: 10%;
    }
    .pg-left
    {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 75%;
    }
    .pg-right
    {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 27.5%;
        right: 0;
    }
    .list-container
    {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .list-title
    {
        position: absolute;
        top: 0;
        bottom: 93%;
        left: 0;
        right: 0;
    }
    .list-elements
    {
        position: absolute;
        top: 7%;
        bottom: 0;
        left: 0;
        right: 0;
    }
</style>