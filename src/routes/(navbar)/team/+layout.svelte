<script lang="ts">
    import TeamCard from "$lib/components/team/team-card.svelte";
    import { Button } from "flowbite-svelte";
    import { onMount } from "svelte";

    let selected_team_name: string;

    onMount((): void =>
    {
        selected_team_name = "Team 1";
    });
</script>

<div class="pg-center flex justify-between">
    <div class="pg-left">
        <div class="team-list-container block bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <p class="team-list-title text-2xl font-bold text-gray-900 dark:text-white mx-6 mt-6 ps-1">Active team</p>
            <ul class="team-list space-y-2 mx-6 mb-6 pb-1" style="overflow-y: auto;">
                <li>
                    <TeamCard team_name={"Team 1"} selected={true}/>
                </li>
                <li>
                    <TeamCard team_name={"Team 2"}/>
                </li>
                <li>
                    <TeamCard team_name={"Team 3"}/>
                </li>
                <li>
                    <TeamCard team_name={"Team 4"}/>
                </li>
                <li>
                    <TeamCard team_name={"Team 5"}/>
                </li>
                <li>
                    <TeamCard team_name={"Team 6"}/>
                </li>
                <li>
                    <TeamCard team_name={"Team 7"}/>
                </li>
                <li>
                    <TeamCard team_name={"Team 8"}/>
                </li>
                <li>
                    <TeamCard team_name={"Team 9"}/>
                </li>
            </ul>
        </div>
        <div class="add-team flex flex-row-reverse pt-2">
            <Button>Add Team</Button>
        </div>
    </div>
    <div class="pg-right">
        <slot></slot>
    </div>
</div>

<style>
    .pg-center
    {
        position: absolute;
        top: 5.25rem;
        bottom: 1rem;
        left: 10%;
        right: 10%;
    }
    .pg-left
    {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 70%;
    }
    .team-list-container
    {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 3.5rem
    }
    .team-list-title
    {
        position: absolute;
        top: 0;
        height: 2rem;
        left: 0;
        right: 0;
    }
    .team-list
    {
        position: absolute;
        top: 4rem;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .add-team
    {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .pg-right
    {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 32.5%;
        right: 0;
    }
</style>