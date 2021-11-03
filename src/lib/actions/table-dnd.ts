import { trigger } from "@utils/utils";
import { tweened } from "svelte/motion";
import { cubicInOut } from "svelte/easing";
import { tick } from "svelte";

export type TableDndInstance = {
  update: () => void,
  onDestroy: () => void,
};
export type TableDndOptions = {
  handle: string;
  classes: {
    dragging: string;
    dropped: string;
  },
  // used for reactivity only
  data: any;
  instance: TableDndInstance
}

export async function tableDnd(table: HTMLTableElement, options: TableDndOptions) {

  const instance = {
    async update() {
      reset();
      await tick();
      init();
    },
    onDestroy() {
      reset();
    },
  };

  const opts: TableDndOptions = {
    handle: "",
    ...options,
    classes: {
      dragging: "",
      dropped: "",
      ...options?.classes,
    },
    instance: null,
  };

  let tbody: HTMLTableSectionElement;
  let rows: NodeListOf<HTMLTableRowElement>;
  let rects: Map<HTMLTableRowElement, DOMRect>;

  let dragging = false;
  let startY = 0;
  let dragged: HTMLTableRowElement = null;
  let draggedRect: DOMRect = null;
  let last_target_row = null;
  let lastBefore = false;
  let lastZIndex = "";

  async function init() {
    tbody = table.querySelector("tbody");
    rows = table.querySelectorAll<HTMLTableRowElement>("tbody > tr");
    tbody.addEventListener("mousemove", handleDragOver);

    document.addEventListener("mouseup", handleDragEnd);
    rects = new Map<HTMLTableRowElement, DOMRect>();
    rows.forEach(row => {
      const el = opts.handle ? row.querySelector(opts.handle) : row;
      el?.addEventListener("mousedown", handleDragStart);
    });
  }

  function reset() {
    tbody.removeEventListener("mousemove", handleDragOver);
    document.removeEventListener("mouseup", handleDragEnd);
    rows.forEach(row => {
      const el = opts.handle ? row.querySelector(opts.handle) : row;
      el?.removeEventListener("mousedown", handleDragStart);
    });
  }

  async function disaptchInstance() {
    await tick();
    trigger(table, "dndinit", { instance });
  }

  init();
  disaptchInstance();

  function updateRects() {
    const rows = table.querySelectorAll<HTMLTableRowElement>("tbody > tr");
    rows.forEach(row => {
      rects.set(row, row.getBoundingClientRect());
    });
    draggedRect = rects.get(dragged);
  }

  function setY(element: HTMLElement, y: number) {
    if (element) {
      element.style.top = y + "px";
    }
  }

  function setOpacity(element: HTMLElement, opacity: number) {
    if (element) {
      element.style.opacity = opacity.toString();
    }
  }

  function handleDragStart(ev: MouseEvent) {
    rows.forEach(row => {
      if (opts.classes.dropped) {
        row.classList.remove(...opts.classes.dropped.split(" "));
      }
    });
    dragging = true;
    startY = ev.clientY;
    dragged = (ev.target as HTMLElement).closest("tr");
    updateRects();
    if (opts.classes.dropped) {
      dragged.classList.remove(...opts.classes.dropped.split(" "));
    }
    if (opts.classes.dragging) {
      dragged.classList.add(...opts.classes.dragging.split(" "));
    }
    dragged.style.position = "relative";
    lastZIndex = dragged.style.zIndex;
    dragged.style.zIndex = "100";
    setOpacity(dragged, 0.8);
    tbody.style.position = "relative";
  }

  function handleDragOver(ev: MouseEvent) {
    if (dragging) {
      let offsetY = ev.clientY - startY;
      setY(dragged, offsetY);
      const result = Array.from(rects)
        .find(([, rect]) => ev.clientY >= rect.top && ev.clientY < rect.bottom);
      if (result) {
        const [target_row, rect] = result;
        if (target_row && target_row !== dragged) {
          const middle = rect.y + rect.height / 2;
          const before = ev.clientY < middle;
          if (target_row !== last_target_row || before !== lastBefore) {
            if (before) {
              tbody.insertBefore(dragged, target_row);
            } else {
              insertAfter(dragged, target_row);
            }
            last_target_row = target_row;
            lastBefore = before;
            const prevY = draggedRect.top;
            dragged.style.top = "0px";
            updateRects();
            const newY = draggedRect.top;
            startY = startY - (prevY - newY);
            offsetY = ev.clientY - startY;
            setY(dragged, offsetY);
          }
        }
      }
    }
  }

  function handleDragEnd(ev: MouseEvent) {
    if (dragging && dragged) {
      const offsetY = ev.clientY - startY;
      const posY = tweened(offsetY, {
        duration: 333,
        easing: cubicInOut,
      });
      if (!dragged) {
        return;
      }
      dragged.style.position = "";
      dragged.style.zIndex = lastZIndex;
      setOpacity(dragged, 1);
      if (dragged) {
        if (opts.classes.dragging) {
          dragged.classList.remove(...opts.classes.dragging.split(" "));
        }
        if (opts.classes.dropped) {
          dragged.classList.add(...opts.classes.dropped.split(" "));
        }
      }
      dragged = null;
      lastZIndex = "";
      trigger(table, "reorder", { order: getOrder(table) });
      dragging = false;
      last_target_row = null;
      posY.set(0);
    }
  }

  function insertAfter(inserted, existing) {
    existing.parentNode.insertBefore(inserted, existing.nextSibling);
  }

  return instance;
}

export function getOrder(table: HTMLTableElement) {
  const rows = table.querySelectorAll("tbody > tr");
  return Array.from(rows).map(row => {
    try {
      return JSON.parse((row as HTMLElement).dataset.id);
    } catch (e) {
      return (row as HTMLElement).dataset.id;
    }
  });
}
