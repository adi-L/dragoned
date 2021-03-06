/*!
 * dragoned
 * Another Sortable library but with the line
 *
 * @version v1.0.10
 * @author Adi Levi <adilev3344@gmail.com> (https://bit.ly/3xx3vTW)
 * @homepage
 * @repository https://github.com/adi-L/dragoned.git
 */
/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src */ "./src/index.js")["default"];

/***/ }),

/***/ "./src/constants.js":
/*!**************************!*\
  !*** ./src/constants.js ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EVENTS": function() { return /* binding */ EVENTS; },
/* harmony export */   "DIRECTIONS": function() { return /* binding */ DIRECTIONS; },
/* harmony export */   "CLASS_NAMES": function() { return /* binding */ CLASS_NAMES; }
/* harmony export */ });
var EVENTS = {
  TOUCH_MOVE: "touchmove",
  MOUSE_MOVE: "mousemove",
  MOUSE_UP: "mouseup",
  MOUSE_DOWN: "mousedown",
  TOUCH_END: "touchend",
  TOUCH_START: "touchstart",
  TOUCH_CANCEL: "touchcancel",
  DRAG_START: "dragstart",
  DRAG_END: "dragend"
};
var DIRECTIONS = {
  LEFT: "left",
  RIGHT: "right",
  UP: "up",
  DOWN: "down",
  TOP: "top",
  BOTTOM: "bottom",
  AFTEREND: "afterend",
  BEFOREBEGIN: "beforebegin"
};
var CLASS_NAMES = {
  guideLine: "__sortable_draggable-guide-line"
};

/***/ }),

/***/ "./src/containerStack.js":
/*!*******************************!*\
  !*** ./src/containerStack.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var containerStack = [];
/* harmony default export */ __webpack_exports__["default"] = (containerStack);

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Dragoned; }
/* harmony export */ });
/* harmony import */ var _scripts_detectLeftButton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scripts/detectLeftButton */ "./src/scripts/detectLeftButton.js");
/* harmony import */ var _scripts_getImmediateChild__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scripts/getImmediateChild */ "./src/scripts/getImmediateChild.js");
/* harmony import */ var _scripts_renderMirrorImage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scripts/renderMirrorImage */ "./src/scripts/renderMirrorImage.js");
/* harmony import */ var _containerStack__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./containerStack */ "./src/containerStack.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./constants */ "./src/constants.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/* eslint-disable no-console */






