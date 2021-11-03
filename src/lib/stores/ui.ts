import { get, writable } from "svelte/store";

export type UiStoreData = {
  loading: boolean;
  lang_input_open: boolean;
}

export const ui_store = writable<UiStoreData>({
  loading: false,
  lang_input_open: false,
});

export function setLoading(loading) {
  const state = get(ui_store);
  state.loading = loading;
  ui_store.set(state);
}
