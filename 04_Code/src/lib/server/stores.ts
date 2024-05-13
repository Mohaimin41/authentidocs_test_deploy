import { writable, type Writable } from "svelte/store";

export const filemap: Writable<Map<string, number[]>> = writable(new Map());