var Dragoned = /*#__PURE__*/function () {
  function Dragoned(container) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Dragoned);

    if (typeof container === "string") {
      container = document.querySelector(container);
    }

    if (!container || !container instanceof HTMLElement) {
      return new Error("Dragoned: container must be a string or an HTMLElement");
    }

    this.createGuideLine();
    this.onMouseUp = this.onMouseUp.bind(this);
    this.dragStart = this.dragStart.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
    this.container = container;
    this.moveY = 0;
    this.moveX = 0;
    this.mouseUp = false;
    this.optionsInit(options);
    _containerStack__WEBPACK_IMPORTED_MODULE_3__["default"].push(this);
    this.init();
  }

  _createClass(Dragoned, [{
    key: "optionsInit",
    value: function optionsInit(options) {
      this.options = {
        draggable: options.draggable,
        handle: options.handle,
        delay: typeof options.delay === "number" ? options.delay : 0,
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
  }, {
    key: "createGuideLine",
    value: function createGuideLine() {
      this.guideLine = document.createElement("div");
      this.guideLine.className = _constants__WEBPACK_IMPORTED_MODULE_4__.CLASS_NAMES.guideLine;
      this.guideLine.style.position = "absolute";
      this.guideLine.style.borderRadius = ".5rem";
      this.guideLine.style.backgroundColor = "rgb(70, 25, 194)";
    }
  }, {
    key: "init",
    value: function init() {
      this.bindDrag(this.container);
    }
  }, {
    key: "dragEnd",
    value: function dragEnd() {
      this.mouseUp = true;

      if (this.mirror) {
        this.mirror.remove();
        this.mirror = null;
      }

      this.dragEl.style.opacity = 1;
      this.guideLine.remove();
      this.guideLine.style.left = "".concat(-9999, "px");
      this.guideLine.style.top = "".concat(-9999, "px");
      document.removeEventListener(_constants__WEBPACK_IMPORTED_MODULE_4__.EVENTS.MOUSE_MOVE, this.onMouseMove);
      document.removeEventListener(_constants__WEBPACK_IMPORTED_MODULE_4__.EVENTS.TOUCH_MOVE, this.onMouseMove, {
        passive: false
      });
      document.removeEventListener(_constants__WEBPACK_IMPORTED_MODULE_4__.EVENTS.MOUSE_UP, this.dragEnd);
      document.removeEventListener(_constants__WEBPACK_IMPORTED_MODULE_4__.EVENTS.TOUCH_END, this.dragEnd);

      if (this.direction && this.dropEl) {
        var cloneEl = this.options.clone === true ? this.dragEl.cloneNode(true) : this.dragEl;

        if (this.options.clone === true && typeof this.options.onClone === "function") {
          this.options.onClone({
            from: this.container,
            oldIndex: this.oldIndex,
            clone: this.cloneEl
          });
        }

        this.dropEl.insertAdjacentElement(this.direction, cloneEl);
        var to = this.dropEl.Sortable__container__;
        var from = this.container;
        this.newIndex = Array.prototype.indexOf.call(to.children, cloneEl);
        delete this.dragEl.Sortable__container__;
        delete this.dragEl.Sortable__container__;

        if (typeof this.options.onEnd === "function") {
          this.options.onEnd({
            item: cloneEl,
            to: to,
            from: from,
            newIndex: this.newIndex,
            oldIndex: this.oldIndex,
            direction: this.direction
          });
        }
      }
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(event) {
      var _this = this;

      event.preventDefault();

      if (event.type === _constants__WEBPACK_IMPORTED_MODULE_4__.EVENTS.MOUSE_MOVE && !(0,_scripts_detectLeftButton__WEBPACK_IMPORTED_MODULE_0__["default"])(event)) {
        this.guideLine.remove();
        document.removeEventListener(_constants__WEBPACK_IMPORTED_MODULE_4__.EVENTS.MOUSE_MOVE, this.onMouseMove);
      }

      var clientY = event.type === _constants__WEBPACK_IMPORTED_MODULE_4__.EVENTS.TOUCH_MOVE ? event.touches[0].clientY : event.clientY;
      var clientX = event.type === _constants__WEBPACK_IMPORTED_MODULE_4__.EVENTS.TOUCH_MOVE ? event.touches[0].clientX : event.clientX;
      var pageY = event.type === _constants__WEBPACK_IMPORTED_MODULE_4__.EVENTS.TOUCH_MOVE ? event.touches[0].pageY : event.pageY;

      if (clientY < this.moveY) {
        this.mouseDirection = _constants__WEBPACK_IMPORTED_MODULE_4__.DIRECTIONS.TOP;
      } else if (clientY > this.moveY) {
        this.mouseDirection = _constants__WEBPACK_IMPORTED_MODULE_4__.DIRECTIONS.BOTTOM;
      }

      this.moveY = clientY;
      this.moveX = clientX;

      function getScrollParent(node) {
        if (node == null) {
          return null;
        }

        if (node.scrollHeight > node.clientHeight) {
          return node;
        } else {
          return getScrollParent(node.parentNode);
        }
      }

      var scroller = function scroller(_target) {
        var scrollableEl = getScrollParent(_target) || document.body;
        console.log(scrollableEl);

        var scrollUp = function scrollUp() {
          return scrollableEl.scroll(0, scrollableEl.scrollTop - 1);
        };

        var scrollBottom = function scrollBottom() {
          return scrollableEl.scroll(0, scrollableEl.scrollTop + 1);
        };

        if (_this.mirror && _this.moveY < 100 && _this.mouseDirection === _constants__WEBPACK_IMPORTED_MODULE_4__.DIRECTIONS.TOP) {
          scrollUp();
          setTimeout(function () {
            scroller();
          }, 100);
        } else if (_this.mirror && window.innerHeight - _this.moveY < 100 && _this.mouseDirection === _constants__WEBPACK_IMPORTED_MODULE_4__.DIRECTIONS.BOTTOM) {
          scrollBottom();
          setTimeout(function () {
            scroller();
          }, 100);
        }
      };

      if (this.mirror && this.dragEl) {
        this.mirror.style.left = "".concat(clientX - document.body.offsetLeft - this.mirror.__offsetX, "px");
        this.mirror.style.top = "".concat(clientY - document.body.offsetTop - this.mirror.__offsetY, "px");
        this.mirror.style.display = "none";
      }

      var _target = document.elementFromPoint(clientX, clientY);

      scroller(_target); // here

      var dropEl;
      var dropInstance;

      for (var index = 0; index < _containerStack__WEBPACK_IMPORTED_MODULE_3__["default"].length; index++) {
        var current = _containerStack__WEBPACK_IMPORTED_MODULE_3__["default"][index];
        var immediate = (0,_scripts_getImmediateChild__WEBPACK_IMPORTED_MODULE_1__["default"])(current.container, _target);

        if (immediate) {
          dropInstance = current;
          dropEl = immediate;
          dropEl.Sortable__container__ = current.container;
          break;
        }
      }

      if (this.mirror) {
        this.mirror.style.display = "block";
      }

      if (dropEl && dropEl !== this.dragEl) {
        if (dropInstance.options.sort === false) {
          return;
        }

        if (typeof this.options.onMove === "function") {
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
        var rect = dropEl.getBoundingClientRect();
        this.guideLine.style.width = "".concat(rect.width, "px");
        this.guideLine.style.height = "4px"; // is mouse is on the top of the element

        if (rect.bottom > this.moveY && rect.bottom - rect.height / 2 < this.moveY) {
          this.direction = _constants__WEBPACK_IMPORTED_MODULE_4__.DIRECTIONS.AFTEREND;
          this.dropEl = dropEl;
          this.dragEl = this.dragEl;
          this.guideLine.style.top = "".concat(pageY - pageY + window.pageYOffset + rect.top + rect.height, "px");
          this.guideLine.style.left = "".concat(rect.left, "px");
        } else if (rect.top < this.moveY && rect.top + rect.height / 2 > this.moveY) {
          this.dropEl = dropEl;
          this.direction = _constants__WEBPACK_IMPORTED_MODULE_4__.DIRECTIONS.BEFOREBEGIN;
          this.guideLine.style.top = "".concat(pageY - pageY + window.pageYOffset + rect.top, "px");
          this.guideLine.style.left = "".concat(rect.left, "px");
        }

        if (rect.top < this.moveY && rect.top + rect.height / 2 > this.moveY && rect.left < this.moveX && rect.left + rect.width / 4 > this.moveX) {
          this.dropEl = dropEl;
          this.direction = _constants__WEBPACK_IMPORTED_MODULE_4__.DIRECTIONS.LEFT;
          this.guideLine.style.height = rect.height + "px";
          this.guideLine.style.width = "4px";
          this.guideLine.style.top = "".concat(pageY - pageY + window.pageYOffset + rect.top, "px");
          this.guideLine.style.left = "".concat(rect.left, "px");
        } else if (rect.top < this.moveY && rect.top + rect.height / 2 > this.moveY && rect.right > this.moveX && rect.right - rect.width / 4 < this.moveX) {
          this.dropEl = dropEl;
          this.direction = _constants__WEBPACK_IMPORTED_MODULE_4__.DIRECTIONS.RIGHT;
          this.guideLine.style.height = rect.height + "px";
          this.guideLine.style.width = "4px";
          this.guideLine.style.top = "".concat(pageY - pageY + window.pageYOffset + rect.top, "px");
          this.guideLine.style.left = "".concat(rect.left + rect.width, "px");
        }
      }
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp() {
      this.mouseUp = true;
      clearTimeout(this.pressDelay);
      document.removeEventListener(_constants__WEBPACK_IMPORTED_MODULE_4__.EVENTS.MOUSE_UP, this.onMouseUp);
    }
  }, {
    key: "dragStart",
    value: function dragStart(event) {
      var _this2 = this;

      this.mouseUp = false;

      if (event.type === _constants__WEBPACK_IMPORTED_MODULE_4__.EVENTS.MOUSE_DOWN && !(0,_scripts_detectLeftButton__WEBPACK_IMPORTED_MODULE_0__["default"])(event)) {
        return;
      }

      this.can = true; // continue if user clicked for 1 second

      var start = function start() {
        document.body.appendChild(_this2.guideLine);
        var clientY = event.type === _constants__WEBPACK_IMPORTED_MODULE_4__.EVENTS.TOUCH_START ? event.touches[0].clientY : event.clientY;
        var clientX = event.type === _constants__WEBPACK_IMPORTED_MODULE_4__.EVENTS.TOUCH_START ? event.touches[0].clientX : event.clientX;
        var target = event.target;
        var draggableEl;
        var handleEl;

        if (_this2.options.draggable) {
          draggableEl = target.closest(_this2.options.draggable);

          if (!draggableEl) {
            return;
          }
        }

        if (_this2.options.handle) {
          handleEl = target.closest(_this2.options.handle);

          if (!handleEl) {
            return;
          }
        }

        var dragEl = (0,_scripts_getImmediateChild__WEBPACK_IMPORTED_MODULE_1__["default"])(_this2.container, target);

        if (!dragEl) {
          return;
        }

        if (!_this2.mirror) {
          _this2.mirror = (0,_scripts_renderMirrorImage__WEBPACK_IMPORTED_MODULE_2__["default"])(dragEl, clientX, clientY);
        }

        if (typeof _this2.options.onStart === "function") {
          _this2.options.onStart({
            from: _this2.container,
            oldIndex: _this2.oldIndex,
            item: dragEl
          });
        }

        _this2.dragEl = dragEl;
        _this2.dragEl.Sortable__container__ = _this2.container;
        _this2.oldIndex = Array.prototype.indexOf.call(_this2.container.children, dragEl);
        document.addEventListener(_constants__WEBPACK_IMPORTED_MODULE_4__.EVENTS.MOUSE_MOVE, _this2.onMouseMove);
        document.addEventListener(_constants__WEBPACK_IMPORTED_MODULE_4__.EVENTS.TOUCH_MOVE, _this2.onMouseMove, {
          passive: false
        });
        document.addEventListener(_constants__WEBPACK_IMPORTED_MODULE_4__.EVENTS.MOUSE_UP, _this2.dragEnd);
        document.addEventListener(_constants__WEBPACK_IMPORTED_MODULE_4__.EVENTS.TOUCH_END, _this2.dragEnd);
      };

      document.addEventListener(_constants__WEBPACK_IMPORTED_MODULE_4__.EVENTS.MOUSE_UP, this.onMouseUp);
      this.pressDelay = setTimeout(function () {
        if (_this2.mouseUp === false) {
          start();
        }
      }, this.options.delay);
    }
  }, {
    key: "bindDrag",
    value: function bindDrag(container) {
      container.style.userSelect = "none";
      container.addEventListener(_constants__WEBPACK_IMPORTED_MODULE_4__.EVENTS.MOUSE_DOWN, this.dragStart);
      container.addEventListener(_constants__WEBPACK_IMPORTED_MODULE_4__.EVENTS.TOUCH_START, this.dragStart);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var _this3 = this;

      var index = _containerStack__WEBPACK_IMPORTED_MODULE_3__["default"].findIndex(function (c) {
        return c === _this3;
      });

      if (index !== -1) {
        _containerStack__WEBPACK_IMPORTED_MODULE_3__["default"].splice(index, 1);
      }

      this.container.removeEventListener(_constants__WEBPACK_IMPORTED_MODULE_4__.EVENTS.MOUSE_DOWN, this.dragStart);
      this.container.removeEventListener(_constants__WEBPACK_IMPORTED_MODULE_4__.EVENTS.TOUCH_START, this.dragStart);

      if (this.mirror) {
        this.mirror.remove();
      }

      if (this.guideLine) {
        this.guideLine.remove();
      }
    }
  }]);

  return Dragoned;
}();



/***/ }),

/***/ "./src/scripts/detectLeftButton.js":
/*!*****************************************!*\
  !*** ./src/scripts/detectLeftButton.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ detectLeftButton; }
/* harmony export */ });
function detectLeftButton(evt) {
  evt = evt || window.event;

  if ('buttons' in evt) {
    return evt.buttons === 1;
  }

  var button = evt.which || evt.button;
  return button === 1;
}

