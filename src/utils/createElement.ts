export const createElement = (
  tag: string,
  props?: { [key: string]: string }
) => {
  const element = document.createElement(tag);

  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  return element;
};
