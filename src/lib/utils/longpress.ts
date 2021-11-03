export function longpress(node, threshold = 500) {
  // note — a complete answer would also consider touch events

  const handle_mousedown = (e) => {
    e.stopPropagation();
    const timeout = setTimeout(() => {
      node.dispatchEvent(new CustomEvent("longpress"));
    }, threshold);

    const cancel = (e) => {
      clearTimeout(timeout);
      e.preventDefault();

      node.removeEventListener("mousemove", cancel);
      node.removeEventListener("mouseup", cancel);
    };

    node.addEventListener("mousemove", cancel);
    node.addEventListener("mouseup", cancel);
  };

  node.addEventListener("mousedown", handle_mousedown);

  return {
    destroy() {
      node.removeEventListener("mousedown", handle_mousedown);
    },
  };
}
