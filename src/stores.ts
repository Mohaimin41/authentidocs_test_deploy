import { writable, type Writable } from "svelte/store";

export const logged_in_store: Writable<boolean> = writable(false);
export const uid: Writable<string> = writable("");
export const priv_key: Writable<CryptoKey | null> = writable(null);