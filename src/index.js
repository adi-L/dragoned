/* eslint-disable no-console */

import detectLeftButton from './scripts/detectLeftButton';
import getImmediateChild from './scripts/getImmediateChild';
import renderMirrorImage from './scripts/renderMirrorImage';
import containerStack from './containerStack';

export default class Draggable {
  constructor(container, options = {}) {
    this.createGuideLine();
    this.dragStart = this.dragStart.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.container = container;
    this.moveY = 0;
    this.optionsInit(options);
    containerStack.push(this);
    this.init();
  }
  optionsInit(options) {
    this.options = {
      draggable: options.draggable,
      handle: options.handle,
      color: options.color,
      preventDefault: options.preventDefault,
      direction: options.direction,
      onStart: options.onStart,
      onMove: options.onMove,
      onEnd: options.onEnd,
      body: options.body || document.body,
      clone: options.clone,
      group: options.group,
      sort: options.sort
    };
  }

  createGuideLine() {
    this.guideLine = document.createElement('div');
    this.guideLine.className = '__sortable_draggable-guide-line';
    this.guideLine.style.position = 'absolute';
    this.guideLine.style.borderRadius = `.5rem`;
    this.guideLine.style.backgroundColor = 'rgb(70, 25, 194)';
  }

  init() {
    this.bindDrag(this.container);
  }
  onMouseUp() {
    if (this.mirror) {
      this.mirror.remove();
      this.mirror = null;
    }
    delete this.dragEl.Sortable__container__;
    this.dragEl.style.opacity = 1;
    this.guideLine.remove();
    this.guideLine.style.left = `${-9999}px`;
    this.guideLine.style.top = `${-9999}px`;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    if (this.direction && this.dropEl) {
      const droppableEl = this.options.clone === true ? this.dragEl.cloneNode(true) : this.dragEl;
      this.dropEl.insertAdjacentElement(this.direction, droppableEl);
      this.newIndex = Array.prototype.indexOf.call(this.container.children, this.dragEl);
      if (this.options.onEnd === 'function') {
        this.options.onEnd({
          item: droppableEl,
          to: this.container,
          from: this.container,
          newIndex: this.newIndex,
          oldIndex: this.oldIndex

        });
      }
    }

  }
  onMouseMove(_e) {
    if (!detectLeftButton(_e)) {
      this.guideLine.remove();
      document.removeEventListener('mousemove', this.onMouseMove);
    }
    if (_e.clientY < this.moveY) {
      this.mouseDirection = 'top';
    } else if (_e.clientY > this.moveY) {
      this.mouseDirection = 'bottom';
    }
    this.moveY = _e.clientY;
    const scrollUp = () => window.scrollTo({
      top: window.scrollY - 1,
      left: 0
    });
    const scrollBottom = () => window.scrollTo({
      top: window.scrollY + 1,
      left: 0
    });
    const scroller = () => {
      if (this.mirror && this.moveY < 50 && this.mouseDirection === 'top') {
        scrollUp();
        setTimeout(() => {
          scroller();
        }, 100);
      } else if (this.mirror && window.innerHeight - this.moveY < 50 && this.mouseDirection === 'bottom') {
        scrollBottom();
        setTimeout(() => {
          scroller();
        }, 100);
      }
    };
    scroller();
    if (this.mirror && this.dragEl) {
      this.mirror.style.left = `${_e.clientX - document.body.offsetLeft - this.mirror.__offsetX}px`;
      this.mirror.style.top = `${_e.clientY - document.body.offsetTop - this.mirror.__offsetY}px`;
      this.mirror.style.display = 'none';
    }
    const _target = document.elementFromPoint(_e.clientX, _e.clientY);
    // here
    let dropEl;
    let dropInstance;
    for (let index = 0; index < containerStack.length; index++) {
      const current = containerStack[index];
      const immediate = getImmediateChild(current.container, _target);
      if (immediate) {
        dropInstance = current;
        dropEl = immediate;
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
        this.direction = 'afterend';
        this.dropEl = dropEl;
        this.dragEl = this.dragEl;
        this.guideLine.style.top = `${_e.pageY - _e.pageY + window.pageYOffset
          + rect.top + rect.height}px`;
        this.guideLine.style.left = `${rect.left}px`;
      } else if (rect.top < this.moveY && rect.top + rect.height / 2 > this.moveY) {
        this.dropEl = dropEl;
        this.direction = 'beforebegin';
        this.guideLine.style.top = `${_e.pageY - _e.pageY + window.pageYOffset
          + rect.top}px`;
        this.guideLine.style.left = `${rect.left}px`;
      }
    } else {
      this.guideLine.style.opacity = 0.2;
    }
  }

  dragStart(e) {
    document.body.appendChild(this.guideLine);

    const target = e.target;
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
      this.mirror = renderMirrorImage(dragEl, e.clientX, e.clientY);
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
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);

  }

  bindDrag(container) {
    container.style.userSelect = 'none';
    container.addEventListener('mousedown', this.dragStart);
  }
}
