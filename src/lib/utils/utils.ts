import { forEach } from "@utils/foreach";

export function keys(obj) {
  return Object.keys(obj);
}

export function isEqual(x, y) {
  if (x === y) {
    return true;
  } else if ((typeof x === "object" && x !== null) && (typeof y === "object" && y !== null)) {
    if (Object.keys(x).length !== Object.keys(y).length) {
      return false;
    }

    for (const prop in x) {
      // eslint-disable-next-line no-prototype-builtins
      if (y.hasOwnProperty(prop)) {
        if (!isEqual(x[prop], y[prop])) {
          return false;
        }
      } else {
        return false;
      }
    }

    return true;
  } else {
    return false;
  }
}

export function flatten(arr) {
  return arr.reduce((flat, toFlatten) => {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

export function cloneDeep(obj) {
  if (obj === null || typeof (obj) !== "object" || "isActiveClone" in obj) {
    return obj;
  }

  const temp = obj.constructor();

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      obj.isActiveClone = null;
      temp[key] = cloneDeep(obj[key]);
      delete obj.isActiveClone;
    }
  }
  return temp;
}

export function shallow(obj) {
  const copy = Object.assign({}, obj);
  for (const prop in copy) {
    if (typeof copy[prop] === "object") {
      delete copy[prop];
    }
  }
  return copy;
}

export function trigger(node: HTMLElement | Document, event: string, data = null): boolean {
  const customEvent = new CustomEvent(event, { detail: data });
  return node.dispatchEvent(customEvent);
}

export function findDuplicates(items) {
  const duplicates = [];
  const copy = [];
  forEach(items, (item) => {
    if (item && copy.includes(item) && !duplicates.includes(item)) {
      duplicates.push(item);
    }
    copy.push(item);
  });
  return duplicates;
}

export function round(value, decimals) {
  return Number(Math.round(parseFloat(value.toString() + "e" + decimals.toString())) + "e-" + decimals);
}

export function uniqid() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

export function ucfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

export function empty(obj) {
  return !obj || Object.keys(obj).length === 0;
}

export function uniqueBy<T extends { id: string }>(items: T[]): T[] {
  return [
    ...new Map<string, T>(
      items.map(item => [item.id, item]),
    ).values(),
  ];
}

export function strToBool(str: string): boolean {
  const map = {
    "true": true,
    "false": false,
  };
  if (!Object.keys(map).includes(str)) {
    return false;
  }
  return map[str];
}
