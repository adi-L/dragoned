const getParent = el => el && el.parentNode === document.body ? null : el && el.parentNode;
export default getParent;
