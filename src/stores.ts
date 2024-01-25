import { writable, type Writable } from "svelte/store";

export const logged_in_store: Writable<boolean> = writable(false);