/***/ }),

/***/ "./src/scripts/getImmediateChild.js":
/*!******************************************!*\
  !*** ./src/scripts/getImmediateChild.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getImmediateChild; }
/* harmony export */ });
/* harmony import */ var _getParent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getParent */ "./src/scripts/getParent.js");

function getImmediateChild(dropTarget, target) {
  var immediate = target; // eslint-disable-next-line max-len

  while (immediate && immediate !== dropTarget && immediate && (0,_getParent__WEBPACK_IMPORTED_MODULE_0__["default"])(immediate) !== dropTarget) {
    immediate = (0,_getParent__WEBPACK_IMPORTED_MODULE_0__["default"])(immediate);
  }

  if (immediate === document.body) {
    return null;
  }

  if (target === dropTarget) {
    return null;
  }

  return immediate;
}

/***/ }),

/***/ "./src/scripts/getParent.js":
/*!**********************************!*\
  !*** ./src/scripts/getParent.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var getParent = function getParent(el) {
  return el && el.parentNode === document.body ? null : el && el.parentNode;
};

/* harmony default export */ __webpack_exports__["default"] = (getParent);

/***/ }),

/***/ "./src/scripts/renderMirrorImage.js":
/*!******************************************!*\
  !*** ./src/scripts/renderMirrorImage.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function renderMirrorImage(dragEl, clientX, clientY) {
  if (!dragEl) {
    return;
  }

  var rect = dragEl.getBoundingClientRect();

  var _mirror = dragEl.cloneNode(true);

  _mirror.style.position = 'fixed';

  _mirror.classList.add('mirror');

  _mirror.style.opacity = 0.5;
  _mirror.style.width = "".concat(rect.width, "px");
  _mirror.style.height = "".concat(rect.height, "px");
  _mirror.style.top = "".concat(rect.top, "px");
  _mirror.style.left = "".concat(rect.left, "px");
  _mirror.__offsetX = clientX - rect.left;
  _mirror.__offsetY = clientY - rect.top; // _mirror.style.transform = `translate(${Math.abs(clientX - rect.left - rect.width/2)}px, -${Math.abs(clientY - rect.top - rect.height / 2)}px)`;

  document.body.appendChild(_mirror);
  return _mirror;
}

/* harmony default export */ __webpack_exports__["default"] = (renderMirrorImage);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	module.exports.Dragoned = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=Dragoned.js.map