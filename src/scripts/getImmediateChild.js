import { getParent } from './getParent';

export default function getImmediateChild(dropTarget, target) {
  let immediate = target;
  while (immediate && immediate !== dropTarget && immediate && getParent(immediate) !== dropTarget) {
    immediate = getParent(immediate);
  }
  if (immediate === document.body) {
    return null;
  }
  if (target === dropTarget) {
    return null;
  }
  return immediate;
}
