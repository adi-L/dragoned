/* eslint-disable no-console */

import detectLeftButton from './scripts/detectLeftButton';
import getImmediateChild from './scripts/getImmediateChild';
import renderMirrorImage from './scripts/renderMirrorImage';
import containerStack from './containerStack';
import { EVENTS, DIRECTIONS, CLASS_NAMES } from './constants';

export default class Dragoned {
  constructor(container, options = {}) {
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    if (!container || !container instanceof HTMLElement) {
      return new Error('Dragoned: container must be a string or an HTMLElement');
    }
    this.createGuideLine();
    this.onMouseUp = this.onMouseUp.bind(this);
    this.dragStart = this.dragStart.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
    this.container = container;
    this.moveY = 0;
    this.mouseUp = false;
    this.optionsInit(options);
    containerStack.push(this);
    this.init();
  }
  optionsInit(options) {
    this.options = {
      draggable: options.draggable,
      handle: options.handle,
      delay: typeof options.delay === 'number' ? options.delay : 0,
      preventDefault: options.preventDefault,
      direction: options.direction,
      onStart: options.onStart,
      onMove: options.onMove,
      onClone: options.onClone,
      onEnd: options.onEnd,
      body: options.body || document.body,
      clone: options.clone,
      group: options.group,
      sort: options.sort
    };
  }

  createGuideLine() {
    this.guideLine = document.createElement('div');
    this.guideLine.className = CLASS_NAMES.guideLine;
    this.guideLine.style.position = 'absolute';
    this.guideLine.style.borderRadius = `.5rem`;
    this.guideLine.style.backgroundColor = 'rgb(70, 25, 194)';
  }

