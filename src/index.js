/* eslint-disable no-console */

import detectLeftButton from './scripts/detectLeftButton';
import getImmediateChild from './scripts/getImmediateChild';
import renderMirrorImage from './scripts/renderMirrorImage';

export default class Draggable {
  constructor(container, options = {}) {
    this.createGuideLine();
    this.dragStart = this.dragStart.bind(this);
    this.onMouseover = this.onMouseover.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.container = container;
    this.options = {
      draggable: options.draggable,
      handle: options.handle,
      color: options.color,
      preventDefault: options.preventDefault,
      direction: options.direction,
      onStart: options.onStart,
      onMove: options.onMove,
      onEnd: options.onEnd,
      onOver: options.onOver
    };
    this.init();
  }
  createGuideLine() {
    this.guideLine = document.createElement('div');
    this.guideLine.className = 'draggable-selector';
  }

  init() {
    this.bindDrag(this.container);
  }
  onMouseUp() {
    if (this.mirror) {
      this.mirror.remove();
      this.mirror = null;
    }
    this.dragEl.style.opacity = 1;
    this.guideLine.remove();
    this.guideLine.style.left = `${-9999}px`;
    this.guideLine.style.top = `${-9999}px`;
    document.removeEventListener('mousemove', this.onMouseover);
    document.removeEventListener('mouseup', this.onMouseUp);
    if (this.direction && this.dropEl) {
      this.dropEl.insertAdjacentElement(this.direction, this.dragEl);
      this.newIndex = Array.prototype.indexOf.call(this.container.children, this.dragEl);
      if (this.options.onEnd === 'function') {
        this.options.onEnd({
          to: this.container,
          from: this.container,
          newIndex: this.newIndex,
          oldIndex: this.oldIndex

        });
      }
    }

  }
  onMouseover(_e) {
    if (!detectLeftButton(_e)) {
      this.guideLine.remove();
      document.removeEventListener('mousemove', this.onMouseover);
    }
    if (this.mirror && this.dragEl) {
      this.mirror.style.left = `${_e.clientX}px`;
      this.mirror.style.top = `${_e.clientY}px`;
      this.mirror.style.display = 'none';
    }
    const _moveY = _e.clientY;
    const _target = document.elementFromPoint(_e.clientX, _e.clientY);
    const dropEl = getImmediateChild(this.container, _target);
    if (this.mirror) {
      this.mirror.style.display = 'block';
    }
    if (dropEl && dropEl !== this.dragEl) {
      if (!this.mirror) {
        this.mirror = renderMirrorImage(this.dragEl, _e.clientX, _e.clientY);
      }

      this.dragEl.style.opacity = 0.2;
      this.guideLine.style.opacity = 1;
      const rect = dropEl.getBoundingClientRect();
      this.guideLine.style.width = `${rect.width}px`;
      this.guideLine.style.height = '4px';
      // is mouse is on the top of the element
      if (rect.bottom > _moveY && rect.bottom - rect.height / 2 < _moveY) {
        this.direction = 'afterend';
        this.dropEl = dropEl;
        this.dragEl = this.dragEl;
        this.guideLine.style.top = `${_e.pageY - _e.pageY + window.pageYOffset
          + rect.top + rect.height}px`;
        this.guideLine.style.left = `${rect.left}px`;
      } else if (rect.top < _moveY && rect.top + rect.height / 2 > _moveY) {
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
    if (typeof this.options.onStart === 'function') {
      this.options.onStart({
        from: this.container,
        oldIndex: this.oldIndex
      });
    }
    const dragEl = getImmediateChild(this.container, target);
    if (dragEl) {
      this.dragEl = dragEl;
      this.oldIndex = Array.prototype.indexOf.call(this.container.children, dragEl);
      document.addEventListener('mousemove', this.onMouseover);
      document.addEventListener('mouseup', this.onMouseUp);
    }
  }

  bindDrag(container) {
    container.addEventListener('mousedown', this.dragStart);
  }
}
