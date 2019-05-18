const hasElement = (el: HTMLElement, target: HTMLElement) => {
  if (!el) return null;
  if (el === target) return true;
  if (el.children) {
    return Array.prototype.some.call(el.children, item => {
      return hasElement(item, target);
    });
  }
  return false;
};

export { hasElement };
