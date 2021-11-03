const encoded = ["&amp;"];
const decoded = ["&"];

export function hashCode(str: string): number {
  let hash = 0;
  let i;
  let chr;
  if (str.length === 0) {
    return hash;
  }
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};


function replaceCumulative(str, find, replace) {
  for (let i = 0; i < find.length; i++) {
    str = str.replace(new RegExp(find[i], "g"), replace[i]);
  }
  return str;
};

export function vg_trans(str: string): string {
  if (!globalThis.dp_translations) {
    return str;
  }
  const hash = hashCode(str);
  const translation = globalThis.dp_translations[hash];
  if (translation) {
    return replaceCumulative(translation, encoded, decoded);
  }
  return str;
}