  init() {
    this.bindDrag(this.container);
  }
  dragEnd() {
    this.mouseUp = true;
    if (this.mirror) {
      this.mirror.remove();
      this.mirror = null;
    }

    this.dragEl.style.opacity = 1;
    this.guideLine.remove();
    this.guideLine.style.left = `${-9999}px`;
    this.guideLine.style.top = `${-9999}px`;
    document.removeEventListener(EVENTS.MOUSE_MOVE, this.onMouseMove);
    document.removeEventListener(EVENTS.MOUSE_UP, this.dragEnd);
    if (this.direction && this.dropEl) {
      const cloneEl = this.options.clone === true ? this.dragEl.cloneNode(true) : this.dragEl;
      if (this.options.clone === true && typeof this.options.onClone === 'function') {
        this.options.onClone({
          from: this.container,
          oldIndex: this.oldIndex,
          clone: this.cloneEl
        });
      }
      this.dropEl.insertAdjacentElement(this.direction, cloneEl);
      const to = this.dropEl.Sortable__container__;
      const from = this.container;
      this.newIndex = Array.prototype.indexOf.call(to.children, cloneEl);

      delete this.dragEl.Sortable__container__;
      delete this.dragEl.Sortable__container__;

      if (typeof this.options.onEnd === 'function') {
        this.options.onEnd({
          item: cloneEl,
          to,
          from,
          newIndex: this.newIndex,
          oldIndex: this.oldIndex
        });
      }
    }

  }
  onMouseMove(event) {
    event.preventDefault();
    if (event.type === EVENTS.MOUSE_MOVE && !detectLeftButton(event)) {
      this.guideLine.remove();
      document.removeEventListener(EVENTS.MOUSE_MOVE, this.onMouseMove);
    }
    const clientY = event.type === EVENTS.TOUCH_MOVE ? event.touches[0].clientY : event.clientY;
    const clientX = event.type === EVENTS.TOUCH_MOVE ? event.touches[0].clientX : event.clientX;
    const pageY = event.type === EVENTS.TOUCH_MOVE ? event.touches[0].pageY : event.pageY;
    if (clientY < this.moveY) {
      this.mouseDirection = DIRECTIONS.TOP;
    } else if (clientY > this.moveY) {
      this.mouseDirection = DIRECTIONS.BOTTOM;
    }
    this.moveY = clientY;
    const scrollUp = () => window.scrollTo({
      top: window.scrollY - 1,
      left: 0
    });
    const scrollBottom = () => window.scrollTo({
      top: window.scrollY + 1,
      left: 0
    });
    const scroller = () => {
      if (this.mirror && this.moveY < 100 && this.mouseDirection === DIRECTIONS.TOP) {
        scrollUp();
        setTimeout(() => {
          scroller();
        }, 100);
      } else if (this.mirror
        && window.innerHeight - this.moveY < 100
        && this.mouseDirection === DIRECTIONS.BOTTOM) {
        scrollBottom();
        setTimeout(() => {
          scroller();
        }, 100);
      }
    };
    scroller();
    if (this.mirror && this.dragEl) {
      this.mirror.style.left = `${clientX - document.body.offsetLeft - this.mirror.__offsetX}px`;
      this.mirror.style.top = `${clientY - document.body.offsetTop - this.mirror.__offsetY}px`;
      this.mirror.style.display = 'none';
    }
    const _target = document.elementFromPoint(clientX, clientY);
    // here
    let dropEl;
    let dropInstance;
    for (let index = 0; index < containerStack.length; index++) {
      const current = containerStack[index];
      const immediate = getImmediateChild(current.container, _target);
      if (immediate) {
        dropInstance = current;
        dropEl = immediate;
        dropEl.Sortable__container__ = current.container;
        break;
      }
    }
    if (this.mirror) {
      this.mirror.style.display = 'block';
    }
    if (dropEl && dropEl !== this.dragEl) {
      if (dropInstance.options.sort === false) {
        return;
      }
      if (typeof this.options.onMove === 'function') {
        this.options.onMove({
          item: this.dragEl,
          to: dropInstance.container,
          from: this.container,
          newIndex: Array.prototype.indexOf.call(dropInstance.container.children, dropEl),
          oldIndex: Array.prototype.indexOf.call(this.container.children, this.dragEl)
        });
      }
      this.dragEl.style.opacity = 0.2;
      this.guideLine.style.opacity = 1;
      const rect = dropEl.getBoundingClientRect();
      this.guideLine.style.width = `${rect.width}px`;
      this.guideLine.style.height = '4px';
      // is mouse is on the top of the element
      if (rect.bottom > this.moveY && rect.bottom - rect.height / 2 < this.moveY) {
        this.direction = DIRECTIONS.AFTEREND;
        this.dropEl = dropEl;
        this.dragEl = this.dragEl;
        this.guideLine.style.top = `${pageY - pageY + window.pageYOffset
          + rect.top + rect.height}px`;
        this.guideLine.style.left = `${rect.left}px`;
      } else if (rect.top < this.moveY && rect.top + rect.height / 2 > this.moveY) {
        this.dropEl = dropEl;
        this.direction = DIRECTIONS.BEFOREBEGIN;
        this.guideLine.style.top = `${pageY - pageY + window.pageYOffset
          + rect.top}px`;
        this.guideLine.style.left = `${rect.left}px`;
      }
    } else {
      this.guideLine.style.opacity = 0.2;
    }
  }
  onMouseUp() {
    this.mouseUp = true;
    clearTimeout(this.pressDelay);
    document.removeEventListener(EVENTS.MOUSE_UP, this.onMouseUp);
  }
  dragStart(event) {
    event.preventDefault();
    this.mouseUp = false;
    if (event.type === EVENTS.MOUSE_DOWN && !detectLeftButton(event)) {
      return;
    }
    this.can = true;
    // continue if user clicked for 1 second
    const start = () => {
      document.body.appendChild(this.guideLine);
      const clientY = event.type === EVENTS.TOUCH_START ? event.touches[0].clientY : event.clientY;
      const clientX = event.type === EVENTS.TOUCH_START ? event.touches[0].clientX : event.clientX;
      const target = event.target;
      let draggableEl;
      let handleEl;
      if (this.options.draggable) {
        draggableEl = target.closest(this.options.draggable);
        if (!draggableEl) {return;}
      }
      if (this.options.handle) {
        handleEl = target.closest(this.options.handle);
        if (!handleEl) {return;}
      }
      const dragEl = getImmediateChild(this.container, target);
      if (!dragEl) {return;}
      if (!this.mirror) {
        this.mirror = renderMirrorImage(dragEl, clientX, clientY);
      }
      if (typeof this.options.onStart === 'function') {
        this.options.onStart({
          from: this.container,
          oldIndex: this.oldIndex,
          item: dragEl
        });
      }
      this.dragEl = dragEl;
      this.dragEl.Sortable__container__ = this.container;
      this.oldIndex = Array.prototype.indexOf.call(this.container.children, dragEl);
      document.addEventListener(EVENTS.MOUSE_MOVE, this.onMouseMove);
      document.addEventListener(EVENTS.TOUCH_MOVE, this.onMouseMove, { passive: false });
      document.addEventListener(EVENTS.MOUSE_UP, this.dragEnd);
      document.addEventListener(EVENTS.TOUCH_END, this.dragEnd);

    };
    document.addEventListener(EVENTS.MOUSE_UP, this.onMouseUp);
    this.pressDelay = setTimeout(() => {
      if (this.mouseUp === false) {
        start();
      }
    }, this.options.delay);
  }

  bindDrag(container) {
    container.style.userSelect = 'none';
    container.addEventListener(EVENTS.MOUSE_DOWN, this.dragStart);
    container.addEventListener(EVENTS.TOUCH_START, this.dragStart);
  }
  destroy() {
    const index = containerStack.findIndex(c => c === this);
    if (index !== -1) {
      containerStack.splice(index, 1);
    }
    this.container.removeEventListener(EVENTS.MOUSE_DOWN, this.dragStart);
    this.container.removeEventListener(EVENTS.TOUCH_START, this.dragStart);
    if (this.mirror) {
      this.mirror.remove();
    }
    if (this.guideLine) {
      this.guideLine.remove();
    }
  }
}
