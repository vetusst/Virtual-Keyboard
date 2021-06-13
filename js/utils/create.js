/**
 * @param {String} elem
 * @param {String} classNames
 * @param {HTMLElement} children
 * @param {HTMLElement} parent
 * @param {...Array} dataAttr
 */

export default function create(elem, classNames, children, parent, ...dataAttr) {
  let element = null;
  try {
    element = document.createElement(elem);
  } catch (error) {
    throw new Error('Unable to create HTML element. Give a proper tag name');
  }

  if (classNames) element.classList.add(...classNames.split(' '));

  if (children && Array.isArray(children)) {
    children.forEach((child) => child && element.appendChild(child));
  } else if (children && typeof children === 'object') {
    element.appendChild(children);
  } else if (children && typeof children === 'string') {
    element.innerHTML = children;
  }

  if (parent) {
    parent.appendChild(element);
  }

  if (dataAttr.length) {
    dataAttr.forEach(([attrName, attrValue]) => {
      if (attrValue === '') {
        element.setAttribute(attrName, '');
      } else if (attrName.match(/value|id|placeholder|cols|rows|autocorrect|spellcheck/)) {
        element.setAttribute(attrName, attrValue);
      } else {
        element.dataset[attrName] = attrValue;
      }
      // if (attrName.match(/value|id|placeholder|cols|rows|autocorrect|spellcheck/) || attrValue === '') {
      //     element.setAttribute(attrName, attrValue)
      // } else {
      //     element.dataset[attrName] = attrValue
      // }
    });
  }
  return element;
}
