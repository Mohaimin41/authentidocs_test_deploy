<script lang="ts">
    import { page } from "$app/stores";
    import { signIn } from "@auth/sveltekit/client";
    import { onMount } from "svelte";

    export let login_card_content_div: HTMLDivElement;
    export let form: HTMLFormElement;
    export let on_card_content_load: () => void;
    let login_failed: boolean = false;
    let email: string;
    let password: string;

    async function login(): Promise<void>
    {
        login_failed = false;
        let subtle_crypto: SubtleCrypto = window.crypto.subtle;
        let text_encoder: TextEncoder = new TextEncoder();
        let password_buffer: ArrayBuffer = await subtle_crypto.digest("SHA-256", text_encoder.encode(password));
        let password_hash: string = [...new Uint8Array(password_buffer)].map(x => x.toString(16).padStart(2, '0')).join('');

        let login_response: Response | undefined = await signIn("credentials", 
        {
            email: email,
            password: password_hash,
            callbackUrl: "/home"
        });

        console.log(await login_response?.json());
    }

    onMount((): void =>
    {
        if($page.url.searchParams.has("error"))
        {
            login_failed = true;
        }

        on_card_content_load();
    });
</script>

<div class="login-card-content" bind:this={login_card_content_div}>
    <p class="text-3xl font-semibold text-gray-900 dark:text-white mb-3">Login</p>
    <form bind:this={form} on:submit={login}>
        <div class="relative z-0 w-full mb-5 group">
            <input bind:value={email} type="email" id="login-email" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required />
            <label for="login-email" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
        </div>
        <div class="relative z-0 w-full mb-5 group">
            <input bind:value={password} type="password" id="login-password" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" minlength="8" required />
            <label for="login-password" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
            {#if login_failed}
                <p class="mt-2 text-sm text-red-600 dark:text-red-500"><span class="font-medium">Wrong Credentials!</p>
            {/if}
        </div>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">New user? <a href="/signup" class="font-medium text-blue-600 hover:underline dark:text-blue-500">Sign Up</a></p>
        <div class="flex flex-row-reverse">
            <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login</button>
        </div>
    </form>
</div>

<style>
    .login-card-content
    {
        opacity: 0;
    }
</style>