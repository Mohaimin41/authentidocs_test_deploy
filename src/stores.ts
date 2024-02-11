import { writable, type Readable, type Writable } from "svelte/store";

export const new_key: Writable<boolean> = writable(false);
export const logged_in_store: Writable<boolean> = writable(false);
export const uid: Writable<string> = writable("");
export const username: Writable<string> = writable("");
export const useremail: Writable<string> = writable("");
export const priv_key: Writable<CryptoKey | null> = writable(null);
// export let noti_json: Readable<any>;