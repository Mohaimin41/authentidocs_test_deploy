<script lang="ts">
  import { signIn, signOut } from "@auth/sveltekit/client";
  import { page } from "$app/stores";
  import { common_fetch } from "$lib/fetch_func";

  let email = "";
  let password = "";
  common_fetch(
    "/api/v1/test",
    "",
    async (response: Response): Promise<void> => {
      let response_obj = await response.json();
      console.log(response_obj);
    }
  );
</script>

<div>
  {#if $page.data.session?.user}
    <p>Signed in as {$page.data.session.user.email}</p>
    <button on:click={() => signOut()}>Sign out</button>
  {:else}
    <form>
      <label>
        Email
        <input name="email" type="email" bind:value={email} />
      </label>
      <label>
        Password
        <input name="password" type="password" bind:value={password} />
      </label>
      <button on:click={() => signIn("credentials", { email, password })}
        >Log in</button
      >
    </form>
  {/if}
</div>
