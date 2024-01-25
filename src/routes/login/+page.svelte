<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import LogginFill from "$lib/components/loggin-fill.svelte";
    import Signing from "$lib/components/signing.svelte";
    import { onMount } from "svelte";

    if($page.data.session !== null)
    {
        goto("/home");
    }

    const IMAGE_COUNT: number = 2;
    const CHAPA_COLLECTION: string[] = ["Everything you need to agree", "It starts with a signature"];
    let login_left_div: HTMLDivElement;
    let login_card_div: HTMLDivElement;
    let login_card_content_div: HTMLDivElement;
    let form: HTMLFormElement;
    let chapa_span: HTMLSpanElement;
    let current_length: number = 0;
    let target_length: number;
    let signing_state: number = 0;
    let start_height: number = 0;

    function on_card_content_load(): void
    {
        login_card_div.animate(
            [
                {height: start_height + "px"},
                {height: login_card_content_div.scrollHeight + "px"}
            ],
            {
                duration: 200,
                iterations: 1,
                easing: "cubic-bezier(0.42, 0, 0.58, 1)"
            }
        ).onfinish = (): void =>
        {
            login_card_div.style.height = login_card_content_div.scrollHeight + "px";
            start_height = login_card_content_div.scrollHeight;
            login_card_content_div.style.opacity = "100%";

            login_card_content_div.animate(
                [
                    {opacity: 0},
                    {opacity: 1}
                ],
                {
                    duration: 200,
                    iterations: 1,
                    easing: "cubic-bezier(0.42, 0, 0.58, 1)"
                }
            ).onfinish = (): void =>
            {
                login_card_content_div.style.opacity = "1";
            };
        };
    }

    onMount((): void =>
    {
        let image_idx = Math.round(Math.random() * (IMAGE_COUNT - 1));
        let chapa_idx = Math.round(Math.random() * (CHAPA_COLLECTION.length - 1));
        let image_src = "signin/" + image_idx + ".webp";

        login_left_div.style.backgroundImage = "url(" + image_src + ")";
        login_left_div.style.animationPlayState = "running";
        login_left_div.onanimationend = (): void =>
        {
            login_left_div.style.opacity = "100%";
        };

        target_length = CHAPA_COLLECTION[chapa_idx].length;
        
        setTimeout((): void =>
        {
            let chapa_interval: NodeJS.Timeout = setInterval((): void =>
            {
                ++current_length;

                if(current_length > target_length)
                {
                    clearInterval(chapa_interval);

                    setTimeout((): void =>
                    {
                        chapa_span.innerText += ".";        
                    }, 500);

                    return;
                }

                chapa_span.innerText = CHAPA_COLLECTION[chapa_idx].substring(0, current_length);
            }, 100);
        }, 500);

        form.onsubmit = (): void =>
        {
            login_card_content_div.animate(
                [
                    {opacity: 1},
                    {opacity: 0}
                ],
                {
                    duration: 200,
                    iterations: 1,
                    easing: "cubic-bezier(0.42, 0, 0.58, 1)"
                }
            ).onfinish = (): void =>
            {
                login_card_content_div.style.opacity = "0";
            };

            signing_state = 1;
        };
    });
</script>

<div class="login-root">
    <div class="login-left" bind:this={login_left_div}>
        <div class="login-left-text">
            <span bind:this={chapa_span} style="text-align: end; line-height: 2ex"></span>
        </div>
    </div>
    <div class="login-right flex flex-col justify-center">
        <p class="text-5xl text-center font-bold text-gray-900 dark:text-white mb-3">Authentidocs</p>
        <p class="text-sm text-center text-gray-700 dark:text-gray-200 mb-10">Your most trusted document signing app</p>
        <div class="flex flex-col align-center block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div class="login-card" bind:this={login_card_div}>
                {#if signing_state == 0}
                    <LogginFill on_card_content_load={on_card_content_load} bind:form={form} bind:login_card_content_div={login_card_content_div} />
                {:else}
                    <Signing signing_text={"Loggin In"} on_card_content_load={on_card_content_load} bind:signin_card_content_div={login_card_content_div} />
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    .login-root
    {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .login-left
    {
        position: absolute;
        top: 5vh;
        bottom: 5vh;
        left: 10%;
        right: 45%;
        border-radius: 20px;
        background-size: 100% 100%;
        opacity: 0;
        animation: login-left-anim 500ms;
        animation-play-state: paused;
    }
    .login-left-text
    {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        font-size: 10ex;
        padding: 5%;
        border-radius: 20px;
        background-color: rgba(0, 0, 0, 0.25);
        color: white;
        mix-blend-mode: multiply;
        display: grid;
        justify-content: end;
        align-items: end;
        font-weight: bold;
    }
    .login-right
    {
        position: absolute;
        top: 5vh;
        bottom: 5vh;
        left: 60%;
        right: 10%;
    }
    .login-card
    {
        height: 0px;
    }
    @keyframes login-left-anim
    {
        0%
        {
            opacity: 0%;
        }

        100%
        {
            opacity: 100%;
        }
    }
</style>