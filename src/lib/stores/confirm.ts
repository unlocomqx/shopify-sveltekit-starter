import { writable } from "svelte/store";

export const confirmCanceled = writable(Date.now());

export function cancelConfirm() {
  confirmCanceled.set(Date.now());
}
