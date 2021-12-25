export default function detectLeftButton(evt) {
  evt = evt || window.event;
  if ('buttons' in evt) {
    return evt.buttons === 1;
  }
  let button = evt.which || evt.button;
  return button === 1;
}
