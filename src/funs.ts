export const appenNewNode = <K extends keyof HTMLElementTagNameMap>(
  parent: HTMLElement,
  tag: K,
  props?: Partial<HTMLElementTagNameMap[K]>
) => {
  const node = document.createElement(tag);
  Object.assign(node, props);
  parent.appendChild(node);
  return node;
};
