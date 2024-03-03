<script lang="ts">
    import sign0 from "$lib/assets/signin/0.webp";
    import sign1 from "$lib/assets/signin/1.webp";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import Signing from "$lib/components/signing.svelte";
    import SignupFill from "$lib/components/signup-fill.svelte";
    import { onMount } from "svelte";

    if($page.data.session !== null)
    {
        goto("/home");
    }

    const IMAGE_COUNT: number = 2;
    const CHAPA_COLLECTION: string[] = ["Everything you need to agree", "It starts with a signature"];
    let signup_left_div: HTMLDivElement;
    let signup_card_div: HTMLDivElement;
    let signup_card_content_div: HTMLDivElement;
    let form: HTMLFormElement;
    let chapa_span: HTMLSpanElement;
    let current_length: number = 0;
    let target_length: number;
    let signing_state: number = 0;
    let start_height: number = 0;
    let user_exist: boolean = false;

    function on_card_content_load(): void
    {
        signup_card_div.animate(
            [
                {height: start_height + "px"},
                {height: signup_card_content_div.scrollHeight + "px"}
            ],
            {
                duration: 200,
                iterations: 1,
                easing: "cubic-bezier(0.42, 0, 0.58, 1)"
            }
        ).onfinish = (): void =>
        {
            signup_card_div.style.height = signup_card_content_div.scrollHeight + "px";
            start_height = signup_card_content_div.scrollHeight;
            signup_card_content_div.style.opacity = "100%";

            signup_card_content_div.animate(
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
                signup_card_content_div.style.opacity = "1";
            };
        };
    }

    onMount((): void =>
    {
        signing_state = 0;
        user_exist = false;

        if($page.url.searchParams.has("error"))
        {
            user_exist = true;
        }

        let image_idx = Math.round(Math.random() * (IMAGE_COUNT - 1));
        let chapa_idx = Math.round(Math.random() * (CHAPA_COLLECTION.length - 1));
        let image_src;

        if(image_idx === 0)
        {
            image_src = sign0;
        }
        else
        {
            image_src = sign1;
        }

        signup_left_div.style.backgroundImage = "url(" + image_src + ")";
        signup_left_div.style.animationPlayState = "running";
        signup_left_div.onanimationend = (): void =>
        {
            signup_left_div.style.opacity = "100%";
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
            signup_card_content_div.animate(
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
                signup_card_content_div.style.opacity = "0";
            };

            signing_state = 1;
        };
    });
</script>

<div class="signup-root">
    <div class="signup-left" bind:this={signup_left_div}>
        <div class="signup-left-text">
            <span bind:this={chapa_span} style="text-align: end; line-height: 2ex"></span>
        </div>
    </div>
    <div class="signup-right flex flex-col justify-center">
        <p class="text-5xl text-center font-bold text-gray-900 dark:text-white mb-3">Authentidocs</p>
        <p class="text-sm text-center text-gray-700 dark:text-gray-200 mb-10">Your most trusted document signing app</p>
        <div class="flex flex-col align-center block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div class="signup-card" bind:this={signup_card_div}>
                {#if signing_state == 0}
                    <SignupFill user_exist={user_exist} on_card_content_load={on_card_content_load} bind:form={form} bind:signup_card_content_div={signup_card_content_div} />
                {:else}
                    <Signing signing_text={"Signing Up"} on_card_content_load={on_card_content_load} bind:signin_card_content_div={signup_card_content_div} />
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    .signup-root
    {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .signup-left
    {
        position: absolute;
        top: 5vh;
        bottom: 5vh;
        left: 10%;
        right: 45%;
        border-radius: 20px;
        background-size: 100% 100%;
        opacity: 0;
        animation: signup-left-anim 500ms;
        animation-play-state: paused;
    }
    .signup-left-text
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
    .signup-right
    {
        position: absolute;
        top: 5vh;
        bottom: 5vh;
        left: 60%;
        right: 10%;
    }
    .signup-card
    {
        height: 0px;
    }
    @keyframes signup-left-anim
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