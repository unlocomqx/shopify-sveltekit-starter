import type { VegemiteStore } from "@interfaces/SvelteStore";
import { cloneDeep, isEqual } from "@utils/utils";
import { writable } from "svelte/store";
import type { Store } from "vegemite";
import vegemite from "vegemite";

export function writableStore<T, M>(value: T): VegemiteStore<T, M> {

  const veg: Store<T, M> = vegemite<M, T>(value);

  let subscribeFunctions = [];

  function set(newValue) {
    value = newValue;
    veg.set(value);
    subscribeFunctions.forEach((func) => func(newValue));
  }

  function dispatch(topic, callback) {
    if (typeof callback === "function") {
      value = callback(value);
    }
    veg.dispatch(topic, value as any);
    set(value);
  }

  function update(callback) {
    set(callback(value));
  }

  function subscribe(callback) {
    subscribeFunctions.push(callback);
    callback(value);

    return function() {
      subscribeFunctions =
        subscribeFunctions.filter((func) => callback !== func);
    };
  }

  function on(event, handle) {
    handle(value);
    return veg.on(event, (_, state) => {
      handle(state);
    });
  }

  function get() {
    return value;
  }

  function pick(path: string) {

    let current_val = pickValue(value, path);
    let previous_val = current_val;

    function pickValue(data, obj_path) {
      const keys = obj_path.split(".");
      let root = data;
      let current_val = null;
      keys.forEach(key => {
        if (root) {
          current_val = root[key];
          root = current_val;
        }
      });
      return current_val;
    }

    const store = writable(current_val);

    subscribe((data) => {
      current_val = pickValue(data, path);
      if (!isEqual(current_val, previous_val)) {
        store.set(current_val);
      }
      previous_val = cloneDeep(current_val);
    });

    return store;
  }

  return { ...veg, set, get, update, subscribe, dispatch, pick, on };
}
