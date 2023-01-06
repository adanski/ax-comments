var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};

// node_modules/EventEmitter3/index.js
var require_EventEmitter3 = __commonJS({
  "node_modules/EventEmitter3/index.js"(exports, module) {
    "use strict";
    var has = Object.prototype.hasOwnProperty;
    var prefix = "~";
    function Events() {
    }
    if (Object.create) {
      Events.prototype = /* @__PURE__ */ Object.create(null);
      if (!new Events().__proto__)
        prefix = false;
    }
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== "function") {
        throw new TypeError("The listener must be a function");
      }
      var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
      if (!emitter._events[evt])
        emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn)
        emitter._events[evt].push(listener);
      else
        emitter._events[evt] = [emitter._events[evt], listener];
      return emitter;
    }
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0)
        emitter._events = new Events();
      else
        delete emitter._events[evt];
    }
    function EventEmitter2() {
      this._events = new Events();
      this._eventsCount = 0;
    }
    EventEmitter2.prototype.eventNames = function eventNames() {
      var names = [], events, name;
      if (this._eventsCount === 0)
        return names;
      for (name in events = this._events) {
        if (has.call(events, name))
          names.push(prefix ? name.slice(1) : name);
      }
      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }
      return names;
    };
    EventEmitter2.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event, handlers = this._events[evt];
      if (!handlers)
        return [];
      if (handlers.fn)
        return [handlers.fn];
      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }
      return ee;
    };
    EventEmitter2.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event, listeners = this._events[evt];
      if (!listeners)
        return 0;
      if (listeners.fn)
        return 1;
      return listeners.length;
    };
    EventEmitter2.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt])
        return false;
      var listeners = this._events[evt], len = arguments.length, args, i;
      if (listeners.fn) {
        if (listeners.once)
          this.removeListener(event, listeners.fn, void 0, true);
        switch (len) {
          case 1:
            return listeners.fn.call(listeners.context), true;
          case 2:
            return listeners.fn.call(listeners.context, a1), true;
          case 3:
            return listeners.fn.call(listeners.context, a1, a2), true;
          case 4:
            return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for (i = 1, args = new Array(len - 1); i < len; i++) {
          args[i - 1] = arguments[i];
        }
        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length, j;
        for (i = 0; i < length; i++) {
          if (listeners[i].once)
            this.removeListener(event, listeners[i].fn, void 0, true);
          switch (len) {
            case 1:
              listeners[i].fn.call(listeners[i].context);
              break;
            case 2:
              listeners[i].fn.call(listeners[i].context, a1);
              break;
            case 3:
              listeners[i].fn.call(listeners[i].context, a1, a2);
              break;
            case 4:
              listeners[i].fn.call(listeners[i].context, a1, a2, a3);
              break;
            default:
              if (!args)
                for (j = 1, args = new Array(len - 1); j < len; j++) {
                  args[j - 1] = arguments[j];
                }
              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }
      return true;
    };
    EventEmitter2.prototype.on = function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    };
    EventEmitter2.prototype.once = function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    };
    EventEmitter2.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt])
        return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }
      var listeners = this._events[evt];
      if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length = listeners.length; i < length; i++) {
          if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
            events.push(listeners[i]);
          }
        }
        if (events.length)
          this._events[evt] = events.length === 1 ? events[0] : events;
        else
          clearEvent(this, evt);
      }
      return this;
    };
    EventEmitter2.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;
      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt])
          clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }
      return this;
    };
    EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
    EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
    EventEmitter2.prefixed = prefix;
    EventEmitter2.EventEmitter = EventEmitter2;
    if ("undefined" !== typeof module) {
      module.exports = EventEmitter2;
    }
  }
});

// node_modules/@textcomplete/core/dist/SearchResult.js
var require_SearchResult = __commonJS({
  "node_modules/@textcomplete/core/dist/SearchResult.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SearchResult = void 0;
    var MAIN = /\$&/g;
    var PLACE = /\$(\d)/g;
    var SearchResult = class {
      constructor(data, term, strategy) {
        this.data = data;
        this.term = term;
        this.strategy = strategy;
      }
      getReplacementData(beforeCursor) {
        let result = this.strategy.replace(this.data);
        if (result == null)
          return null;
        let afterCursor = "";
        if (Array.isArray(result)) {
          afterCursor = result[1];
          result = result[0];
        }
        const match = this.strategy.match(beforeCursor);
        if (match == null || match.index == null)
          return null;
        const replacement = result.replace(MAIN, match[0]).replace(PLACE, (_, p) => match[parseInt(p)]);
        return {
          start: match.index,
          end: match.index + match[0].length,
          beforeCursor: replacement,
          afterCursor
        };
      }
      replace(beforeCursor, afterCursor) {
        const replacement = this.getReplacementData(beforeCursor);
        if (replacement === null)
          return;
        afterCursor = replacement.afterCursor + afterCursor;
        return [
          [
            beforeCursor.slice(0, replacement.start),
            replacement.beforeCursor,
            beforeCursor.slice(replacement.end)
          ].join(""),
          afterCursor
        ];
      }
      render() {
        return this.strategy.renderTemplate(this.data, this.term);
      }
      getStrategyId() {
        return this.strategy.getId();
      }
    };
    exports.SearchResult = SearchResult;
  }
});

// node_modules/@textcomplete/core/dist/Strategy.js
var require_Strategy = __commonJS({
  "node_modules/@textcomplete/core/dist/Strategy.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Strategy = exports.DEFAULT_INDEX = void 0;
    var SearchResult_1 = require_SearchResult();
    exports.DEFAULT_INDEX = 1;
    var Strategy = class {
      constructor(props) {
        this.props = props;
        this.cache = {};
      }
      destroy() {
        this.cache = {};
        return this;
      }
      replace(data) {
        return this.props.replace(data);
      }
      execute(beforeCursor, callback) {
        var _a;
        const match = this.matchWithContext(beforeCursor);
        if (!match)
          return false;
        const term = match[(_a = this.props.index) !== null && _a !== void 0 ? _a : exports.DEFAULT_INDEX];
        this.search(term, (results) => {
          callback(results.map((result) => new SearchResult_1.SearchResult(result, term, this)));
        }, match);
        return true;
      }
      renderTemplate(data, term) {
        if (this.props.template) {
          return this.props.template(data, term);
        }
        if (typeof data === "string")
          return data;
        throw new Error(`Unexpected render data type: ${typeof data}. Please implement template parameter by yourself`);
      }
      getId() {
        return this.props.id || null;
      }
      match(text) {
        return typeof this.props.match === "function" ? this.props.match(text) : text.match(this.props.match);
      }
      search(term, callback, match) {
        if (this.props.cache) {
          this.searchWithCach(term, callback, match);
        } else {
          this.props.search(term, callback, match);
        }
      }
      matchWithContext(beforeCursor) {
        const context = this.context(beforeCursor);
        if (context === false)
          return null;
        return this.match(context === true ? beforeCursor : context);
      }
      context(beforeCursor) {
        return this.props.context ? this.props.context(beforeCursor) : true;
      }
      searchWithCach(term, callback, match) {
        if (this.cache[term] != null) {
          callback(this.cache[term]);
        } else {
          this.props.search(term, (results) => {
            this.cache[term] = results;
            callback(results);
          }, match);
        }
      }
    };
    exports.Strategy = Strategy;
  }
});

// node_modules/@textcomplete/core/dist/Completer.js
var require_Completer = __commonJS({
  "node_modules/@textcomplete/core/dist/Completer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Completer = void 0;
    var eventemitter3_1 = require_EventEmitter3();
    var Strategy_1 = require_Strategy();
    var Completer = class extends eventemitter3_1.EventEmitter {
      constructor(strategyPropsList) {
        super();
        this.handleQueryResult = (searchResults) => {
          this.emit("hit", { searchResults });
        };
        this.strategies = strategyPropsList.map((p) => new Strategy_1.Strategy(p));
      }
      destroy() {
        this.strategies.forEach((s) => s.destroy());
        return this;
      }
      run(beforeCursor) {
        for (const strategy of this.strategies) {
          const executed = strategy.execute(beforeCursor, this.handleQueryResult);
          if (executed)
            return;
        }
        this.handleQueryResult([]);
      }
    };
    exports.Completer = Completer;
  }
});

// node_modules/@textcomplete/core/dist/utils.js
var require_utils = __commonJS({
  "node_modules/@textcomplete/core/dist/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createCustomEvent = void 0;
    var isCustomEventSupported = typeof window !== "undefined" && !!window.CustomEvent;
    var createCustomEvent = (type, options) => {
      if (isCustomEventSupported)
        return new CustomEvent(type, options);
      const event = document.createEvent("CustomEvent");
      event.initCustomEvent(
        type,
        /* bubbles */
        false,
        (options === null || options === void 0 ? void 0 : options.cancelable) || false,
        (options === null || options === void 0 ? void 0 : options.detail) || void 0
      );
      return event;
    };
    exports.createCustomEvent = createCustomEvent;
  }
});

// node_modules/@textcomplete/core/dist/Dropdown.js
var require_Dropdown = __commonJS({
  "node_modules/@textcomplete/core/dist/Dropdown.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Dropdown = exports.DEFAULT_DROPDOWN_ITEM_ACTIVE_CLASS_NAME = exports.DEFAULT_DROPDOWN_ITEM_CLASS_NAME = exports.DEFAULT_DROPDOWN_CLASS_NAME = exports.DEFAULT_DROPDOWN_PLACEMENT = exports.DEFAULT_DROPDOWN_MAX_COUNT = void 0;
    var eventemitter3_1 = require_EventEmitter3();
    var utils_1 = require_utils();
    exports.DEFAULT_DROPDOWN_MAX_COUNT = 10;
    exports.DEFAULT_DROPDOWN_PLACEMENT = "auto";
    exports.DEFAULT_DROPDOWN_CLASS_NAME = "dropdown-menu textcomplete-dropdown";
    exports.DEFAULT_DROPDOWN_ITEM_CLASS_NAME = "textcomplete-item";
    exports.DEFAULT_DROPDOWN_ITEM_ACTIVE_CLASS_NAME = `${exports.DEFAULT_DROPDOWN_ITEM_CLASS_NAME} active`;
    var Dropdown = class extends eventemitter3_1.EventEmitter {
      constructor(el, option) {
        super();
        this.el = el;
        this.option = option;
        this.shown = false;
        this.items = [];
        this.activeIndex = null;
      }
      static create(option) {
        const ul = document.createElement("ul");
        ul.className = option.className || exports.DEFAULT_DROPDOWN_CLASS_NAME;
        Object.assign(ul.style, {
          display: "none",
          position: "absolute",
          zIndex: "1000"
        }, option.style);
        const parent = option.parent || document.body;
        parent === null || parent === void 0 ? void 0 : parent.appendChild(ul);
        return new Dropdown(ul, option);
      }
      /**
       * Render the given search results. Previous results are cleared.
       *
       * @emits render
       * @emits rendered
       */
      render(searchResults, cursorOffset) {
        const event = (0, utils_1.createCustomEvent)("render", { cancelable: true });
        this.emit("render", event);
        if (event.defaultPrevented)
          return this;
        this.clear();
        if (searchResults.length === 0)
          return this.hide();
        this.items = searchResults.slice(0, this.option.maxCount || exports.DEFAULT_DROPDOWN_MAX_COUNT).map((r, index) => {
          var _a;
          return new DropdownItem(this, index, r, ((_a = this.option) === null || _a === void 0 ? void 0 : _a.item) || {});
        });
        this.setStrategyId(searchResults[0]).renderEdge(searchResults, "header").renderItems().renderEdge(searchResults, "footer").show().setOffset(cursorOffset).activate(0);
        this.emit("rendered", (0, utils_1.createCustomEvent)("rendered"));
        return this;
      }
      destroy() {
        var _a;
        this.clear();
        (_a = this.el.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this.el);
        return this;
      }
      /**
       * Select the given item
       *
       * @emits select
       * @emits selected
       */
      select(item) {
        const detail = { searchResult: item.searchResult };
        const event = (0, utils_1.createCustomEvent)("select", { cancelable: true, detail });
        this.emit("select", event);
        if (event.defaultPrevented)
          return this;
        this.hide();
        this.emit("selected", (0, utils_1.createCustomEvent)("selected", { detail }));
        return this;
      }
      /**
       * Show the dropdown element
       *
       * @emits show
       * @emits shown
       */
      show() {
        if (!this.shown) {
          const event = (0, utils_1.createCustomEvent)("show", { cancelable: true });
          this.emit("show", event);
          if (event.defaultPrevented)
            return this;
          this.el.style.display = "block";
          this.shown = true;
          this.emit("shown", (0, utils_1.createCustomEvent)("shown"));
        }
        return this;
      }
      /**
       * Hide the dropdown element
       *
       * @emits hide
       * @emits hidden
       */
      hide() {
        if (this.shown) {
          const event = (0, utils_1.createCustomEvent)("hide", { cancelable: true });
          this.emit("hide", event);
          if (event.defaultPrevented)
            return this;
          this.el.style.display = "none";
          this.shown = false;
          this.clear();
          this.emit("hidden", (0, utils_1.createCustomEvent)("hidden"));
        }
        return this;
      }
      /** Clear search results */
      clear() {
        this.items.forEach((i) => i.destroy());
        this.items = [];
        this.el.innerHTML = "";
        this.activeIndex = null;
        return this;
      }
      up(e) {
        return this.shown ? this.moveActiveItem("prev", e) : this;
      }
      down(e) {
        return this.shown ? this.moveActiveItem("next", e) : this;
      }
      moveActiveItem(direction, e) {
        if (this.activeIndex != null) {
          const activeIndex = direction === "next" ? this.getNextActiveIndex() : this.getPrevActiveIndex();
          if (activeIndex != null) {
            this.activate(activeIndex);
            e.preventDefault();
          }
        }
        return this;
      }
      activate(index) {
        if (this.activeIndex !== index) {
          if (this.activeIndex != null) {
            this.items[this.activeIndex].deactivate();
          }
          this.activeIndex = index;
          this.items[index].activate();
        }
        return this;
      }
      isShown() {
        return this.shown;
      }
      getActiveItem() {
        return this.activeIndex != null ? this.items[this.activeIndex] : null;
      }
      setOffset(cursorOffset) {
        const doc = document.documentElement;
        if (doc) {
          const elementWidth = this.el.offsetWidth;
          if (cursorOffset.left) {
            const browserWidth = this.option.dynamicWidth ? doc.scrollWidth : doc.clientWidth;
            if (cursorOffset.left + elementWidth > browserWidth) {
              cursorOffset.left = browserWidth - elementWidth;
            }
            this.el.style.left = `${cursorOffset.left}px`;
          } else if (cursorOffset.right) {
            if (cursorOffset.right - elementWidth < 0) {
              cursorOffset.right = 0;
            }
            this.el.style.right = `${cursorOffset.right}px`;
          }
          let forceTop = false;
          const placement = this.option.placement || exports.DEFAULT_DROPDOWN_PLACEMENT;
          if (placement === "auto") {
            const dropdownHeight = this.items.length * cursorOffset.lineHeight;
            forceTop = cursorOffset.clientTop != null && cursorOffset.clientTop + dropdownHeight > doc.clientHeight;
          }
          if (placement === "top" || forceTop) {
            this.el.style.bottom = `${doc.clientHeight - cursorOffset.top + cursorOffset.lineHeight}px`;
            this.el.style.top = "auto";
          } else {
            this.el.style.top = `${cursorOffset.top}px`;
            this.el.style.bottom = "auto";
          }
        }
        return this;
      }
      getNextActiveIndex() {
        if (this.activeIndex == null)
          throw new Error();
        return this.activeIndex < this.items.length - 1 ? this.activeIndex + 1 : this.option.rotate ? 0 : null;
      }
      getPrevActiveIndex() {
        if (this.activeIndex == null)
          throw new Error();
        return this.activeIndex !== 0 ? this.activeIndex - 1 : this.option.rotate ? this.items.length - 1 : null;
      }
      renderItems() {
        const fragment = document.createDocumentFragment();
        for (const item of this.items) {
          fragment.appendChild(item.el);
        }
        this.el.appendChild(fragment);
        return this;
      }
      setStrategyId(searchResult) {
        const id = searchResult.getStrategyId();
        if (id)
          this.el.dataset.strategy = id;
        return this;
      }
      renderEdge(searchResults, type) {
        const option = this.option[type];
        const li = document.createElement("li");
        li.className = `textcomplete-${type}`;
        li.innerHTML = typeof option === "function" ? option(searchResults.map((s) => s.data)) : option || "";
        this.el.appendChild(li);
        return this;
      }
    };
    exports.Dropdown = Dropdown;
    var DropdownItem = class {
      constructor(dropdown, index, searchResult, props) {
        this.dropdown = dropdown;
        this.index = index;
        this.searchResult = searchResult;
        this.props = props;
        this.active = false;
        this.onClick = (e) => {
          e.preventDefault();
          this.dropdown.select(this);
        };
        this.className = this.props.className || exports.DEFAULT_DROPDOWN_ITEM_CLASS_NAME;
        this.activeClassName = this.props.activeClassName || exports.DEFAULT_DROPDOWN_ITEM_ACTIVE_CLASS_NAME;
        const li = document.createElement("li");
        li.className = this.active ? this.activeClassName : this.className;
        const span = document.createElement("span");
        span.tabIndex = -1;
        span.innerHTML = this.searchResult.render();
        li.appendChild(span);
        li.addEventListener("click", this.onClick);
        this.el = li;
      }
      destroy() {
        var _a;
        const li = this.el;
        (_a = li.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(li);
        li.removeEventListener("click", this.onClick, false);
        return this;
      }
      activate() {
        if (!this.active) {
          this.active = true;
          this.el.className = this.activeClassName;
          this.dropdown.el.scrollTop = this.el.offsetTop;
        }
        return this;
      }
      deactivate() {
        if (this.active) {
          this.active = false;
          this.el.className = this.className;
        }
        return this;
      }
    };
  }
});

// node_modules/@textcomplete/core/dist/Editor.js
var require_Editor = __commonJS({
  "node_modules/@textcomplete/core/dist/Editor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Editor = void 0;
    var eventemitter3_1 = require_EventEmitter3();
    var utils_1 = require_utils();
    var Editor = class extends eventemitter3_1.EventEmitter {
      /**
       * Finalize the editor object.
       *
       * It is called when associated textcomplete object is destroyed.
       */
      destroy() {
        return this;
      }
      /**
       * It is called when a search result is selected by a user.
       */
      applySearchResult(_searchResult) {
        throw new Error("Not implemented.");
      }
      /**
       * The input cursor's absolute coordinates from the window's left
       * top corner.
       */
      getCursorOffset() {
        throw new Error("Not implemented.");
      }
      /**
       * Editor string value from head to the cursor.
       * Returns null if selection type is range not cursor.
       */
      getBeforeCursor() {
        throw new Error("Not implemented.");
      }
      /**
       * Emit a move event, which moves active dropdown element.
       * Child class must call this method at proper timing with proper parameter.
       *
       * @see {@link Textarea} for live example.
       */
      emitMoveEvent(code) {
        const moveEvent = (0, utils_1.createCustomEvent)("move", {
          cancelable: true,
          detail: {
            code
          }
        });
        this.emit("move", moveEvent);
        return moveEvent;
      }
      /**
       * Emit a enter event, which selects current search result.
       * Child class must call this method at proper timing.
       *
       * @see {@link Textarea} for live example.
       */
      emitEnterEvent() {
        const enterEvent = (0, utils_1.createCustomEvent)("enter", { cancelable: true });
        this.emit("enter", enterEvent);
        return enterEvent;
      }
      /**
       * Emit a change event, which triggers auto completion.
       * Child class must call this method at proper timing.
       *
       * @see {@link Textarea} for live example.
       */
      emitChangeEvent() {
        const changeEvent = (0, utils_1.createCustomEvent)("change", {
          detail: {
            beforeCursor: this.getBeforeCursor()
          }
        });
        this.emit("change", changeEvent);
        return changeEvent;
      }
      /**
       * Emit a esc event, which hides dropdown element.
       * Child class must call this method at proper timing.
       *
       * @see {@link Textarea} for live example.
       */
      emitEscEvent() {
        const escEvent = (0, utils_1.createCustomEvent)("esc", { cancelable: true });
        this.emit("esc", escEvent);
        return escEvent;
      }
      /**
       * Helper method for parsing KeyboardEvent.
       *
       * @see {@link Textarea} for live example.
       */
      getCode(e) {
        return e.keyCode === 9 ? "ENTER" : e.keyCode === 13 ? "ENTER" : e.keyCode === 27 ? "ESC" : e.keyCode === 38 ? "UP" : e.keyCode === 40 ? "DOWN" : e.keyCode === 78 && e.ctrlKey ? "DOWN" : e.keyCode === 80 && e.ctrlKey ? "UP" : "OTHER";
      }
    };
    exports.Editor = Editor;
  }
});

// node_modules/@textcomplete/core/dist/Textcomplete.js
var require_Textcomplete = __commonJS({
  "node_modules/@textcomplete/core/dist/Textcomplete.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Textcomplete = void 0;
    var eventemitter3_1 = require_EventEmitter3();
    var Dropdown_1 = require_Dropdown();
    var Completer_1 = require_Completer();
    var PASSTHOUGH_EVENT_NAMES = [
      "show",
      "shown",
      "render",
      "rendered",
      "selected",
      "hidden",
      "hide"
    ];
    var Textcomplete2 = class extends eventemitter3_1.EventEmitter {
      constructor(editor, strategies, option) {
        super();
        this.editor = editor;
        this.isQueryInFlight = false;
        this.nextPendingQuery = null;
        this.handleHit = ({ searchResults }) => {
          if (searchResults.length) {
            this.dropdown.render(searchResults, this.editor.getCursorOffset());
          } else {
            this.dropdown.hide();
          }
          this.isQueryInFlight = false;
          if (this.nextPendingQuery !== null)
            this.trigger(this.nextPendingQuery);
        };
        this.handleMove = (e) => {
          e.detail.code === "UP" ? this.dropdown.up(e) : this.dropdown.down(e);
        };
        this.handleEnter = (e) => {
          const activeItem = this.dropdown.getActiveItem();
          if (activeItem) {
            this.dropdown.select(activeItem);
            e.preventDefault();
          } else {
            this.dropdown.hide();
          }
        };
        this.handleEsc = (e) => {
          if (this.dropdown.isShown()) {
            this.dropdown.hide();
            e.preventDefault();
          }
        };
        this.handleChange = (e) => {
          if (e.detail.beforeCursor != null) {
            this.trigger(e.detail.beforeCursor);
          } else {
            this.dropdown.hide();
          }
        };
        this.handleSelect = (selectEvent) => {
          this.emit("select", selectEvent);
          if (!selectEvent.defaultPrevented) {
            this.editor.applySearchResult(selectEvent.detail.searchResult);
          }
        };
        this.handleResize = () => {
          if (this.dropdown.isShown()) {
            this.dropdown.setOffset(this.editor.getCursorOffset());
          }
        };
        this.completer = new Completer_1.Completer(strategies);
        this.dropdown = Dropdown_1.Dropdown.create((option === null || option === void 0 ? void 0 : option.dropdown) || {});
        this.startListening();
      }
      destroy(destroyEditor = true) {
        this.completer.destroy();
        this.dropdown.destroy();
        if (destroyEditor)
          this.editor.destroy();
        this.stopListening();
        return this;
      }
      isShown() {
        return this.dropdown.isShown();
      }
      hide() {
        this.dropdown.hide();
        return this;
      }
      trigger(beforeCursor) {
        if (this.isQueryInFlight) {
          this.nextPendingQuery = beforeCursor;
        } else {
          this.isQueryInFlight = true;
          this.nextPendingQuery = null;
          this.completer.run(beforeCursor);
        }
        return this;
      }
      startListening() {
        var _a;
        this.editor.on("move", this.handleMove).on("enter", this.handleEnter).on("esc", this.handleEsc).on("change", this.handleChange);
        this.dropdown.on("select", this.handleSelect);
        for (const eventName of PASSTHOUGH_EVENT_NAMES) {
          this.dropdown.on(eventName, (e) => this.emit(eventName, e));
        }
        this.completer.on("hit", this.handleHit);
        (_a = this.dropdown.el.ownerDocument.defaultView) === null || _a === void 0 ? void 0 : _a.addEventListener("resize", this.handleResize);
      }
      stopListening() {
        var _a;
        (_a = this.dropdown.el.ownerDocument.defaultView) === null || _a === void 0 ? void 0 : _a.removeEventListener("resize", this.handleResize);
        this.completer.removeAllListeners();
        this.dropdown.removeAllListeners();
        this.editor.removeListener("move", this.handleMove).removeListener("enter", this.handleEnter).removeListener("esc", this.handleEsc).removeListener("change", this.handleChange);
      }
    };
    exports.Textcomplete = Textcomplete2;
  }
});

// node_modules/@textcomplete/core/dist/index.js
var require_dist = __commonJS({
  "node_modules/@textcomplete/core/dist/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_Completer(), exports);
    __exportStar(require_Dropdown(), exports);
    __exportStar(require_Editor(), exports);
    __exportStar(require_SearchResult(), exports);
    __exportStar(require_Strategy(), exports);
    __exportStar(require_Textcomplete(), exports);
    __exportStar(require_utils(), exports);
  }
});

// node_modules/undate/dist/index.js
var require_dist2 = __commonJS({
  "node_modules/undate/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function update(el, headToCursor, cursorToTail) {
      var curr = el.value;
      var next = headToCursor + (cursorToTail || "");
      var activeElement = document.activeElement;
      var aLength = 0;
      var cLength = 0;
      while (aLength < curr.length && aLength < next.length && curr[aLength] === next[aLength]) {
        aLength++;
      }
      while (curr.length - cLength - 1 >= 0 && next.length - cLength - 1 >= 0 && curr[curr.length - cLength - 1] === next[next.length - cLength - 1]) {
        cLength++;
      }
      aLength = Math.min(aLength, Math.min(curr.length, next.length) - cLength);
      el.setSelectionRange(aLength, curr.length - cLength);
      var strB2 = next.substring(aLength, next.length - cLength);
      el.focus();
      if (!document.execCommand("insertText", false, strB2)) {
        el.value = next;
        var event_1 = document.createEvent("Event");
        event_1.initEvent("input", true, true);
        el.dispatchEvent(event_1);
      }
      el.setSelectionRange(headToCursor.length, headToCursor.length);
      activeElement.focus();
      return el;
    }
    function wrapCursor(el, before, after) {
      var initEnd = el.selectionEnd;
      var headToCursor = el.value.substr(0, el.selectionStart) + before;
      var cursorToTail = el.value.substring(el.selectionStart, initEnd) + (after || "") + el.value.substr(initEnd);
      update(el, headToCursor, cursorToTail);
      el.selectionEnd = initEnd + before.length;
      return el;
    }
    exports.update = update;
    exports.wrapCursor = wrapCursor;
  }
});

// node_modules/textarea-caret/index.js
var require_textarea_caret = __commonJS({
  "node_modules/textarea-caret/index.js"(exports, module) {
    (function() {
      var properties = [
        "direction",
        // RTL support
        "boxSizing",
        "width",
        // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
        "height",
        "overflowX",
        "overflowY",
        // copy the scrollbar for IE
        "borderTopWidth",
        "borderRightWidth",
        "borderBottomWidth",
        "borderLeftWidth",
        "borderStyle",
        "paddingTop",
        "paddingRight",
        "paddingBottom",
        "paddingLeft",
        // https://developer.mozilla.org/en-US/docs/Web/CSS/font
        "fontStyle",
        "fontVariant",
        "fontWeight",
        "fontStretch",
        "fontSize",
        "fontSizeAdjust",
        "lineHeight",
        "fontFamily",
        "textAlign",
        "textTransform",
        "textIndent",
        "textDecoration",
        // might not make a difference, but better be safe
        "letterSpacing",
        "wordSpacing",
        "tabSize",
        "MozTabSize"
      ];
      var isBrowser = typeof window !== "undefined";
      var isFirefox = isBrowser && window.mozInnerScreenX != null;
      function getCaretCoordinates(element, position, options) {
        if (!isBrowser) {
          throw new Error("textarea-caret-position#getCaretCoordinates should only be called in a browser");
        }
        var debug = options && options.debug || false;
        if (debug) {
          var el = document.querySelector("#input-textarea-caret-position-mirror-div");
          if (el)
            el.parentNode.removeChild(el);
        }
        var div = document.createElement("div");
        div.id = "input-textarea-caret-position-mirror-div";
        document.body.appendChild(div);
        var style = div.style;
        var computed = window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle;
        var isInput = element.nodeName === "INPUT";
        style.whiteSpace = "pre-wrap";
        if (!isInput)
          style.wordWrap = "break-word";
        style.position = "absolute";
        if (!debug)
          style.visibility = "hidden";
        properties.forEach(function(prop) {
          if (isInput && prop === "lineHeight") {
            style.lineHeight = computed.height;
          } else {
            style[prop] = computed[prop];
          }
        });
        if (isFirefox) {
          if (element.scrollHeight > parseInt(computed.height))
            style.overflowY = "scroll";
        } else {
          style.overflow = "hidden";
        }
        div.textContent = element.value.substring(0, position);
        if (isInput)
          div.textContent = div.textContent.replace(/\s/g, "\xA0");
        var span = document.createElement("span");
        span.textContent = element.value.substring(position) || ".";
        div.appendChild(span);
        var coordinates = {
          top: span.offsetTop + parseInt(computed["borderTopWidth"]),
          left: span.offsetLeft + parseInt(computed["borderLeftWidth"]),
          height: parseInt(computed["lineHeight"])
        };
        if (debug) {
          span.style.backgroundColor = "#aaa";
        } else {
          document.body.removeChild(div);
        }
        return coordinates;
      }
      if (typeof module != "undefined" && typeof module.exports != "undefined") {
        module.exports = getCaretCoordinates;
      } else if (isBrowser) {
        window.getCaretCoordinates = getCaretCoordinates;
      }
    })();
  }
});

// node_modules/@textcomplete/utils/dist/calculateElementOffset.js
var require_calculateElementOffset = __commonJS({
  "node_modules/@textcomplete/utils/dist/calculateElementOffset.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.calculateElementOffset = void 0;
    var calculateElementOffset = (el) => {
      const rect = el.getBoundingClientRect();
      const owner = el.ownerDocument;
      if (owner == null) {
        throw new Error("Given element does not belong to document");
      }
      const { defaultView, documentElement } = owner;
      if (defaultView == null) {
        throw new Error("Given element does not belong to window");
      }
      const offset = {
        top: rect.top + defaultView.pageYOffset,
        left: rect.left + defaultView.pageXOffset
      };
      if (documentElement) {
        offset.top -= documentElement.clientTop;
        offset.left -= documentElement.clientLeft;
      }
      return offset;
    };
    exports.calculateElementOffset = calculateElementOffset;
  }
});

// node_modules/@textcomplete/utils/dist/getLineHeightPx.js
var require_getLineHeightPx = __commonJS({
  "node_modules/@textcomplete/utils/dist/getLineHeightPx.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getLineHeightPx = void 0;
    var CHAR_CODE_ZERO = "0".charCodeAt(0);
    var CHAR_CODE_NINE = "9".charCodeAt(0);
    var isDigit = (charCode) => CHAR_CODE_ZERO <= charCode && charCode <= CHAR_CODE_NINE;
    var getLineHeightPx = (el) => {
      const computedStyle = getComputedStyle(el);
      const lineHeight = computedStyle.lineHeight;
      if (isDigit(lineHeight.charCodeAt(0))) {
        const floatLineHeight = parseFloat(lineHeight);
        return isDigit(lineHeight.charCodeAt(lineHeight.length - 1)) ? floatLineHeight * parseFloat(computedStyle.fontSize) : floatLineHeight;
      }
      return calculateLineHeightPx(el.nodeName, computedStyle);
    };
    exports.getLineHeightPx = getLineHeightPx;
    var calculateLineHeightPx = (nodeName, computedStyle) => {
      const body = document.body;
      if (!body)
        return 0;
      const tempNode = document.createElement(nodeName);
      tempNode.innerHTML = "&nbsp;";
      Object.assign(tempNode.style, {
        fontSize: computedStyle.fontSize,
        fontFamily: computedStyle.fontFamily,
        padding: "0"
      });
      body.appendChild(tempNode);
      if (tempNode instanceof HTMLTextAreaElement) {
        tempNode.rows = 1;
      }
      const height = tempNode.offsetHeight;
      body.removeChild(tempNode);
      return height;
    };
  }
});

// node_modules/@textcomplete/utils/dist/isSafari.js
var require_isSafari = __commonJS({
  "node_modules/@textcomplete/utils/dist/isSafari.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isSafari = void 0;
    var isSafari = () => /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    exports.isSafari = isSafari;
  }
});

// node_modules/@textcomplete/utils/dist/index.js
var require_dist3 = __commonJS({
  "node_modules/@textcomplete/utils/dist/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_calculateElementOffset(), exports);
    __exportStar(require_getLineHeightPx(), exports);
    __exportStar(require_isSafari(), exports);
  }
});

// node_modules/@textcomplete/textarea/dist/TextareaEditor.js
var require_TextareaEditor = __commonJS({
  "node_modules/@textcomplete/textarea/dist/TextareaEditor.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TextareaEditor = void 0;
    var undate_1 = require_dist2();
    var textarea_caret_1 = __importDefault(require_textarea_caret());
    var core_1 = require_dist();
    var utils_1 = require_dist3();
    var TextareaEditor2 = class extends core_1.Editor {
      constructor(el) {
        super();
        this.el = el;
        this.onInput = () => {
          this.emitChangeEvent();
        };
        this.onKeydown = (e) => {
          const code = this.getCode(e);
          let event;
          if (code === "UP" || code === "DOWN") {
            event = this.emitMoveEvent(code);
          } else if (code === "ENTER") {
            event = this.emitEnterEvent();
          } else if (code === "ESC") {
            event = this.emitEscEvent();
          }
          if (event && event.defaultPrevented) {
            e.preventDefault();
          }
        };
        this.startListening();
      }
      destroy() {
        super.destroy();
        this.stopListening();
        return this;
      }
      /**
       * @implements {@link Editor#applySearchResult}
       */
      applySearchResult(searchResult) {
        const beforeCursor = this.getBeforeCursor();
        if (beforeCursor != null) {
          const replace = searchResult.replace(beforeCursor, this.getAfterCursor());
          this.el.focus();
          if (Array.isArray(replace)) {
            (0, undate_1.update)(this.el, replace[0], replace[1]);
            if (this.el) {
              this.el.dispatchEvent((0, core_1.createCustomEvent)("input"));
            }
          }
        }
      }
      /**
       * @implements {@link Editor#getCursorOffset}
       */
      getCursorOffset() {
        const elOffset = (0, utils_1.calculateElementOffset)(this.el);
        const elScroll = this.getElScroll();
        const cursorPosition = this.getCursorPosition();
        const lineHeight = (0, utils_1.getLineHeightPx)(this.el);
        const top = elOffset.top - elScroll.top + cursorPosition.top + lineHeight;
        const left = elOffset.left - elScroll.left + cursorPosition.left;
        const clientTop = this.el.getBoundingClientRect().top;
        if (this.el.dir !== "rtl") {
          return { top, left, lineHeight, clientTop };
        } else {
          const right = document.documentElement ? document.documentElement.clientWidth - left : 0;
          return { top, right, lineHeight, clientTop };
        }
      }
      /**
       * @implements {@link Editor#getBeforeCursor}
       */
      getBeforeCursor() {
        return this.el.selectionStart !== this.el.selectionEnd ? null : this.el.value.substring(0, this.el.selectionEnd);
      }
      getAfterCursor() {
        return this.el.value.substring(this.el.selectionEnd);
      }
      getElScroll() {
        return { top: this.el.scrollTop, left: this.el.scrollLeft };
      }
      /**
       * The input cursor's relative coordinates from the textarea's left
       * top corner.
       */
      getCursorPosition() {
        return (0, textarea_caret_1.default)(this.el, this.el.selectionEnd);
      }
      startListening() {
        this.el.addEventListener("input", this.onInput);
        this.el.addEventListener("keydown", this.onKeydown);
      }
      stopListening() {
        this.el.removeEventListener("input", this.onInput);
        this.el.removeEventListener("keydown", this.onKeydown);
      }
    };
    exports.TextareaEditor = TextareaEditor2;
  }
});

// node_modules/@textcomplete/textarea/dist/index.js
var require_dist4 = __commonJS({
  "node_modules/@textcomplete/textarea/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TextareaEditor = void 0;
    var TextareaEditor_1 = require_TextareaEditor();
    Object.defineProperty(exports, "TextareaEditor", { enumerable: true, get: function() {
      return TextareaEditor_1.TextareaEditor;
    } });
  }
});

// node_modules/entities/lib/maps/decode.json
var require_decode = __commonJS({
  "node_modules/entities/lib/maps/decode.json"(exports, module) {
    module.exports = { "0": 65533, "128": 8364, "130": 8218, "131": 402, "132": 8222, "133": 8230, "134": 8224, "135": 8225, "136": 710, "137": 8240, "138": 352, "139": 8249, "140": 338, "142": 381, "145": 8216, "146": 8217, "147": 8220, "148": 8221, "149": 8226, "150": 8211, "151": 8212, "152": 732, "153": 8482, "154": 353, "155": 8250, "156": 339, "158": 382, "159": 376 };
  }
});

// node_modules/entities/lib/decode_codepoint.js
var require_decode_codepoint = __commonJS({
  "node_modules/entities/lib/decode_codepoint.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var decode_json_1 = __importDefault(require_decode());
    var fromCodePoint = (
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      String.fromCodePoint || function(codePoint) {
        var output = "";
        if (codePoint > 65535) {
          codePoint -= 65536;
          output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
          codePoint = 56320 | codePoint & 1023;
        }
        output += String.fromCharCode(codePoint);
        return output;
      }
    );
    function decodeCodePoint(codePoint) {
      if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
        return "\uFFFD";
      }
      if (codePoint in decode_json_1.default) {
        codePoint = decode_json_1.default[codePoint];
      }
      return fromCodePoint(codePoint);
    }
    exports.default = decodeCodePoint;
  }
});

// node_modules/entities/lib/maps/entities.json
var require_entities = __commonJS({
  "node_modules/entities/lib/maps/entities.json"(exports, module) {
    module.exports = { Aacute: "\xC1", aacute: "\xE1", Abreve: "\u0102", abreve: "\u0103", ac: "\u223E", acd: "\u223F", acE: "\u223E\u0333", Acirc: "\xC2", acirc: "\xE2", acute: "\xB4", Acy: "\u0410", acy: "\u0430", AElig: "\xC6", aelig: "\xE6", af: "\u2061", Afr: "\u{1D504}", afr: "\u{1D51E}", Agrave: "\xC0", agrave: "\xE0", alefsym: "\u2135", aleph: "\u2135", Alpha: "\u0391", alpha: "\u03B1", Amacr: "\u0100", amacr: "\u0101", amalg: "\u2A3F", amp: "&", AMP: "&", andand: "\u2A55", And: "\u2A53", and: "\u2227", andd: "\u2A5C", andslope: "\u2A58", andv: "\u2A5A", ang: "\u2220", ange: "\u29A4", angle: "\u2220", angmsdaa: "\u29A8", angmsdab: "\u29A9", angmsdac: "\u29AA", angmsdad: "\u29AB", angmsdae: "\u29AC", angmsdaf: "\u29AD", angmsdag: "\u29AE", angmsdah: "\u29AF", angmsd: "\u2221", angrt: "\u221F", angrtvb: "\u22BE", angrtvbd: "\u299D", angsph: "\u2222", angst: "\xC5", angzarr: "\u237C", Aogon: "\u0104", aogon: "\u0105", Aopf: "\u{1D538}", aopf: "\u{1D552}", apacir: "\u2A6F", ap: "\u2248", apE: "\u2A70", ape: "\u224A", apid: "\u224B", apos: "'", ApplyFunction: "\u2061", approx: "\u2248", approxeq: "\u224A", Aring: "\xC5", aring: "\xE5", Ascr: "\u{1D49C}", ascr: "\u{1D4B6}", Assign: "\u2254", ast: "*", asymp: "\u2248", asympeq: "\u224D", Atilde: "\xC3", atilde: "\xE3", Auml: "\xC4", auml: "\xE4", awconint: "\u2233", awint: "\u2A11", backcong: "\u224C", backepsilon: "\u03F6", backprime: "\u2035", backsim: "\u223D", backsimeq: "\u22CD", Backslash: "\u2216", Barv: "\u2AE7", barvee: "\u22BD", barwed: "\u2305", Barwed: "\u2306", barwedge: "\u2305", bbrk: "\u23B5", bbrktbrk: "\u23B6", bcong: "\u224C", Bcy: "\u0411", bcy: "\u0431", bdquo: "\u201E", becaus: "\u2235", because: "\u2235", Because: "\u2235", bemptyv: "\u29B0", bepsi: "\u03F6", bernou: "\u212C", Bernoullis: "\u212C", Beta: "\u0392", beta: "\u03B2", beth: "\u2136", between: "\u226C", Bfr: "\u{1D505}", bfr: "\u{1D51F}", bigcap: "\u22C2", bigcirc: "\u25EF", bigcup: "\u22C3", bigodot: "\u2A00", bigoplus: "\u2A01", bigotimes: "\u2A02", bigsqcup: "\u2A06", bigstar: "\u2605", bigtriangledown: "\u25BD", bigtriangleup: "\u25B3", biguplus: "\u2A04", bigvee: "\u22C1", bigwedge: "\u22C0", bkarow: "\u290D", blacklozenge: "\u29EB", blacksquare: "\u25AA", blacktriangle: "\u25B4", blacktriangledown: "\u25BE", blacktriangleleft: "\u25C2", blacktriangleright: "\u25B8", blank: "\u2423", blk12: "\u2592", blk14: "\u2591", blk34: "\u2593", block: "\u2588", bne: "=\u20E5", bnequiv: "\u2261\u20E5", bNot: "\u2AED", bnot: "\u2310", Bopf: "\u{1D539}", bopf: "\u{1D553}", bot: "\u22A5", bottom: "\u22A5", bowtie: "\u22C8", boxbox: "\u29C9", boxdl: "\u2510", boxdL: "\u2555", boxDl: "\u2556", boxDL: "\u2557", boxdr: "\u250C", boxdR: "\u2552", boxDr: "\u2553", boxDR: "\u2554", boxh: "\u2500", boxH: "\u2550", boxhd: "\u252C", boxHd: "\u2564", boxhD: "\u2565", boxHD: "\u2566", boxhu: "\u2534", boxHu: "\u2567", boxhU: "\u2568", boxHU: "\u2569", boxminus: "\u229F", boxplus: "\u229E", boxtimes: "\u22A0", boxul: "\u2518", boxuL: "\u255B", boxUl: "\u255C", boxUL: "\u255D", boxur: "\u2514", boxuR: "\u2558", boxUr: "\u2559", boxUR: "\u255A", boxv: "\u2502", boxV: "\u2551", boxvh: "\u253C", boxvH: "\u256A", boxVh: "\u256B", boxVH: "\u256C", boxvl: "\u2524", boxvL: "\u2561", boxVl: "\u2562", boxVL: "\u2563", boxvr: "\u251C", boxvR: "\u255E", boxVr: "\u255F", boxVR: "\u2560", bprime: "\u2035", breve: "\u02D8", Breve: "\u02D8", brvbar: "\xA6", bscr: "\u{1D4B7}", Bscr: "\u212C", bsemi: "\u204F", bsim: "\u223D", bsime: "\u22CD", bsolb: "\u29C5", bsol: "\\", bsolhsub: "\u27C8", bull: "\u2022", bullet: "\u2022", bump: "\u224E", bumpE: "\u2AAE", bumpe: "\u224F", Bumpeq: "\u224E", bumpeq: "\u224F", Cacute: "\u0106", cacute: "\u0107", capand: "\u2A44", capbrcup: "\u2A49", capcap: "\u2A4B", cap: "\u2229", Cap: "\u22D2", capcup: "\u2A47", capdot: "\u2A40", CapitalDifferentialD: "\u2145", caps: "\u2229\uFE00", caret: "\u2041", caron: "\u02C7", Cayleys: "\u212D", ccaps: "\u2A4D", Ccaron: "\u010C", ccaron: "\u010D", Ccedil: "\xC7", ccedil: "\xE7", Ccirc: "\u0108", ccirc: "\u0109", Cconint: "\u2230", ccups: "\u2A4C", ccupssm: "\u2A50", Cdot: "\u010A", cdot: "\u010B", cedil: "\xB8", Cedilla: "\xB8", cemptyv: "\u29B2", cent: "\xA2", centerdot: "\xB7", CenterDot: "\xB7", cfr: "\u{1D520}", Cfr: "\u212D", CHcy: "\u0427", chcy: "\u0447", check: "\u2713", checkmark: "\u2713", Chi: "\u03A7", chi: "\u03C7", circ: "\u02C6", circeq: "\u2257", circlearrowleft: "\u21BA", circlearrowright: "\u21BB", circledast: "\u229B", circledcirc: "\u229A", circleddash: "\u229D", CircleDot: "\u2299", circledR: "\xAE", circledS: "\u24C8", CircleMinus: "\u2296", CirclePlus: "\u2295", CircleTimes: "\u2297", cir: "\u25CB", cirE: "\u29C3", cire: "\u2257", cirfnint: "\u2A10", cirmid: "\u2AEF", cirscir: "\u29C2", ClockwiseContourIntegral: "\u2232", CloseCurlyDoubleQuote: "\u201D", CloseCurlyQuote: "\u2019", clubs: "\u2663", clubsuit: "\u2663", colon: ":", Colon: "\u2237", Colone: "\u2A74", colone: "\u2254", coloneq: "\u2254", comma: ",", commat: "@", comp: "\u2201", compfn: "\u2218", complement: "\u2201", complexes: "\u2102", cong: "\u2245", congdot: "\u2A6D", Congruent: "\u2261", conint: "\u222E", Conint: "\u222F", ContourIntegral: "\u222E", copf: "\u{1D554}", Copf: "\u2102", coprod: "\u2210", Coproduct: "\u2210", copy: "\xA9", COPY: "\xA9", copysr: "\u2117", CounterClockwiseContourIntegral: "\u2233", crarr: "\u21B5", cross: "\u2717", Cross: "\u2A2F", Cscr: "\u{1D49E}", cscr: "\u{1D4B8}", csub: "\u2ACF", csube: "\u2AD1", csup: "\u2AD0", csupe: "\u2AD2", ctdot: "\u22EF", cudarrl: "\u2938", cudarrr: "\u2935", cuepr: "\u22DE", cuesc: "\u22DF", cularr: "\u21B6", cularrp: "\u293D", cupbrcap: "\u2A48", cupcap: "\u2A46", CupCap: "\u224D", cup: "\u222A", Cup: "\u22D3", cupcup: "\u2A4A", cupdot: "\u228D", cupor: "\u2A45", cups: "\u222A\uFE00", curarr: "\u21B7", curarrm: "\u293C", curlyeqprec: "\u22DE", curlyeqsucc: "\u22DF", curlyvee: "\u22CE", curlywedge: "\u22CF", curren: "\xA4", curvearrowleft: "\u21B6", curvearrowright: "\u21B7", cuvee: "\u22CE", cuwed: "\u22CF", cwconint: "\u2232", cwint: "\u2231", cylcty: "\u232D", dagger: "\u2020", Dagger: "\u2021", daleth: "\u2138", darr: "\u2193", Darr: "\u21A1", dArr: "\u21D3", dash: "\u2010", Dashv: "\u2AE4", dashv: "\u22A3", dbkarow: "\u290F", dblac: "\u02DD", Dcaron: "\u010E", dcaron: "\u010F", Dcy: "\u0414", dcy: "\u0434", ddagger: "\u2021", ddarr: "\u21CA", DD: "\u2145", dd: "\u2146", DDotrahd: "\u2911", ddotseq: "\u2A77", deg: "\xB0", Del: "\u2207", Delta: "\u0394", delta: "\u03B4", demptyv: "\u29B1", dfisht: "\u297F", Dfr: "\u{1D507}", dfr: "\u{1D521}", dHar: "\u2965", dharl: "\u21C3", dharr: "\u21C2", DiacriticalAcute: "\xB4", DiacriticalDot: "\u02D9", DiacriticalDoubleAcute: "\u02DD", DiacriticalGrave: "`", DiacriticalTilde: "\u02DC", diam: "\u22C4", diamond: "\u22C4", Diamond: "\u22C4", diamondsuit: "\u2666", diams: "\u2666", die: "\xA8", DifferentialD: "\u2146", digamma: "\u03DD", disin: "\u22F2", div: "\xF7", divide: "\xF7", divideontimes: "\u22C7", divonx: "\u22C7", DJcy: "\u0402", djcy: "\u0452", dlcorn: "\u231E", dlcrop: "\u230D", dollar: "$", Dopf: "\u{1D53B}", dopf: "\u{1D555}", Dot: "\xA8", dot: "\u02D9", DotDot: "\u20DC", doteq: "\u2250", doteqdot: "\u2251", DotEqual: "\u2250", dotminus: "\u2238", dotplus: "\u2214", dotsquare: "\u22A1", doublebarwedge: "\u2306", DoubleContourIntegral: "\u222F", DoubleDot: "\xA8", DoubleDownArrow: "\u21D3", DoubleLeftArrow: "\u21D0", DoubleLeftRightArrow: "\u21D4", DoubleLeftTee: "\u2AE4", DoubleLongLeftArrow: "\u27F8", DoubleLongLeftRightArrow: "\u27FA", DoubleLongRightArrow: "\u27F9", DoubleRightArrow: "\u21D2", DoubleRightTee: "\u22A8", DoubleUpArrow: "\u21D1", DoubleUpDownArrow: "\u21D5", DoubleVerticalBar: "\u2225", DownArrowBar: "\u2913", downarrow: "\u2193", DownArrow: "\u2193", Downarrow: "\u21D3", DownArrowUpArrow: "\u21F5", DownBreve: "\u0311", downdownarrows: "\u21CA", downharpoonleft: "\u21C3", downharpoonright: "\u21C2", DownLeftRightVector: "\u2950", DownLeftTeeVector: "\u295E", DownLeftVectorBar: "\u2956", DownLeftVector: "\u21BD", DownRightTeeVector: "\u295F", DownRightVectorBar: "\u2957", DownRightVector: "\u21C1", DownTeeArrow: "\u21A7", DownTee: "\u22A4", drbkarow: "\u2910", drcorn: "\u231F", drcrop: "\u230C", Dscr: "\u{1D49F}", dscr: "\u{1D4B9}", DScy: "\u0405", dscy: "\u0455", dsol: "\u29F6", Dstrok: "\u0110", dstrok: "\u0111", dtdot: "\u22F1", dtri: "\u25BF", dtrif: "\u25BE", duarr: "\u21F5", duhar: "\u296F", dwangle: "\u29A6", DZcy: "\u040F", dzcy: "\u045F", dzigrarr: "\u27FF", Eacute: "\xC9", eacute: "\xE9", easter: "\u2A6E", Ecaron: "\u011A", ecaron: "\u011B", Ecirc: "\xCA", ecirc: "\xEA", ecir: "\u2256", ecolon: "\u2255", Ecy: "\u042D", ecy: "\u044D", eDDot: "\u2A77", Edot: "\u0116", edot: "\u0117", eDot: "\u2251", ee: "\u2147", efDot: "\u2252", Efr: "\u{1D508}", efr: "\u{1D522}", eg: "\u2A9A", Egrave: "\xC8", egrave: "\xE8", egs: "\u2A96", egsdot: "\u2A98", el: "\u2A99", Element: "\u2208", elinters: "\u23E7", ell: "\u2113", els: "\u2A95", elsdot: "\u2A97", Emacr: "\u0112", emacr: "\u0113", empty: "\u2205", emptyset: "\u2205", EmptySmallSquare: "\u25FB", emptyv: "\u2205", EmptyVerySmallSquare: "\u25AB", emsp13: "\u2004", emsp14: "\u2005", emsp: "\u2003", ENG: "\u014A", eng: "\u014B", ensp: "\u2002", Eogon: "\u0118", eogon: "\u0119", Eopf: "\u{1D53C}", eopf: "\u{1D556}", epar: "\u22D5", eparsl: "\u29E3", eplus: "\u2A71", epsi: "\u03B5", Epsilon: "\u0395", epsilon: "\u03B5", epsiv: "\u03F5", eqcirc: "\u2256", eqcolon: "\u2255", eqsim: "\u2242", eqslantgtr: "\u2A96", eqslantless: "\u2A95", Equal: "\u2A75", equals: "=", EqualTilde: "\u2242", equest: "\u225F", Equilibrium: "\u21CC", equiv: "\u2261", equivDD: "\u2A78", eqvparsl: "\u29E5", erarr: "\u2971", erDot: "\u2253", escr: "\u212F", Escr: "\u2130", esdot: "\u2250", Esim: "\u2A73", esim: "\u2242", Eta: "\u0397", eta: "\u03B7", ETH: "\xD0", eth: "\xF0", Euml: "\xCB", euml: "\xEB", euro: "\u20AC", excl: "!", exist: "\u2203", Exists: "\u2203", expectation: "\u2130", exponentiale: "\u2147", ExponentialE: "\u2147", fallingdotseq: "\u2252", Fcy: "\u0424", fcy: "\u0444", female: "\u2640", ffilig: "\uFB03", fflig: "\uFB00", ffllig: "\uFB04", Ffr: "\u{1D509}", ffr: "\u{1D523}", filig: "\uFB01", FilledSmallSquare: "\u25FC", FilledVerySmallSquare: "\u25AA", fjlig: "fj", flat: "\u266D", fllig: "\uFB02", fltns: "\u25B1", fnof: "\u0192", Fopf: "\u{1D53D}", fopf: "\u{1D557}", forall: "\u2200", ForAll: "\u2200", fork: "\u22D4", forkv: "\u2AD9", Fouriertrf: "\u2131", fpartint: "\u2A0D", frac12: "\xBD", frac13: "\u2153", frac14: "\xBC", frac15: "\u2155", frac16: "\u2159", frac18: "\u215B", frac23: "\u2154", frac25: "\u2156", frac34: "\xBE", frac35: "\u2157", frac38: "\u215C", frac45: "\u2158", frac56: "\u215A", frac58: "\u215D", frac78: "\u215E", frasl: "\u2044", frown: "\u2322", fscr: "\u{1D4BB}", Fscr: "\u2131", gacute: "\u01F5", Gamma: "\u0393", gamma: "\u03B3", Gammad: "\u03DC", gammad: "\u03DD", gap: "\u2A86", Gbreve: "\u011E", gbreve: "\u011F", Gcedil: "\u0122", Gcirc: "\u011C", gcirc: "\u011D", Gcy: "\u0413", gcy: "\u0433", Gdot: "\u0120", gdot: "\u0121", ge: "\u2265", gE: "\u2267", gEl: "\u2A8C", gel: "\u22DB", geq: "\u2265", geqq: "\u2267", geqslant: "\u2A7E", gescc: "\u2AA9", ges: "\u2A7E", gesdot: "\u2A80", gesdoto: "\u2A82", gesdotol: "\u2A84", gesl: "\u22DB\uFE00", gesles: "\u2A94", Gfr: "\u{1D50A}", gfr: "\u{1D524}", gg: "\u226B", Gg: "\u22D9", ggg: "\u22D9", gimel: "\u2137", GJcy: "\u0403", gjcy: "\u0453", gla: "\u2AA5", gl: "\u2277", glE: "\u2A92", glj: "\u2AA4", gnap: "\u2A8A", gnapprox: "\u2A8A", gne: "\u2A88", gnE: "\u2269", gneq: "\u2A88", gneqq: "\u2269", gnsim: "\u22E7", Gopf: "\u{1D53E}", gopf: "\u{1D558}", grave: "`", GreaterEqual: "\u2265", GreaterEqualLess: "\u22DB", GreaterFullEqual: "\u2267", GreaterGreater: "\u2AA2", GreaterLess: "\u2277", GreaterSlantEqual: "\u2A7E", GreaterTilde: "\u2273", Gscr: "\u{1D4A2}", gscr: "\u210A", gsim: "\u2273", gsime: "\u2A8E", gsiml: "\u2A90", gtcc: "\u2AA7", gtcir: "\u2A7A", gt: ">", GT: ">", Gt: "\u226B", gtdot: "\u22D7", gtlPar: "\u2995", gtquest: "\u2A7C", gtrapprox: "\u2A86", gtrarr: "\u2978", gtrdot: "\u22D7", gtreqless: "\u22DB", gtreqqless: "\u2A8C", gtrless: "\u2277", gtrsim: "\u2273", gvertneqq: "\u2269\uFE00", gvnE: "\u2269\uFE00", Hacek: "\u02C7", hairsp: "\u200A", half: "\xBD", hamilt: "\u210B", HARDcy: "\u042A", hardcy: "\u044A", harrcir: "\u2948", harr: "\u2194", hArr: "\u21D4", harrw: "\u21AD", Hat: "^", hbar: "\u210F", Hcirc: "\u0124", hcirc: "\u0125", hearts: "\u2665", heartsuit: "\u2665", hellip: "\u2026", hercon: "\u22B9", hfr: "\u{1D525}", Hfr: "\u210C", HilbertSpace: "\u210B", hksearow: "\u2925", hkswarow: "\u2926", hoarr: "\u21FF", homtht: "\u223B", hookleftarrow: "\u21A9", hookrightarrow: "\u21AA", hopf: "\u{1D559}", Hopf: "\u210D", horbar: "\u2015", HorizontalLine: "\u2500", hscr: "\u{1D4BD}", Hscr: "\u210B", hslash: "\u210F", Hstrok: "\u0126", hstrok: "\u0127", HumpDownHump: "\u224E", HumpEqual: "\u224F", hybull: "\u2043", hyphen: "\u2010", Iacute: "\xCD", iacute: "\xED", ic: "\u2063", Icirc: "\xCE", icirc: "\xEE", Icy: "\u0418", icy: "\u0438", Idot: "\u0130", IEcy: "\u0415", iecy: "\u0435", iexcl: "\xA1", iff: "\u21D4", ifr: "\u{1D526}", Ifr: "\u2111", Igrave: "\xCC", igrave: "\xEC", ii: "\u2148", iiiint: "\u2A0C", iiint: "\u222D", iinfin: "\u29DC", iiota: "\u2129", IJlig: "\u0132", ijlig: "\u0133", Imacr: "\u012A", imacr: "\u012B", image: "\u2111", ImaginaryI: "\u2148", imagline: "\u2110", imagpart: "\u2111", imath: "\u0131", Im: "\u2111", imof: "\u22B7", imped: "\u01B5", Implies: "\u21D2", incare: "\u2105", in: "\u2208", infin: "\u221E", infintie: "\u29DD", inodot: "\u0131", intcal: "\u22BA", int: "\u222B", Int: "\u222C", integers: "\u2124", Integral: "\u222B", intercal: "\u22BA", Intersection: "\u22C2", intlarhk: "\u2A17", intprod: "\u2A3C", InvisibleComma: "\u2063", InvisibleTimes: "\u2062", IOcy: "\u0401", iocy: "\u0451", Iogon: "\u012E", iogon: "\u012F", Iopf: "\u{1D540}", iopf: "\u{1D55A}", Iota: "\u0399", iota: "\u03B9", iprod: "\u2A3C", iquest: "\xBF", iscr: "\u{1D4BE}", Iscr: "\u2110", isin: "\u2208", isindot: "\u22F5", isinE: "\u22F9", isins: "\u22F4", isinsv: "\u22F3", isinv: "\u2208", it: "\u2062", Itilde: "\u0128", itilde: "\u0129", Iukcy: "\u0406", iukcy: "\u0456", Iuml: "\xCF", iuml: "\xEF", Jcirc: "\u0134", jcirc: "\u0135", Jcy: "\u0419", jcy: "\u0439", Jfr: "\u{1D50D}", jfr: "\u{1D527}", jmath: "\u0237", Jopf: "\u{1D541}", jopf: "\u{1D55B}", Jscr: "\u{1D4A5}", jscr: "\u{1D4BF}", Jsercy: "\u0408", jsercy: "\u0458", Jukcy: "\u0404", jukcy: "\u0454", Kappa: "\u039A", kappa: "\u03BA", kappav: "\u03F0", Kcedil: "\u0136", kcedil: "\u0137", Kcy: "\u041A", kcy: "\u043A", Kfr: "\u{1D50E}", kfr: "\u{1D528}", kgreen: "\u0138", KHcy: "\u0425", khcy: "\u0445", KJcy: "\u040C", kjcy: "\u045C", Kopf: "\u{1D542}", kopf: "\u{1D55C}", Kscr: "\u{1D4A6}", kscr: "\u{1D4C0}", lAarr: "\u21DA", Lacute: "\u0139", lacute: "\u013A", laemptyv: "\u29B4", lagran: "\u2112", Lambda: "\u039B", lambda: "\u03BB", lang: "\u27E8", Lang: "\u27EA", langd: "\u2991", langle: "\u27E8", lap: "\u2A85", Laplacetrf: "\u2112", laquo: "\xAB", larrb: "\u21E4", larrbfs: "\u291F", larr: "\u2190", Larr: "\u219E", lArr: "\u21D0", larrfs: "\u291D", larrhk: "\u21A9", larrlp: "\u21AB", larrpl: "\u2939", larrsim: "\u2973", larrtl: "\u21A2", latail: "\u2919", lAtail: "\u291B", lat: "\u2AAB", late: "\u2AAD", lates: "\u2AAD\uFE00", lbarr: "\u290C", lBarr: "\u290E", lbbrk: "\u2772", lbrace: "{", lbrack: "[", lbrke: "\u298B", lbrksld: "\u298F", lbrkslu: "\u298D", Lcaron: "\u013D", lcaron: "\u013E", Lcedil: "\u013B", lcedil: "\u013C", lceil: "\u2308", lcub: "{", Lcy: "\u041B", lcy: "\u043B", ldca: "\u2936", ldquo: "\u201C", ldquor: "\u201E", ldrdhar: "\u2967", ldrushar: "\u294B", ldsh: "\u21B2", le: "\u2264", lE: "\u2266", LeftAngleBracket: "\u27E8", LeftArrowBar: "\u21E4", leftarrow: "\u2190", LeftArrow: "\u2190", Leftarrow: "\u21D0", LeftArrowRightArrow: "\u21C6", leftarrowtail: "\u21A2", LeftCeiling: "\u2308", LeftDoubleBracket: "\u27E6", LeftDownTeeVector: "\u2961", LeftDownVectorBar: "\u2959", LeftDownVector: "\u21C3", LeftFloor: "\u230A", leftharpoondown: "\u21BD", leftharpoonup: "\u21BC", leftleftarrows: "\u21C7", leftrightarrow: "\u2194", LeftRightArrow: "\u2194", Leftrightarrow: "\u21D4", leftrightarrows: "\u21C6", leftrightharpoons: "\u21CB", leftrightsquigarrow: "\u21AD", LeftRightVector: "\u294E", LeftTeeArrow: "\u21A4", LeftTee: "\u22A3", LeftTeeVector: "\u295A", leftthreetimes: "\u22CB", LeftTriangleBar: "\u29CF", LeftTriangle: "\u22B2", LeftTriangleEqual: "\u22B4", LeftUpDownVector: "\u2951", LeftUpTeeVector: "\u2960", LeftUpVectorBar: "\u2958", LeftUpVector: "\u21BF", LeftVectorBar: "\u2952", LeftVector: "\u21BC", lEg: "\u2A8B", leg: "\u22DA", leq: "\u2264", leqq: "\u2266", leqslant: "\u2A7D", lescc: "\u2AA8", les: "\u2A7D", lesdot: "\u2A7F", lesdoto: "\u2A81", lesdotor: "\u2A83", lesg: "\u22DA\uFE00", lesges: "\u2A93", lessapprox: "\u2A85", lessdot: "\u22D6", lesseqgtr: "\u22DA", lesseqqgtr: "\u2A8B", LessEqualGreater: "\u22DA", LessFullEqual: "\u2266", LessGreater: "\u2276", lessgtr: "\u2276", LessLess: "\u2AA1", lesssim: "\u2272", LessSlantEqual: "\u2A7D", LessTilde: "\u2272", lfisht: "\u297C", lfloor: "\u230A", Lfr: "\u{1D50F}", lfr: "\u{1D529}", lg: "\u2276", lgE: "\u2A91", lHar: "\u2962", lhard: "\u21BD", lharu: "\u21BC", lharul: "\u296A", lhblk: "\u2584", LJcy: "\u0409", ljcy: "\u0459", llarr: "\u21C7", ll: "\u226A", Ll: "\u22D8", llcorner: "\u231E", Lleftarrow: "\u21DA", llhard: "\u296B", lltri: "\u25FA", Lmidot: "\u013F", lmidot: "\u0140", lmoustache: "\u23B0", lmoust: "\u23B0", lnap: "\u2A89", lnapprox: "\u2A89", lne: "\u2A87", lnE: "\u2268", lneq: "\u2A87", lneqq: "\u2268", lnsim: "\u22E6", loang: "\u27EC", loarr: "\u21FD", lobrk: "\u27E6", longleftarrow: "\u27F5", LongLeftArrow: "\u27F5", Longleftarrow: "\u27F8", longleftrightarrow: "\u27F7", LongLeftRightArrow: "\u27F7", Longleftrightarrow: "\u27FA", longmapsto: "\u27FC", longrightarrow: "\u27F6", LongRightArrow: "\u27F6", Longrightarrow: "\u27F9", looparrowleft: "\u21AB", looparrowright: "\u21AC", lopar: "\u2985", Lopf: "\u{1D543}", lopf: "\u{1D55D}", loplus: "\u2A2D", lotimes: "\u2A34", lowast: "\u2217", lowbar: "_", LowerLeftArrow: "\u2199", LowerRightArrow: "\u2198", loz: "\u25CA", lozenge: "\u25CA", lozf: "\u29EB", lpar: "(", lparlt: "\u2993", lrarr: "\u21C6", lrcorner: "\u231F", lrhar: "\u21CB", lrhard: "\u296D", lrm: "\u200E", lrtri: "\u22BF", lsaquo: "\u2039", lscr: "\u{1D4C1}", Lscr: "\u2112", lsh: "\u21B0", Lsh: "\u21B0", lsim: "\u2272", lsime: "\u2A8D", lsimg: "\u2A8F", lsqb: "[", lsquo: "\u2018", lsquor: "\u201A", Lstrok: "\u0141", lstrok: "\u0142", ltcc: "\u2AA6", ltcir: "\u2A79", lt: "<", LT: "<", Lt: "\u226A", ltdot: "\u22D6", lthree: "\u22CB", ltimes: "\u22C9", ltlarr: "\u2976", ltquest: "\u2A7B", ltri: "\u25C3", ltrie: "\u22B4", ltrif: "\u25C2", ltrPar: "\u2996", lurdshar: "\u294A", luruhar: "\u2966", lvertneqq: "\u2268\uFE00", lvnE: "\u2268\uFE00", macr: "\xAF", male: "\u2642", malt: "\u2720", maltese: "\u2720", Map: "\u2905", map: "\u21A6", mapsto: "\u21A6", mapstodown: "\u21A7", mapstoleft: "\u21A4", mapstoup: "\u21A5", marker: "\u25AE", mcomma: "\u2A29", Mcy: "\u041C", mcy: "\u043C", mdash: "\u2014", mDDot: "\u223A", measuredangle: "\u2221", MediumSpace: "\u205F", Mellintrf: "\u2133", Mfr: "\u{1D510}", mfr: "\u{1D52A}", mho: "\u2127", micro: "\xB5", midast: "*", midcir: "\u2AF0", mid: "\u2223", middot: "\xB7", minusb: "\u229F", minus: "\u2212", minusd: "\u2238", minusdu: "\u2A2A", MinusPlus: "\u2213", mlcp: "\u2ADB", mldr: "\u2026", mnplus: "\u2213", models: "\u22A7", Mopf: "\u{1D544}", mopf: "\u{1D55E}", mp: "\u2213", mscr: "\u{1D4C2}", Mscr: "\u2133", mstpos: "\u223E", Mu: "\u039C", mu: "\u03BC", multimap: "\u22B8", mumap: "\u22B8", nabla: "\u2207", Nacute: "\u0143", nacute: "\u0144", nang: "\u2220\u20D2", nap: "\u2249", napE: "\u2A70\u0338", napid: "\u224B\u0338", napos: "\u0149", napprox: "\u2249", natural: "\u266E", naturals: "\u2115", natur: "\u266E", nbsp: "\xA0", nbump: "\u224E\u0338", nbumpe: "\u224F\u0338", ncap: "\u2A43", Ncaron: "\u0147", ncaron: "\u0148", Ncedil: "\u0145", ncedil: "\u0146", ncong: "\u2247", ncongdot: "\u2A6D\u0338", ncup: "\u2A42", Ncy: "\u041D", ncy: "\u043D", ndash: "\u2013", nearhk: "\u2924", nearr: "\u2197", neArr: "\u21D7", nearrow: "\u2197", ne: "\u2260", nedot: "\u2250\u0338", NegativeMediumSpace: "\u200B", NegativeThickSpace: "\u200B", NegativeThinSpace: "\u200B", NegativeVeryThinSpace: "\u200B", nequiv: "\u2262", nesear: "\u2928", nesim: "\u2242\u0338", NestedGreaterGreater: "\u226B", NestedLessLess: "\u226A", NewLine: "\n", nexist: "\u2204", nexists: "\u2204", Nfr: "\u{1D511}", nfr: "\u{1D52B}", ngE: "\u2267\u0338", nge: "\u2271", ngeq: "\u2271", ngeqq: "\u2267\u0338", ngeqslant: "\u2A7E\u0338", nges: "\u2A7E\u0338", nGg: "\u22D9\u0338", ngsim: "\u2275", nGt: "\u226B\u20D2", ngt: "\u226F", ngtr: "\u226F", nGtv: "\u226B\u0338", nharr: "\u21AE", nhArr: "\u21CE", nhpar: "\u2AF2", ni: "\u220B", nis: "\u22FC", nisd: "\u22FA", niv: "\u220B", NJcy: "\u040A", njcy: "\u045A", nlarr: "\u219A", nlArr: "\u21CD", nldr: "\u2025", nlE: "\u2266\u0338", nle: "\u2270", nleftarrow: "\u219A", nLeftarrow: "\u21CD", nleftrightarrow: "\u21AE", nLeftrightarrow: "\u21CE", nleq: "\u2270", nleqq: "\u2266\u0338", nleqslant: "\u2A7D\u0338", nles: "\u2A7D\u0338", nless: "\u226E", nLl: "\u22D8\u0338", nlsim: "\u2274", nLt: "\u226A\u20D2", nlt: "\u226E", nltri: "\u22EA", nltrie: "\u22EC", nLtv: "\u226A\u0338", nmid: "\u2224", NoBreak: "\u2060", NonBreakingSpace: "\xA0", nopf: "\u{1D55F}", Nopf: "\u2115", Not: "\u2AEC", not: "\xAC", NotCongruent: "\u2262", NotCupCap: "\u226D", NotDoubleVerticalBar: "\u2226", NotElement: "\u2209", NotEqual: "\u2260", NotEqualTilde: "\u2242\u0338", NotExists: "\u2204", NotGreater: "\u226F", NotGreaterEqual: "\u2271", NotGreaterFullEqual: "\u2267\u0338", NotGreaterGreater: "\u226B\u0338", NotGreaterLess: "\u2279", NotGreaterSlantEqual: "\u2A7E\u0338", NotGreaterTilde: "\u2275", NotHumpDownHump: "\u224E\u0338", NotHumpEqual: "\u224F\u0338", notin: "\u2209", notindot: "\u22F5\u0338", notinE: "\u22F9\u0338", notinva: "\u2209", notinvb: "\u22F7", notinvc: "\u22F6", NotLeftTriangleBar: "\u29CF\u0338", NotLeftTriangle: "\u22EA", NotLeftTriangleEqual: "\u22EC", NotLess: "\u226E", NotLessEqual: "\u2270", NotLessGreater: "\u2278", NotLessLess: "\u226A\u0338", NotLessSlantEqual: "\u2A7D\u0338", NotLessTilde: "\u2274", NotNestedGreaterGreater: "\u2AA2\u0338", NotNestedLessLess: "\u2AA1\u0338", notni: "\u220C", notniva: "\u220C", notnivb: "\u22FE", notnivc: "\u22FD", NotPrecedes: "\u2280", NotPrecedesEqual: "\u2AAF\u0338", NotPrecedesSlantEqual: "\u22E0", NotReverseElement: "\u220C", NotRightTriangleBar: "\u29D0\u0338", NotRightTriangle: "\u22EB", NotRightTriangleEqual: "\u22ED", NotSquareSubset: "\u228F\u0338", NotSquareSubsetEqual: "\u22E2", NotSquareSuperset: "\u2290\u0338", NotSquareSupersetEqual: "\u22E3", NotSubset: "\u2282\u20D2", NotSubsetEqual: "\u2288", NotSucceeds: "\u2281", NotSucceedsEqual: "\u2AB0\u0338", NotSucceedsSlantEqual: "\u22E1", NotSucceedsTilde: "\u227F\u0338", NotSuperset: "\u2283\u20D2", NotSupersetEqual: "\u2289", NotTilde: "\u2241", NotTildeEqual: "\u2244", NotTildeFullEqual: "\u2247", NotTildeTilde: "\u2249", NotVerticalBar: "\u2224", nparallel: "\u2226", npar: "\u2226", nparsl: "\u2AFD\u20E5", npart: "\u2202\u0338", npolint: "\u2A14", npr: "\u2280", nprcue: "\u22E0", nprec: "\u2280", npreceq: "\u2AAF\u0338", npre: "\u2AAF\u0338", nrarrc: "\u2933\u0338", nrarr: "\u219B", nrArr: "\u21CF", nrarrw: "\u219D\u0338", nrightarrow: "\u219B", nRightarrow: "\u21CF", nrtri: "\u22EB", nrtrie: "\u22ED", nsc: "\u2281", nsccue: "\u22E1", nsce: "\u2AB0\u0338", Nscr: "\u{1D4A9}", nscr: "\u{1D4C3}", nshortmid: "\u2224", nshortparallel: "\u2226", nsim: "\u2241", nsime: "\u2244", nsimeq: "\u2244", nsmid: "\u2224", nspar: "\u2226", nsqsube: "\u22E2", nsqsupe: "\u22E3", nsub: "\u2284", nsubE: "\u2AC5\u0338", nsube: "\u2288", nsubset: "\u2282\u20D2", nsubseteq: "\u2288", nsubseteqq: "\u2AC5\u0338", nsucc: "\u2281", nsucceq: "\u2AB0\u0338", nsup: "\u2285", nsupE: "\u2AC6\u0338", nsupe: "\u2289", nsupset: "\u2283\u20D2", nsupseteq: "\u2289", nsupseteqq: "\u2AC6\u0338", ntgl: "\u2279", Ntilde: "\xD1", ntilde: "\xF1", ntlg: "\u2278", ntriangleleft: "\u22EA", ntrianglelefteq: "\u22EC", ntriangleright: "\u22EB", ntrianglerighteq: "\u22ED", Nu: "\u039D", nu: "\u03BD", num: "#", numero: "\u2116", numsp: "\u2007", nvap: "\u224D\u20D2", nvdash: "\u22AC", nvDash: "\u22AD", nVdash: "\u22AE", nVDash: "\u22AF", nvge: "\u2265\u20D2", nvgt: ">\u20D2", nvHarr: "\u2904", nvinfin: "\u29DE", nvlArr: "\u2902", nvle: "\u2264\u20D2", nvlt: "<\u20D2", nvltrie: "\u22B4\u20D2", nvrArr: "\u2903", nvrtrie: "\u22B5\u20D2", nvsim: "\u223C\u20D2", nwarhk: "\u2923", nwarr: "\u2196", nwArr: "\u21D6", nwarrow: "\u2196", nwnear: "\u2927", Oacute: "\xD3", oacute: "\xF3", oast: "\u229B", Ocirc: "\xD4", ocirc: "\xF4", ocir: "\u229A", Ocy: "\u041E", ocy: "\u043E", odash: "\u229D", Odblac: "\u0150", odblac: "\u0151", odiv: "\u2A38", odot: "\u2299", odsold: "\u29BC", OElig: "\u0152", oelig: "\u0153", ofcir: "\u29BF", Ofr: "\u{1D512}", ofr: "\u{1D52C}", ogon: "\u02DB", Ograve: "\xD2", ograve: "\xF2", ogt: "\u29C1", ohbar: "\u29B5", ohm: "\u03A9", oint: "\u222E", olarr: "\u21BA", olcir: "\u29BE", olcross: "\u29BB", oline: "\u203E", olt: "\u29C0", Omacr: "\u014C", omacr: "\u014D", Omega: "\u03A9", omega: "\u03C9", Omicron: "\u039F", omicron: "\u03BF", omid: "\u29B6", ominus: "\u2296", Oopf: "\u{1D546}", oopf: "\u{1D560}", opar: "\u29B7", OpenCurlyDoubleQuote: "\u201C", OpenCurlyQuote: "\u2018", operp: "\u29B9", oplus: "\u2295", orarr: "\u21BB", Or: "\u2A54", or: "\u2228", ord: "\u2A5D", order: "\u2134", orderof: "\u2134", ordf: "\xAA", ordm: "\xBA", origof: "\u22B6", oror: "\u2A56", orslope: "\u2A57", orv: "\u2A5B", oS: "\u24C8", Oscr: "\u{1D4AA}", oscr: "\u2134", Oslash: "\xD8", oslash: "\xF8", osol: "\u2298", Otilde: "\xD5", otilde: "\xF5", otimesas: "\u2A36", Otimes: "\u2A37", otimes: "\u2297", Ouml: "\xD6", ouml: "\xF6", ovbar: "\u233D", OverBar: "\u203E", OverBrace: "\u23DE", OverBracket: "\u23B4", OverParenthesis: "\u23DC", para: "\xB6", parallel: "\u2225", par: "\u2225", parsim: "\u2AF3", parsl: "\u2AFD", part: "\u2202", PartialD: "\u2202", Pcy: "\u041F", pcy: "\u043F", percnt: "%", period: ".", permil: "\u2030", perp: "\u22A5", pertenk: "\u2031", Pfr: "\u{1D513}", pfr: "\u{1D52D}", Phi: "\u03A6", phi: "\u03C6", phiv: "\u03D5", phmmat: "\u2133", phone: "\u260E", Pi: "\u03A0", pi: "\u03C0", pitchfork: "\u22D4", piv: "\u03D6", planck: "\u210F", planckh: "\u210E", plankv: "\u210F", plusacir: "\u2A23", plusb: "\u229E", pluscir: "\u2A22", plus: "+", plusdo: "\u2214", plusdu: "\u2A25", pluse: "\u2A72", PlusMinus: "\xB1", plusmn: "\xB1", plussim: "\u2A26", plustwo: "\u2A27", pm: "\xB1", Poincareplane: "\u210C", pointint: "\u2A15", popf: "\u{1D561}", Popf: "\u2119", pound: "\xA3", prap: "\u2AB7", Pr: "\u2ABB", pr: "\u227A", prcue: "\u227C", precapprox: "\u2AB7", prec: "\u227A", preccurlyeq: "\u227C", Precedes: "\u227A", PrecedesEqual: "\u2AAF", PrecedesSlantEqual: "\u227C", PrecedesTilde: "\u227E", preceq: "\u2AAF", precnapprox: "\u2AB9", precneqq: "\u2AB5", precnsim: "\u22E8", pre: "\u2AAF", prE: "\u2AB3", precsim: "\u227E", prime: "\u2032", Prime: "\u2033", primes: "\u2119", prnap: "\u2AB9", prnE: "\u2AB5", prnsim: "\u22E8", prod: "\u220F", Product: "\u220F", profalar: "\u232E", profline: "\u2312", profsurf: "\u2313", prop: "\u221D", Proportional: "\u221D", Proportion: "\u2237", propto: "\u221D", prsim: "\u227E", prurel: "\u22B0", Pscr: "\u{1D4AB}", pscr: "\u{1D4C5}", Psi: "\u03A8", psi: "\u03C8", puncsp: "\u2008", Qfr: "\u{1D514}", qfr: "\u{1D52E}", qint: "\u2A0C", qopf: "\u{1D562}", Qopf: "\u211A", qprime: "\u2057", Qscr: "\u{1D4AC}", qscr: "\u{1D4C6}", quaternions: "\u210D", quatint: "\u2A16", quest: "?", questeq: "\u225F", quot: '"', QUOT: '"', rAarr: "\u21DB", race: "\u223D\u0331", Racute: "\u0154", racute: "\u0155", radic: "\u221A", raemptyv: "\u29B3", rang: "\u27E9", Rang: "\u27EB", rangd: "\u2992", range: "\u29A5", rangle: "\u27E9", raquo: "\xBB", rarrap: "\u2975", rarrb: "\u21E5", rarrbfs: "\u2920", rarrc: "\u2933", rarr: "\u2192", Rarr: "\u21A0", rArr: "\u21D2", rarrfs: "\u291E", rarrhk: "\u21AA", rarrlp: "\u21AC", rarrpl: "\u2945", rarrsim: "\u2974", Rarrtl: "\u2916", rarrtl: "\u21A3", rarrw: "\u219D", ratail: "\u291A", rAtail: "\u291C", ratio: "\u2236", rationals: "\u211A", rbarr: "\u290D", rBarr: "\u290F", RBarr: "\u2910", rbbrk: "\u2773", rbrace: "}", rbrack: "]", rbrke: "\u298C", rbrksld: "\u298E", rbrkslu: "\u2990", Rcaron: "\u0158", rcaron: "\u0159", Rcedil: "\u0156", rcedil: "\u0157", rceil: "\u2309", rcub: "}", Rcy: "\u0420", rcy: "\u0440", rdca: "\u2937", rdldhar: "\u2969", rdquo: "\u201D", rdquor: "\u201D", rdsh: "\u21B3", real: "\u211C", realine: "\u211B", realpart: "\u211C", reals: "\u211D", Re: "\u211C", rect: "\u25AD", reg: "\xAE", REG: "\xAE", ReverseElement: "\u220B", ReverseEquilibrium: "\u21CB", ReverseUpEquilibrium: "\u296F", rfisht: "\u297D", rfloor: "\u230B", rfr: "\u{1D52F}", Rfr: "\u211C", rHar: "\u2964", rhard: "\u21C1", rharu: "\u21C0", rharul: "\u296C", Rho: "\u03A1", rho: "\u03C1", rhov: "\u03F1", RightAngleBracket: "\u27E9", RightArrowBar: "\u21E5", rightarrow: "\u2192", RightArrow: "\u2192", Rightarrow: "\u21D2", RightArrowLeftArrow: "\u21C4", rightarrowtail: "\u21A3", RightCeiling: "\u2309", RightDoubleBracket: "\u27E7", RightDownTeeVector: "\u295D", RightDownVectorBar: "\u2955", RightDownVector: "\u21C2", RightFloor: "\u230B", rightharpoondown: "\u21C1", rightharpoonup: "\u21C0", rightleftarrows: "\u21C4", rightleftharpoons: "\u21CC", rightrightarrows: "\u21C9", rightsquigarrow: "\u219D", RightTeeArrow: "\u21A6", RightTee: "\u22A2", RightTeeVector: "\u295B", rightthreetimes: "\u22CC", RightTriangleBar: "\u29D0", RightTriangle: "\u22B3", RightTriangleEqual: "\u22B5", RightUpDownVector: "\u294F", RightUpTeeVector: "\u295C", RightUpVectorBar: "\u2954", RightUpVector: "\u21BE", RightVectorBar: "\u2953", RightVector: "\u21C0", ring: "\u02DA", risingdotseq: "\u2253", rlarr: "\u21C4", rlhar: "\u21CC", rlm: "\u200F", rmoustache: "\u23B1", rmoust: "\u23B1", rnmid: "\u2AEE", roang: "\u27ED", roarr: "\u21FE", robrk: "\u27E7", ropar: "\u2986", ropf: "\u{1D563}", Ropf: "\u211D", roplus: "\u2A2E", rotimes: "\u2A35", RoundImplies: "\u2970", rpar: ")", rpargt: "\u2994", rppolint: "\u2A12", rrarr: "\u21C9", Rrightarrow: "\u21DB", rsaquo: "\u203A", rscr: "\u{1D4C7}", Rscr: "\u211B", rsh: "\u21B1", Rsh: "\u21B1", rsqb: "]", rsquo: "\u2019", rsquor: "\u2019", rthree: "\u22CC", rtimes: "\u22CA", rtri: "\u25B9", rtrie: "\u22B5", rtrif: "\u25B8", rtriltri: "\u29CE", RuleDelayed: "\u29F4", ruluhar: "\u2968", rx: "\u211E", Sacute: "\u015A", sacute: "\u015B", sbquo: "\u201A", scap: "\u2AB8", Scaron: "\u0160", scaron: "\u0161", Sc: "\u2ABC", sc: "\u227B", sccue: "\u227D", sce: "\u2AB0", scE: "\u2AB4", Scedil: "\u015E", scedil: "\u015F", Scirc: "\u015C", scirc: "\u015D", scnap: "\u2ABA", scnE: "\u2AB6", scnsim: "\u22E9", scpolint: "\u2A13", scsim: "\u227F", Scy: "\u0421", scy: "\u0441", sdotb: "\u22A1", sdot: "\u22C5", sdote: "\u2A66", searhk: "\u2925", searr: "\u2198", seArr: "\u21D8", searrow: "\u2198", sect: "\xA7", semi: ";", seswar: "\u2929", setminus: "\u2216", setmn: "\u2216", sext: "\u2736", Sfr: "\u{1D516}", sfr: "\u{1D530}", sfrown: "\u2322", sharp: "\u266F", SHCHcy: "\u0429", shchcy: "\u0449", SHcy: "\u0428", shcy: "\u0448", ShortDownArrow: "\u2193", ShortLeftArrow: "\u2190", shortmid: "\u2223", shortparallel: "\u2225", ShortRightArrow: "\u2192", ShortUpArrow: "\u2191", shy: "\xAD", Sigma: "\u03A3", sigma: "\u03C3", sigmaf: "\u03C2", sigmav: "\u03C2", sim: "\u223C", simdot: "\u2A6A", sime: "\u2243", simeq: "\u2243", simg: "\u2A9E", simgE: "\u2AA0", siml: "\u2A9D", simlE: "\u2A9F", simne: "\u2246", simplus: "\u2A24", simrarr: "\u2972", slarr: "\u2190", SmallCircle: "\u2218", smallsetminus: "\u2216", smashp: "\u2A33", smeparsl: "\u29E4", smid: "\u2223", smile: "\u2323", smt: "\u2AAA", smte: "\u2AAC", smtes: "\u2AAC\uFE00", SOFTcy: "\u042C", softcy: "\u044C", solbar: "\u233F", solb: "\u29C4", sol: "/", Sopf: "\u{1D54A}", sopf: "\u{1D564}", spades: "\u2660", spadesuit: "\u2660", spar: "\u2225", sqcap: "\u2293", sqcaps: "\u2293\uFE00", sqcup: "\u2294", sqcups: "\u2294\uFE00", Sqrt: "\u221A", sqsub: "\u228F", sqsube: "\u2291", sqsubset: "\u228F", sqsubseteq: "\u2291", sqsup: "\u2290", sqsupe: "\u2292", sqsupset: "\u2290", sqsupseteq: "\u2292", square: "\u25A1", Square: "\u25A1", SquareIntersection: "\u2293", SquareSubset: "\u228F", SquareSubsetEqual: "\u2291", SquareSuperset: "\u2290", SquareSupersetEqual: "\u2292", SquareUnion: "\u2294", squarf: "\u25AA", squ: "\u25A1", squf: "\u25AA", srarr: "\u2192", Sscr: "\u{1D4AE}", sscr: "\u{1D4C8}", ssetmn: "\u2216", ssmile: "\u2323", sstarf: "\u22C6", Star: "\u22C6", star: "\u2606", starf: "\u2605", straightepsilon: "\u03F5", straightphi: "\u03D5", strns: "\xAF", sub: "\u2282", Sub: "\u22D0", subdot: "\u2ABD", subE: "\u2AC5", sube: "\u2286", subedot: "\u2AC3", submult: "\u2AC1", subnE: "\u2ACB", subne: "\u228A", subplus: "\u2ABF", subrarr: "\u2979", subset: "\u2282", Subset: "\u22D0", subseteq: "\u2286", subseteqq: "\u2AC5", SubsetEqual: "\u2286", subsetneq: "\u228A", subsetneqq: "\u2ACB", subsim: "\u2AC7", subsub: "\u2AD5", subsup: "\u2AD3", succapprox: "\u2AB8", succ: "\u227B", succcurlyeq: "\u227D", Succeeds: "\u227B", SucceedsEqual: "\u2AB0", SucceedsSlantEqual: "\u227D", SucceedsTilde: "\u227F", succeq: "\u2AB0", succnapprox: "\u2ABA", succneqq: "\u2AB6", succnsim: "\u22E9", succsim: "\u227F", SuchThat: "\u220B", sum: "\u2211", Sum: "\u2211", sung: "\u266A", sup1: "\xB9", sup2: "\xB2", sup3: "\xB3", sup: "\u2283", Sup: "\u22D1", supdot: "\u2ABE", supdsub: "\u2AD8", supE: "\u2AC6", supe: "\u2287", supedot: "\u2AC4", Superset: "\u2283", SupersetEqual: "\u2287", suphsol: "\u27C9", suphsub: "\u2AD7", suplarr: "\u297B", supmult: "\u2AC2", supnE: "\u2ACC", supne: "\u228B", supplus: "\u2AC0", supset: "\u2283", Supset: "\u22D1", supseteq: "\u2287", supseteqq: "\u2AC6", supsetneq: "\u228B", supsetneqq: "\u2ACC", supsim: "\u2AC8", supsub: "\u2AD4", supsup: "\u2AD6", swarhk: "\u2926", swarr: "\u2199", swArr: "\u21D9", swarrow: "\u2199", swnwar: "\u292A", szlig: "\xDF", Tab: "	", target: "\u2316", Tau: "\u03A4", tau: "\u03C4", tbrk: "\u23B4", Tcaron: "\u0164", tcaron: "\u0165", Tcedil: "\u0162", tcedil: "\u0163", Tcy: "\u0422", tcy: "\u0442", tdot: "\u20DB", telrec: "\u2315", Tfr: "\u{1D517}", tfr: "\u{1D531}", there4: "\u2234", therefore: "\u2234", Therefore: "\u2234", Theta: "\u0398", theta: "\u03B8", thetasym: "\u03D1", thetav: "\u03D1", thickapprox: "\u2248", thicksim: "\u223C", ThickSpace: "\u205F\u200A", ThinSpace: "\u2009", thinsp: "\u2009", thkap: "\u2248", thksim: "\u223C", THORN: "\xDE", thorn: "\xFE", tilde: "\u02DC", Tilde: "\u223C", TildeEqual: "\u2243", TildeFullEqual: "\u2245", TildeTilde: "\u2248", timesbar: "\u2A31", timesb: "\u22A0", times: "\xD7", timesd: "\u2A30", tint: "\u222D", toea: "\u2928", topbot: "\u2336", topcir: "\u2AF1", top: "\u22A4", Topf: "\u{1D54B}", topf: "\u{1D565}", topfork: "\u2ADA", tosa: "\u2929", tprime: "\u2034", trade: "\u2122", TRADE: "\u2122", triangle: "\u25B5", triangledown: "\u25BF", triangleleft: "\u25C3", trianglelefteq: "\u22B4", triangleq: "\u225C", triangleright: "\u25B9", trianglerighteq: "\u22B5", tridot: "\u25EC", trie: "\u225C", triminus: "\u2A3A", TripleDot: "\u20DB", triplus: "\u2A39", trisb: "\u29CD", tritime: "\u2A3B", trpezium: "\u23E2", Tscr: "\u{1D4AF}", tscr: "\u{1D4C9}", TScy: "\u0426", tscy: "\u0446", TSHcy: "\u040B", tshcy: "\u045B", Tstrok: "\u0166", tstrok: "\u0167", twixt: "\u226C", twoheadleftarrow: "\u219E", twoheadrightarrow: "\u21A0", Uacute: "\xDA", uacute: "\xFA", uarr: "\u2191", Uarr: "\u219F", uArr: "\u21D1", Uarrocir: "\u2949", Ubrcy: "\u040E", ubrcy: "\u045E", Ubreve: "\u016C", ubreve: "\u016D", Ucirc: "\xDB", ucirc: "\xFB", Ucy: "\u0423", ucy: "\u0443", udarr: "\u21C5", Udblac: "\u0170", udblac: "\u0171", udhar: "\u296E", ufisht: "\u297E", Ufr: "\u{1D518}", ufr: "\u{1D532}", Ugrave: "\xD9", ugrave: "\xF9", uHar: "\u2963", uharl: "\u21BF", uharr: "\u21BE", uhblk: "\u2580", ulcorn: "\u231C", ulcorner: "\u231C", ulcrop: "\u230F", ultri: "\u25F8", Umacr: "\u016A", umacr: "\u016B", uml: "\xA8", UnderBar: "_", UnderBrace: "\u23DF", UnderBracket: "\u23B5", UnderParenthesis: "\u23DD", Union: "\u22C3", UnionPlus: "\u228E", Uogon: "\u0172", uogon: "\u0173", Uopf: "\u{1D54C}", uopf: "\u{1D566}", UpArrowBar: "\u2912", uparrow: "\u2191", UpArrow: "\u2191", Uparrow: "\u21D1", UpArrowDownArrow: "\u21C5", updownarrow: "\u2195", UpDownArrow: "\u2195", Updownarrow: "\u21D5", UpEquilibrium: "\u296E", upharpoonleft: "\u21BF", upharpoonright: "\u21BE", uplus: "\u228E", UpperLeftArrow: "\u2196", UpperRightArrow: "\u2197", upsi: "\u03C5", Upsi: "\u03D2", upsih: "\u03D2", Upsilon: "\u03A5", upsilon: "\u03C5", UpTeeArrow: "\u21A5", UpTee: "\u22A5", upuparrows: "\u21C8", urcorn: "\u231D", urcorner: "\u231D", urcrop: "\u230E", Uring: "\u016E", uring: "\u016F", urtri: "\u25F9", Uscr: "\u{1D4B0}", uscr: "\u{1D4CA}", utdot: "\u22F0", Utilde: "\u0168", utilde: "\u0169", utri: "\u25B5", utrif: "\u25B4", uuarr: "\u21C8", Uuml: "\xDC", uuml: "\xFC", uwangle: "\u29A7", vangrt: "\u299C", varepsilon: "\u03F5", varkappa: "\u03F0", varnothing: "\u2205", varphi: "\u03D5", varpi: "\u03D6", varpropto: "\u221D", varr: "\u2195", vArr: "\u21D5", varrho: "\u03F1", varsigma: "\u03C2", varsubsetneq: "\u228A\uFE00", varsubsetneqq: "\u2ACB\uFE00", varsupsetneq: "\u228B\uFE00", varsupsetneqq: "\u2ACC\uFE00", vartheta: "\u03D1", vartriangleleft: "\u22B2", vartriangleright: "\u22B3", vBar: "\u2AE8", Vbar: "\u2AEB", vBarv: "\u2AE9", Vcy: "\u0412", vcy: "\u0432", vdash: "\u22A2", vDash: "\u22A8", Vdash: "\u22A9", VDash: "\u22AB", Vdashl: "\u2AE6", veebar: "\u22BB", vee: "\u2228", Vee: "\u22C1", veeeq: "\u225A", vellip: "\u22EE", verbar: "|", Verbar: "\u2016", vert: "|", Vert: "\u2016", VerticalBar: "\u2223", VerticalLine: "|", VerticalSeparator: "\u2758", VerticalTilde: "\u2240", VeryThinSpace: "\u200A", Vfr: "\u{1D519}", vfr: "\u{1D533}", vltri: "\u22B2", vnsub: "\u2282\u20D2", vnsup: "\u2283\u20D2", Vopf: "\u{1D54D}", vopf: "\u{1D567}", vprop: "\u221D", vrtri: "\u22B3", Vscr: "\u{1D4B1}", vscr: "\u{1D4CB}", vsubnE: "\u2ACB\uFE00", vsubne: "\u228A\uFE00", vsupnE: "\u2ACC\uFE00", vsupne: "\u228B\uFE00", Vvdash: "\u22AA", vzigzag: "\u299A", Wcirc: "\u0174", wcirc: "\u0175", wedbar: "\u2A5F", wedge: "\u2227", Wedge: "\u22C0", wedgeq: "\u2259", weierp: "\u2118", Wfr: "\u{1D51A}", wfr: "\u{1D534}", Wopf: "\u{1D54E}", wopf: "\u{1D568}", wp: "\u2118", wr: "\u2240", wreath: "\u2240", Wscr: "\u{1D4B2}", wscr: "\u{1D4CC}", xcap: "\u22C2", xcirc: "\u25EF", xcup: "\u22C3", xdtri: "\u25BD", Xfr: "\u{1D51B}", xfr: "\u{1D535}", xharr: "\u27F7", xhArr: "\u27FA", Xi: "\u039E", xi: "\u03BE", xlarr: "\u27F5", xlArr: "\u27F8", xmap: "\u27FC", xnis: "\u22FB", xodot: "\u2A00", Xopf: "\u{1D54F}", xopf: "\u{1D569}", xoplus: "\u2A01", xotime: "\u2A02", xrarr: "\u27F6", xrArr: "\u27F9", Xscr: "\u{1D4B3}", xscr: "\u{1D4CD}", xsqcup: "\u2A06", xuplus: "\u2A04", xutri: "\u25B3", xvee: "\u22C1", xwedge: "\u22C0", Yacute: "\xDD", yacute: "\xFD", YAcy: "\u042F", yacy: "\u044F", Ycirc: "\u0176", ycirc: "\u0177", Ycy: "\u042B", ycy: "\u044B", yen: "\xA5", Yfr: "\u{1D51C}", yfr: "\u{1D536}", YIcy: "\u0407", yicy: "\u0457", Yopf: "\u{1D550}", yopf: "\u{1D56A}", Yscr: "\u{1D4B4}", yscr: "\u{1D4CE}", YUcy: "\u042E", yucy: "\u044E", yuml: "\xFF", Yuml: "\u0178", Zacute: "\u0179", zacute: "\u017A", Zcaron: "\u017D", zcaron: "\u017E", Zcy: "\u0417", zcy: "\u0437", Zdot: "\u017B", zdot: "\u017C", zeetrf: "\u2128", ZeroWidthSpace: "\u200B", Zeta: "\u0396", zeta: "\u03B6", zfr: "\u{1D537}", Zfr: "\u2128", ZHcy: "\u0416", zhcy: "\u0436", zigrarr: "\u21DD", zopf: "\u{1D56B}", Zopf: "\u2124", Zscr: "\u{1D4B5}", zscr: "\u{1D4CF}", zwj: "\u200D", zwnj: "\u200C" };
  }
});

// node_modules/entities/lib/maps/legacy.json
var require_legacy = __commonJS({
  "node_modules/entities/lib/maps/legacy.json"(exports, module) {
    module.exports = { Aacute: "\xC1", aacute: "\xE1", Acirc: "\xC2", acirc: "\xE2", acute: "\xB4", AElig: "\xC6", aelig: "\xE6", Agrave: "\xC0", agrave: "\xE0", amp: "&", AMP: "&", Aring: "\xC5", aring: "\xE5", Atilde: "\xC3", atilde: "\xE3", Auml: "\xC4", auml: "\xE4", brvbar: "\xA6", Ccedil: "\xC7", ccedil: "\xE7", cedil: "\xB8", cent: "\xA2", copy: "\xA9", COPY: "\xA9", curren: "\xA4", deg: "\xB0", divide: "\xF7", Eacute: "\xC9", eacute: "\xE9", Ecirc: "\xCA", ecirc: "\xEA", Egrave: "\xC8", egrave: "\xE8", ETH: "\xD0", eth: "\xF0", Euml: "\xCB", euml: "\xEB", frac12: "\xBD", frac14: "\xBC", frac34: "\xBE", gt: ">", GT: ">", Iacute: "\xCD", iacute: "\xED", Icirc: "\xCE", icirc: "\xEE", iexcl: "\xA1", Igrave: "\xCC", igrave: "\xEC", iquest: "\xBF", Iuml: "\xCF", iuml: "\xEF", laquo: "\xAB", lt: "<", LT: "<", macr: "\xAF", micro: "\xB5", middot: "\xB7", nbsp: "\xA0", not: "\xAC", Ntilde: "\xD1", ntilde: "\xF1", Oacute: "\xD3", oacute: "\xF3", Ocirc: "\xD4", ocirc: "\xF4", Ograve: "\xD2", ograve: "\xF2", ordf: "\xAA", ordm: "\xBA", Oslash: "\xD8", oslash: "\xF8", Otilde: "\xD5", otilde: "\xF5", Ouml: "\xD6", ouml: "\xF6", para: "\xB6", plusmn: "\xB1", pound: "\xA3", quot: '"', QUOT: '"', raquo: "\xBB", reg: "\xAE", REG: "\xAE", sect: "\xA7", shy: "\xAD", sup1: "\xB9", sup2: "\xB2", sup3: "\xB3", szlig: "\xDF", THORN: "\xDE", thorn: "\xFE", times: "\xD7", Uacute: "\xDA", uacute: "\xFA", Ucirc: "\xDB", ucirc: "\xFB", Ugrave: "\xD9", ugrave: "\xF9", uml: "\xA8", Uuml: "\xDC", uuml: "\xFC", Yacute: "\xDD", yacute: "\xFD", yen: "\xA5", yuml: "\xFF" };
  }
});

// node_modules/entities/lib/maps/xml.json
var require_xml = __commonJS({
  "node_modules/entities/lib/maps/xml.json"(exports, module) {
    module.exports = { amp: "&", apos: "'", gt: ">", lt: "<", quot: '"' };
  }
});

// node_modules/htmlparser2/lib/Tokenizer.js
var require_Tokenizer = __commonJS({
  "node_modules/htmlparser2/lib/Tokenizer.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var decode_codepoint_1 = __importDefault(require_decode_codepoint());
    var entities_json_1 = __importDefault(require_entities());
    var legacy_json_1 = __importDefault(require_legacy());
    var xml_json_1 = __importDefault(require_xml());
    function whitespace(c) {
      return c === " " || c === "\n" || c === "	" || c === "\f" || c === "\r";
    }
    function isASCIIAlpha(c) {
      return c >= "a" && c <= "z" || c >= "A" && c <= "Z";
    }
    function ifElseState(upper, SUCCESS, FAILURE) {
      var lower = upper.toLowerCase();
      if (upper === lower) {
        return function(t, c) {
          if (c === lower) {
            t._state = SUCCESS;
          } else {
            t._state = FAILURE;
            t._index--;
          }
        };
      }
      return function(t, c) {
        if (c === lower || c === upper) {
          t._state = SUCCESS;
        } else {
          t._state = FAILURE;
          t._index--;
        }
      };
    }
    function consumeSpecialNameChar(upper, NEXT_STATE) {
      var lower = upper.toLowerCase();
      return function(t, c) {
        if (c === lower || c === upper) {
          t._state = NEXT_STATE;
        } else {
          t._state = 3;
          t._index--;
        }
      };
    }
    var stateBeforeCdata1 = ifElseState(
      "C",
      24,
      16
      /* InDeclaration */
    );
    var stateBeforeCdata2 = ifElseState(
      "D",
      25,
      16
      /* InDeclaration */
    );
    var stateBeforeCdata3 = ifElseState(
      "A",
      26,
      16
      /* InDeclaration */
    );
    var stateBeforeCdata4 = ifElseState(
      "T",
      27,
      16
      /* InDeclaration */
    );
    var stateBeforeCdata5 = ifElseState(
      "A",
      28,
      16
      /* InDeclaration */
    );
    var stateBeforeScript1 = consumeSpecialNameChar(
      "R",
      35
      /* BeforeScript2 */
    );
    var stateBeforeScript2 = consumeSpecialNameChar(
      "I",
      36
      /* BeforeScript3 */
    );
    var stateBeforeScript3 = consumeSpecialNameChar(
      "P",
      37
      /* BeforeScript4 */
    );
    var stateBeforeScript4 = consumeSpecialNameChar(
      "T",
      38
      /* BeforeScript5 */
    );
    var stateAfterScript1 = ifElseState(
      "R",
      40,
      1
      /* Text */
    );
    var stateAfterScript2 = ifElseState(
      "I",
      41,
      1
      /* Text */
    );
    var stateAfterScript3 = ifElseState(
      "P",
      42,
      1
      /* Text */
    );
    var stateAfterScript4 = ifElseState(
      "T",
      43,
      1
      /* Text */
    );
    var stateBeforeStyle1 = consumeSpecialNameChar(
      "Y",
      45
      /* BeforeStyle2 */
    );
    var stateBeforeStyle2 = consumeSpecialNameChar(
      "L",
      46
      /* BeforeStyle3 */
    );
    var stateBeforeStyle3 = consumeSpecialNameChar(
      "E",
      47
      /* BeforeStyle4 */
    );
    var stateAfterStyle1 = ifElseState(
      "Y",
      49,
      1
      /* Text */
    );
    var stateAfterStyle2 = ifElseState(
      "L",
      50,
      1
      /* Text */
    );
    var stateAfterStyle3 = ifElseState(
      "E",
      51,
      1
      /* Text */
    );
    var stateBeforeSpecialT = consumeSpecialNameChar(
      "I",
      54
      /* BeforeTitle1 */
    );
    var stateBeforeTitle1 = consumeSpecialNameChar(
      "T",
      55
      /* BeforeTitle2 */
    );
    var stateBeforeTitle2 = consumeSpecialNameChar(
      "L",
      56
      /* BeforeTitle3 */
    );
    var stateBeforeTitle3 = consumeSpecialNameChar(
      "E",
      57
      /* BeforeTitle4 */
    );
    var stateAfterSpecialTEnd = ifElseState(
      "I",
      58,
      1
      /* Text */
    );
    var stateAfterTitle1 = ifElseState(
      "T",
      59,
      1
      /* Text */
    );
    var stateAfterTitle2 = ifElseState(
      "L",
      60,
      1
      /* Text */
    );
    var stateAfterTitle3 = ifElseState(
      "E",
      61,
      1
      /* Text */
    );
    var stateBeforeEntity = ifElseState(
      "#",
      63,
      64
      /* InNamedEntity */
    );
    var stateBeforeNumericEntity = ifElseState(
      "X",
      66,
      65
      /* InNumericEntity */
    );
    var Tokenizer = function() {
      function Tokenizer2(options, cbs) {
        var _a;
        this._state = 1;
        this.buffer = "";
        this.sectionStart = 0;
        this._index = 0;
        this.bufferOffset = 0;
        this.baseState = 1;
        this.special = 1;
        this.running = true;
        this.ended = false;
        this.cbs = cbs;
        this.xmlMode = !!(options === null || options === void 0 ? void 0 : options.xmlMode);
        this.decodeEntities = (_a = options === null || options === void 0 ? void 0 : options.decodeEntities) !== null && _a !== void 0 ? _a : true;
      }
      Tokenizer2.prototype.reset = function() {
        this._state = 1;
        this.buffer = "";
        this.sectionStart = 0;
        this._index = 0;
        this.bufferOffset = 0;
        this.baseState = 1;
        this.special = 1;
        this.running = true;
        this.ended = false;
      };
      Tokenizer2.prototype.write = function(chunk) {
        if (this.ended)
          this.cbs.onerror(Error(".write() after done!"));
        this.buffer += chunk;
        this.parse();
      };
      Tokenizer2.prototype.end = function(chunk) {
        if (this.ended)
          this.cbs.onerror(Error(".end() after done!"));
        if (chunk)
          this.write(chunk);
        this.ended = true;
        if (this.running)
          this.finish();
      };
      Tokenizer2.prototype.pause = function() {
        this.running = false;
      };
      Tokenizer2.prototype.resume = function() {
        this.running = true;
        if (this._index < this.buffer.length) {
          this.parse();
        }
        if (this.ended) {
          this.finish();
        }
      };
      Tokenizer2.prototype.getAbsoluteIndex = function() {
        return this.bufferOffset + this._index;
      };
      Tokenizer2.prototype.stateText = function(c) {
        if (c === "<") {
          if (this._index > this.sectionStart) {
            this.cbs.ontext(this.getSection());
          }
          this._state = 2;
          this.sectionStart = this._index;
        } else if (this.decodeEntities && c === "&" && (this.special === 1 || this.special === 4)) {
          if (this._index > this.sectionStart) {
            this.cbs.ontext(this.getSection());
          }
          this.baseState = 1;
          this._state = 62;
          this.sectionStart = this._index;
        }
      };
      Tokenizer2.prototype.isTagStartChar = function(c) {
        return isASCIIAlpha(c) || this.xmlMode && !whitespace(c) && c !== "/" && c !== ">";
      };
      Tokenizer2.prototype.stateBeforeTagName = function(c) {
        if (c === "/") {
          this._state = 5;
        } else if (c === "<") {
          this.cbs.ontext(this.getSection());
          this.sectionStart = this._index;
        } else if (c === ">" || this.special !== 1 || whitespace(c)) {
          this._state = 1;
        } else if (c === "!") {
          this._state = 15;
          this.sectionStart = this._index + 1;
        } else if (c === "?") {
          this._state = 17;
          this.sectionStart = this._index + 1;
        } else if (!this.isTagStartChar(c)) {
          this._state = 1;
        } else {
          this._state = !this.xmlMode && (c === "s" || c === "S") ? 32 : !this.xmlMode && (c === "t" || c === "T") ? 52 : 3;
          this.sectionStart = this._index;
        }
      };
      Tokenizer2.prototype.stateInTagName = function(c) {
        if (c === "/" || c === ">" || whitespace(c)) {
          this.emitToken("onopentagname");
          this._state = 8;
          this._index--;
        }
      };
      Tokenizer2.prototype.stateBeforeClosingTagName = function(c) {
        if (whitespace(c)) {
        } else if (c === ">") {
          this._state = 1;
        } else if (this.special !== 1) {
          if (this.special !== 4 && (c === "s" || c === "S")) {
            this._state = 33;
          } else if (this.special === 4 && (c === "t" || c === "T")) {
            this._state = 53;
          } else {
            this._state = 1;
            this._index--;
          }
        } else if (!this.isTagStartChar(c)) {
          this._state = 20;
          this.sectionStart = this._index;
        } else {
          this._state = 6;
          this.sectionStart = this._index;
        }
      };
      Tokenizer2.prototype.stateInClosingTagName = function(c) {
        if (c === ">" || whitespace(c)) {
          this.emitToken("onclosetag");
          this._state = 7;
          this._index--;
        }
      };
      Tokenizer2.prototype.stateAfterClosingTagName = function(c) {
        if (c === ">") {
          this._state = 1;
          this.sectionStart = this._index + 1;
        }
      };
      Tokenizer2.prototype.stateBeforeAttributeName = function(c) {
        if (c === ">") {
          this.cbs.onopentagend();
          this._state = 1;
          this.sectionStart = this._index + 1;
        } else if (c === "/") {
          this._state = 4;
        } else if (!whitespace(c)) {
          this._state = 9;
          this.sectionStart = this._index;
        }
      };
      Tokenizer2.prototype.stateInSelfClosingTag = function(c) {
        if (c === ">") {
          this.cbs.onselfclosingtag();
          this._state = 1;
          this.sectionStart = this._index + 1;
          this.special = 1;
        } else if (!whitespace(c)) {
          this._state = 8;
          this._index--;
        }
      };
      Tokenizer2.prototype.stateInAttributeName = function(c) {
        if (c === "=" || c === "/" || c === ">" || whitespace(c)) {
          this.cbs.onattribname(this.getSection());
          this.sectionStart = -1;
          this._state = 10;
          this._index--;
        }
      };
      Tokenizer2.prototype.stateAfterAttributeName = function(c) {
        if (c === "=") {
          this._state = 11;
        } else if (c === "/" || c === ">") {
          this.cbs.onattribend(void 0);
          this._state = 8;
          this._index--;
        } else if (!whitespace(c)) {
          this.cbs.onattribend(void 0);
          this._state = 9;
          this.sectionStart = this._index;
        }
      };
      Tokenizer2.prototype.stateBeforeAttributeValue = function(c) {
        if (c === '"') {
          this._state = 12;
          this.sectionStart = this._index + 1;
        } else if (c === "'") {
          this._state = 13;
          this.sectionStart = this._index + 1;
        } else if (!whitespace(c)) {
          this._state = 14;
          this.sectionStart = this._index;
          this._index--;
        }
      };
      Tokenizer2.prototype.handleInAttributeValue = function(c, quote) {
        if (c === quote) {
          this.emitToken("onattribdata");
          this.cbs.onattribend(quote);
          this._state = 8;
        } else if (this.decodeEntities && c === "&") {
          this.emitToken("onattribdata");
          this.baseState = this._state;
          this._state = 62;
          this.sectionStart = this._index;
        }
      };
      Tokenizer2.prototype.stateInAttributeValueDoubleQuotes = function(c) {
        this.handleInAttributeValue(c, '"');
      };
      Tokenizer2.prototype.stateInAttributeValueSingleQuotes = function(c) {
        this.handleInAttributeValue(c, "'");
      };
      Tokenizer2.prototype.stateInAttributeValueNoQuotes = function(c) {
        if (whitespace(c) || c === ">") {
          this.emitToken("onattribdata");
          this.cbs.onattribend(null);
          this._state = 8;
          this._index--;
        } else if (this.decodeEntities && c === "&") {
          this.emitToken("onattribdata");
          this.baseState = this._state;
          this._state = 62;
          this.sectionStart = this._index;
        }
      };
      Tokenizer2.prototype.stateBeforeDeclaration = function(c) {
        this._state = c === "[" ? 23 : c === "-" ? 18 : 16;
      };
      Tokenizer2.prototype.stateInDeclaration = function(c) {
        if (c === ">") {
          this.cbs.ondeclaration(this.getSection());
          this._state = 1;
          this.sectionStart = this._index + 1;
        }
      };
      Tokenizer2.prototype.stateInProcessingInstruction = function(c) {
        if (c === ">") {
          this.cbs.onprocessinginstruction(this.getSection());
          this._state = 1;
          this.sectionStart = this._index + 1;
        }
      };
      Tokenizer2.prototype.stateBeforeComment = function(c) {
        if (c === "-") {
          this._state = 19;
          this.sectionStart = this._index + 1;
        } else {
          this._state = 16;
        }
      };
      Tokenizer2.prototype.stateInComment = function(c) {
        if (c === "-")
          this._state = 21;
      };
      Tokenizer2.prototype.stateInSpecialComment = function(c) {
        if (c === ">") {
          this.cbs.oncomment(this.buffer.substring(this.sectionStart, this._index));
          this._state = 1;
          this.sectionStart = this._index + 1;
        }
      };
      Tokenizer2.prototype.stateAfterComment1 = function(c) {
        if (c === "-") {
          this._state = 22;
        } else {
          this._state = 19;
        }
      };
      Tokenizer2.prototype.stateAfterComment2 = function(c) {
        if (c === ">") {
          this.cbs.oncomment(this.buffer.substring(this.sectionStart, this._index - 2));
          this._state = 1;
          this.sectionStart = this._index + 1;
        } else if (c !== "-") {
          this._state = 19;
        }
      };
      Tokenizer2.prototype.stateBeforeCdata6 = function(c) {
        if (c === "[") {
          this._state = 29;
          this.sectionStart = this._index + 1;
        } else {
          this._state = 16;
          this._index--;
        }
      };
      Tokenizer2.prototype.stateInCdata = function(c) {
        if (c === "]")
          this._state = 30;
      };
      Tokenizer2.prototype.stateAfterCdata1 = function(c) {
        if (c === "]")
          this._state = 31;
        else
          this._state = 29;
      };
      Tokenizer2.prototype.stateAfterCdata2 = function(c) {
        if (c === ">") {
          this.cbs.oncdata(this.buffer.substring(this.sectionStart, this._index - 2));
          this._state = 1;
          this.sectionStart = this._index + 1;
        } else if (c !== "]") {
          this._state = 29;
        }
      };
      Tokenizer2.prototype.stateBeforeSpecialS = function(c) {
        if (c === "c" || c === "C") {
          this._state = 34;
        } else if (c === "t" || c === "T") {
          this._state = 44;
        } else {
          this._state = 3;
          this._index--;
        }
      };
      Tokenizer2.prototype.stateBeforeSpecialSEnd = function(c) {
        if (this.special === 2 && (c === "c" || c === "C")) {
          this._state = 39;
        } else if (this.special === 3 && (c === "t" || c === "T")) {
          this._state = 48;
        } else
          this._state = 1;
      };
      Tokenizer2.prototype.stateBeforeSpecialLast = function(c, special) {
        if (c === "/" || c === ">" || whitespace(c)) {
          this.special = special;
        }
        this._state = 3;
        this._index--;
      };
      Tokenizer2.prototype.stateAfterSpecialLast = function(c, sectionStartOffset) {
        if (c === ">" || whitespace(c)) {
          this.special = 1;
          this._state = 6;
          this.sectionStart = this._index - sectionStartOffset;
          this._index--;
        } else
          this._state = 1;
      };
      Tokenizer2.prototype.parseFixedEntity = function(map) {
        if (map === void 0) {
          map = this.xmlMode ? xml_json_1.default : entities_json_1.default;
        }
        if (this.sectionStart + 1 < this._index) {
          var entity = this.buffer.substring(this.sectionStart + 1, this._index);
          if (Object.prototype.hasOwnProperty.call(map, entity)) {
            this.emitPartial(map[entity]);
            this.sectionStart = this._index + 1;
          }
        }
      };
      Tokenizer2.prototype.parseLegacyEntity = function() {
        var start = this.sectionStart + 1;
        var limit = Math.min(this._index - start, 6);
        while (limit >= 2) {
          var entity = this.buffer.substr(start, limit);
          if (Object.prototype.hasOwnProperty.call(legacy_json_1.default, entity)) {
            this.emitPartial(legacy_json_1.default[entity]);
            this.sectionStart += limit + 1;
            return;
          }
          limit--;
        }
      };
      Tokenizer2.prototype.stateInNamedEntity = function(c) {
        if (c === ";") {
          this.parseFixedEntity();
          if (this.baseState === 1 && this.sectionStart + 1 < this._index && !this.xmlMode) {
            this.parseLegacyEntity();
          }
          this._state = this.baseState;
        } else if ((c < "0" || c > "9") && !isASCIIAlpha(c)) {
          if (this.xmlMode || this.sectionStart + 1 === this._index) {
          } else if (this.baseState !== 1) {
            if (c !== "=") {
              this.parseFixedEntity(legacy_json_1.default);
            }
          } else {
            this.parseLegacyEntity();
          }
          this._state = this.baseState;
          this._index--;
        }
      };
      Tokenizer2.prototype.decodeNumericEntity = function(offset, base, strict) {
        var sectionStart = this.sectionStart + offset;
        if (sectionStart !== this._index) {
          var entity = this.buffer.substring(sectionStart, this._index);
          var parsed = parseInt(entity, base);
          this.emitPartial(decode_codepoint_1.default(parsed));
          this.sectionStart = strict ? this._index + 1 : this._index;
        }
        this._state = this.baseState;
      };
      Tokenizer2.prototype.stateInNumericEntity = function(c) {
        if (c === ";") {
          this.decodeNumericEntity(2, 10, true);
        } else if (c < "0" || c > "9") {
          if (!this.xmlMode) {
            this.decodeNumericEntity(2, 10, false);
          } else {
            this._state = this.baseState;
          }
          this._index--;
        }
      };
      Tokenizer2.prototype.stateInHexEntity = function(c) {
        if (c === ";") {
          this.decodeNumericEntity(3, 16, true);
        } else if ((c < "a" || c > "f") && (c < "A" || c > "F") && (c < "0" || c > "9")) {
          if (!this.xmlMode) {
            this.decodeNumericEntity(3, 16, false);
          } else {
            this._state = this.baseState;
          }
          this._index--;
        }
      };
      Tokenizer2.prototype.cleanup = function() {
        if (this.sectionStart < 0) {
          this.buffer = "";
          this.bufferOffset += this._index;
          this._index = 0;
        } else if (this.running) {
          if (this._state === 1) {
            if (this.sectionStart !== this._index) {
              this.cbs.ontext(this.buffer.substr(this.sectionStart));
            }
            this.buffer = "";
            this.bufferOffset += this._index;
            this._index = 0;
          } else if (this.sectionStart === this._index) {
            this.buffer = "";
            this.bufferOffset += this._index;
            this._index = 0;
          } else {
            this.buffer = this.buffer.substr(this.sectionStart);
            this._index -= this.sectionStart;
            this.bufferOffset += this.sectionStart;
          }
          this.sectionStart = 0;
        }
      };
      Tokenizer2.prototype.parse = function() {
        while (this._index < this.buffer.length && this.running) {
          var c = this.buffer.charAt(this._index);
          if (this._state === 1) {
            this.stateText(c);
          } else if (this._state === 12) {
            this.stateInAttributeValueDoubleQuotes(c);
          } else if (this._state === 9) {
            this.stateInAttributeName(c);
          } else if (this._state === 19) {
            this.stateInComment(c);
          } else if (this._state === 20) {
            this.stateInSpecialComment(c);
          } else if (this._state === 8) {
            this.stateBeforeAttributeName(c);
          } else if (this._state === 3) {
            this.stateInTagName(c);
          } else if (this._state === 6) {
            this.stateInClosingTagName(c);
          } else if (this._state === 2) {
            this.stateBeforeTagName(c);
          } else if (this._state === 10) {
            this.stateAfterAttributeName(c);
          } else if (this._state === 13) {
            this.stateInAttributeValueSingleQuotes(c);
          } else if (this._state === 11) {
            this.stateBeforeAttributeValue(c);
          } else if (this._state === 5) {
            this.stateBeforeClosingTagName(c);
          } else if (this._state === 7) {
            this.stateAfterClosingTagName(c);
          } else if (this._state === 32) {
            this.stateBeforeSpecialS(c);
          } else if (this._state === 21) {
            this.stateAfterComment1(c);
          } else if (this._state === 14) {
            this.stateInAttributeValueNoQuotes(c);
          } else if (this._state === 4) {
            this.stateInSelfClosingTag(c);
          } else if (this._state === 16) {
            this.stateInDeclaration(c);
          } else if (this._state === 15) {
            this.stateBeforeDeclaration(c);
          } else if (this._state === 22) {
            this.stateAfterComment2(c);
          } else if (this._state === 18) {
            this.stateBeforeComment(c);
          } else if (this._state === 33) {
            this.stateBeforeSpecialSEnd(c);
          } else if (this._state === 53) {
            stateAfterSpecialTEnd(this, c);
          } else if (this._state === 39) {
            stateAfterScript1(this, c);
          } else if (this._state === 40) {
            stateAfterScript2(this, c);
          } else if (this._state === 41) {
            stateAfterScript3(this, c);
          } else if (this._state === 34) {
            stateBeforeScript1(this, c);
          } else if (this._state === 35) {
            stateBeforeScript2(this, c);
          } else if (this._state === 36) {
            stateBeforeScript3(this, c);
          } else if (this._state === 37) {
            stateBeforeScript4(this, c);
          } else if (this._state === 38) {
            this.stateBeforeSpecialLast(
              c,
              2
              /* Script */
            );
          } else if (this._state === 42) {
            stateAfterScript4(this, c);
          } else if (this._state === 43) {
            this.stateAfterSpecialLast(c, 6);
          } else if (this._state === 44) {
            stateBeforeStyle1(this, c);
          } else if (this._state === 29) {
            this.stateInCdata(c);
          } else if (this._state === 45) {
            stateBeforeStyle2(this, c);
          } else if (this._state === 46) {
            stateBeforeStyle3(this, c);
          } else if (this._state === 47) {
            this.stateBeforeSpecialLast(
              c,
              3
              /* Style */
            );
          } else if (this._state === 48) {
            stateAfterStyle1(this, c);
          } else if (this._state === 49) {
            stateAfterStyle2(this, c);
          } else if (this._state === 50) {
            stateAfterStyle3(this, c);
          } else if (this._state === 51) {
            this.stateAfterSpecialLast(c, 5);
          } else if (this._state === 52) {
            stateBeforeSpecialT(this, c);
          } else if (this._state === 54) {
            stateBeforeTitle1(this, c);
          } else if (this._state === 55) {
            stateBeforeTitle2(this, c);
          } else if (this._state === 56) {
            stateBeforeTitle3(this, c);
          } else if (this._state === 57) {
            this.stateBeforeSpecialLast(
              c,
              4
              /* Title */
            );
          } else if (this._state === 58) {
            stateAfterTitle1(this, c);
          } else if (this._state === 59) {
            stateAfterTitle2(this, c);
          } else if (this._state === 60) {
            stateAfterTitle3(this, c);
          } else if (this._state === 61) {
            this.stateAfterSpecialLast(c, 5);
          } else if (this._state === 17) {
            this.stateInProcessingInstruction(c);
          } else if (this._state === 64) {
            this.stateInNamedEntity(c);
          } else if (this._state === 23) {
            stateBeforeCdata1(this, c);
          } else if (this._state === 62) {
            stateBeforeEntity(this, c);
          } else if (this._state === 24) {
            stateBeforeCdata2(this, c);
          } else if (this._state === 25) {
            stateBeforeCdata3(this, c);
          } else if (this._state === 30) {
            this.stateAfterCdata1(c);
          } else if (this._state === 31) {
            this.stateAfterCdata2(c);
          } else if (this._state === 26) {
            stateBeforeCdata4(this, c);
          } else if (this._state === 27) {
            stateBeforeCdata5(this, c);
          } else if (this._state === 28) {
            this.stateBeforeCdata6(c);
          } else if (this._state === 66) {
            this.stateInHexEntity(c);
          } else if (this._state === 65) {
            this.stateInNumericEntity(c);
          } else if (this._state === 63) {
            stateBeforeNumericEntity(this, c);
          } else {
            this.cbs.onerror(Error("unknown _state"), this._state);
          }
          this._index++;
        }
        this.cleanup();
      };
      Tokenizer2.prototype.finish = function() {
        if (this.sectionStart < this._index) {
          this.handleTrailingData();
        }
        this.cbs.onend();
      };
      Tokenizer2.prototype.handleTrailingData = function() {
        var data = this.buffer.substr(this.sectionStart);
        if (this._state === 29 || this._state === 30 || this._state === 31) {
          this.cbs.oncdata(data);
        } else if (this._state === 19 || this._state === 21 || this._state === 22) {
          this.cbs.oncomment(data);
        } else if (this._state === 64 && !this.xmlMode) {
          this.parseLegacyEntity();
          if (this.sectionStart < this._index) {
            this._state = this.baseState;
            this.handleTrailingData();
          }
        } else if (this._state === 65 && !this.xmlMode) {
          this.decodeNumericEntity(2, 10, false);
          if (this.sectionStart < this._index) {
            this._state = this.baseState;
            this.handleTrailingData();
          }
        } else if (this._state === 66 && !this.xmlMode) {
          this.decodeNumericEntity(3, 16, false);
          if (this.sectionStart < this._index) {
            this._state = this.baseState;
            this.handleTrailingData();
          }
        } else if (this._state !== 3 && this._state !== 8 && this._state !== 11 && this._state !== 10 && this._state !== 9 && this._state !== 13 && this._state !== 12 && this._state !== 14 && this._state !== 6) {
          this.cbs.ontext(data);
        }
      };
      Tokenizer2.prototype.getSection = function() {
        return this.buffer.substring(this.sectionStart, this._index);
      };
      Tokenizer2.prototype.emitToken = function(name) {
        this.cbs[name](this.getSection());
        this.sectionStart = -1;
      };
      Tokenizer2.prototype.emitPartial = function(value) {
        if (this.baseState !== 1) {
          this.cbs.onattribdata(value);
        } else {
          this.cbs.ontext(value);
        }
      };
      return Tokenizer2;
    }();
    exports.default = Tokenizer;
  }
});

// node_modules/htmlparser2/lib/Parser.js
var require_Parser = __commonJS({
  "node_modules/htmlparser2/lib/Parser.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Parser = void 0;
    var Tokenizer_1 = __importDefault(require_Tokenizer());
    var formTags = /* @__PURE__ */ new Set([
      "input",
      "option",
      "optgroup",
      "select",
      "button",
      "datalist",
      "textarea"
    ]);
    var pTag = /* @__PURE__ */ new Set(["p"]);
    var openImpliesClose = {
      tr: /* @__PURE__ */ new Set(["tr", "th", "td"]),
      th: /* @__PURE__ */ new Set(["th"]),
      td: /* @__PURE__ */ new Set(["thead", "th", "td"]),
      body: /* @__PURE__ */ new Set(["head", "link", "script"]),
      li: /* @__PURE__ */ new Set(["li"]),
      p: pTag,
      h1: pTag,
      h2: pTag,
      h3: pTag,
      h4: pTag,
      h5: pTag,
      h6: pTag,
      select: formTags,
      input: formTags,
      output: formTags,
      button: formTags,
      datalist: formTags,
      textarea: formTags,
      option: /* @__PURE__ */ new Set(["option"]),
      optgroup: /* @__PURE__ */ new Set(["optgroup", "option"]),
      dd: /* @__PURE__ */ new Set(["dt", "dd"]),
      dt: /* @__PURE__ */ new Set(["dt", "dd"]),
      address: pTag,
      article: pTag,
      aside: pTag,
      blockquote: pTag,
      details: pTag,
      div: pTag,
      dl: pTag,
      fieldset: pTag,
      figcaption: pTag,
      figure: pTag,
      footer: pTag,
      form: pTag,
      header: pTag,
      hr: pTag,
      main: pTag,
      nav: pTag,
      ol: pTag,
      pre: pTag,
      section: pTag,
      table: pTag,
      ul: pTag,
      rt: /* @__PURE__ */ new Set(["rt", "rp"]),
      rp: /* @__PURE__ */ new Set(["rt", "rp"]),
      tbody: /* @__PURE__ */ new Set(["thead", "tbody"]),
      tfoot: /* @__PURE__ */ new Set(["thead", "tbody"])
    };
    var voidElements = /* @__PURE__ */ new Set([
      "area",
      "base",
      "basefont",
      "br",
      "col",
      "command",
      "embed",
      "frame",
      "hr",
      "img",
      "input",
      "isindex",
      "keygen",
      "link",
      "meta",
      "param",
      "source",
      "track",
      "wbr"
    ]);
    var foreignContextElements = /* @__PURE__ */ new Set(["math", "svg"]);
    var htmlIntegrationElements = /* @__PURE__ */ new Set([
      "mi",
      "mo",
      "mn",
      "ms",
      "mtext",
      "annotation-xml",
      "foreignObject",
      "desc",
      "title"
    ]);
    var reNameEnd = /\s|\//;
    var Parser = function() {
      function Parser2(cbs, options) {
        if (options === void 0) {
          options = {};
        }
        var _a, _b, _c, _d, _e;
        this.startIndex = 0;
        this.endIndex = null;
        this.tagname = "";
        this.attribname = "";
        this.attribvalue = "";
        this.attribs = null;
        this.stack = [];
        this.foreignContext = [];
        this.options = options;
        this.cbs = cbs !== null && cbs !== void 0 ? cbs : {};
        this.lowerCaseTagNames = (_a = options.lowerCaseTags) !== null && _a !== void 0 ? _a : !options.xmlMode;
        this.lowerCaseAttributeNames = (_b = options.lowerCaseAttributeNames) !== null && _b !== void 0 ? _b : !options.xmlMode;
        this.tokenizer = new ((_c = options.Tokenizer) !== null && _c !== void 0 ? _c : Tokenizer_1.default)(this.options, this);
        (_e = (_d = this.cbs).onparserinit) === null || _e === void 0 ? void 0 : _e.call(_d, this);
      }
      Parser2.prototype.updatePosition = function(initialOffset) {
        if (this.endIndex === null) {
          if (this.tokenizer.sectionStart <= initialOffset) {
            this.startIndex = 0;
          } else {
            this.startIndex = this.tokenizer.sectionStart - initialOffset;
          }
        } else {
          this.startIndex = this.endIndex + 1;
        }
        this.endIndex = this.tokenizer.getAbsoluteIndex();
      };
      Parser2.prototype.ontext = function(data) {
        var _a, _b;
        this.updatePosition(1);
        this.endIndex--;
        (_b = (_a = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a, data);
      };
      Parser2.prototype.onopentagname = function(name) {
        var _a, _b;
        if (this.lowerCaseTagNames) {
          name = name.toLowerCase();
        }
        this.tagname = name;
        if (!this.options.xmlMode && Object.prototype.hasOwnProperty.call(openImpliesClose, name)) {
          var el = void 0;
          while (this.stack.length > 0 && openImpliesClose[name].has(el = this.stack[this.stack.length - 1])) {
            this.onclosetag(el);
          }
        }
        if (this.options.xmlMode || !voidElements.has(name)) {
          this.stack.push(name);
          if (foreignContextElements.has(name)) {
            this.foreignContext.push(true);
          } else if (htmlIntegrationElements.has(name)) {
            this.foreignContext.push(false);
          }
        }
        (_b = (_a = this.cbs).onopentagname) === null || _b === void 0 ? void 0 : _b.call(_a, name);
        if (this.cbs.onopentag)
          this.attribs = {};
      };
      Parser2.prototype.onopentagend = function() {
        var _a, _b;
        this.updatePosition(1);
        if (this.attribs) {
          (_b = (_a = this.cbs).onopentag) === null || _b === void 0 ? void 0 : _b.call(_a, this.tagname, this.attribs);
          this.attribs = null;
        }
        if (!this.options.xmlMode && this.cbs.onclosetag && voidElements.has(this.tagname)) {
          this.cbs.onclosetag(this.tagname);
        }
        this.tagname = "";
      };
      Parser2.prototype.onclosetag = function(name) {
        this.updatePosition(1);
        if (this.lowerCaseTagNames) {
          name = name.toLowerCase();
        }
        if (foreignContextElements.has(name) || htmlIntegrationElements.has(name)) {
          this.foreignContext.pop();
        }
        if (this.stack.length && (this.options.xmlMode || !voidElements.has(name))) {
          var pos = this.stack.lastIndexOf(name);
          if (pos !== -1) {
            if (this.cbs.onclosetag) {
              pos = this.stack.length - pos;
              while (pos--) {
                this.cbs.onclosetag(this.stack.pop());
              }
            } else
              this.stack.length = pos;
          } else if (name === "p" && !this.options.xmlMode) {
            this.onopentagname(name);
            this.closeCurrentTag();
          }
        } else if (!this.options.xmlMode && (name === "br" || name === "p")) {
          this.onopentagname(name);
          this.closeCurrentTag();
        }
      };
      Parser2.prototype.onselfclosingtag = function() {
        if (this.options.xmlMode || this.options.recognizeSelfClosing || this.foreignContext[this.foreignContext.length - 1]) {
          this.closeCurrentTag();
        } else {
          this.onopentagend();
        }
      };
      Parser2.prototype.closeCurrentTag = function() {
        var _a, _b;
        var name = this.tagname;
        this.onopentagend();
        if (this.stack[this.stack.length - 1] === name) {
          (_b = (_a = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a, name);
          this.stack.pop();
        }
      };
      Parser2.prototype.onattribname = function(name) {
        if (this.lowerCaseAttributeNames) {
          name = name.toLowerCase();
        }
        this.attribname = name;
      };
      Parser2.prototype.onattribdata = function(value) {
        this.attribvalue += value;
      };
      Parser2.prototype.onattribend = function(quote) {
        var _a, _b;
        (_b = (_a = this.cbs).onattribute) === null || _b === void 0 ? void 0 : _b.call(_a, this.attribname, this.attribvalue, quote);
        if (this.attribs && !Object.prototype.hasOwnProperty.call(this.attribs, this.attribname)) {
          this.attribs[this.attribname] = this.attribvalue;
        }
        this.attribname = "";
        this.attribvalue = "";
      };
      Parser2.prototype.getInstructionName = function(value) {
        var idx = value.search(reNameEnd);
        var name = idx < 0 ? value : value.substr(0, idx);
        if (this.lowerCaseTagNames) {
          name = name.toLowerCase();
        }
        return name;
      };
      Parser2.prototype.ondeclaration = function(value) {
        if (this.cbs.onprocessinginstruction) {
          var name_1 = this.getInstructionName(value);
          this.cbs.onprocessinginstruction("!" + name_1, "!" + value);
        }
      };
      Parser2.prototype.onprocessinginstruction = function(value) {
        if (this.cbs.onprocessinginstruction) {
          var name_2 = this.getInstructionName(value);
          this.cbs.onprocessinginstruction("?" + name_2, "?" + value);
        }
      };
      Parser2.prototype.oncomment = function(value) {
        var _a, _b, _c, _d;
        this.updatePosition(4);
        (_b = (_a = this.cbs).oncomment) === null || _b === void 0 ? void 0 : _b.call(_a, value);
        (_d = (_c = this.cbs).oncommentend) === null || _d === void 0 ? void 0 : _d.call(_c);
      };
      Parser2.prototype.oncdata = function(value) {
        var _a, _b, _c, _d, _e, _f;
        this.updatePosition(1);
        if (this.options.xmlMode || this.options.recognizeCDATA) {
          (_b = (_a = this.cbs).oncdatastart) === null || _b === void 0 ? void 0 : _b.call(_a);
          (_d = (_c = this.cbs).ontext) === null || _d === void 0 ? void 0 : _d.call(_c, value);
          (_f = (_e = this.cbs).oncdataend) === null || _f === void 0 ? void 0 : _f.call(_e);
        } else {
          this.oncomment("[CDATA[" + value + "]]");
        }
      };
      Parser2.prototype.onerror = function(err) {
        var _a, _b;
        (_b = (_a = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a, err);
      };
      Parser2.prototype.onend = function() {
        var _a, _b;
        if (this.cbs.onclosetag) {
          for (var i = this.stack.length; i > 0; this.cbs.onclosetag(this.stack[--i]))
            ;
        }
        (_b = (_a = this.cbs).onend) === null || _b === void 0 ? void 0 : _b.call(_a);
      };
      Parser2.prototype.reset = function() {
        var _a, _b, _c, _d;
        (_b = (_a = this.cbs).onreset) === null || _b === void 0 ? void 0 : _b.call(_a);
        this.tokenizer.reset();
        this.tagname = "";
        this.attribname = "";
        this.attribs = null;
        this.stack = [];
        (_d = (_c = this.cbs).onparserinit) === null || _d === void 0 ? void 0 : _d.call(_c, this);
      };
      Parser2.prototype.parseComplete = function(data) {
        this.reset();
        this.end(data);
      };
      Parser2.prototype.write = function(chunk) {
        this.tokenizer.write(chunk);
      };
      Parser2.prototype.end = function(chunk) {
        this.tokenizer.end(chunk);
      };
      Parser2.prototype.pause = function() {
        this.tokenizer.pause();
      };
      Parser2.prototype.resume = function() {
        this.tokenizer.resume();
      };
      Parser2.prototype.parseChunk = function(chunk) {
        this.write(chunk);
      };
      Parser2.prototype.done = function(chunk) {
        this.end(chunk);
      };
      return Parser2;
    }();
    exports.Parser = Parser;
  }
});

// node_modules/domelementtype/lib/index.js
var require_lib = __commonJS({
  "node_modules/domelementtype/lib/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Doctype = exports.CDATA = exports.Tag = exports.Style = exports.Script = exports.Comment = exports.Directive = exports.Text = exports.Root = exports.isTag = exports.ElementType = void 0;
    var ElementType;
    (function(ElementType2) {
      ElementType2["Root"] = "root";
      ElementType2["Text"] = "text";
      ElementType2["Directive"] = "directive";
      ElementType2["Comment"] = "comment";
      ElementType2["Script"] = "script";
      ElementType2["Style"] = "style";
      ElementType2["Tag"] = "tag";
      ElementType2["CDATA"] = "cdata";
      ElementType2["Doctype"] = "doctype";
    })(ElementType = exports.ElementType || (exports.ElementType = {}));
    function isTag(elem) {
      return elem.type === ElementType.Tag || elem.type === ElementType.Script || elem.type === ElementType.Style;
    }
    exports.isTag = isTag;
    exports.Root = ElementType.Root;
    exports.Text = ElementType.Text;
    exports.Directive = ElementType.Directive;
    exports.Comment = ElementType.Comment;
    exports.Script = ElementType.Script;
    exports.Style = ElementType.Style;
    exports.Tag = ElementType.Tag;
    exports.CDATA = ElementType.CDATA;
    exports.Doctype = ElementType.Doctype;
  }
});

// node_modules/domhandler/lib/node.js
var require_node = __commonJS({
  "node_modules/domhandler/lib/node.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.cloneNode = exports.hasChildren = exports.isDocument = exports.isDirective = exports.isComment = exports.isText = exports.isCDATA = exports.isTag = exports.Element = exports.Document = exports.NodeWithChildren = exports.ProcessingInstruction = exports.Comment = exports.Text = exports.DataNode = exports.Node = void 0;
    var domelementtype_1 = require_lib();
    var nodeTypes = /* @__PURE__ */ new Map([
      [domelementtype_1.ElementType.Tag, 1],
      [domelementtype_1.ElementType.Script, 1],
      [domelementtype_1.ElementType.Style, 1],
      [domelementtype_1.ElementType.Directive, 1],
      [domelementtype_1.ElementType.Text, 3],
      [domelementtype_1.ElementType.CDATA, 4],
      [domelementtype_1.ElementType.Comment, 8],
      [domelementtype_1.ElementType.Root, 9]
    ]);
    var Node = function() {
      function Node2(type) {
        this.type = type;
        this.parent = null;
        this.prev = null;
        this.next = null;
        this.startIndex = null;
        this.endIndex = null;
      }
      Object.defineProperty(Node2.prototype, "nodeType", {
        // Read-only aliases
        /**
         * [DOM spec](https://dom.spec.whatwg.org/#dom-node-nodetype)-compatible
         * node {@link type}.
         */
        get: function() {
          var _a;
          return (_a = nodeTypes.get(this.type)) !== null && _a !== void 0 ? _a : 1;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Node2.prototype, "parentNode", {
        // Read-write aliases for properties
        /**
         * Same as {@link parent}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.parent;
        },
        set: function(parent) {
          this.parent = parent;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Node2.prototype, "previousSibling", {
        /**
         * Same as {@link prev}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.prev;
        },
        set: function(prev) {
          this.prev = prev;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Node2.prototype, "nextSibling", {
        /**
         * Same as {@link next}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.next;
        },
        set: function(next) {
          this.next = next;
        },
        enumerable: false,
        configurable: true
      });
      Node2.prototype.cloneNode = function(recursive) {
        if (recursive === void 0) {
          recursive = false;
        }
        return cloneNode(this, recursive);
      };
      return Node2;
    }();
    exports.Node = Node;
    var DataNode = function(_super) {
      __extends(DataNode2, _super);
      function DataNode2(type, data) {
        var _this = _super.call(this, type) || this;
        _this.data = data;
        return _this;
      }
      Object.defineProperty(DataNode2.prototype, "nodeValue", {
        /**
         * Same as {@link data}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.data;
        },
        set: function(data) {
          this.data = data;
        },
        enumerable: false,
        configurable: true
      });
      return DataNode2;
    }(Node);
    exports.DataNode = DataNode;
    var Text = function(_super) {
      __extends(Text2, _super);
      function Text2(data) {
        return _super.call(this, domelementtype_1.ElementType.Text, data) || this;
      }
      return Text2;
    }(DataNode);
    exports.Text = Text;
    var Comment = function(_super) {
      __extends(Comment2, _super);
      function Comment2(data) {
        return _super.call(this, domelementtype_1.ElementType.Comment, data) || this;
      }
      return Comment2;
    }(DataNode);
    exports.Comment = Comment;
    var ProcessingInstruction = function(_super) {
      __extends(ProcessingInstruction2, _super);
      function ProcessingInstruction2(name, data) {
        var _this = _super.call(this, domelementtype_1.ElementType.Directive, data) || this;
        _this.name = name;
        return _this;
      }
      return ProcessingInstruction2;
    }(DataNode);
    exports.ProcessingInstruction = ProcessingInstruction;
    var NodeWithChildren = function(_super) {
      __extends(NodeWithChildren2, _super);
      function NodeWithChildren2(type, children) {
        var _this = _super.call(this, type) || this;
        _this.children = children;
        return _this;
      }
      Object.defineProperty(NodeWithChildren2.prototype, "firstChild", {
        // Aliases
        /** First child of the node. */
        get: function() {
          var _a;
          return (_a = this.children[0]) !== null && _a !== void 0 ? _a : null;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(NodeWithChildren2.prototype, "lastChild", {
        /** Last child of the node. */
        get: function() {
          return this.children.length > 0 ? this.children[this.children.length - 1] : null;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(NodeWithChildren2.prototype, "childNodes", {
        /**
         * Same as {@link children}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.children;
        },
        set: function(children) {
          this.children = children;
        },
        enumerable: false,
        configurable: true
      });
      return NodeWithChildren2;
    }(Node);
    exports.NodeWithChildren = NodeWithChildren;
    var Document = function(_super) {
      __extends(Document2, _super);
      function Document2(children) {
        return _super.call(this, domelementtype_1.ElementType.Root, children) || this;
      }
      return Document2;
    }(NodeWithChildren);
    exports.Document = Document;
    var Element = function(_super) {
      __extends(Element2, _super);
      function Element2(name, attribs, children, type) {
        if (children === void 0) {
          children = [];
        }
        if (type === void 0) {
          type = name === "script" ? domelementtype_1.ElementType.Script : name === "style" ? domelementtype_1.ElementType.Style : domelementtype_1.ElementType.Tag;
        }
        var _this = _super.call(this, type, children) || this;
        _this.name = name;
        _this.attribs = attribs;
        return _this;
      }
      Object.defineProperty(Element2.prototype, "tagName", {
        // DOM Level 1 aliases
        /**
         * Same as {@link name}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.name;
        },
        set: function(name) {
          this.name = name;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Element2.prototype, "attributes", {
        get: function() {
          var _this = this;
          return Object.keys(this.attribs).map(function(name) {
            var _a, _b;
            return {
              name,
              value: _this.attribs[name],
              namespace: (_a = _this["x-attribsNamespace"]) === null || _a === void 0 ? void 0 : _a[name],
              prefix: (_b = _this["x-attribsPrefix"]) === null || _b === void 0 ? void 0 : _b[name]
            };
          });
        },
        enumerable: false,
        configurable: true
      });
      return Element2;
    }(NodeWithChildren);
    exports.Element = Element;
    function isTag(node) {
      return (0, domelementtype_1.isTag)(node);
    }
    exports.isTag = isTag;
    function isCDATA(node) {
      return node.type === domelementtype_1.ElementType.CDATA;
    }
    exports.isCDATA = isCDATA;
    function isText(node) {
      return node.type === domelementtype_1.ElementType.Text;
    }
    exports.isText = isText;
    function isComment(node) {
      return node.type === domelementtype_1.ElementType.Comment;
    }
    exports.isComment = isComment;
    function isDirective(node) {
      return node.type === domelementtype_1.ElementType.Directive;
    }
    exports.isDirective = isDirective;
    function isDocument(node) {
      return node.type === domelementtype_1.ElementType.Root;
    }
    exports.isDocument = isDocument;
    function hasChildren(node) {
      return Object.prototype.hasOwnProperty.call(node, "children");
    }
    exports.hasChildren = hasChildren;
    function cloneNode(node, recursive) {
      if (recursive === void 0) {
        recursive = false;
      }
      var result;
      if (isText(node)) {
        result = new Text(node.data);
      } else if (isComment(node)) {
        result = new Comment(node.data);
      } else if (isTag(node)) {
        var children = recursive ? cloneChildren(node.children) : [];
        var clone_1 = new Element(node.name, __assign({}, node.attribs), children);
        children.forEach(function(child) {
          return child.parent = clone_1;
        });
        if (node.namespace != null) {
          clone_1.namespace = node.namespace;
        }
        if (node["x-attribsNamespace"]) {
          clone_1["x-attribsNamespace"] = __assign({}, node["x-attribsNamespace"]);
        }
        if (node["x-attribsPrefix"]) {
          clone_1["x-attribsPrefix"] = __assign({}, node["x-attribsPrefix"]);
        }
        result = clone_1;
      } else if (isCDATA(node)) {
        var children = recursive ? cloneChildren(node.children) : [];
        var clone_2 = new NodeWithChildren(domelementtype_1.ElementType.CDATA, children);
        children.forEach(function(child) {
          return child.parent = clone_2;
        });
        result = clone_2;
      } else if (isDocument(node)) {
        var children = recursive ? cloneChildren(node.children) : [];
        var clone_3 = new Document(children);
        children.forEach(function(child) {
          return child.parent = clone_3;
        });
        if (node["x-mode"]) {
          clone_3["x-mode"] = node["x-mode"];
        }
        result = clone_3;
      } else if (isDirective(node)) {
        var instruction = new ProcessingInstruction(node.name, node.data);
        if (node["x-name"] != null) {
          instruction["x-name"] = node["x-name"];
          instruction["x-publicId"] = node["x-publicId"];
          instruction["x-systemId"] = node["x-systemId"];
        }
        result = instruction;
      } else {
        throw new Error("Not implemented yet: ".concat(node.type));
      }
      result.startIndex = node.startIndex;
      result.endIndex = node.endIndex;
      if (node.sourceCodeLocation != null) {
        result.sourceCodeLocation = node.sourceCodeLocation;
      }
      return result;
    }
    exports.cloneNode = cloneNode;
    function cloneChildren(childs) {
      var children = childs.map(function(child) {
        return cloneNode(child, true);
      });
      for (var i = 1; i < children.length; i++) {
        children[i].prev = children[i - 1];
        children[i - 1].next = children[i];
      }
      return children;
    }
  }
});

// node_modules/domhandler/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/domhandler/lib/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DomHandler = void 0;
    var domelementtype_1 = require_lib();
    var node_1 = require_node();
    __exportStar(require_node(), exports);
    var reWhitespace = /\s+/g;
    var defaultOpts = {
      normalizeWhitespace: false,
      withStartIndices: false,
      withEndIndices: false,
      xmlMode: false
    };
    var DomHandler = function() {
      function DomHandler2(callback, options, elementCB) {
        this.dom = [];
        this.root = new node_1.Document(this.dom);
        this.done = false;
        this.tagStack = [this.root];
        this.lastNode = null;
        this.parser = null;
        if (typeof options === "function") {
          elementCB = options;
          options = defaultOpts;
        }
        if (typeof callback === "object") {
          options = callback;
          callback = void 0;
        }
        this.callback = callback !== null && callback !== void 0 ? callback : null;
        this.options = options !== null && options !== void 0 ? options : defaultOpts;
        this.elementCB = elementCB !== null && elementCB !== void 0 ? elementCB : null;
      }
      DomHandler2.prototype.onparserinit = function(parser) {
        this.parser = parser;
      };
      DomHandler2.prototype.onreset = function() {
        this.dom = [];
        this.root = new node_1.Document(this.dom);
        this.done = false;
        this.tagStack = [this.root];
        this.lastNode = null;
        this.parser = null;
      };
      DomHandler2.prototype.onend = function() {
        if (this.done)
          return;
        this.done = true;
        this.parser = null;
        this.handleCallback(null);
      };
      DomHandler2.prototype.onerror = function(error) {
        this.handleCallback(error);
      };
      DomHandler2.prototype.onclosetag = function() {
        this.lastNode = null;
        var elem = this.tagStack.pop();
        if (this.options.withEndIndices) {
          elem.endIndex = this.parser.endIndex;
        }
        if (this.elementCB)
          this.elementCB(elem);
      };
      DomHandler2.prototype.onopentag = function(name, attribs) {
        var type = this.options.xmlMode ? domelementtype_1.ElementType.Tag : void 0;
        var element = new node_1.Element(name, attribs, void 0, type);
        this.addNode(element);
        this.tagStack.push(element);
      };
      DomHandler2.prototype.ontext = function(data) {
        var normalizeWhitespace = this.options.normalizeWhitespace;
        var lastNode = this.lastNode;
        if (lastNode && lastNode.type === domelementtype_1.ElementType.Text) {
          if (normalizeWhitespace) {
            lastNode.data = (lastNode.data + data).replace(reWhitespace, " ");
          } else {
            lastNode.data += data;
          }
          if (this.options.withEndIndices) {
            lastNode.endIndex = this.parser.endIndex;
          }
        } else {
          if (normalizeWhitespace) {
            data = data.replace(reWhitespace, " ");
          }
          var node = new node_1.Text(data);
          this.addNode(node);
          this.lastNode = node;
        }
      };
      DomHandler2.prototype.oncomment = function(data) {
        if (this.lastNode && this.lastNode.type === domelementtype_1.ElementType.Comment) {
          this.lastNode.data += data;
          return;
        }
        var node = new node_1.Comment(data);
        this.addNode(node);
        this.lastNode = node;
      };
      DomHandler2.prototype.oncommentend = function() {
        this.lastNode = null;
      };
      DomHandler2.prototype.oncdatastart = function() {
        var text = new node_1.Text("");
        var node = new node_1.NodeWithChildren(domelementtype_1.ElementType.CDATA, [text]);
        this.addNode(node);
        text.parent = node;
        this.lastNode = text;
      };
      DomHandler2.prototype.oncdataend = function() {
        this.lastNode = null;
      };
      DomHandler2.prototype.onprocessinginstruction = function(name, data) {
        var node = new node_1.ProcessingInstruction(name, data);
        this.addNode(node);
      };
      DomHandler2.prototype.handleCallback = function(error) {
        if (typeof this.callback === "function") {
          this.callback(error, this.dom);
        } else if (error) {
          throw error;
        }
      };
      DomHandler2.prototype.addNode = function(node) {
        var parent = this.tagStack[this.tagStack.length - 1];
        var previousSibling = parent.children[parent.children.length - 1];
        if (this.options.withStartIndices) {
          node.startIndex = this.parser.startIndex;
        }
        if (this.options.withEndIndices) {
          node.endIndex = this.parser.endIndex;
        }
        parent.children.push(node);
        if (previousSibling) {
          node.prev = previousSibling;
          previousSibling.next = node;
        }
        node.parent = parent;
        this.lastNode = null;
      };
      return DomHandler2;
    }();
    exports.DomHandler = DomHandler;
    exports.default = DomHandler;
  }
});

// node_modules/entities/lib/decode.js
var require_decode2 = __commonJS({
  "node_modules/entities/lib/decode.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeHTML = exports.decodeHTMLStrict = exports.decodeXML = void 0;
    var entities_json_1 = __importDefault(require_entities());
    var legacy_json_1 = __importDefault(require_legacy());
    var xml_json_1 = __importDefault(require_xml());
    var decode_codepoint_1 = __importDefault(require_decode_codepoint());
    var strictEntityRe = /&(?:[a-zA-Z0-9]+|#[xX][\da-fA-F]+|#\d+);/g;
    exports.decodeXML = getStrictDecoder(xml_json_1.default);
    exports.decodeHTMLStrict = getStrictDecoder(entities_json_1.default);
    function getStrictDecoder(map) {
      var replace = getReplacer(map);
      return function(str) {
        return String(str).replace(strictEntityRe, replace);
      };
    }
    var sorter = function(a, b) {
      return a < b ? 1 : -1;
    };
    exports.decodeHTML = function() {
      var legacy = Object.keys(legacy_json_1.default).sort(sorter);
      var keys = Object.keys(entities_json_1.default).sort(sorter);
      for (var i = 0, j = 0; i < keys.length; i++) {
        if (legacy[j] === keys[i]) {
          keys[i] += ";?";
          j++;
        } else {
          keys[i] += ";";
        }
      }
      var re = new RegExp("&(?:" + keys.join("|") + "|#[xX][\\da-fA-F]+;?|#\\d+;?)", "g");
      var replace = getReplacer(entities_json_1.default);
      function replacer(str) {
        if (str.substr(-1) !== ";")
          str += ";";
        return replace(str);
      }
      return function(str) {
        return String(str).replace(re, replacer);
      };
    }();
    function getReplacer(map) {
      return function replace(str) {
        if (str.charAt(1) === "#") {
          var secondChar = str.charAt(2);
          if (secondChar === "X" || secondChar === "x") {
            return decode_codepoint_1.default(parseInt(str.substr(3), 16));
          }
          return decode_codepoint_1.default(parseInt(str.substr(2), 10));
        }
        return map[str.slice(1, -1)] || str;
      };
    }
  }
});

// node_modules/entities/lib/encode.js
var require_encode = __commonJS({
  "node_modules/entities/lib/encode.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.escapeUTF8 = exports.escape = exports.encodeNonAsciiHTML = exports.encodeHTML = exports.encodeXML = void 0;
    var xml_json_1 = __importDefault(require_xml());
    var inverseXML = getInverseObj(xml_json_1.default);
    var xmlReplacer = getInverseReplacer(inverseXML);
    exports.encodeXML = getASCIIEncoder(inverseXML);
    var entities_json_1 = __importDefault(require_entities());
    var inverseHTML = getInverseObj(entities_json_1.default);
    var htmlReplacer = getInverseReplacer(inverseHTML);
    exports.encodeHTML = getInverse(inverseHTML, htmlReplacer);
    exports.encodeNonAsciiHTML = getASCIIEncoder(inverseHTML);
    function getInverseObj(obj) {
      return Object.keys(obj).sort().reduce(function(inverse, name) {
        inverse[obj[name]] = "&" + name + ";";
        return inverse;
      }, {});
    }
    function getInverseReplacer(inverse) {
      var single = [];
      var multiple = [];
      for (var _i = 0, _a = Object.keys(inverse); _i < _a.length; _i++) {
        var k = _a[_i];
        if (k.length === 1) {
          single.push("\\" + k);
        } else {
          multiple.push(k);
        }
      }
      single.sort();
      for (var start = 0; start < single.length - 1; start++) {
        var end = start;
        while (end < single.length - 1 && single[end].charCodeAt(1) + 1 === single[end + 1].charCodeAt(1)) {
          end += 1;
        }
        var count = 1 + end - start;
        if (count < 3)
          continue;
        single.splice(start, count, single[start] + "-" + single[end]);
      }
      multiple.unshift("[" + single.join("") + "]");
      return new RegExp(multiple.join("|"), "g");
    }
    var reNonASCII = /(?:[\x80-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g;
    var getCodePoint = (
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      String.prototype.codePointAt != null ? (
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        function(str) {
          return str.codePointAt(0);
        }
      ) : (
        // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        function(c) {
          return (c.charCodeAt(0) - 55296) * 1024 + c.charCodeAt(1) - 56320 + 65536;
        }
      )
    );
    function singleCharReplacer(c) {
      return "&#x" + (c.length > 1 ? getCodePoint(c) : c.charCodeAt(0)).toString(16).toUpperCase() + ";";
    }
    function getInverse(inverse, re) {
      return function(data) {
        return data.replace(re, function(name) {
          return inverse[name];
        }).replace(reNonASCII, singleCharReplacer);
      };
    }
    var reEscapeChars = new RegExp(xmlReplacer.source + "|" + reNonASCII.source, "g");
    function escape(data) {
      return data.replace(reEscapeChars, singleCharReplacer);
    }
    exports.escape = escape;
    function escapeUTF8(data) {
      return data.replace(xmlReplacer, singleCharReplacer);
    }
    exports.escapeUTF8 = escapeUTF8;
    function getASCIIEncoder(obj) {
      return function(data) {
        return data.replace(reEscapeChars, function(c) {
          return obj[c] || singleCharReplacer(c);
        });
      };
    }
  }
});

// node_modules/entities/lib/index.js
var require_lib3 = __commonJS({
  "node_modules/entities/lib/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeXMLStrict = exports.decodeHTML5Strict = exports.decodeHTML4Strict = exports.decodeHTML5 = exports.decodeHTML4 = exports.decodeHTMLStrict = exports.decodeHTML = exports.decodeXML = exports.encodeHTML5 = exports.encodeHTML4 = exports.escapeUTF8 = exports.escape = exports.encodeNonAsciiHTML = exports.encodeHTML = exports.encodeXML = exports.encode = exports.decodeStrict = exports.decode = void 0;
    var decode_1 = require_decode2();
    var encode_1 = require_encode();
    function decode(data, level) {
      return (!level || level <= 0 ? decode_1.decodeXML : decode_1.decodeHTML)(data);
    }
    exports.decode = decode;
    function decodeStrict(data, level) {
      return (!level || level <= 0 ? decode_1.decodeXML : decode_1.decodeHTMLStrict)(data);
    }
    exports.decodeStrict = decodeStrict;
    function encode(data, level) {
      return (!level || level <= 0 ? encode_1.encodeXML : encode_1.encodeHTML)(data);
    }
    exports.encode = encode;
    var encode_2 = require_encode();
    Object.defineProperty(exports, "encodeXML", { enumerable: true, get: function() {
      return encode_2.encodeXML;
    } });
    Object.defineProperty(exports, "encodeHTML", { enumerable: true, get: function() {
      return encode_2.encodeHTML;
    } });
    Object.defineProperty(exports, "encodeNonAsciiHTML", { enumerable: true, get: function() {
      return encode_2.encodeNonAsciiHTML;
    } });
    Object.defineProperty(exports, "escape", { enumerable: true, get: function() {
      return encode_2.escape;
    } });
    Object.defineProperty(exports, "escapeUTF8", { enumerable: true, get: function() {
      return encode_2.escapeUTF8;
    } });
    Object.defineProperty(exports, "encodeHTML4", { enumerable: true, get: function() {
      return encode_2.encodeHTML;
    } });
    Object.defineProperty(exports, "encodeHTML5", { enumerable: true, get: function() {
      return encode_2.encodeHTML;
    } });
    var decode_2 = require_decode2();
    Object.defineProperty(exports, "decodeXML", { enumerable: true, get: function() {
      return decode_2.decodeXML;
    } });
    Object.defineProperty(exports, "decodeHTML", { enumerable: true, get: function() {
      return decode_2.decodeHTML;
    } });
    Object.defineProperty(exports, "decodeHTMLStrict", { enumerable: true, get: function() {
      return decode_2.decodeHTMLStrict;
    } });
    Object.defineProperty(exports, "decodeHTML4", { enumerable: true, get: function() {
      return decode_2.decodeHTML;
    } });
    Object.defineProperty(exports, "decodeHTML5", { enumerable: true, get: function() {
      return decode_2.decodeHTML;
    } });
    Object.defineProperty(exports, "decodeHTML4Strict", { enumerable: true, get: function() {
      return decode_2.decodeHTMLStrict;
    } });
    Object.defineProperty(exports, "decodeHTML5Strict", { enumerable: true, get: function() {
      return decode_2.decodeHTMLStrict;
    } });
    Object.defineProperty(exports, "decodeXMLStrict", { enumerable: true, get: function() {
      return decode_2.decodeXML;
    } });
  }
});

// node_modules/dom-serializer/lib/foreignNames.js
var require_foreignNames = __commonJS({
  "node_modules/dom-serializer/lib/foreignNames.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.attributeNames = exports.elementNames = void 0;
    exports.elementNames = /* @__PURE__ */ new Map([
      ["altglyph", "altGlyph"],
      ["altglyphdef", "altGlyphDef"],
      ["altglyphitem", "altGlyphItem"],
      ["animatecolor", "animateColor"],
      ["animatemotion", "animateMotion"],
      ["animatetransform", "animateTransform"],
      ["clippath", "clipPath"],
      ["feblend", "feBlend"],
      ["fecolormatrix", "feColorMatrix"],
      ["fecomponenttransfer", "feComponentTransfer"],
      ["fecomposite", "feComposite"],
      ["feconvolvematrix", "feConvolveMatrix"],
      ["fediffuselighting", "feDiffuseLighting"],
      ["fedisplacementmap", "feDisplacementMap"],
      ["fedistantlight", "feDistantLight"],
      ["fedropshadow", "feDropShadow"],
      ["feflood", "feFlood"],
      ["fefunca", "feFuncA"],
      ["fefuncb", "feFuncB"],
      ["fefuncg", "feFuncG"],
      ["fefuncr", "feFuncR"],
      ["fegaussianblur", "feGaussianBlur"],
      ["feimage", "feImage"],
      ["femerge", "feMerge"],
      ["femergenode", "feMergeNode"],
      ["femorphology", "feMorphology"],
      ["feoffset", "feOffset"],
      ["fepointlight", "fePointLight"],
      ["fespecularlighting", "feSpecularLighting"],
      ["fespotlight", "feSpotLight"],
      ["fetile", "feTile"],
      ["feturbulence", "feTurbulence"],
      ["foreignobject", "foreignObject"],
      ["glyphref", "glyphRef"],
      ["lineargradient", "linearGradient"],
      ["radialgradient", "radialGradient"],
      ["textpath", "textPath"]
    ]);
    exports.attributeNames = /* @__PURE__ */ new Map([
      ["definitionurl", "definitionURL"],
      ["attributename", "attributeName"],
      ["attributetype", "attributeType"],
      ["basefrequency", "baseFrequency"],
      ["baseprofile", "baseProfile"],
      ["calcmode", "calcMode"],
      ["clippathunits", "clipPathUnits"],
      ["diffuseconstant", "diffuseConstant"],
      ["edgemode", "edgeMode"],
      ["filterunits", "filterUnits"],
      ["glyphref", "glyphRef"],
      ["gradienttransform", "gradientTransform"],
      ["gradientunits", "gradientUnits"],
      ["kernelmatrix", "kernelMatrix"],
      ["kernelunitlength", "kernelUnitLength"],
      ["keypoints", "keyPoints"],
      ["keysplines", "keySplines"],
      ["keytimes", "keyTimes"],
      ["lengthadjust", "lengthAdjust"],
      ["limitingconeangle", "limitingConeAngle"],
      ["markerheight", "markerHeight"],
      ["markerunits", "markerUnits"],
      ["markerwidth", "markerWidth"],
      ["maskcontentunits", "maskContentUnits"],
      ["maskunits", "maskUnits"],
      ["numoctaves", "numOctaves"],
      ["pathlength", "pathLength"],
      ["patterncontentunits", "patternContentUnits"],
      ["patterntransform", "patternTransform"],
      ["patternunits", "patternUnits"],
      ["pointsatx", "pointsAtX"],
      ["pointsaty", "pointsAtY"],
      ["pointsatz", "pointsAtZ"],
      ["preservealpha", "preserveAlpha"],
      ["preserveaspectratio", "preserveAspectRatio"],
      ["primitiveunits", "primitiveUnits"],
      ["refx", "refX"],
      ["refy", "refY"],
      ["repeatcount", "repeatCount"],
      ["repeatdur", "repeatDur"],
      ["requiredextensions", "requiredExtensions"],
      ["requiredfeatures", "requiredFeatures"],
      ["specularconstant", "specularConstant"],
      ["specularexponent", "specularExponent"],
      ["spreadmethod", "spreadMethod"],
      ["startoffset", "startOffset"],
      ["stddeviation", "stdDeviation"],
      ["stitchtiles", "stitchTiles"],
      ["surfacescale", "surfaceScale"],
      ["systemlanguage", "systemLanguage"],
      ["tablevalues", "tableValues"],
      ["targetx", "targetX"],
      ["targety", "targetY"],
      ["textlength", "textLength"],
      ["viewbox", "viewBox"],
      ["viewtarget", "viewTarget"],
      ["xchannelselector", "xChannelSelector"],
      ["ychannelselector", "yChannelSelector"],
      ["zoomandpan", "zoomAndPan"]
    ]);
  }
});

// node_modules/dom-serializer/lib/index.js
var require_lib4 = __commonJS({
  "node_modules/dom-serializer/lib/index.js"(exports) {
    "use strict";
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var ElementType = __importStar(require_lib());
    var entities_1 = require_lib3();
    var foreignNames_1 = require_foreignNames();
    var unencodedElements = /* @__PURE__ */ new Set([
      "style",
      "script",
      "xmp",
      "iframe",
      "noembed",
      "noframes",
      "plaintext",
      "noscript"
    ]);
    function formatAttributes(attributes, opts) {
      if (!attributes)
        return;
      return Object.keys(attributes).map(function(key) {
        var _a, _b;
        var value = (_a = attributes[key]) !== null && _a !== void 0 ? _a : "";
        if (opts.xmlMode === "foreign") {
          key = (_b = foreignNames_1.attributeNames.get(key)) !== null && _b !== void 0 ? _b : key;
        }
        if (!opts.emptyAttrs && !opts.xmlMode && value === "") {
          return key;
        }
        return key + '="' + (opts.decodeEntities !== false ? entities_1.encodeXML(value) : value.replace(/"/g, "&quot;")) + '"';
      }).join(" ");
    }
    var singleTag = /* @__PURE__ */ new Set([
      "area",
      "base",
      "basefont",
      "br",
      "col",
      "command",
      "embed",
      "frame",
      "hr",
      "img",
      "input",
      "isindex",
      "keygen",
      "link",
      "meta",
      "param",
      "source",
      "track",
      "wbr"
    ]);
    function render(node, options) {
      if (options === void 0) {
        options = {};
      }
      var nodes = "length" in node ? node : [node];
      var output = "";
      for (var i = 0; i < nodes.length; i++) {
        output += renderNode(nodes[i], options);
      }
      return output;
    }
    exports.default = render;
    function renderNode(node, options) {
      switch (node.type) {
        case ElementType.Root:
          return render(node.children, options);
        case ElementType.Directive:
        case ElementType.Doctype:
          return renderDirective(node);
        case ElementType.Comment:
          return renderComment(node);
        case ElementType.CDATA:
          return renderCdata(node);
        case ElementType.Script:
        case ElementType.Style:
        case ElementType.Tag:
          return renderTag(node, options);
        case ElementType.Text:
          return renderText(node, options);
      }
    }
    var foreignModeIntegrationPoints = /* @__PURE__ */ new Set([
      "mi",
      "mo",
      "mn",
      "ms",
      "mtext",
      "annotation-xml",
      "foreignObject",
      "desc",
      "title"
    ]);
    var foreignElements = /* @__PURE__ */ new Set(["svg", "math"]);
    function renderTag(elem, opts) {
      var _a;
      if (opts.xmlMode === "foreign") {
        elem.name = (_a = foreignNames_1.elementNames.get(elem.name)) !== null && _a !== void 0 ? _a : elem.name;
        if (elem.parent && foreignModeIntegrationPoints.has(elem.parent.name)) {
          opts = __assign(__assign({}, opts), { xmlMode: false });
        }
      }
      if (!opts.xmlMode && foreignElements.has(elem.name)) {
        opts = __assign(__assign({}, opts), { xmlMode: "foreign" });
      }
      var tag = "<" + elem.name;
      var attribs = formatAttributes(elem.attribs, opts);
      if (attribs) {
        tag += " " + attribs;
      }
      if (elem.children.length === 0 && (opts.xmlMode ? (
        // In XML mode or foreign mode, and user hasn't explicitly turned off self-closing tags
        opts.selfClosingTags !== false
      ) : (
        // User explicitly asked for self-closing tags, even in HTML mode
        opts.selfClosingTags && singleTag.has(elem.name)
      ))) {
        if (!opts.xmlMode)
          tag += " ";
        tag += "/>";
      } else {
        tag += ">";
        if (elem.children.length > 0) {
          tag += render(elem.children, opts);
        }
        if (opts.xmlMode || !singleTag.has(elem.name)) {
          tag += "</" + elem.name + ">";
        }
      }
      return tag;
    }
    function renderDirective(elem) {
      return "<" + elem.data + ">";
    }
    function renderText(elem, opts) {
      var data = elem.data || "";
      if (opts.decodeEntities !== false && !(!opts.xmlMode && elem.parent && unencodedElements.has(elem.parent.name))) {
        data = entities_1.encodeXML(data);
      }
      return data;
    }
    function renderCdata(elem) {
      return "<![CDATA[" + elem.children[0].data + "]]>";
    }
    function renderComment(elem) {
      return "<!--" + elem.data + "-->";
    }
  }
});

// node_modules/domutils/lib/stringify.js
var require_stringify = __commonJS({
  "node_modules/domutils/lib/stringify.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.innerText = exports.textContent = exports.getText = exports.getInnerHTML = exports.getOuterHTML = void 0;
    var domhandler_1 = require_lib2();
    var dom_serializer_1 = __importDefault(require_lib4());
    var domelementtype_1 = require_lib();
    function getOuterHTML(node, options) {
      return (0, dom_serializer_1.default)(node, options);
    }
    exports.getOuterHTML = getOuterHTML;
    function getInnerHTML(node, options) {
      return (0, domhandler_1.hasChildren)(node) ? node.children.map(function(node2) {
        return getOuterHTML(node2, options);
      }).join("") : "";
    }
    exports.getInnerHTML = getInnerHTML;
    function getText(node) {
      if (Array.isArray(node))
        return node.map(getText).join("");
      if ((0, domhandler_1.isTag)(node))
        return node.name === "br" ? "\n" : getText(node.children);
      if ((0, domhandler_1.isCDATA)(node))
        return getText(node.children);
      if ((0, domhandler_1.isText)(node))
        return node.data;
      return "";
    }
    exports.getText = getText;
    function textContent(node) {
      if (Array.isArray(node))
        return node.map(textContent).join("");
      if ((0, domhandler_1.hasChildren)(node) && !(0, domhandler_1.isComment)(node)) {
        return textContent(node.children);
      }
      if ((0, domhandler_1.isText)(node))
        return node.data;
      return "";
    }
    exports.textContent = textContent;
    function innerText(node) {
      if (Array.isArray(node))
        return node.map(innerText).join("");
      if ((0, domhandler_1.hasChildren)(node) && (node.type === domelementtype_1.ElementType.Tag || (0, domhandler_1.isCDATA)(node))) {
        return innerText(node.children);
      }
      if ((0, domhandler_1.isText)(node))
        return node.data;
      return "";
    }
    exports.innerText = innerText;
  }
});

// node_modules/domutils/lib/traversal.js
var require_traversal = __commonJS({
  "node_modules/domutils/lib/traversal.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.prevElementSibling = exports.nextElementSibling = exports.getName = exports.hasAttrib = exports.getAttributeValue = exports.getSiblings = exports.getParent = exports.getChildren = void 0;
    var domhandler_1 = require_lib2();
    var emptyArray = [];
    function getChildren(elem) {
      var _a;
      return (_a = elem.children) !== null && _a !== void 0 ? _a : emptyArray;
    }
    exports.getChildren = getChildren;
    function getParent(elem) {
      return elem.parent || null;
    }
    exports.getParent = getParent;
    function getSiblings(elem) {
      var _a, _b;
      var parent = getParent(elem);
      if (parent != null)
        return getChildren(parent);
      var siblings = [elem];
      var prev = elem.prev, next = elem.next;
      while (prev != null) {
        siblings.unshift(prev);
        _a = prev, prev = _a.prev;
      }
      while (next != null) {
        siblings.push(next);
        _b = next, next = _b.next;
      }
      return siblings;
    }
    exports.getSiblings = getSiblings;
    function getAttributeValue(elem, name) {
      var _a;
      return (_a = elem.attribs) === null || _a === void 0 ? void 0 : _a[name];
    }
    exports.getAttributeValue = getAttributeValue;
    function hasAttrib(elem, name) {
      return elem.attribs != null && Object.prototype.hasOwnProperty.call(elem.attribs, name) && elem.attribs[name] != null;
    }
    exports.hasAttrib = hasAttrib;
    function getName(elem) {
      return elem.name;
    }
    exports.getName = getName;
    function nextElementSibling(elem) {
      var _a;
      var next = elem.next;
      while (next !== null && !(0, domhandler_1.isTag)(next))
        _a = next, next = _a.next;
      return next;
    }
    exports.nextElementSibling = nextElementSibling;
    function prevElementSibling(elem) {
      var _a;
      var prev = elem.prev;
      while (prev !== null && !(0, domhandler_1.isTag)(prev))
        _a = prev, prev = _a.prev;
      return prev;
    }
    exports.prevElementSibling = prevElementSibling;
  }
});

// node_modules/domutils/lib/manipulation.js
var require_manipulation = __commonJS({
  "node_modules/domutils/lib/manipulation.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.prepend = exports.prependChild = exports.append = exports.appendChild = exports.replaceElement = exports.removeElement = void 0;
    function removeElement(elem) {
      if (elem.prev)
        elem.prev.next = elem.next;
      if (elem.next)
        elem.next.prev = elem.prev;
      if (elem.parent) {
        var childs = elem.parent.children;
        childs.splice(childs.lastIndexOf(elem), 1);
      }
    }
    exports.removeElement = removeElement;
    function replaceElement(elem, replacement) {
      var prev = replacement.prev = elem.prev;
      if (prev) {
        prev.next = replacement;
      }
      var next = replacement.next = elem.next;
      if (next) {
        next.prev = replacement;
      }
      var parent = replacement.parent = elem.parent;
      if (parent) {
        var childs = parent.children;
        childs[childs.lastIndexOf(elem)] = replacement;
      }
    }
    exports.replaceElement = replaceElement;
    function appendChild(elem, child) {
      removeElement(child);
      child.next = null;
      child.parent = elem;
      if (elem.children.push(child) > 1) {
        var sibling = elem.children[elem.children.length - 2];
        sibling.next = child;
        child.prev = sibling;
      } else {
        child.prev = null;
      }
    }
    exports.appendChild = appendChild;
    function append(elem, next) {
      removeElement(next);
      var parent = elem.parent;
      var currNext = elem.next;
      next.next = currNext;
      next.prev = elem;
      elem.next = next;
      next.parent = parent;
      if (currNext) {
        currNext.prev = next;
        if (parent) {
          var childs = parent.children;
          childs.splice(childs.lastIndexOf(currNext), 0, next);
        }
      } else if (parent) {
        parent.children.push(next);
      }
    }
    exports.append = append;
    function prependChild(elem, child) {
      removeElement(child);
      child.parent = elem;
      child.prev = null;
      if (elem.children.unshift(child) !== 1) {
        var sibling = elem.children[1];
        sibling.prev = child;
        child.next = sibling;
      } else {
        child.next = null;
      }
    }
    exports.prependChild = prependChild;
    function prepend(elem, prev) {
      removeElement(prev);
      var parent = elem.parent;
      if (parent) {
        var childs = parent.children;
        childs.splice(childs.indexOf(elem), 0, prev);
      }
      if (elem.prev) {
        elem.prev.next = prev;
      }
      prev.parent = parent;
      prev.prev = elem.prev;
      prev.next = elem;
      elem.prev = prev;
    }
    exports.prepend = prepend;
  }
});

// node_modules/domutils/lib/querying.js
var require_querying = __commonJS({
  "node_modules/domutils/lib/querying.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.findAll = exports.existsOne = exports.findOne = exports.findOneChild = exports.find = exports.filter = void 0;
    var domhandler_1 = require_lib2();
    function filter(test, node, recurse, limit) {
      if (recurse === void 0) {
        recurse = true;
      }
      if (limit === void 0) {
        limit = Infinity;
      }
      if (!Array.isArray(node))
        node = [node];
      return find(test, node, recurse, limit);
    }
    exports.filter = filter;
    function find(test, nodes, recurse, limit) {
      var result = [];
      for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
        var elem = nodes_1[_i];
        if (test(elem)) {
          result.push(elem);
          if (--limit <= 0)
            break;
        }
        if (recurse && (0, domhandler_1.hasChildren)(elem) && elem.children.length > 0) {
          var children = find(test, elem.children, recurse, limit);
          result.push.apply(result, children);
          limit -= children.length;
          if (limit <= 0)
            break;
        }
      }
      return result;
    }
    exports.find = find;
    function findOneChild(test, nodes) {
      return nodes.find(test);
    }
    exports.findOneChild = findOneChild;
    function findOne(test, nodes, recurse) {
      if (recurse === void 0) {
        recurse = true;
      }
      var elem = null;
      for (var i = 0; i < nodes.length && !elem; i++) {
        var checked = nodes[i];
        if (!(0, domhandler_1.isTag)(checked)) {
          continue;
        } else if (test(checked)) {
          elem = checked;
        } else if (recurse && checked.children.length > 0) {
          elem = findOne(test, checked.children);
        }
      }
      return elem;
    }
    exports.findOne = findOne;
    function existsOne(test, nodes) {
      return nodes.some(function(checked) {
        return (0, domhandler_1.isTag)(checked) && (test(checked) || checked.children.length > 0 && existsOne(test, checked.children));
      });
    }
    exports.existsOne = existsOne;
    function findAll(test, nodes) {
      var _a;
      var result = [];
      var stack = nodes.filter(domhandler_1.isTag);
      var elem;
      while (elem = stack.shift()) {
        var children = (_a = elem.children) === null || _a === void 0 ? void 0 : _a.filter(domhandler_1.isTag);
        if (children && children.length > 0) {
          stack.unshift.apply(stack, children);
        }
        if (test(elem))
          result.push(elem);
      }
      return result;
    }
    exports.findAll = findAll;
  }
});

// node_modules/domutils/lib/legacy.js
var require_legacy2 = __commonJS({
  "node_modules/domutils/lib/legacy.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getElementsByTagType = exports.getElementsByTagName = exports.getElementById = exports.getElements = exports.testElement = void 0;
    var domhandler_1 = require_lib2();
    var querying_1 = require_querying();
    var Checks = {
      tag_name: function(name) {
        if (typeof name === "function") {
          return function(elem) {
            return (0, domhandler_1.isTag)(elem) && name(elem.name);
          };
        } else if (name === "*") {
          return domhandler_1.isTag;
        }
        return function(elem) {
          return (0, domhandler_1.isTag)(elem) && elem.name === name;
        };
      },
      tag_type: function(type) {
        if (typeof type === "function") {
          return function(elem) {
            return type(elem.type);
          };
        }
        return function(elem) {
          return elem.type === type;
        };
      },
      tag_contains: function(data) {
        if (typeof data === "function") {
          return function(elem) {
            return (0, domhandler_1.isText)(elem) && data(elem.data);
          };
        }
        return function(elem) {
          return (0, domhandler_1.isText)(elem) && elem.data === data;
        };
      }
    };
    function getAttribCheck(attrib, value) {
      if (typeof value === "function") {
        return function(elem) {
          return (0, domhandler_1.isTag)(elem) && value(elem.attribs[attrib]);
        };
      }
      return function(elem) {
        return (0, domhandler_1.isTag)(elem) && elem.attribs[attrib] === value;
      };
    }
    function combineFuncs(a, b) {
      return function(elem) {
        return a(elem) || b(elem);
      };
    }
    function compileTest(options) {
      var funcs = Object.keys(options).map(function(key) {
        var value = options[key];
        return Object.prototype.hasOwnProperty.call(Checks, key) ? Checks[key](value) : getAttribCheck(key, value);
      });
      return funcs.length === 0 ? null : funcs.reduce(combineFuncs);
    }
    function testElement(options, node) {
      var test = compileTest(options);
      return test ? test(node) : true;
    }
    exports.testElement = testElement;
    function getElements(options, nodes, recurse, limit) {
      if (limit === void 0) {
        limit = Infinity;
      }
      var test = compileTest(options);
      return test ? (0, querying_1.filter)(test, nodes, recurse, limit) : [];
    }
    exports.getElements = getElements;
    function getElementById(id, nodes, recurse) {
      if (recurse === void 0) {
        recurse = true;
      }
      if (!Array.isArray(nodes))
        nodes = [nodes];
      return (0, querying_1.findOne)(getAttribCheck("id", id), nodes, recurse);
    }
    exports.getElementById = getElementById;
    function getElementsByTagName(tagName, nodes, recurse, limit) {
      if (recurse === void 0) {
        recurse = true;
      }
      if (limit === void 0) {
        limit = Infinity;
      }
      return (0, querying_1.filter)(Checks.tag_name(tagName), nodes, recurse, limit);
    }
    exports.getElementsByTagName = getElementsByTagName;
    function getElementsByTagType(type, nodes, recurse, limit) {
      if (recurse === void 0) {
        recurse = true;
      }
      if (limit === void 0) {
        limit = Infinity;
      }
      return (0, querying_1.filter)(Checks.tag_type(type), nodes, recurse, limit);
    }
    exports.getElementsByTagType = getElementsByTagType;
  }
});

// node_modules/domutils/lib/helpers.js
var require_helpers = __commonJS({
  "node_modules/domutils/lib/helpers.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.uniqueSort = exports.compareDocumentPosition = exports.removeSubsets = void 0;
    var domhandler_1 = require_lib2();
    function removeSubsets(nodes) {
      var idx = nodes.length;
      while (--idx >= 0) {
        var node = nodes[idx];
        if (idx > 0 && nodes.lastIndexOf(node, idx - 1) >= 0) {
          nodes.splice(idx, 1);
          continue;
        }
        for (var ancestor = node.parent; ancestor; ancestor = ancestor.parent) {
          if (nodes.includes(ancestor)) {
            nodes.splice(idx, 1);
            break;
          }
        }
      }
      return nodes;
    }
    exports.removeSubsets = removeSubsets;
    function compareDocumentPosition(nodeA, nodeB) {
      var aParents = [];
      var bParents = [];
      if (nodeA === nodeB) {
        return 0;
      }
      var current = (0, domhandler_1.hasChildren)(nodeA) ? nodeA : nodeA.parent;
      while (current) {
        aParents.unshift(current);
        current = current.parent;
      }
      current = (0, domhandler_1.hasChildren)(nodeB) ? nodeB : nodeB.parent;
      while (current) {
        bParents.unshift(current);
        current = current.parent;
      }
      var maxIdx = Math.min(aParents.length, bParents.length);
      var idx = 0;
      while (idx < maxIdx && aParents[idx] === bParents[idx]) {
        idx++;
      }
      if (idx === 0) {
        return 1;
      }
      var sharedParent = aParents[idx - 1];
      var siblings = sharedParent.children;
      var aSibling = aParents[idx];
      var bSibling = bParents[idx];
      if (siblings.indexOf(aSibling) > siblings.indexOf(bSibling)) {
        if (sharedParent === nodeB) {
          return 4 | 16;
        }
        return 4;
      }
      if (sharedParent === nodeA) {
        return 2 | 8;
      }
      return 2;
    }
    exports.compareDocumentPosition = compareDocumentPosition;
    function uniqueSort(nodes) {
      nodes = nodes.filter(function(node, i, arr) {
        return !arr.includes(node, i + 1);
      });
      nodes.sort(function(a, b) {
        var relative = compareDocumentPosition(a, b);
        if (relative & 2) {
          return -1;
        } else if (relative & 4) {
          return 1;
        }
        return 0;
      });
      return nodes;
    }
    exports.uniqueSort = uniqueSort;
  }
});

// node_modules/domutils/lib/feeds.js
var require_feeds = __commonJS({
  "node_modules/domutils/lib/feeds.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getFeed = void 0;
    var stringify_1 = require_stringify();
    var legacy_1 = require_legacy2();
    function getFeed(doc) {
      var feedRoot = getOneElement(isValidFeed, doc);
      return !feedRoot ? null : feedRoot.name === "feed" ? getAtomFeed(feedRoot) : getRssFeed(feedRoot);
    }
    exports.getFeed = getFeed;
    function getAtomFeed(feedRoot) {
      var _a;
      var childs = feedRoot.children;
      var feed = {
        type: "atom",
        items: (0, legacy_1.getElementsByTagName)("entry", childs).map(function(item) {
          var _a2;
          var children = item.children;
          var entry = { media: getMediaElements(children) };
          addConditionally(entry, "id", "id", children);
          addConditionally(entry, "title", "title", children);
          var href2 = (_a2 = getOneElement("link", children)) === null || _a2 === void 0 ? void 0 : _a2.attribs.href;
          if (href2) {
            entry.link = href2;
          }
          var description = fetch("summary", children) || fetch("content", children);
          if (description) {
            entry.description = description;
          }
          var pubDate = fetch("updated", children);
          if (pubDate) {
            entry.pubDate = new Date(pubDate);
          }
          return entry;
        })
      };
      addConditionally(feed, "id", "id", childs);
      addConditionally(feed, "title", "title", childs);
      var href = (_a = getOneElement("link", childs)) === null || _a === void 0 ? void 0 : _a.attribs.href;
      if (href) {
        feed.link = href;
      }
      addConditionally(feed, "description", "subtitle", childs);
      var updated = fetch("updated", childs);
      if (updated) {
        feed.updated = new Date(updated);
      }
      addConditionally(feed, "author", "email", childs, true);
      return feed;
    }
    function getRssFeed(feedRoot) {
      var _a, _b;
      var childs = (_b = (_a = getOneElement("channel", feedRoot.children)) === null || _a === void 0 ? void 0 : _a.children) !== null && _b !== void 0 ? _b : [];
      var feed = {
        type: feedRoot.name.substr(0, 3),
        id: "",
        items: (0, legacy_1.getElementsByTagName)("item", feedRoot.children).map(function(item) {
          var children = item.children;
          var entry = { media: getMediaElements(children) };
          addConditionally(entry, "id", "guid", children);
          addConditionally(entry, "title", "title", children);
          addConditionally(entry, "link", "link", children);
          addConditionally(entry, "description", "description", children);
          var pubDate = fetch("pubDate", children);
          if (pubDate)
            entry.pubDate = new Date(pubDate);
          return entry;
        })
      };
      addConditionally(feed, "title", "title", childs);
      addConditionally(feed, "link", "link", childs);
      addConditionally(feed, "description", "description", childs);
      var updated = fetch("lastBuildDate", childs);
      if (updated) {
        feed.updated = new Date(updated);
      }
      addConditionally(feed, "author", "managingEditor", childs, true);
      return feed;
    }
    var MEDIA_KEYS_STRING = ["url", "type", "lang"];
    var MEDIA_KEYS_INT = [
      "fileSize",
      "bitrate",
      "framerate",
      "samplingrate",
      "channels",
      "duration",
      "height",
      "width"
    ];
    function getMediaElements(where) {
      return (0, legacy_1.getElementsByTagName)("media:content", where).map(function(elem) {
        var attribs = elem.attribs;
        var media = {
          medium: attribs.medium,
          isDefault: !!attribs.isDefault
        };
        for (var _i = 0, MEDIA_KEYS_STRING_1 = MEDIA_KEYS_STRING; _i < MEDIA_KEYS_STRING_1.length; _i++) {
          var attrib = MEDIA_KEYS_STRING_1[_i];
          if (attribs[attrib]) {
            media[attrib] = attribs[attrib];
          }
        }
        for (var _a = 0, MEDIA_KEYS_INT_1 = MEDIA_KEYS_INT; _a < MEDIA_KEYS_INT_1.length; _a++) {
          var attrib = MEDIA_KEYS_INT_1[_a];
          if (attribs[attrib]) {
            media[attrib] = parseInt(attribs[attrib], 10);
          }
        }
        if (attribs.expression) {
          media.expression = attribs.expression;
        }
        return media;
      });
    }
    function getOneElement(tagName, node) {
      return (0, legacy_1.getElementsByTagName)(tagName, node, true, 1)[0];
    }
    function fetch(tagName, where, recurse) {
      if (recurse === void 0) {
        recurse = false;
      }
      return (0, stringify_1.textContent)((0, legacy_1.getElementsByTagName)(tagName, where, recurse, 1)).trim();
    }
    function addConditionally(obj, prop, tagName, where, recurse) {
      if (recurse === void 0) {
        recurse = false;
      }
      var val = fetch(tagName, where, recurse);
      if (val)
        obj[prop] = val;
    }
    function isValidFeed(value) {
      return value === "rss" || value === "feed" || value === "rdf:RDF";
    }
  }
});

// node_modules/domutils/lib/index.js
var require_lib5 = __commonJS({
  "node_modules/domutils/lib/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hasChildren = exports.isDocument = exports.isComment = exports.isText = exports.isCDATA = exports.isTag = void 0;
    __exportStar(require_stringify(), exports);
    __exportStar(require_traversal(), exports);
    __exportStar(require_manipulation(), exports);
    __exportStar(require_querying(), exports);
    __exportStar(require_legacy2(), exports);
    __exportStar(require_helpers(), exports);
    __exportStar(require_feeds(), exports);
    var domhandler_1 = require_lib2();
    Object.defineProperty(exports, "isTag", { enumerable: true, get: function() {
      return domhandler_1.isTag;
    } });
    Object.defineProperty(exports, "isCDATA", { enumerable: true, get: function() {
      return domhandler_1.isCDATA;
    } });
    Object.defineProperty(exports, "isText", { enumerable: true, get: function() {
      return domhandler_1.isText;
    } });
    Object.defineProperty(exports, "isComment", { enumerable: true, get: function() {
      return domhandler_1.isComment;
    } });
    Object.defineProperty(exports, "isDocument", { enumerable: true, get: function() {
      return domhandler_1.isDocument;
    } });
    Object.defineProperty(exports, "hasChildren", { enumerable: true, get: function() {
      return domhandler_1.hasChildren;
    } });
  }
});

// node_modules/htmlparser2/lib/FeedHandler.js
var require_FeedHandler = __commonJS({
  "node_modules/htmlparser2/lib/FeedHandler.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseFeed = exports.FeedHandler = void 0;
    var domhandler_1 = __importDefault(require_lib2());
    var DomUtils = __importStar(require_lib5());
    var Parser_1 = require_Parser();
    var FeedItemMediaMedium;
    (function(FeedItemMediaMedium2) {
      FeedItemMediaMedium2[FeedItemMediaMedium2["image"] = 0] = "image";
      FeedItemMediaMedium2[FeedItemMediaMedium2["audio"] = 1] = "audio";
      FeedItemMediaMedium2[FeedItemMediaMedium2["video"] = 2] = "video";
      FeedItemMediaMedium2[FeedItemMediaMedium2["document"] = 3] = "document";
      FeedItemMediaMedium2[FeedItemMediaMedium2["executable"] = 4] = "executable";
    })(FeedItemMediaMedium || (FeedItemMediaMedium = {}));
    var FeedItemMediaExpression;
    (function(FeedItemMediaExpression2) {
      FeedItemMediaExpression2[FeedItemMediaExpression2["sample"] = 0] = "sample";
      FeedItemMediaExpression2[FeedItemMediaExpression2["full"] = 1] = "full";
      FeedItemMediaExpression2[FeedItemMediaExpression2["nonstop"] = 2] = "nonstop";
    })(FeedItemMediaExpression || (FeedItemMediaExpression = {}));
    var FeedHandler = function(_super) {
      __extends(FeedHandler2, _super);
      function FeedHandler2(callback, options) {
        var _this = this;
        if (typeof callback === "object") {
          callback = void 0;
          options = callback;
        }
        _this = _super.call(this, callback, options) || this;
        return _this;
      }
      FeedHandler2.prototype.onend = function() {
        var _a, _b;
        var feedRoot = getOneElement(isValidFeed, this.dom);
        if (!feedRoot) {
          this.handleCallback(new Error("couldn't find root of feed"));
          return;
        }
        var feed = {};
        if (feedRoot.name === "feed") {
          var childs = feedRoot.children;
          feed.type = "atom";
          addConditionally(feed, "id", "id", childs);
          addConditionally(feed, "title", "title", childs);
          var href = getAttribute("href", getOneElement("link", childs));
          if (href) {
            feed.link = href;
          }
          addConditionally(feed, "description", "subtitle", childs);
          var updated = fetch("updated", childs);
          if (updated) {
            feed.updated = new Date(updated);
          }
          addConditionally(feed, "author", "email", childs, true);
          feed.items = getElements("entry", childs).map(function(item) {
            var entry = {};
            var children = item.children;
            addConditionally(entry, "id", "id", children);
            addConditionally(entry, "title", "title", children);
            var href2 = getAttribute("href", getOneElement("link", children));
            if (href2) {
              entry.link = href2;
            }
            var description = fetch("summary", children) || fetch("content", children);
            if (description) {
              entry.description = description;
            }
            var pubDate = fetch("updated", children);
            if (pubDate) {
              entry.pubDate = new Date(pubDate);
            }
            entry.media = getMediaElements(children);
            return entry;
          });
        } else {
          var childs = (_b = (_a = getOneElement("channel", feedRoot.children)) === null || _a === void 0 ? void 0 : _a.children) !== null && _b !== void 0 ? _b : [];
          feed.type = feedRoot.name.substr(0, 3);
          feed.id = "";
          addConditionally(feed, "title", "title", childs);
          addConditionally(feed, "link", "link", childs);
          addConditionally(feed, "description", "description", childs);
          var updated = fetch("lastBuildDate", childs);
          if (updated) {
            feed.updated = new Date(updated);
          }
          addConditionally(feed, "author", "managingEditor", childs, true);
          feed.items = getElements("item", feedRoot.children).map(function(item) {
            var entry = {};
            var children = item.children;
            addConditionally(entry, "id", "guid", children);
            addConditionally(entry, "title", "title", children);
            addConditionally(entry, "link", "link", children);
            addConditionally(entry, "description", "description", children);
            var pubDate = fetch("pubDate", children);
            if (pubDate)
              entry.pubDate = new Date(pubDate);
            entry.media = getMediaElements(children);
            return entry;
          });
        }
        this.feed = feed;
        this.handleCallback(null);
      };
      return FeedHandler2;
    }(domhandler_1.default);
    exports.FeedHandler = FeedHandler;
    function getMediaElements(where) {
      return getElements("media:content", where).map(function(elem) {
        var media = {
          medium: elem.attribs.medium,
          isDefault: !!elem.attribs.isDefault
        };
        if (elem.attribs.url) {
          media.url = elem.attribs.url;
        }
        if (elem.attribs.fileSize) {
          media.fileSize = parseInt(elem.attribs.fileSize, 10);
        }
        if (elem.attribs.type) {
          media.type = elem.attribs.type;
        }
        if (elem.attribs.expression) {
          media.expression = elem.attribs.expression;
        }
        if (elem.attribs.bitrate) {
          media.bitrate = parseInt(elem.attribs.bitrate, 10);
        }
        if (elem.attribs.framerate) {
          media.framerate = parseInt(elem.attribs.framerate, 10);
        }
        if (elem.attribs.samplingrate) {
          media.samplingrate = parseInt(elem.attribs.samplingrate, 10);
        }
        if (elem.attribs.channels) {
          media.channels = parseInt(elem.attribs.channels, 10);
        }
        if (elem.attribs.duration) {
          media.duration = parseInt(elem.attribs.duration, 10);
        }
        if (elem.attribs.height) {
          media.height = parseInt(elem.attribs.height, 10);
        }
        if (elem.attribs.width) {
          media.width = parseInt(elem.attribs.width, 10);
        }
        if (elem.attribs.lang) {
          media.lang = elem.attribs.lang;
        }
        return media;
      });
    }
    function getElements(tagName, where) {
      return DomUtils.getElementsByTagName(tagName, where, true);
    }
    function getOneElement(tagName, node) {
      return DomUtils.getElementsByTagName(tagName, node, true, 1)[0];
    }
    function fetch(tagName, where, recurse) {
      if (recurse === void 0) {
        recurse = false;
      }
      return DomUtils.getText(DomUtils.getElementsByTagName(tagName, where, recurse, 1)).trim();
    }
    function getAttribute(name, elem) {
      if (!elem) {
        return null;
      }
      var attribs = elem.attribs;
      return attribs[name];
    }
    function addConditionally(obj, prop, what, where, recurse) {
      if (recurse === void 0) {
        recurse = false;
      }
      var tmp = fetch(what, where, recurse);
      if (tmp)
        obj[prop] = tmp;
    }
    function isValidFeed(value) {
      return value === "rss" || value === "feed" || value === "rdf:RDF";
    }
    function parseFeed(feed, options) {
      if (options === void 0) {
        options = { xmlMode: true };
      }
      var handler = new FeedHandler(options);
      new Parser_1.Parser(handler, options).end(feed);
      return handler.feed;
    }
    exports.parseFeed = parseFeed;
  }
});

// node_modules/htmlparser2/lib/index.js
var require_lib6 = __commonJS({
  "node_modules/htmlparser2/lib/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RssHandler = exports.DefaultHandler = exports.DomUtils = exports.ElementType = exports.Tokenizer = exports.createDomStream = exports.parseDOM = exports.parseDocument = exports.DomHandler = exports.Parser = void 0;
    var Parser_1 = require_Parser();
    Object.defineProperty(exports, "Parser", { enumerable: true, get: function() {
      return Parser_1.Parser;
    } });
    var domhandler_1 = require_lib2();
    Object.defineProperty(exports, "DomHandler", { enumerable: true, get: function() {
      return domhandler_1.DomHandler;
    } });
    Object.defineProperty(exports, "DefaultHandler", { enumerable: true, get: function() {
      return domhandler_1.DomHandler;
    } });
    function parseDocument(data, options) {
      var handler = new domhandler_1.DomHandler(void 0, options);
      new Parser_1.Parser(handler, options).end(data);
      return handler.root;
    }
    exports.parseDocument = parseDocument;
    function parseDOM(data, options) {
      return parseDocument(data, options).children;
    }
    exports.parseDOM = parseDOM;
    function createDomStream(cb, options, elementCb) {
      var handler = new domhandler_1.DomHandler(cb, options, elementCb);
      return new Parser_1.Parser(handler, options);
    }
    exports.createDomStream = createDomStream;
    var Tokenizer_1 = require_Tokenizer();
    Object.defineProperty(exports, "Tokenizer", { enumerable: true, get: function() {
      return __importDefault(Tokenizer_1).default;
    } });
    var ElementType = __importStar(require_lib());
    exports.ElementType = ElementType;
    __exportStar(require_FeedHandler(), exports);
    exports.DomUtils = __importStar(require_lib5());
    var FeedHandler_1 = require_FeedHandler();
    Object.defineProperty(exports, "RssHandler", { enumerable: true, get: function() {
      return FeedHandler_1.FeedHandler;
    } });
  }
});

// node_modules/escape-string-regexp/index.js
var require_escape_string_regexp = __commonJS({
  "node_modules/escape-string-regexp/index.js"(exports, module) {
    "use strict";
    module.exports = (string) => {
      if (typeof string !== "string") {
        throw new TypeError("Expected a string");
      }
      return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
    };
  }
});

// node_modules/is-plain-object/dist/is-plain-object.js
var require_is_plain_object = __commonJS({
  "node_modules/is-plain-object/dist/is-plain-object.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function isObject(o) {
      return Object.prototype.toString.call(o) === "[object Object]";
    }
    function isPlainObject(o) {
      var ctor, prot;
      if (isObject(o) === false)
        return false;
      ctor = o.constructor;
      if (ctor === void 0)
        return true;
      prot = ctor.prototype;
      if (isObject(prot) === false)
        return false;
      if (prot.hasOwnProperty("isPrototypeOf") === false) {
        return false;
      }
      return true;
    }
    exports.isPlainObject = isPlainObject;
  }
});

// node_modules/deepmerge/dist/cjs.js
var require_cjs = __commonJS({
  "node_modules/deepmerge/dist/cjs.js"(exports, module) {
    "use strict";
    var isMergeableObject = function isMergeableObject2(value) {
      return isNonNullObject(value) && !isSpecial(value);
    };
    function isNonNullObject(value) {
      return !!value && typeof value === "object";
    }
    function isSpecial(value) {
      var stringValue = Object.prototype.toString.call(value);
      return stringValue === "[object RegExp]" || stringValue === "[object Date]" || isReactElement(value);
    }
    var canUseSymbol = typeof Symbol === "function" && Symbol.for;
    var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for("react.element") : 60103;
    function isReactElement(value) {
      return value.$$typeof === REACT_ELEMENT_TYPE;
    }
    function emptyTarget(val) {
      return Array.isArray(val) ? [] : {};
    }
    function cloneUnlessOtherwiseSpecified(value, options) {
      return options.clone !== false && options.isMergeableObject(value) ? deepmerge(emptyTarget(value), value, options) : value;
    }
    function defaultArrayMerge(target, source, options) {
      return target.concat(source).map(function(element) {
        return cloneUnlessOtherwiseSpecified(element, options);
      });
    }
    function getMergeFunction(key, options) {
      if (!options.customMerge) {
        return deepmerge;
      }
      var customMerge = options.customMerge(key);
      return typeof customMerge === "function" ? customMerge : deepmerge;
    }
    function getEnumerableOwnPropertySymbols(target) {
      return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(target).filter(function(symbol) {
        return target.propertyIsEnumerable(symbol);
      }) : [];
    }
    function getKeys(target) {
      return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target));
    }
    function propertyIsOnObject(object, property) {
      try {
        return property in object;
      } catch (_) {
        return false;
      }
    }
    function propertyIsUnsafe(target, key) {
      return propertyIsOnObject(target, key) && !(Object.hasOwnProperty.call(target, key) && Object.propertyIsEnumerable.call(target, key));
    }
    function mergeObject(target, source, options) {
      var destination = {};
      if (options.isMergeableObject(target)) {
        getKeys(target).forEach(function(key) {
          destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
        });
      }
      getKeys(source).forEach(function(key) {
        if (propertyIsUnsafe(target, key)) {
          return;
        }
        if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
          destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
        } else {
          destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
        }
      });
      return destination;
    }
    function deepmerge(target, source, options) {
      options = options || {};
      options.arrayMerge = options.arrayMerge || defaultArrayMerge;
      options.isMergeableObject = options.isMergeableObject || isMergeableObject;
      options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;
      var sourceIsArray = Array.isArray(source);
      var targetIsArray = Array.isArray(target);
      var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;
      if (!sourceAndTargetTypesMatch) {
        return cloneUnlessOtherwiseSpecified(source, options);
      } else if (sourceIsArray) {
        return options.arrayMerge(target, source, options);
      } else {
        return mergeObject(target, source, options);
      }
    }
    deepmerge.all = function deepmergeAll(array, options) {
      if (!Array.isArray(array)) {
        throw new Error("first argument should be an array");
      }
      return array.reduce(function(prev, next) {
        return deepmerge(prev, next, options);
      }, {});
    };
    var deepmerge_1 = deepmerge;
    module.exports = deepmerge_1;
  }
});

// node_modules/parse-srcset/src/parse-srcset.js
var require_parse_srcset = __commonJS({
  "node_modules/parse-srcset/src/parse-srcset.js"(exports, module) {
    (function(root, factory) {
      if (typeof define === "function" && define.amd) {
        define([], factory);
      } else if (typeof module === "object" && module.exports) {
        module.exports = factory();
      } else {
        root.parseSrcset = factory();
      }
    })(exports, function() {
      return function(input) {
        function isSpace(c2) {
          return c2 === " " || // space
          c2 === "	" || // horizontal tab
          c2 === "\n" || // new line
          c2 === "\f" || // form feed
          c2 === "\r";
        }
        function collectCharacters(regEx) {
          var chars, match = regEx.exec(input.substring(pos));
          if (match) {
            chars = match[0];
            pos += chars.length;
            return chars;
          }
        }
        var inputLength = input.length, regexLeadingSpaces = /^[ \t\n\r\u000c]+/, regexLeadingCommasOrSpaces = /^[, \t\n\r\u000c]+/, regexLeadingNotSpaces = /^[^ \t\n\r\u000c]+/, regexTrailingCommas = /[,]+$/, regexNonNegativeInteger = /^\d+$/, regexFloatingPoint = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/, url, descriptors, currentDescriptor, state, c, pos = 0, candidates = [];
        while (true) {
          collectCharacters(regexLeadingCommasOrSpaces);
          if (pos >= inputLength) {
            return candidates;
          }
          url = collectCharacters(regexLeadingNotSpaces);
          descriptors = [];
          if (url.slice(-1) === ",") {
            url = url.replace(regexTrailingCommas, "");
            parseDescriptors();
          } else {
            tokenize();
          }
        }
        function tokenize() {
          collectCharacters(regexLeadingSpaces);
          currentDescriptor = "";
          state = "in descriptor";
          while (true) {
            c = input.charAt(pos);
            if (state === "in descriptor") {
              if (isSpace(c)) {
                if (currentDescriptor) {
                  descriptors.push(currentDescriptor);
                  currentDescriptor = "";
                  state = "after descriptor";
                }
              } else if (c === ",") {
                pos += 1;
                if (currentDescriptor) {
                  descriptors.push(currentDescriptor);
                }
                parseDescriptors();
                return;
              } else if (c === "(") {
                currentDescriptor = currentDescriptor + c;
                state = "in parens";
              } else if (c === "") {
                if (currentDescriptor) {
                  descriptors.push(currentDescriptor);
                }
                parseDescriptors();
                return;
              } else {
                currentDescriptor = currentDescriptor + c;
              }
            } else if (state === "in parens") {
              if (c === ")") {
                currentDescriptor = currentDescriptor + c;
                state = "in descriptor";
              } else if (c === "") {
                descriptors.push(currentDescriptor);
                parseDescriptors();
                return;
              } else {
                currentDescriptor = currentDescriptor + c;
              }
            } else if (state === "after descriptor") {
              if (isSpace(c)) {
              } else if (c === "") {
                parseDescriptors();
                return;
              } else {
                state = "in descriptor";
                pos -= 1;
              }
            }
            pos += 1;
          }
        }
        function parseDescriptors() {
          var pError = false, w, d, h, i, candidate = {}, desc, lastChar, value, intVal, floatVal;
          for (i = 0; i < descriptors.length; i++) {
            desc = descriptors[i];
            lastChar = desc[desc.length - 1];
            value = desc.substring(0, desc.length - 1);
            intVal = parseInt(value, 10);
            floatVal = parseFloat(value);
            if (regexNonNegativeInteger.test(value) && lastChar === "w") {
              if (w || d) {
                pError = true;
              }
              if (intVal === 0) {
                pError = true;
              } else {
                w = intVal;
              }
            } else if (regexFloatingPoint.test(value) && lastChar === "x") {
              if (w || d || h) {
                pError = true;
              }
              if (floatVal < 0) {
                pError = true;
              } else {
                d = floatVal;
              }
            } else if (regexNonNegativeInteger.test(value) && lastChar === "h") {
              if (h || d) {
                pError = true;
              }
              if (intVal === 0) {
                pError = true;
              } else {
                h = intVal;
              }
            } else {
              pError = true;
            }
          }
          if (!pError) {
            candidate.url = url;
            if (w) {
              candidate.w = w;
            }
            if (d) {
              candidate.d = d;
            }
            if (h) {
              candidate.h = h;
            }
            candidates.push(candidate);
          } else if (console && console.log) {
            console.log("Invalid srcset descriptor found in '" + input + "' at '" + desc + "'.");
          }
        }
      };
    });
  }
});

// node_modules/picocolors/picocolors.browser.js
var require_picocolors_browser = __commonJS({
  "node_modules/picocolors/picocolors.browser.js"(exports, module) {
    var x = String;
    var create = function() {
      return { isColorSupported: false, reset: x, bold: x, dim: x, italic: x, underline: x, inverse: x, hidden: x, strikethrough: x, black: x, red: x, green: x, yellow: x, blue: x, magenta: x, cyan: x, white: x, gray: x, bgBlack: x, bgRed: x, bgGreen: x, bgYellow: x, bgBlue: x, bgMagenta: x, bgCyan: x, bgWhite: x };
    };
    module.exports = create();
    module.exports.createColors = create;
  }
});

// (disabled):node_modules/postcss/lib/terminal-highlight
var require_terminal_highlight = __commonJS({
  "(disabled):node_modules/postcss/lib/terminal-highlight"() {
  }
});

// node_modules/postcss/lib/css-syntax-error.js
var require_css_syntax_error = __commonJS({
  "node_modules/postcss/lib/css-syntax-error.js"(exports, module) {
    "use strict";
    var pico = require_picocolors_browser();
    var terminalHighlight = require_terminal_highlight();
    var CssSyntaxError = class extends Error {
      constructor(message, line, column, source, file, plugin) {
        super(message);
        this.name = "CssSyntaxError";
        this.reason = message;
        if (file) {
          this.file = file;
        }
        if (source) {
          this.source = source;
        }
        if (plugin) {
          this.plugin = plugin;
        }
        if (typeof line !== "undefined" && typeof column !== "undefined") {
          if (typeof line === "number") {
            this.line = line;
            this.column = column;
          } else {
            this.line = line.line;
            this.column = line.column;
            this.endLine = column.line;
            this.endColumn = column.column;
          }
        }
        this.setMessage();
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, CssSyntaxError);
        }
      }
      setMessage() {
        this.message = this.plugin ? this.plugin + ": " : "";
        this.message += this.file ? this.file : "<css input>";
        if (typeof this.line !== "undefined") {
          this.message += ":" + this.line + ":" + this.column;
        }
        this.message += ": " + this.reason;
      }
      showSourceCode(color) {
        if (!this.source)
          return "";
        let css = this.source;
        if (color == null)
          color = pico.isColorSupported;
        if (terminalHighlight) {
          if (color)
            css = terminalHighlight(css);
        }
        let lines = css.split(/\r?\n/);
        let start = Math.max(this.line - 3, 0);
        let end = Math.min(this.line + 2, lines.length);
        let maxWidth = String(end).length;
        let mark, aside;
        if (color) {
          let { bold, red, gray } = pico.createColors(true);
          mark = (text) => bold(red(text));
          aside = (text) => gray(text);
        } else {
          mark = aside = (str) => str;
        }
        return lines.slice(start, end).map((line, index) => {
          let number = start + 1 + index;
          let gutter = " " + (" " + number).slice(-maxWidth) + " | ";
          if (number === this.line) {
            let spacing = aside(gutter.replace(/\d/g, " ")) + line.slice(0, this.column - 1).replace(/[^\t]/g, " ");
            return mark(">") + aside(gutter) + line + "\n " + spacing + mark("^");
          }
          return " " + aside(gutter) + line;
        }).join("\n");
      }
      toString() {
        let code = this.showSourceCode();
        if (code) {
          code = "\n\n" + code + "\n";
        }
        return this.name + ": " + this.message + code;
      }
    };
    module.exports = CssSyntaxError;
    CssSyntaxError.default = CssSyntaxError;
  }
});

// node_modules/postcss/lib/symbols.js
var require_symbols = __commonJS({
  "node_modules/postcss/lib/symbols.js"(exports, module) {
    "use strict";
    module.exports.isClean = Symbol("isClean");
    module.exports.my = Symbol("my");
  }
});

// node_modules/postcss/lib/stringifier.js
var require_stringifier = __commonJS({
  "node_modules/postcss/lib/stringifier.js"(exports, module) {
    "use strict";
    var DEFAULT_RAW = {
      colon: ": ",
      indent: "    ",
      beforeDecl: "\n",
      beforeRule: "\n",
      beforeOpen: " ",
      beforeClose: "\n",
      beforeComment: "\n",
      after: "\n",
      emptyBody: "",
      commentLeft: " ",
      commentRight: " ",
      semicolon: false
    };
    function capitalize(str) {
      return str[0].toUpperCase() + str.slice(1);
    }
    var Stringifier = class {
      constructor(builder) {
        this.builder = builder;
      }
      stringify(node, semicolon) {
        if (!this[node.type]) {
          throw new Error(
            "Unknown AST node type " + node.type + ". Maybe you need to change PostCSS stringifier."
          );
        }
        this[node.type](node, semicolon);
      }
      document(node) {
        this.body(node);
      }
      root(node) {
        this.body(node);
        if (node.raws.after)
          this.builder(node.raws.after);
      }
      comment(node) {
        let left = this.raw(node, "left", "commentLeft");
        let right = this.raw(node, "right", "commentRight");
        this.builder("/*" + left + node.text + right + "*/", node);
      }
      decl(node, semicolon) {
        let between = this.raw(node, "between", "colon");
        let string = node.prop + between + this.rawValue(node, "value");
        if (node.important) {
          string += node.raws.important || " !important";
        }
        if (semicolon)
          string += ";";
        this.builder(string, node);
      }
      rule(node) {
        this.block(node, this.rawValue(node, "selector"));
        if (node.raws.ownSemicolon) {
          this.builder(node.raws.ownSemicolon, node, "end");
        }
      }
      atrule(node, semicolon) {
        let name = "@" + node.name;
        let params = node.params ? this.rawValue(node, "params") : "";
        if (typeof node.raws.afterName !== "undefined") {
          name += node.raws.afterName;
        } else if (params) {
          name += " ";
        }
        if (node.nodes) {
          this.block(node, name + params);
        } else {
          let end = (node.raws.between || "") + (semicolon ? ";" : "");
          this.builder(name + params + end, node);
        }
      }
      body(node) {
        let last = node.nodes.length - 1;
        while (last > 0) {
          if (node.nodes[last].type !== "comment")
            break;
          last -= 1;
        }
        let semicolon = this.raw(node, "semicolon");
        for (let i = 0; i < node.nodes.length; i++) {
          let child = node.nodes[i];
          let before = this.raw(child, "before");
          if (before)
            this.builder(before);
          this.stringify(child, last !== i || semicolon);
        }
      }
      block(node, start) {
        let between = this.raw(node, "between", "beforeOpen");
        this.builder(start + between + "{", node, "start");
        let after;
        if (node.nodes && node.nodes.length) {
          this.body(node);
          after = this.raw(node, "after");
        } else {
          after = this.raw(node, "after", "emptyBody");
        }
        if (after)
          this.builder(after);
        this.builder("}", node, "end");
      }
      raw(node, own, detect) {
        let value;
        if (!detect)
          detect = own;
        if (own) {
          value = node.raws[own];
          if (typeof value !== "undefined")
            return value;
        }
        let parent = node.parent;
        if (detect === "before") {
          if (!parent || parent.type === "root" && parent.first === node) {
            return "";
          }
          if (parent && parent.type === "document") {
            return "";
          }
        }
        if (!parent)
          return DEFAULT_RAW[detect];
        let root = node.root();
        if (!root.rawCache)
          root.rawCache = {};
        if (typeof root.rawCache[detect] !== "undefined") {
          return root.rawCache[detect];
        }
        if (detect === "before" || detect === "after") {
          return this.beforeAfter(node, detect);
        } else {
          let method = "raw" + capitalize(detect);
          if (this[method]) {
            value = this[method](root, node);
          } else {
            root.walk((i) => {
              value = i.raws[own];
              if (typeof value !== "undefined")
                return false;
            });
          }
        }
        if (typeof value === "undefined")
          value = DEFAULT_RAW[detect];
        root.rawCache[detect] = value;
        return value;
      }
      rawSemicolon(root) {
        let value;
        root.walk((i) => {
          if (i.nodes && i.nodes.length && i.last.type === "decl") {
            value = i.raws.semicolon;
            if (typeof value !== "undefined")
              return false;
          }
        });
        return value;
      }
      rawEmptyBody(root) {
        let value;
        root.walk((i) => {
          if (i.nodes && i.nodes.length === 0) {
            value = i.raws.after;
            if (typeof value !== "undefined")
              return false;
          }
        });
        return value;
      }
      rawIndent(root) {
        if (root.raws.indent)
          return root.raws.indent;
        let value;
        root.walk((i) => {
          let p = i.parent;
          if (p && p !== root && p.parent && p.parent === root) {
            if (typeof i.raws.before !== "undefined") {
              let parts = i.raws.before.split("\n");
              value = parts[parts.length - 1];
              value = value.replace(/\S/g, "");
              return false;
            }
          }
        });
        return value;
      }
      rawBeforeComment(root, node) {
        let value;
        root.walkComments((i) => {
          if (typeof i.raws.before !== "undefined") {
            value = i.raws.before;
            if (value.includes("\n")) {
              value = value.replace(/[^\n]+$/, "");
            }
            return false;
          }
        });
        if (typeof value === "undefined") {
          value = this.raw(node, null, "beforeDecl");
        } else if (value) {
          value = value.replace(/\S/g, "");
        }
        return value;
      }
      rawBeforeDecl(root, node) {
        let value;
        root.walkDecls((i) => {
          if (typeof i.raws.before !== "undefined") {
            value = i.raws.before;
            if (value.includes("\n")) {
              value = value.replace(/[^\n]+$/, "");
            }
            return false;
          }
        });
        if (typeof value === "undefined") {
          value = this.raw(node, null, "beforeRule");
        } else if (value) {
          value = value.replace(/\S/g, "");
        }
        return value;
      }
      rawBeforeRule(root) {
        let value;
        root.walk((i) => {
          if (i.nodes && (i.parent !== root || root.first !== i)) {
            if (typeof i.raws.before !== "undefined") {
              value = i.raws.before;
              if (value.includes("\n")) {
                value = value.replace(/[^\n]+$/, "");
              }
              return false;
            }
          }
        });
        if (value)
          value = value.replace(/\S/g, "");
        return value;
      }
      rawBeforeClose(root) {
        let value;
        root.walk((i) => {
          if (i.nodes && i.nodes.length > 0) {
            if (typeof i.raws.after !== "undefined") {
              value = i.raws.after;
              if (value.includes("\n")) {
                value = value.replace(/[^\n]+$/, "");
              }
              return false;
            }
          }
        });
        if (value)
          value = value.replace(/\S/g, "");
        return value;
      }
      rawBeforeOpen(root) {
        let value;
        root.walk((i) => {
          if (i.type !== "decl") {
            value = i.raws.between;
            if (typeof value !== "undefined")
              return false;
          }
        });
        return value;
      }
      rawColon(root) {
        let value;
        root.walkDecls((i) => {
          if (typeof i.raws.between !== "undefined") {
            value = i.raws.between.replace(/[^\s:]/g, "");
            return false;
          }
        });
        return value;
      }
      beforeAfter(node, detect) {
        let value;
        if (node.type === "decl") {
          value = this.raw(node, null, "beforeDecl");
        } else if (node.type === "comment") {
          value = this.raw(node, null, "beforeComment");
        } else if (detect === "before") {
          value = this.raw(node, null, "beforeRule");
        } else {
          value = this.raw(node, null, "beforeClose");
        }
        let buf = node.parent;
        let depth = 0;
        while (buf && buf.type !== "root") {
          depth += 1;
          buf = buf.parent;
        }
        if (value.includes("\n")) {
          let indent = this.raw(node, null, "indent");
          if (indent.length) {
            for (let step = 0; step < depth; step++)
              value += indent;
          }
        }
        return value;
      }
      rawValue(node, prop) {
        let value = node[prop];
        let raw = node.raws[prop];
        if (raw && raw.value === value) {
          return raw.raw;
        }
        return value;
      }
    };
    module.exports = Stringifier;
    Stringifier.default = Stringifier;
  }
});

// node_modules/postcss/lib/stringify.js
var require_stringify2 = __commonJS({
  "node_modules/postcss/lib/stringify.js"(exports, module) {
    "use strict";
    var Stringifier = require_stringifier();
    function stringify(node, builder) {
      let str = new Stringifier(builder);
      str.stringify(node);
    }
    module.exports = stringify;
    stringify.default = stringify;
  }
});

// node_modules/postcss/lib/node.js
var require_node2 = __commonJS({
  "node_modules/postcss/lib/node.js"(exports, module) {
    "use strict";
    var { isClean, my } = require_symbols();
    var CssSyntaxError = require_css_syntax_error();
    var Stringifier = require_stringifier();
    var stringify = require_stringify2();
    function cloneNode(obj, parent) {
      let cloned = new obj.constructor();
      for (let i in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, i)) {
          continue;
        }
        if (i === "proxyCache")
          continue;
        let value = obj[i];
        let type = typeof value;
        if (i === "parent" && type === "object") {
          if (parent)
            cloned[i] = parent;
        } else if (i === "source") {
          cloned[i] = value;
        } else if (Array.isArray(value)) {
          cloned[i] = value.map((j) => cloneNode(j, cloned));
        } else {
          if (type === "object" && value !== null)
            value = cloneNode(value);
          cloned[i] = value;
        }
      }
      return cloned;
    }
    var Node = class {
      constructor(defaults = {}) {
        this.raws = {};
        this[isClean] = false;
        this[my] = true;
        for (let name in defaults) {
          if (name === "nodes") {
            this.nodes = [];
            for (let node of defaults[name]) {
              if (typeof node.clone === "function") {
                this.append(node.clone());
              } else {
                this.append(node);
              }
            }
          } else {
            this[name] = defaults[name];
          }
        }
      }
      error(message, opts = {}) {
        if (this.source) {
          let { start, end } = this.rangeBy(opts);
          return this.source.input.error(
            message,
            { line: start.line, column: start.column },
            { line: end.line, column: end.column },
            opts
          );
        }
        return new CssSyntaxError(message);
      }
      warn(result, text, opts) {
        let data = { node: this };
        for (let i in opts)
          data[i] = opts[i];
        return result.warn(text, data);
      }
      remove() {
        if (this.parent) {
          this.parent.removeChild(this);
        }
        this.parent = void 0;
        return this;
      }
      toString(stringifier = stringify) {
        if (stringifier.stringify)
          stringifier = stringifier.stringify;
        let result = "";
        stringifier(this, (i) => {
          result += i;
        });
        return result;
      }
      assign(overrides = {}) {
        for (let name in overrides) {
          this[name] = overrides[name];
        }
        return this;
      }
      clone(overrides = {}) {
        let cloned = cloneNode(this);
        for (let name in overrides) {
          cloned[name] = overrides[name];
        }
        return cloned;
      }
      cloneBefore(overrides = {}) {
        let cloned = this.clone(overrides);
        this.parent.insertBefore(this, cloned);
        return cloned;
      }
      cloneAfter(overrides = {}) {
        let cloned = this.clone(overrides);
        this.parent.insertAfter(this, cloned);
        return cloned;
      }
      replaceWith(...nodes) {
        if (this.parent) {
          let bookmark = this;
          let foundSelf = false;
          for (let node of nodes) {
            if (node === this) {
              foundSelf = true;
            } else if (foundSelf) {
              this.parent.insertAfter(bookmark, node);
              bookmark = node;
            } else {
              this.parent.insertBefore(bookmark, node);
            }
          }
          if (!foundSelf) {
            this.remove();
          }
        }
        return this;
      }
      next() {
        if (!this.parent)
          return void 0;
        let index = this.parent.index(this);
        return this.parent.nodes[index + 1];
      }
      prev() {
        if (!this.parent)
          return void 0;
        let index = this.parent.index(this);
        return this.parent.nodes[index - 1];
      }
      before(add) {
        this.parent.insertBefore(this, add);
        return this;
      }
      after(add) {
        this.parent.insertAfter(this, add);
        return this;
      }
      root() {
        let result = this;
        while (result.parent && result.parent.type !== "document") {
          result = result.parent;
        }
        return result;
      }
      raw(prop, defaultType) {
        let str = new Stringifier();
        return str.raw(this, prop, defaultType);
      }
      cleanRaws(keepBetween) {
        delete this.raws.before;
        delete this.raws.after;
        if (!keepBetween)
          delete this.raws.between;
      }
      toJSON(_, inputs) {
        let fixed = {};
        let emitInputs = inputs == null;
        inputs = inputs || /* @__PURE__ */ new Map();
        let inputsNextIndex = 0;
        for (let name in this) {
          if (!Object.prototype.hasOwnProperty.call(this, name)) {
            continue;
          }
          if (name === "parent" || name === "proxyCache")
            continue;
          let value = this[name];
          if (Array.isArray(value)) {
            fixed[name] = value.map((i) => {
              if (typeof i === "object" && i.toJSON) {
                return i.toJSON(null, inputs);
              } else {
                return i;
              }
            });
          } else if (typeof value === "object" && value.toJSON) {
            fixed[name] = value.toJSON(null, inputs);
          } else if (name === "source") {
            let inputId = inputs.get(value.input);
            if (inputId == null) {
              inputId = inputsNextIndex;
              inputs.set(value.input, inputsNextIndex);
              inputsNextIndex++;
            }
            fixed[name] = {
              inputId,
              start: value.start,
              end: value.end
            };
          } else {
            fixed[name] = value;
          }
        }
        if (emitInputs) {
          fixed.inputs = [...inputs.keys()].map((input) => input.toJSON());
        }
        return fixed;
      }
      positionInside(index) {
        let string = this.toString();
        let column = this.source.start.column;
        let line = this.source.start.line;
        for (let i = 0; i < index; i++) {
          if (string[i] === "\n") {
            column = 1;
            line += 1;
          } else {
            column += 1;
          }
        }
        return { line, column };
      }
      positionBy(opts) {
        let pos = this.source.start;
        if (opts.index) {
          pos = this.positionInside(opts.index);
        } else if (opts.word) {
          let index = this.toString().indexOf(opts.word);
          if (index !== -1)
            pos = this.positionInside(index);
        }
        return pos;
      }
      rangeBy(opts) {
        let start = {
          line: this.source.start.line,
          column: this.source.start.column
        };
        let end = this.source.end ? {
          line: this.source.end.line,
          column: this.source.end.column + 1
        } : {
          line: start.line,
          column: start.column + 1
        };
        if (opts.word) {
          let index = this.toString().indexOf(opts.word);
          if (index !== -1) {
            start = this.positionInside(index);
            end = this.positionInside(index + opts.word.length);
          }
        } else {
          if (opts.start) {
            start = {
              line: opts.start.line,
              column: opts.start.column
            };
          } else if (opts.index) {
            start = this.positionInside(opts.index);
          }
          if (opts.end) {
            end = {
              line: opts.end.line,
              column: opts.end.column
            };
          } else if (opts.endIndex) {
            end = this.positionInside(opts.endIndex);
          } else if (opts.index) {
            end = this.positionInside(opts.index + 1);
          }
        }
        if (end.line < start.line || end.line === start.line && end.column <= start.column) {
          end = { line: start.line, column: start.column + 1 };
        }
        return { start, end };
      }
      getProxyProcessor() {
        return {
          set(node, prop, value) {
            if (node[prop] === value)
              return true;
            node[prop] = value;
            if (prop === "prop" || prop === "value" || prop === "name" || prop === "params" || prop === "important" || /* c8 ignore next */
            prop === "text") {
              node.markDirty();
            }
            return true;
          },
          get(node, prop) {
            if (prop === "proxyOf") {
              return node;
            } else if (prop === "root") {
              return () => node.root().toProxy();
            } else {
              return node[prop];
            }
          }
        };
      }
      toProxy() {
        if (!this.proxyCache) {
          this.proxyCache = new Proxy(this, this.getProxyProcessor());
        }
        return this.proxyCache;
      }
      addToError(error) {
        error.postcssNode = this;
        if (error.stack && this.source && /\n\s{4}at /.test(error.stack)) {
          let s = this.source;
          error.stack = error.stack.replace(
            /\n\s{4}at /,
            `$&${s.input.from}:${s.start.line}:${s.start.column}$&`
          );
        }
        return error;
      }
      markDirty() {
        if (this[isClean]) {
          this[isClean] = false;
          let next = this;
          while (next = next.parent) {
            next[isClean] = false;
          }
        }
      }
      get proxyOf() {
        return this;
      }
    };
    module.exports = Node;
    Node.default = Node;
  }
});

// node_modules/postcss/lib/declaration.js
var require_declaration = __commonJS({
  "node_modules/postcss/lib/declaration.js"(exports, module) {
    "use strict";
    var Node = require_node2();
    var Declaration = class extends Node {
      constructor(defaults) {
        if (defaults && typeof defaults.value !== "undefined" && typeof defaults.value !== "string") {
          defaults = { ...defaults, value: String(defaults.value) };
        }
        super(defaults);
        this.type = "decl";
      }
      get variable() {
        return this.prop.startsWith("--") || this.prop[0] === "$";
      }
    };
    module.exports = Declaration;
    Declaration.default = Declaration;
  }
});

// (disabled):node_modules/source-map-js/source-map.js
var require_source_map = __commonJS({
  "(disabled):node_modules/source-map-js/source-map.js"() {
  }
});

// (disabled):path
var require_path = __commonJS({
  "(disabled):path"() {
  }
});

// (disabled):url
var require_url = __commonJS({
  "(disabled):url"() {
  }
});

// node_modules/nanoid/non-secure/index.cjs
var require_non_secure = __commonJS({
  "node_modules/nanoid/non-secure/index.cjs"(exports, module) {
    var urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
    var customAlphabet = (alphabet, defaultSize = 21) => {
      return (size = defaultSize) => {
        let id = "";
        let i = size;
        while (i--) {
          id += alphabet[Math.random() * alphabet.length | 0];
        }
        return id;
      };
    };
    var nanoid = (size = 21) => {
      let id = "";
      let i = size;
      while (i--) {
        id += urlAlphabet[Math.random() * 64 | 0];
      }
      return id;
    };
    module.exports = { nanoid, customAlphabet };
  }
});

// (disabled):fs
var require_fs = __commonJS({
  "(disabled):fs"() {
  }
});

// node_modules/postcss/lib/previous-map.js
var require_previous_map = __commonJS({
  "node_modules/postcss/lib/previous-map.js"(exports, module) {
    "use strict";
    var { SourceMapConsumer, SourceMapGenerator } = require_source_map();
    var { existsSync, readFileSync } = require_fs();
    var { dirname, join } = require_path();
    function fromBase64(str) {
      if (Buffer) {
        return Buffer.from(str, "base64").toString();
      } else {
        return window.atob(str);
      }
    }
    var PreviousMap = class {
      constructor(css, opts) {
        if (opts.map === false)
          return;
        this.loadAnnotation(css);
        this.inline = this.startWith(this.annotation, "data:");
        let prev = opts.map ? opts.map.prev : void 0;
        let text = this.loadMap(opts.from, prev);
        if (!this.mapFile && opts.from) {
          this.mapFile = opts.from;
        }
        if (this.mapFile)
          this.root = dirname(this.mapFile);
        if (text)
          this.text = text;
      }
      consumer() {
        if (!this.consumerCache) {
          this.consumerCache = new SourceMapConsumer(this.text);
        }
        return this.consumerCache;
      }
      withContent() {
        return !!(this.consumer().sourcesContent && this.consumer().sourcesContent.length > 0);
      }
      startWith(string, start) {
        if (!string)
          return false;
        return string.substr(0, start.length) === start;
      }
      getAnnotationURL(sourceMapString) {
        return sourceMapString.replace(/^\/\*\s*# sourceMappingURL=/, "").trim();
      }
      loadAnnotation(css) {
        let comments = css.match(/\/\*\s*# sourceMappingURL=/gm);
        if (!comments)
          return;
        let start = css.lastIndexOf(comments.pop());
        let end = css.indexOf("*/", start);
        if (start > -1 && end > -1) {
          this.annotation = this.getAnnotationURL(css.substring(start, end));
        }
      }
      decodeInline(text) {
        let baseCharsetUri = /^data:application\/json;charset=utf-?8;base64,/;
        let baseUri = /^data:application\/json;base64,/;
        let charsetUri = /^data:application\/json;charset=utf-?8,/;
        let uri = /^data:application\/json,/;
        if (charsetUri.test(text) || uri.test(text)) {
          return decodeURIComponent(text.substr(RegExp.lastMatch.length));
        }
        if (baseCharsetUri.test(text) || baseUri.test(text)) {
          return fromBase64(text.substr(RegExp.lastMatch.length));
        }
        let encoding = text.match(/data:application\/json;([^,]+),/)[1];
        throw new Error("Unsupported source map encoding " + encoding);
      }
      loadFile(path) {
        this.root = dirname(path);
        if (existsSync(path)) {
          this.mapFile = path;
          return readFileSync(path, "utf-8").toString().trim();
        }
      }
      loadMap(file, prev) {
        if (prev === false)
          return false;
        if (prev) {
          if (typeof prev === "string") {
            return prev;
          } else if (typeof prev === "function") {
            let prevPath = prev(file);
            if (prevPath) {
              let map = this.loadFile(prevPath);
              if (!map) {
                throw new Error(
                  "Unable to load previous source map: " + prevPath.toString()
                );
              }
              return map;
            }
          } else if (prev instanceof SourceMapConsumer) {
            return SourceMapGenerator.fromSourceMap(prev).toString();
          } else if (prev instanceof SourceMapGenerator) {
            return prev.toString();
          } else if (this.isMap(prev)) {
            return JSON.stringify(prev);
          } else {
            throw new Error(
              "Unsupported previous source map format: " + prev.toString()
            );
          }
        } else if (this.inline) {
          return this.decodeInline(this.annotation);
        } else if (this.annotation) {
          let map = this.annotation;
          if (file)
            map = join(dirname(file), map);
          return this.loadFile(map);
        }
      }
      isMap(map) {
        if (typeof map !== "object")
          return false;
        return typeof map.mappings === "string" || typeof map._mappings === "string" || Array.isArray(map.sections);
      }
    };
    module.exports = PreviousMap;
    PreviousMap.default = PreviousMap;
  }
});

// node_modules/postcss/lib/input.js
var require_input = __commonJS({
  "node_modules/postcss/lib/input.js"(exports, module) {
    "use strict";
    var { SourceMapConsumer, SourceMapGenerator } = require_source_map();
    var { fileURLToPath, pathToFileURL } = require_url();
    var { resolve, isAbsolute } = require_path();
    var { nanoid } = require_non_secure();
    var terminalHighlight = require_terminal_highlight();
    var CssSyntaxError = require_css_syntax_error();
    var PreviousMap = require_previous_map();
    var fromOffsetCache = Symbol("fromOffsetCache");
    var sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator);
    var pathAvailable = Boolean(resolve && isAbsolute);
    var Input = class {
      constructor(css, opts = {}) {
        if (css === null || typeof css === "undefined" || typeof css === "object" && !css.toString) {
          throw new Error(`PostCSS received ${css} instead of CSS string`);
        }
        this.css = css.toString();
        if (this.css[0] === "\uFEFF" || this.css[0] === "\uFFFE") {
          this.hasBOM = true;
          this.css = this.css.slice(1);
        } else {
          this.hasBOM = false;
        }
        if (opts.from) {
          if (!pathAvailable || /^\w+:\/\//.test(opts.from) || isAbsolute(opts.from)) {
            this.file = opts.from;
          } else {
            this.file = resolve(opts.from);
          }
        }
        if (pathAvailable && sourceMapAvailable) {
          let map = new PreviousMap(this.css, opts);
          if (map.text) {
            this.map = map;
            let file = map.consumer().file;
            if (!this.file && file)
              this.file = this.mapResolve(file);
          }
        }
        if (!this.file) {
          this.id = "<input css " + nanoid(6) + ">";
        }
        if (this.map)
          this.map.file = this.from;
      }
      fromOffset(offset) {
        let lastLine, lineToIndex;
        if (!this[fromOffsetCache]) {
          let lines = this.css.split("\n");
          lineToIndex = new Array(lines.length);
          let prevIndex = 0;
          for (let i = 0, l = lines.length; i < l; i++) {
            lineToIndex[i] = prevIndex;
            prevIndex += lines[i].length + 1;
          }
          this[fromOffsetCache] = lineToIndex;
        } else {
          lineToIndex = this[fromOffsetCache];
        }
        lastLine = lineToIndex[lineToIndex.length - 1];
        let min = 0;
        if (offset >= lastLine) {
          min = lineToIndex.length - 1;
        } else {
          let max = lineToIndex.length - 2;
          let mid;
          while (min < max) {
            mid = min + (max - min >> 1);
            if (offset < lineToIndex[mid]) {
              max = mid - 1;
            } else if (offset >= lineToIndex[mid + 1]) {
              min = mid + 1;
            } else {
              min = mid;
              break;
            }
          }
        }
        return {
          line: min + 1,
          col: offset - lineToIndex[min] + 1
        };
      }
      error(message, line, column, opts = {}) {
        let result, endLine, endColumn;
        if (line && typeof line === "object") {
          let start = line;
          let end = column;
          if (typeof line.offset === "number") {
            let pos = this.fromOffset(start.offset);
            line = pos.line;
            column = pos.col;
          } else {
            line = start.line;
            column = start.column;
          }
          if (typeof end.offset === "number") {
            let pos = this.fromOffset(end.offset);
            endLine = pos.line;
            endColumn = pos.col;
          } else {
            endLine = end.line;
            endColumn = end.column;
          }
        } else if (!column) {
          let pos = this.fromOffset(line);
          line = pos.line;
          column = pos.col;
        }
        let origin = this.origin(line, column, endLine, endColumn);
        if (origin) {
          result = new CssSyntaxError(
            message,
            origin.endLine === void 0 ? origin.line : { line: origin.line, column: origin.column },
            origin.endLine === void 0 ? origin.column : { line: origin.endLine, column: origin.endColumn },
            origin.source,
            origin.file,
            opts.plugin
          );
        } else {
          result = new CssSyntaxError(
            message,
            endLine === void 0 ? line : { line, column },
            endLine === void 0 ? column : { line: endLine, column: endColumn },
            this.css,
            this.file,
            opts.plugin
          );
        }
        result.input = { line, column, endLine, endColumn, source: this.css };
        if (this.file) {
          if (pathToFileURL) {
            result.input.url = pathToFileURL(this.file).toString();
          }
          result.input.file = this.file;
        }
        return result;
      }
      origin(line, column, endLine, endColumn) {
        if (!this.map)
          return false;
        let consumer = this.map.consumer();
        let from = consumer.originalPositionFor({ line, column });
        if (!from.source)
          return false;
        let to;
        if (typeof endLine === "number") {
          to = consumer.originalPositionFor({ line: endLine, column: endColumn });
        }
        let fromUrl;
        if (isAbsolute(from.source)) {
          fromUrl = pathToFileURL(from.source);
        } else {
          fromUrl = new URL(
            from.source,
            this.map.consumer().sourceRoot || pathToFileURL(this.map.mapFile)
          );
        }
        let result = {
          url: fromUrl.toString(),
          line: from.line,
          column: from.column,
          endLine: to && to.line,
          endColumn: to && to.column
        };
        if (fromUrl.protocol === "file:") {
          if (fileURLToPath) {
            result.file = fileURLToPath(fromUrl);
          } else {
            throw new Error(`file: protocol is not available in this PostCSS build`);
          }
        }
        let source = consumer.sourceContentFor(from.source);
        if (source)
          result.source = source;
        return result;
      }
      mapResolve(file) {
        if (/^\w+:\/\//.test(file)) {
          return file;
        }
        return resolve(this.map.consumer().sourceRoot || this.map.root || ".", file);
      }
      get from() {
        return this.file || this.id;
      }
      toJSON() {
        let json = {};
        for (let name of ["hasBOM", "css", "file", "id"]) {
          if (this[name] != null) {
            json[name] = this[name];
          }
        }
        if (this.map) {
          json.map = { ...this.map };
          if (json.map.consumerCache) {
            json.map.consumerCache = void 0;
          }
        }
        return json;
      }
    };
    module.exports = Input;
    Input.default = Input;
    if (terminalHighlight && terminalHighlight.registerInput) {
      terminalHighlight.registerInput(Input);
    }
  }
});

// node_modules/postcss/lib/map-generator.js
var require_map_generator = __commonJS({
  "node_modules/postcss/lib/map-generator.js"(exports, module) {
    "use strict";
    var { SourceMapConsumer, SourceMapGenerator } = require_source_map();
    var { dirname, resolve, relative, sep } = require_path();
    var { pathToFileURL } = require_url();
    var Input = require_input();
    var sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator);
    var pathAvailable = Boolean(dirname && resolve && relative && sep);
    var MapGenerator = class {
      constructor(stringify, root, opts, cssString) {
        this.stringify = stringify;
        this.mapOpts = opts.map || {};
        this.root = root;
        this.opts = opts;
        this.css = cssString;
        this.usesFileUrls = !this.mapOpts.from && this.mapOpts.absolute;
      }
      isMap() {
        if (typeof this.opts.map !== "undefined") {
          return !!this.opts.map;
        }
        return this.previous().length > 0;
      }
      previous() {
        if (!this.previousMaps) {
          this.previousMaps = [];
          if (this.root) {
            this.root.walk((node) => {
              if (node.source && node.source.input.map) {
                let map = node.source.input.map;
                if (!this.previousMaps.includes(map)) {
                  this.previousMaps.push(map);
                }
              }
            });
          } else {
            let input = new Input(this.css, this.opts);
            if (input.map)
              this.previousMaps.push(input.map);
          }
        }
        return this.previousMaps;
      }
      isInline() {
        if (typeof this.mapOpts.inline !== "undefined") {
          return this.mapOpts.inline;
        }
        let annotation = this.mapOpts.annotation;
        if (typeof annotation !== "undefined" && annotation !== true) {
          return false;
        }
        if (this.previous().length) {
          return this.previous().some((i) => i.inline);
        }
        return true;
      }
      isSourcesContent() {
        if (typeof this.mapOpts.sourcesContent !== "undefined") {
          return this.mapOpts.sourcesContent;
        }
        if (this.previous().length) {
          return this.previous().some((i) => i.withContent());
        }
        return true;
      }
      clearAnnotation() {
        if (this.mapOpts.annotation === false)
          return;
        if (this.root) {
          let node;
          for (let i = this.root.nodes.length - 1; i >= 0; i--) {
            node = this.root.nodes[i];
            if (node.type !== "comment")
              continue;
            if (node.text.indexOf("# sourceMappingURL=") === 0) {
              this.root.removeChild(i);
            }
          }
        } else if (this.css) {
          this.css = this.css.replace(/(\n)?\/\*#[\S\s]*?\*\/$/gm, "");
        }
      }
      setSourcesContent() {
        let already = {};
        if (this.root) {
          this.root.walk((node) => {
            if (node.source) {
              let from = node.source.input.from;
              if (from && !already[from]) {
                already[from] = true;
                let fromUrl = this.usesFileUrls ? this.toFileUrl(from) : this.toUrl(this.path(from));
                this.map.setSourceContent(fromUrl, node.source.input.css);
              }
            }
          });
        } else if (this.css) {
          let from = this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>";
          this.map.setSourceContent(from, this.css);
        }
      }
      applyPrevMaps() {
        for (let prev of this.previous()) {
          let from = this.toUrl(this.path(prev.file));
          let root = prev.root || dirname(prev.file);
          let map;
          if (this.mapOpts.sourcesContent === false) {
            map = new SourceMapConsumer(prev.text);
            if (map.sourcesContent) {
              map.sourcesContent = map.sourcesContent.map(() => null);
            }
          } else {
            map = prev.consumer();
          }
          this.map.applySourceMap(map, from, this.toUrl(this.path(root)));
        }
      }
      isAnnotation() {
        if (this.isInline()) {
          return true;
        }
        if (typeof this.mapOpts.annotation !== "undefined") {
          return this.mapOpts.annotation;
        }
        if (this.previous().length) {
          return this.previous().some((i) => i.annotation);
        }
        return true;
      }
      toBase64(str) {
        if (Buffer) {
          return Buffer.from(str).toString("base64");
        } else {
          return window.btoa(unescape(encodeURIComponent(str)));
        }
      }
      addAnnotation() {
        let content;
        if (this.isInline()) {
          content = "data:application/json;base64," + this.toBase64(this.map.toString());
        } else if (typeof this.mapOpts.annotation === "string") {
          content = this.mapOpts.annotation;
        } else if (typeof this.mapOpts.annotation === "function") {
          content = this.mapOpts.annotation(this.opts.to, this.root);
        } else {
          content = this.outputFile() + ".map";
        }
        let eol = "\n";
        if (this.css.includes("\r\n"))
          eol = "\r\n";
        this.css += eol + "/*# sourceMappingURL=" + content + " */";
      }
      outputFile() {
        if (this.opts.to) {
          return this.path(this.opts.to);
        } else if (this.opts.from) {
          return this.path(this.opts.from);
        } else {
          return "to.css";
        }
      }
      generateMap() {
        if (this.root) {
          this.generateString();
        } else if (this.previous().length === 1) {
          let prev = this.previous()[0].consumer();
          prev.file = this.outputFile();
          this.map = SourceMapGenerator.fromSourceMap(prev);
        } else {
          this.map = new SourceMapGenerator({ file: this.outputFile() });
          this.map.addMapping({
            source: this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>",
            generated: { line: 1, column: 0 },
            original: { line: 1, column: 0 }
          });
        }
        if (this.isSourcesContent())
          this.setSourcesContent();
        if (this.root && this.previous().length > 0)
          this.applyPrevMaps();
        if (this.isAnnotation())
          this.addAnnotation();
        if (this.isInline()) {
          return [this.css];
        } else {
          return [this.css, this.map];
        }
      }
      path(file) {
        if (file.indexOf("<") === 0)
          return file;
        if (/^\w+:\/\//.test(file))
          return file;
        if (this.mapOpts.absolute)
          return file;
        let from = this.opts.to ? dirname(this.opts.to) : ".";
        if (typeof this.mapOpts.annotation === "string") {
          from = dirname(resolve(from, this.mapOpts.annotation));
        }
        file = relative(from, file);
        return file;
      }
      toUrl(path) {
        if (sep === "\\") {
          path = path.replace(/\\/g, "/");
        }
        return encodeURI(path).replace(/[#?]/g, encodeURIComponent);
      }
      toFileUrl(path) {
        if (pathToFileURL) {
          return pathToFileURL(path).toString();
        } else {
          throw new Error(
            "`map.absolute` option is not available in this PostCSS build"
          );
        }
      }
      sourcePath(node) {
        if (this.mapOpts.from) {
          return this.toUrl(this.mapOpts.from);
        } else if (this.usesFileUrls) {
          return this.toFileUrl(node.source.input.from);
        } else {
          return this.toUrl(this.path(node.source.input.from));
        }
      }
      generateString() {
        this.css = "";
        this.map = new SourceMapGenerator({ file: this.outputFile() });
        let line = 1;
        let column = 1;
        let noSource = "<no source>";
        let mapping = {
          source: "",
          generated: { line: 0, column: 0 },
          original: { line: 0, column: 0 }
        };
        let lines, last;
        this.stringify(this.root, (str, node, type) => {
          this.css += str;
          if (node && type !== "end") {
            mapping.generated.line = line;
            mapping.generated.column = column - 1;
            if (node.source && node.source.start) {
              mapping.source = this.sourcePath(node);
              mapping.original.line = node.source.start.line;
              mapping.original.column = node.source.start.column - 1;
              this.map.addMapping(mapping);
            } else {
              mapping.source = noSource;
              mapping.original.line = 1;
              mapping.original.column = 0;
              this.map.addMapping(mapping);
            }
          }
          lines = str.match(/\n/g);
          if (lines) {
            line += lines.length;
            last = str.lastIndexOf("\n");
            column = str.length - last;
          } else {
            column += str.length;
          }
          if (node && type !== "start") {
            let p = node.parent || { raws: {} };
            if (node.type !== "decl" || node !== p.last || p.raws.semicolon) {
              if (node.source && node.source.end) {
                mapping.source = this.sourcePath(node);
                mapping.original.line = node.source.end.line;
                mapping.original.column = node.source.end.column - 1;
                mapping.generated.line = line;
                mapping.generated.column = column - 2;
                this.map.addMapping(mapping);
              } else {
                mapping.source = noSource;
                mapping.original.line = 1;
                mapping.original.column = 0;
                mapping.generated.line = line;
                mapping.generated.column = column - 1;
                this.map.addMapping(mapping);
              }
            }
          }
        });
      }
      generate() {
        this.clearAnnotation();
        if (pathAvailable && sourceMapAvailable && this.isMap()) {
          return this.generateMap();
        } else {
          let result = "";
          this.stringify(this.root, (i) => {
            result += i;
          });
          return [result];
        }
      }
    };
    module.exports = MapGenerator;
  }
});

// node_modules/postcss/lib/comment.js
var require_comment = __commonJS({
  "node_modules/postcss/lib/comment.js"(exports, module) {
    "use strict";
    var Node = require_node2();
    var Comment = class extends Node {
      constructor(defaults) {
        super(defaults);
        this.type = "comment";
      }
    };
    module.exports = Comment;
    Comment.default = Comment;
  }
});

// node_modules/postcss/lib/container.js
var require_container = __commonJS({
  "node_modules/postcss/lib/container.js"(exports, module) {
    "use strict";
    var { isClean, my } = require_symbols();
    var Declaration = require_declaration();
    var Comment = require_comment();
    var Node = require_node2();
    var parse;
    var Rule;
    var AtRule;
    var Root;
    function cleanSource(nodes) {
      return nodes.map((i) => {
        if (i.nodes)
          i.nodes = cleanSource(i.nodes);
        delete i.source;
        return i;
      });
    }
    function markDirtyUp(node) {
      node[isClean] = false;
      if (node.proxyOf.nodes) {
        for (let i of node.proxyOf.nodes) {
          markDirtyUp(i);
        }
      }
    }
    var Container = class extends Node {
      push(child) {
        child.parent = this;
        this.proxyOf.nodes.push(child);
        return this;
      }
      each(callback) {
        if (!this.proxyOf.nodes)
          return void 0;
        let iterator = this.getIterator();
        let index, result;
        while (this.indexes[iterator] < this.proxyOf.nodes.length) {
          index = this.indexes[iterator];
          result = callback(this.proxyOf.nodes[index], index);
          if (result === false)
            break;
          this.indexes[iterator] += 1;
        }
        delete this.indexes[iterator];
        return result;
      }
      walk(callback) {
        return this.each((child, i) => {
          let result;
          try {
            result = callback(child, i);
          } catch (e) {
            throw child.addToError(e);
          }
          if (result !== false && child.walk) {
            result = child.walk(callback);
          }
          return result;
        });
      }
      walkDecls(prop, callback) {
        if (!callback) {
          callback = prop;
          return this.walk((child, i) => {
            if (child.type === "decl") {
              return callback(child, i);
            }
          });
        }
        if (prop instanceof RegExp) {
          return this.walk((child, i) => {
            if (child.type === "decl" && prop.test(child.prop)) {
              return callback(child, i);
            }
          });
        }
        return this.walk((child, i) => {
          if (child.type === "decl" && child.prop === prop) {
            return callback(child, i);
          }
        });
      }
      walkRules(selector, callback) {
        if (!callback) {
          callback = selector;
          return this.walk((child, i) => {
            if (child.type === "rule") {
              return callback(child, i);
            }
          });
        }
        if (selector instanceof RegExp) {
          return this.walk((child, i) => {
            if (child.type === "rule" && selector.test(child.selector)) {
              return callback(child, i);
            }
          });
        }
        return this.walk((child, i) => {
          if (child.type === "rule" && child.selector === selector) {
            return callback(child, i);
          }
        });
      }
      walkAtRules(name, callback) {
        if (!callback) {
          callback = name;
          return this.walk((child, i) => {
            if (child.type === "atrule") {
              return callback(child, i);
            }
          });
        }
        if (name instanceof RegExp) {
          return this.walk((child, i) => {
            if (child.type === "atrule" && name.test(child.name)) {
              return callback(child, i);
            }
          });
        }
        return this.walk((child, i) => {
          if (child.type === "atrule" && child.name === name) {
            return callback(child, i);
          }
        });
      }
      walkComments(callback) {
        return this.walk((child, i) => {
          if (child.type === "comment") {
            return callback(child, i);
          }
        });
      }
      append(...children) {
        for (let child of children) {
          let nodes = this.normalize(child, this.last);
          for (let node of nodes)
            this.proxyOf.nodes.push(node);
        }
        this.markDirty();
        return this;
      }
      prepend(...children) {
        children = children.reverse();
        for (let child of children) {
          let nodes = this.normalize(child, this.first, "prepend").reverse();
          for (let node of nodes)
            this.proxyOf.nodes.unshift(node);
          for (let id in this.indexes) {
            this.indexes[id] = this.indexes[id] + nodes.length;
          }
        }
        this.markDirty();
        return this;
      }
      cleanRaws(keepBetween) {
        super.cleanRaws(keepBetween);
        if (this.nodes) {
          for (let node of this.nodes)
            node.cleanRaws(keepBetween);
        }
      }
      insertBefore(exist, add) {
        let existIndex = this.index(exist);
        let type = exist === 0 ? "prepend" : false;
        let nodes = this.normalize(add, this.proxyOf.nodes[existIndex], type).reverse();
        existIndex = this.index(exist);
        for (let node of nodes)
          this.proxyOf.nodes.splice(existIndex, 0, node);
        let index;
        for (let id in this.indexes) {
          index = this.indexes[id];
          if (existIndex <= index) {
            this.indexes[id] = index + nodes.length;
          }
        }
        this.markDirty();
        return this;
      }
      insertAfter(exist, add) {
        let existIndex = this.index(exist);
        let nodes = this.normalize(add, this.proxyOf.nodes[existIndex]).reverse();
        existIndex = this.index(exist);
        for (let node of nodes)
          this.proxyOf.nodes.splice(existIndex + 1, 0, node);
        let index;
        for (let id in this.indexes) {
          index = this.indexes[id];
          if (existIndex < index) {
            this.indexes[id] = index + nodes.length;
          }
        }
        this.markDirty();
        return this;
      }
      removeChild(child) {
        child = this.index(child);
        this.proxyOf.nodes[child].parent = void 0;
        this.proxyOf.nodes.splice(child, 1);
        let index;
        for (let id in this.indexes) {
          index = this.indexes[id];
          if (index >= child) {
            this.indexes[id] = index - 1;
          }
        }
        this.markDirty();
        return this;
      }
      removeAll() {
        for (let node of this.proxyOf.nodes)
          node.parent = void 0;
        this.proxyOf.nodes = [];
        this.markDirty();
        return this;
      }
      replaceValues(pattern, opts, callback) {
        if (!callback) {
          callback = opts;
          opts = {};
        }
        this.walkDecls((decl) => {
          if (opts.props && !opts.props.includes(decl.prop))
            return;
          if (opts.fast && !decl.value.includes(opts.fast))
            return;
          decl.value = decl.value.replace(pattern, callback);
        });
        this.markDirty();
        return this;
      }
      every(condition) {
        return this.nodes.every(condition);
      }
      some(condition) {
        return this.nodes.some(condition);
      }
      index(child) {
        if (typeof child === "number")
          return child;
        if (child.proxyOf)
          child = child.proxyOf;
        return this.proxyOf.nodes.indexOf(child);
      }
      get first() {
        if (!this.proxyOf.nodes)
          return void 0;
        return this.proxyOf.nodes[0];
      }
      get last() {
        if (!this.proxyOf.nodes)
          return void 0;
        return this.proxyOf.nodes[this.proxyOf.nodes.length - 1];
      }
      normalize(nodes, sample) {
        if (typeof nodes === "string") {
          nodes = cleanSource(parse(nodes).nodes);
        } else if (Array.isArray(nodes)) {
          nodes = nodes.slice(0);
          for (let i of nodes) {
            if (i.parent)
              i.parent.removeChild(i, "ignore");
          }
        } else if (nodes.type === "root" && this.type !== "document") {
          nodes = nodes.nodes.slice(0);
          for (let i of nodes) {
            if (i.parent)
              i.parent.removeChild(i, "ignore");
          }
        } else if (nodes.type) {
          nodes = [nodes];
        } else if (nodes.prop) {
          if (typeof nodes.value === "undefined") {
            throw new Error("Value field is missed in node creation");
          } else if (typeof nodes.value !== "string") {
            nodes.value = String(nodes.value);
          }
          nodes = [new Declaration(nodes)];
        } else if (nodes.selector) {
          nodes = [new Rule(nodes)];
        } else if (nodes.name) {
          nodes = [new AtRule(nodes)];
        } else if (nodes.text) {
          nodes = [new Comment(nodes)];
        } else {
          throw new Error("Unknown node type in node creation");
        }
        let processed = nodes.map((i) => {
          if (!i[my])
            Container.rebuild(i);
          i = i.proxyOf;
          if (i.parent)
            i.parent.removeChild(i);
          if (i[isClean])
            markDirtyUp(i);
          if (typeof i.raws.before === "undefined") {
            if (sample && typeof sample.raws.before !== "undefined") {
              i.raws.before = sample.raws.before.replace(/\S/g, "");
            }
          }
          i.parent = this.proxyOf;
          return i;
        });
        return processed;
      }
      getProxyProcessor() {
        return {
          set(node, prop, value) {
            if (node[prop] === value)
              return true;
            node[prop] = value;
            if (prop === "name" || prop === "params" || prop === "selector") {
              node.markDirty();
            }
            return true;
          },
          get(node, prop) {
            if (prop === "proxyOf") {
              return node;
            } else if (!node[prop]) {
              return node[prop];
            } else if (prop === "each" || typeof prop === "string" && prop.startsWith("walk")) {
              return (...args) => {
                return node[prop](
                  ...args.map((i) => {
                    if (typeof i === "function") {
                      return (child, index) => i(child.toProxy(), index);
                    } else {
                      return i;
                    }
                  })
                );
              };
            } else if (prop === "every" || prop === "some") {
              return (cb) => {
                return node[prop](
                  (child, ...other) => cb(child.toProxy(), ...other)
                );
              };
            } else if (prop === "root") {
              return () => node.root().toProxy();
            } else if (prop === "nodes") {
              return node.nodes.map((i) => i.toProxy());
            } else if (prop === "first" || prop === "last") {
              return node[prop].toProxy();
            } else {
              return node[prop];
            }
          }
        };
      }
      getIterator() {
        if (!this.lastEach)
          this.lastEach = 0;
        if (!this.indexes)
          this.indexes = {};
        this.lastEach += 1;
        let iterator = this.lastEach;
        this.indexes[iterator] = 0;
        return iterator;
      }
    };
    Container.registerParse = (dependant) => {
      parse = dependant;
    };
    Container.registerRule = (dependant) => {
      Rule = dependant;
    };
    Container.registerAtRule = (dependant) => {
      AtRule = dependant;
    };
    Container.registerRoot = (dependant) => {
      Root = dependant;
    };
    module.exports = Container;
    Container.default = Container;
    Container.rebuild = (node) => {
      if (node.type === "atrule") {
        Object.setPrototypeOf(node, AtRule.prototype);
      } else if (node.type === "rule") {
        Object.setPrototypeOf(node, Rule.prototype);
      } else if (node.type === "decl") {
        Object.setPrototypeOf(node, Declaration.prototype);
      } else if (node.type === "comment") {
        Object.setPrototypeOf(node, Comment.prototype);
      } else if (node.type === "root") {
        Object.setPrototypeOf(node, Root.prototype);
      }
      node[my] = true;
      if (node.nodes) {
        node.nodes.forEach((child) => {
          Container.rebuild(child);
        });
      }
    };
  }
});

// node_modules/postcss/lib/document.js
var require_document = __commonJS({
  "node_modules/postcss/lib/document.js"(exports, module) {
    "use strict";
    var Container = require_container();
    var LazyResult;
    var Processor;
    var Document = class extends Container {
      constructor(defaults) {
        super({ type: "document", ...defaults });
        if (!this.nodes) {
          this.nodes = [];
        }
      }
      toResult(opts = {}) {
        let lazy = new LazyResult(new Processor(), this, opts);
        return lazy.stringify();
      }
    };
    Document.registerLazyResult = (dependant) => {
      LazyResult = dependant;
    };
    Document.registerProcessor = (dependant) => {
      Processor = dependant;
    };
    module.exports = Document;
    Document.default = Document;
  }
});

// node_modules/postcss/lib/warn-once.js
var require_warn_once = __commonJS({
  "node_modules/postcss/lib/warn-once.js"(exports, module) {
    "use strict";
    var printed = {};
    module.exports = function warnOnce(message) {
      if (printed[message])
        return;
      printed[message] = true;
      if (typeof console !== "undefined" && console.warn) {
        console.warn(message);
      }
    };
  }
});

// node_modules/postcss/lib/warning.js
var require_warning = __commonJS({
  "node_modules/postcss/lib/warning.js"(exports, module) {
    "use strict";
    var Warning = class {
      constructor(text, opts = {}) {
        this.type = "warning";
        this.text = text;
        if (opts.node && opts.node.source) {
          let range = opts.node.rangeBy(opts);
          this.line = range.start.line;
          this.column = range.start.column;
          this.endLine = range.end.line;
          this.endColumn = range.end.column;
        }
        for (let opt in opts)
          this[opt] = opts[opt];
      }
      toString() {
        if (this.node) {
          return this.node.error(this.text, {
            plugin: this.plugin,
            index: this.index,
            word: this.word
          }).message;
        }
        if (this.plugin) {
          return this.plugin + ": " + this.text;
        }
        return this.text;
      }
    };
    module.exports = Warning;
    Warning.default = Warning;
  }
});

// node_modules/postcss/lib/result.js
var require_result = __commonJS({
  "node_modules/postcss/lib/result.js"(exports, module) {
    "use strict";
    var Warning = require_warning();
    var Result = class {
      constructor(processor, root, opts) {
        this.processor = processor;
        this.messages = [];
        this.root = root;
        this.opts = opts;
        this.css = void 0;
        this.map = void 0;
      }
      toString() {
        return this.css;
      }
      warn(text, opts = {}) {
        if (!opts.plugin) {
          if (this.lastPlugin && this.lastPlugin.postcssPlugin) {
            opts.plugin = this.lastPlugin.postcssPlugin;
          }
        }
        let warning = new Warning(text, opts);
        this.messages.push(warning);
        return warning;
      }
      warnings() {
        return this.messages.filter((i) => i.type === "warning");
      }
      get content() {
        return this.css;
      }
    };
    module.exports = Result;
    Result.default = Result;
  }
});

// node_modules/postcss/lib/tokenize.js
var require_tokenize = __commonJS({
  "node_modules/postcss/lib/tokenize.js"(exports, module) {
    "use strict";
    var SINGLE_QUOTE = "'".charCodeAt(0);
    var DOUBLE_QUOTE = '"'.charCodeAt(0);
    var BACKSLASH = "\\".charCodeAt(0);
    var SLASH = "/".charCodeAt(0);
    var NEWLINE = "\n".charCodeAt(0);
    var SPACE = " ".charCodeAt(0);
    var FEED = "\f".charCodeAt(0);
    var TAB = "	".charCodeAt(0);
    var CR = "\r".charCodeAt(0);
    var OPEN_SQUARE = "[".charCodeAt(0);
    var CLOSE_SQUARE = "]".charCodeAt(0);
    var OPEN_PARENTHESES = "(".charCodeAt(0);
    var CLOSE_PARENTHESES = ")".charCodeAt(0);
    var OPEN_CURLY = "{".charCodeAt(0);
    var CLOSE_CURLY = "}".charCodeAt(0);
    var SEMICOLON = ";".charCodeAt(0);
    var ASTERISK = "*".charCodeAt(0);
    var COLON = ":".charCodeAt(0);
    var AT = "@".charCodeAt(0);
    var RE_AT_END = /[\t\n\f\r "#'()/;[\\\]{}]/g;
    var RE_WORD_END = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g;
    var RE_BAD_BRACKET = /.[\n"'(/\\]/;
    var RE_HEX_ESCAPE = /[\da-f]/i;
    module.exports = function tokenizer(input, options = {}) {
      let css = input.css.valueOf();
      let ignore = options.ignoreErrors;
      let code, next, quote, content, escape;
      let escaped, escapePos, prev, n, currentToken;
      let length = css.length;
      let pos = 0;
      let buffer = [];
      let returned = [];
      function position() {
        return pos;
      }
      function unclosed(what) {
        throw input.error("Unclosed " + what, pos);
      }
      function endOfFile() {
        return returned.length === 0 && pos >= length;
      }
      function nextToken(opts) {
        if (returned.length)
          return returned.pop();
        if (pos >= length)
          return;
        let ignoreUnclosed = opts ? opts.ignoreUnclosed : false;
        code = css.charCodeAt(pos);
        switch (code) {
          case NEWLINE:
          case SPACE:
          case TAB:
          case CR:
          case FEED: {
            next = pos;
            do {
              next += 1;
              code = css.charCodeAt(next);
            } while (code === SPACE || code === NEWLINE || code === TAB || code === CR || code === FEED);
            currentToken = ["space", css.slice(pos, next)];
            pos = next - 1;
            break;
          }
          case OPEN_SQUARE:
          case CLOSE_SQUARE:
          case OPEN_CURLY:
          case CLOSE_CURLY:
          case COLON:
          case SEMICOLON:
          case CLOSE_PARENTHESES: {
            let controlChar = String.fromCharCode(code);
            currentToken = [controlChar, controlChar, pos];
            break;
          }
          case OPEN_PARENTHESES: {
            prev = buffer.length ? buffer.pop()[1] : "";
            n = css.charCodeAt(pos + 1);
            if (prev === "url" && n !== SINGLE_QUOTE && n !== DOUBLE_QUOTE && n !== SPACE && n !== NEWLINE && n !== TAB && n !== FEED && n !== CR) {
              next = pos;
              do {
                escaped = false;
                next = css.indexOf(")", next + 1);
                if (next === -1) {
                  if (ignore || ignoreUnclosed) {
                    next = pos;
                    break;
                  } else {
                    unclosed("bracket");
                  }
                }
                escapePos = next;
                while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
                  escapePos -= 1;
                  escaped = !escaped;
                }
              } while (escaped);
              currentToken = ["brackets", css.slice(pos, next + 1), pos, next];
              pos = next;
            } else {
              next = css.indexOf(")", pos + 1);
              content = css.slice(pos, next + 1);
              if (next === -1 || RE_BAD_BRACKET.test(content)) {
                currentToken = ["(", "(", pos];
              } else {
                currentToken = ["brackets", content, pos, next];
                pos = next;
              }
            }
            break;
          }
          case SINGLE_QUOTE:
          case DOUBLE_QUOTE: {
            quote = code === SINGLE_QUOTE ? "'" : '"';
            next = pos;
            do {
              escaped = false;
              next = css.indexOf(quote, next + 1);
              if (next === -1) {
                if (ignore || ignoreUnclosed) {
                  next = pos + 1;
                  break;
                } else {
                  unclosed("string");
                }
              }
              escapePos = next;
              while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
                escapePos -= 1;
                escaped = !escaped;
              }
            } while (escaped);
            currentToken = ["string", css.slice(pos, next + 1), pos, next];
            pos = next;
            break;
          }
          case AT: {
            RE_AT_END.lastIndex = pos + 1;
            RE_AT_END.test(css);
            if (RE_AT_END.lastIndex === 0) {
              next = css.length - 1;
            } else {
              next = RE_AT_END.lastIndex - 2;
            }
            currentToken = ["at-word", css.slice(pos, next + 1), pos, next];
            pos = next;
            break;
          }
          case BACKSLASH: {
            next = pos;
            escape = true;
            while (css.charCodeAt(next + 1) === BACKSLASH) {
              next += 1;
              escape = !escape;
            }
            code = css.charCodeAt(next + 1);
            if (escape && code !== SLASH && code !== SPACE && code !== NEWLINE && code !== TAB && code !== CR && code !== FEED) {
              next += 1;
              if (RE_HEX_ESCAPE.test(css.charAt(next))) {
                while (RE_HEX_ESCAPE.test(css.charAt(next + 1))) {
                  next += 1;
                }
                if (css.charCodeAt(next + 1) === SPACE) {
                  next += 1;
                }
              }
            }
            currentToken = ["word", css.slice(pos, next + 1), pos, next];
            pos = next;
            break;
          }
          default: {
            if (code === SLASH && css.charCodeAt(pos + 1) === ASTERISK) {
              next = css.indexOf("*/", pos + 2) + 1;
              if (next === 0) {
                if (ignore || ignoreUnclosed) {
                  next = css.length;
                } else {
                  unclosed("comment");
                }
              }
              currentToken = ["comment", css.slice(pos, next + 1), pos, next];
              pos = next;
            } else {
              RE_WORD_END.lastIndex = pos + 1;
              RE_WORD_END.test(css);
              if (RE_WORD_END.lastIndex === 0) {
                next = css.length - 1;
              } else {
                next = RE_WORD_END.lastIndex - 2;
              }
              currentToken = ["word", css.slice(pos, next + 1), pos, next];
              buffer.push(currentToken);
              pos = next;
            }
            break;
          }
        }
        pos++;
        return currentToken;
      }
      function back(token) {
        returned.push(token);
      }
      return {
        back,
        nextToken,
        endOfFile,
        position
      };
    };
  }
});

// node_modules/postcss/lib/at-rule.js
var require_at_rule = __commonJS({
  "node_modules/postcss/lib/at-rule.js"(exports, module) {
    "use strict";
    var Container = require_container();
    var AtRule = class extends Container {
      constructor(defaults) {
        super(defaults);
        this.type = "atrule";
      }
      append(...children) {
        if (!this.proxyOf.nodes)
          this.nodes = [];
        return super.append(...children);
      }
      prepend(...children) {
        if (!this.proxyOf.nodes)
          this.nodes = [];
        return super.prepend(...children);
      }
    };
    module.exports = AtRule;
    AtRule.default = AtRule;
    Container.registerAtRule(AtRule);
  }
});

// node_modules/postcss/lib/root.js
var require_root = __commonJS({
  "node_modules/postcss/lib/root.js"(exports, module) {
    "use strict";
    var Container = require_container();
    var LazyResult;
    var Processor;
    var Root = class extends Container {
      constructor(defaults) {
        super(defaults);
        this.type = "root";
        if (!this.nodes)
          this.nodes = [];
      }
      removeChild(child, ignore) {
        let index = this.index(child);
        if (!ignore && index === 0 && this.nodes.length > 1) {
          this.nodes[1].raws.before = this.nodes[index].raws.before;
        }
        return super.removeChild(child);
      }
      normalize(child, sample, type) {
        let nodes = super.normalize(child);
        if (sample) {
          if (type === "prepend") {
            if (this.nodes.length > 1) {
              sample.raws.before = this.nodes[1].raws.before;
            } else {
              delete sample.raws.before;
            }
          } else if (this.first !== sample) {
            for (let node of nodes) {
              node.raws.before = sample.raws.before;
            }
          }
        }
        return nodes;
      }
      toResult(opts = {}) {
        let lazy = new LazyResult(new Processor(), this, opts);
        return lazy.stringify();
      }
    };
    Root.registerLazyResult = (dependant) => {
      LazyResult = dependant;
    };
    Root.registerProcessor = (dependant) => {
      Processor = dependant;
    };
    module.exports = Root;
    Root.default = Root;
    Container.registerRoot(Root);
  }
});

// node_modules/postcss/lib/list.js
var require_list = __commonJS({
  "node_modules/postcss/lib/list.js"(exports, module) {
    "use strict";
    var list = {
      split(string, separators, last) {
        let array = [];
        let current = "";
        let split = false;
        let func = 0;
        let inQuote = false;
        let prevQuote = "";
        let escape = false;
        for (let letter of string) {
          if (escape) {
            escape = false;
          } else if (letter === "\\") {
            escape = true;
          } else if (inQuote) {
            if (letter === prevQuote) {
              inQuote = false;
            }
          } else if (letter === '"' || letter === "'") {
            inQuote = true;
            prevQuote = letter;
          } else if (letter === "(") {
            func += 1;
          } else if (letter === ")") {
            if (func > 0)
              func -= 1;
          } else if (func === 0) {
            if (separators.includes(letter))
              split = true;
          }
          if (split) {
            if (current !== "")
              array.push(current.trim());
            current = "";
            split = false;
          } else {
            current += letter;
          }
        }
        if (last || current !== "")
          array.push(current.trim());
        return array;
      },
      space(string) {
        let spaces = [" ", "\n", "	"];
        return list.split(string, spaces);
      },
      comma(string) {
        return list.split(string, [","], true);
      }
    };
    module.exports = list;
    list.default = list;
  }
});

// node_modules/postcss/lib/rule.js
var require_rule = __commonJS({
  "node_modules/postcss/lib/rule.js"(exports, module) {
    "use strict";
    var Container = require_container();
    var list = require_list();
    var Rule = class extends Container {
      constructor(defaults) {
        super(defaults);
        this.type = "rule";
        if (!this.nodes)
          this.nodes = [];
      }
      get selectors() {
        return list.comma(this.selector);
      }
      set selectors(values) {
        let match = this.selector ? this.selector.match(/,\s*/) : null;
        let sep = match ? match[0] : "," + this.raw("between", "beforeOpen");
        this.selector = values.join(sep);
      }
    };
    module.exports = Rule;
    Rule.default = Rule;
    Container.registerRule(Rule);
  }
});

// node_modules/postcss/lib/parser.js
var require_parser = __commonJS({
  "node_modules/postcss/lib/parser.js"(exports, module) {
    "use strict";
    var Declaration = require_declaration();
    var tokenizer = require_tokenize();
    var Comment = require_comment();
    var AtRule = require_at_rule();
    var Root = require_root();
    var Rule = require_rule();
    var SAFE_COMMENT_NEIGHBOR = {
      empty: true,
      space: true
    };
    function findLastWithPosition(tokens) {
      for (let i = tokens.length - 1; i >= 0; i--) {
        let token = tokens[i];
        let pos = token[3] || token[2];
        if (pos)
          return pos;
      }
    }
    var Parser = class {
      constructor(input) {
        this.input = input;
        this.root = new Root();
        this.current = this.root;
        this.spaces = "";
        this.semicolon = false;
        this.customProperty = false;
        this.createTokenizer();
        this.root.source = { input, start: { offset: 0, line: 1, column: 1 } };
      }
      createTokenizer() {
        this.tokenizer = tokenizer(this.input);
      }
      parse() {
        let token;
        while (!this.tokenizer.endOfFile()) {
          token = this.tokenizer.nextToken();
          switch (token[0]) {
            case "space":
              this.spaces += token[1];
              break;
            case ";":
              this.freeSemicolon(token);
              break;
            case "}":
              this.end(token);
              break;
            case "comment":
              this.comment(token);
              break;
            case "at-word":
              this.atrule(token);
              break;
            case "{":
              this.emptyRule(token);
              break;
            default:
              this.other(token);
              break;
          }
        }
        this.endFile();
      }
      comment(token) {
        let node = new Comment();
        this.init(node, token[2]);
        node.source.end = this.getPosition(token[3] || token[2]);
        let text = token[1].slice(2, -2);
        if (/^\s*$/.test(text)) {
          node.text = "";
          node.raws.left = text;
          node.raws.right = "";
        } else {
          let match = text.match(/^(\s*)([^]*\S)(\s*)$/);
          node.text = match[2];
          node.raws.left = match[1];
          node.raws.right = match[3];
        }
      }
      emptyRule(token) {
        let node = new Rule();
        this.init(node, token[2]);
        node.selector = "";
        node.raws.between = "";
        this.current = node;
      }
      other(start) {
        let end = false;
        let type = null;
        let colon = false;
        let bracket = null;
        let brackets = [];
        let customProperty = start[1].startsWith("--");
        let tokens = [];
        let token = start;
        while (token) {
          type = token[0];
          tokens.push(token);
          if (type === "(" || type === "[") {
            if (!bracket)
              bracket = token;
            brackets.push(type === "(" ? ")" : "]");
          } else if (customProperty && colon && type === "{") {
            if (!bracket)
              bracket = token;
            brackets.push("}");
          } else if (brackets.length === 0) {
            if (type === ";") {
              if (colon) {
                this.decl(tokens, customProperty);
                return;
              } else {
                break;
              }
            } else if (type === "{") {
              this.rule(tokens);
              return;
            } else if (type === "}") {
              this.tokenizer.back(tokens.pop());
              end = true;
              break;
            } else if (type === ":") {
              colon = true;
            }
          } else if (type === brackets[brackets.length - 1]) {
            brackets.pop();
            if (brackets.length === 0)
              bracket = null;
          }
          token = this.tokenizer.nextToken();
        }
        if (this.tokenizer.endOfFile())
          end = true;
        if (brackets.length > 0)
          this.unclosedBracket(bracket);
        if (end && colon) {
          if (!customProperty) {
            while (tokens.length) {
              token = tokens[tokens.length - 1][0];
              if (token !== "space" && token !== "comment")
                break;
              this.tokenizer.back(tokens.pop());
            }
          }
          this.decl(tokens, customProperty);
        } else {
          this.unknownWord(tokens);
        }
      }
      rule(tokens) {
        tokens.pop();
        let node = new Rule();
        this.init(node, tokens[0][2]);
        node.raws.between = this.spacesAndCommentsFromEnd(tokens);
        this.raw(node, "selector", tokens);
        this.current = node;
      }
      decl(tokens, customProperty) {
        let node = new Declaration();
        this.init(node, tokens[0][2]);
        let last = tokens[tokens.length - 1];
        if (last[0] === ";") {
          this.semicolon = true;
          tokens.pop();
        }
        node.source.end = this.getPosition(
          last[3] || last[2] || findLastWithPosition(tokens)
        );
        while (tokens[0][0] !== "word") {
          if (tokens.length === 1)
            this.unknownWord(tokens);
          node.raws.before += tokens.shift()[1];
        }
        node.source.start = this.getPosition(tokens[0][2]);
        node.prop = "";
        while (tokens.length) {
          let type = tokens[0][0];
          if (type === ":" || type === "space" || type === "comment") {
            break;
          }
          node.prop += tokens.shift()[1];
        }
        node.raws.between = "";
        let token;
        while (tokens.length) {
          token = tokens.shift();
          if (token[0] === ":") {
            node.raws.between += token[1];
            break;
          } else {
            if (token[0] === "word" && /\w/.test(token[1])) {
              this.unknownWord([token]);
            }
            node.raws.between += token[1];
          }
        }
        if (node.prop[0] === "_" || node.prop[0] === "*") {
          node.raws.before += node.prop[0];
          node.prop = node.prop.slice(1);
        }
        let firstSpaces = [];
        let next;
        while (tokens.length) {
          next = tokens[0][0];
          if (next !== "space" && next !== "comment")
            break;
          firstSpaces.push(tokens.shift());
        }
        this.precheckMissedSemicolon(tokens);
        for (let i = tokens.length - 1; i >= 0; i--) {
          token = tokens[i];
          if (token[1].toLowerCase() === "!important") {
            node.important = true;
            let string = this.stringFrom(tokens, i);
            string = this.spacesFromEnd(tokens) + string;
            if (string !== " !important")
              node.raws.important = string;
            break;
          } else if (token[1].toLowerCase() === "important") {
            let cache = tokens.slice(0);
            let str = "";
            for (let j = i; j > 0; j--) {
              let type = cache[j][0];
              if (str.trim().indexOf("!") === 0 && type !== "space") {
                break;
              }
              str = cache.pop()[1] + str;
            }
            if (str.trim().indexOf("!") === 0) {
              node.important = true;
              node.raws.important = str;
              tokens = cache;
            }
          }
          if (token[0] !== "space" && token[0] !== "comment") {
            break;
          }
        }
        let hasWord = tokens.some((i) => i[0] !== "space" && i[0] !== "comment");
        if (hasWord) {
          node.raws.between += firstSpaces.map((i) => i[1]).join("");
          firstSpaces = [];
        }
        this.raw(node, "value", firstSpaces.concat(tokens), customProperty);
        if (node.value.includes(":") && !customProperty) {
          this.checkMissedSemicolon(tokens);
        }
      }
      atrule(token) {
        let node = new AtRule();
        node.name = token[1].slice(1);
        if (node.name === "") {
          this.unnamedAtrule(node, token);
        }
        this.init(node, token[2]);
        let type;
        let prev;
        let shift;
        let last = false;
        let open = false;
        let params = [];
        let brackets = [];
        while (!this.tokenizer.endOfFile()) {
          token = this.tokenizer.nextToken();
          type = token[0];
          if (type === "(" || type === "[") {
            brackets.push(type === "(" ? ")" : "]");
          } else if (type === "{" && brackets.length > 0) {
            brackets.push("}");
          } else if (type === brackets[brackets.length - 1]) {
            brackets.pop();
          }
          if (brackets.length === 0) {
            if (type === ";") {
              node.source.end = this.getPosition(token[2]);
              this.semicolon = true;
              break;
            } else if (type === "{") {
              open = true;
              break;
            } else if (type === "}") {
              if (params.length > 0) {
                shift = params.length - 1;
                prev = params[shift];
                while (prev && prev[0] === "space") {
                  prev = params[--shift];
                }
                if (prev) {
                  node.source.end = this.getPosition(prev[3] || prev[2]);
                }
              }
              this.end(token);
              break;
            } else {
              params.push(token);
            }
          } else {
            params.push(token);
          }
          if (this.tokenizer.endOfFile()) {
            last = true;
            break;
          }
        }
        node.raws.between = this.spacesAndCommentsFromEnd(params);
        if (params.length) {
          node.raws.afterName = this.spacesAndCommentsFromStart(params);
          this.raw(node, "params", params);
          if (last) {
            token = params[params.length - 1];
            node.source.end = this.getPosition(token[3] || token[2]);
            this.spaces = node.raws.between;
            node.raws.between = "";
          }
        } else {
          node.raws.afterName = "";
          node.params = "";
        }
        if (open) {
          node.nodes = [];
          this.current = node;
        }
      }
      end(token) {
        if (this.current.nodes && this.current.nodes.length) {
          this.current.raws.semicolon = this.semicolon;
        }
        this.semicolon = false;
        this.current.raws.after = (this.current.raws.after || "") + this.spaces;
        this.spaces = "";
        if (this.current.parent) {
          this.current.source.end = this.getPosition(token[2]);
          this.current = this.current.parent;
        } else {
          this.unexpectedClose(token);
        }
      }
      endFile() {
        if (this.current.parent)
          this.unclosedBlock();
        if (this.current.nodes && this.current.nodes.length) {
          this.current.raws.semicolon = this.semicolon;
        }
        this.current.raws.after = (this.current.raws.after || "") + this.spaces;
      }
      freeSemicolon(token) {
        this.spaces += token[1];
        if (this.current.nodes) {
          let prev = this.current.nodes[this.current.nodes.length - 1];
          if (prev && prev.type === "rule" && !prev.raws.ownSemicolon) {
            prev.raws.ownSemicolon = this.spaces;
            this.spaces = "";
          }
        }
      }
      // Helpers
      getPosition(offset) {
        let pos = this.input.fromOffset(offset);
        return {
          offset,
          line: pos.line,
          column: pos.col
        };
      }
      init(node, offset) {
        this.current.push(node);
        node.source = {
          start: this.getPosition(offset),
          input: this.input
        };
        node.raws.before = this.spaces;
        this.spaces = "";
        if (node.type !== "comment")
          this.semicolon = false;
      }
      raw(node, prop, tokens, customProperty) {
        let token, type;
        let length = tokens.length;
        let value = "";
        let clean = true;
        let next, prev;
        for (let i = 0; i < length; i += 1) {
          token = tokens[i];
          type = token[0];
          if (type === "space" && i === length - 1 && !customProperty) {
            clean = false;
          } else if (type === "comment") {
            prev = tokens[i - 1] ? tokens[i - 1][0] : "empty";
            next = tokens[i + 1] ? tokens[i + 1][0] : "empty";
            if (!SAFE_COMMENT_NEIGHBOR[prev] && !SAFE_COMMENT_NEIGHBOR[next]) {
              if (value.slice(-1) === ",") {
                clean = false;
              } else {
                value += token[1];
              }
            } else {
              clean = false;
            }
          } else {
            value += token[1];
          }
        }
        if (!clean) {
          let raw = tokens.reduce((all, i) => all + i[1], "");
          node.raws[prop] = { value, raw };
        }
        node[prop] = value;
      }
      spacesAndCommentsFromEnd(tokens) {
        let lastTokenType;
        let spaces = "";
        while (tokens.length) {
          lastTokenType = tokens[tokens.length - 1][0];
          if (lastTokenType !== "space" && lastTokenType !== "comment")
            break;
          spaces = tokens.pop()[1] + spaces;
        }
        return spaces;
      }
      spacesAndCommentsFromStart(tokens) {
        let next;
        let spaces = "";
        while (tokens.length) {
          next = tokens[0][0];
          if (next !== "space" && next !== "comment")
            break;
          spaces += tokens.shift()[1];
        }
        return spaces;
      }
      spacesFromEnd(tokens) {
        let lastTokenType;
        let spaces = "";
        while (tokens.length) {
          lastTokenType = tokens[tokens.length - 1][0];
          if (lastTokenType !== "space")
            break;
          spaces = tokens.pop()[1] + spaces;
        }
        return spaces;
      }
      stringFrom(tokens, from) {
        let result = "";
        for (let i = from; i < tokens.length; i++) {
          result += tokens[i][1];
        }
        tokens.splice(from, tokens.length - from);
        return result;
      }
      colon(tokens) {
        let brackets = 0;
        let token, type, prev;
        for (let [i, element] of tokens.entries()) {
          token = element;
          type = token[0];
          if (type === "(") {
            brackets += 1;
          }
          if (type === ")") {
            brackets -= 1;
          }
          if (brackets === 0 && type === ":") {
            if (!prev) {
              this.doubleColon(token);
            } else if (prev[0] === "word" && prev[1] === "progid") {
              continue;
            } else {
              return i;
            }
          }
          prev = token;
        }
        return false;
      }
      // Errors
      unclosedBracket(bracket) {
        throw this.input.error(
          "Unclosed bracket",
          { offset: bracket[2] },
          { offset: bracket[2] + 1 }
        );
      }
      unknownWord(tokens) {
        throw this.input.error(
          "Unknown word",
          { offset: tokens[0][2] },
          { offset: tokens[0][2] + tokens[0][1].length }
        );
      }
      unexpectedClose(token) {
        throw this.input.error(
          "Unexpected }",
          { offset: token[2] },
          { offset: token[2] + 1 }
        );
      }
      unclosedBlock() {
        let pos = this.current.source.start;
        throw this.input.error("Unclosed block", pos.line, pos.column);
      }
      doubleColon(token) {
        throw this.input.error(
          "Double colon",
          { offset: token[2] },
          { offset: token[2] + token[1].length }
        );
      }
      unnamedAtrule(node, token) {
        throw this.input.error(
          "At-rule without name",
          { offset: token[2] },
          { offset: token[2] + token[1].length }
        );
      }
      precheckMissedSemicolon() {
      }
      checkMissedSemicolon(tokens) {
        let colon = this.colon(tokens);
        if (colon === false)
          return;
        let founded = 0;
        let token;
        for (let j = colon - 1; j >= 0; j--) {
          token = tokens[j];
          if (token[0] !== "space") {
            founded += 1;
            if (founded === 2)
              break;
          }
        }
        throw this.input.error(
          "Missed semicolon",
          token[0] === "word" ? token[3] + 1 : token[2]
        );
      }
    };
    module.exports = Parser;
  }
});

// node_modules/postcss/lib/parse.js
var require_parse = __commonJS({
  "node_modules/postcss/lib/parse.js"(exports, module) {
    "use strict";
    var Container = require_container();
    var Parser = require_parser();
    var Input = require_input();
    function parse(css, opts) {
      let input = new Input(css, opts);
      let parser = new Parser(input);
      try {
        parser.parse();
      } catch (e) {
        if (true) {
          if (e.name === "CssSyntaxError" && opts && opts.from) {
            if (/\.scss$/i.test(opts.from)) {
              e.message += "\nYou tried to parse SCSS with the standard CSS parser; try again with the postcss-scss parser";
            } else if (/\.sass/i.test(opts.from)) {
              e.message += "\nYou tried to parse Sass with the standard CSS parser; try again with the postcss-sass parser";
            } else if (/\.less$/i.test(opts.from)) {
              e.message += "\nYou tried to parse Less with the standard CSS parser; try again with the postcss-less parser";
            }
          }
        }
        throw e;
      }
      return parser.root;
    }
    module.exports = parse;
    parse.default = parse;
    Container.registerParse(parse);
  }
});

// node_modules/postcss/lib/lazy-result.js
var require_lazy_result = __commonJS({
  "node_modules/postcss/lib/lazy-result.js"(exports, module) {
    "use strict";
    var { isClean, my } = require_symbols();
    var MapGenerator = require_map_generator();
    var stringify = require_stringify2();
    var Container = require_container();
    var Document = require_document();
    var warnOnce = require_warn_once();
    var Result = require_result();
    var parse = require_parse();
    var Root = require_root();
    var TYPE_TO_CLASS_NAME = {
      document: "Document",
      root: "Root",
      atrule: "AtRule",
      rule: "Rule",
      decl: "Declaration",
      comment: "Comment"
    };
    var PLUGIN_PROPS = {
      postcssPlugin: true,
      prepare: true,
      Once: true,
      Document: true,
      Root: true,
      Declaration: true,
      Rule: true,
      AtRule: true,
      Comment: true,
      DeclarationExit: true,
      RuleExit: true,
      AtRuleExit: true,
      CommentExit: true,
      RootExit: true,
      DocumentExit: true,
      OnceExit: true
    };
    var NOT_VISITORS = {
      postcssPlugin: true,
      prepare: true,
      Once: true
    };
    var CHILDREN = 0;
    function isPromise(obj) {
      return typeof obj === "object" && typeof obj.then === "function";
    }
    function getEvents(node) {
      let key = false;
      let type = TYPE_TO_CLASS_NAME[node.type];
      if (node.type === "decl") {
        key = node.prop.toLowerCase();
      } else if (node.type === "atrule") {
        key = node.name.toLowerCase();
      }
      if (key && node.append) {
        return [
          type,
          type + "-" + key,
          CHILDREN,
          type + "Exit",
          type + "Exit-" + key
        ];
      } else if (key) {
        return [type, type + "-" + key, type + "Exit", type + "Exit-" + key];
      } else if (node.append) {
        return [type, CHILDREN, type + "Exit"];
      } else {
        return [type, type + "Exit"];
      }
    }
    function toStack(node) {
      let events;
      if (node.type === "document") {
        events = ["Document", CHILDREN, "DocumentExit"];
      } else if (node.type === "root") {
        events = ["Root", CHILDREN, "RootExit"];
      } else {
        events = getEvents(node);
      }
      return {
        node,
        events,
        eventIndex: 0,
        visitors: [],
        visitorIndex: 0,
        iterator: 0
      };
    }
    function cleanMarks(node) {
      node[isClean] = false;
      if (node.nodes)
        node.nodes.forEach((i) => cleanMarks(i));
      return node;
    }
    var postcss = {};
    var LazyResult = class {
      constructor(processor, css, opts) {
        this.stringified = false;
        this.processed = false;
        let root;
        if (typeof css === "object" && css !== null && (css.type === "root" || css.type === "document")) {
          root = cleanMarks(css);
        } else if (css instanceof LazyResult || css instanceof Result) {
          root = cleanMarks(css.root);
          if (css.map) {
            if (typeof opts.map === "undefined")
              opts.map = {};
            if (!opts.map.inline)
              opts.map.inline = false;
            opts.map.prev = css.map;
          }
        } else {
          let parser = parse;
          if (opts.syntax)
            parser = opts.syntax.parse;
          if (opts.parser)
            parser = opts.parser;
          if (parser.parse)
            parser = parser.parse;
          try {
            root = parser(css, opts);
          } catch (error) {
            this.processed = true;
            this.error = error;
          }
          if (root && !root[my]) {
            Container.rebuild(root);
          }
        }
        this.result = new Result(processor, root, opts);
        this.helpers = { ...postcss, result: this.result, postcss };
        this.plugins = this.processor.plugins.map((plugin) => {
          if (typeof plugin === "object" && plugin.prepare) {
            return { ...plugin, ...plugin.prepare(this.result) };
          } else {
            return plugin;
          }
        });
      }
      get [Symbol.toStringTag]() {
        return "LazyResult";
      }
      get processor() {
        return this.result.processor;
      }
      get opts() {
        return this.result.opts;
      }
      get css() {
        return this.stringify().css;
      }
      get content() {
        return this.stringify().content;
      }
      get map() {
        return this.stringify().map;
      }
      get root() {
        return this.sync().root;
      }
      get messages() {
        return this.sync().messages;
      }
      warnings() {
        return this.sync().warnings();
      }
      toString() {
        return this.css;
      }
      then(onFulfilled, onRejected) {
        if (true) {
          if (!("from" in this.opts)) {
            warnOnce(
              "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
            );
          }
        }
        return this.async().then(onFulfilled, onRejected);
      }
      catch(onRejected) {
        return this.async().catch(onRejected);
      }
      finally(onFinally) {
        return this.async().then(onFinally, onFinally);
      }
      async() {
        if (this.error)
          return Promise.reject(this.error);
        if (this.processed)
          return Promise.resolve(this.result);
        if (!this.processing) {
          this.processing = this.runAsync();
        }
        return this.processing;
      }
      sync() {
        if (this.error)
          throw this.error;
        if (this.processed)
          return this.result;
        this.processed = true;
        if (this.processing) {
          throw this.getAsyncError();
        }
        for (let plugin of this.plugins) {
          let promise = this.runOnRoot(plugin);
          if (isPromise(promise)) {
            throw this.getAsyncError();
          }
        }
        this.prepareVisitors();
        if (this.hasListener) {
          let root = this.result.root;
          while (!root[isClean]) {
            root[isClean] = true;
            this.walkSync(root);
          }
          if (this.listeners.OnceExit) {
            if (root.type === "document") {
              for (let subRoot of root.nodes) {
                this.visitSync(this.listeners.OnceExit, subRoot);
              }
            } else {
              this.visitSync(this.listeners.OnceExit, root);
            }
          }
        }
        return this.result;
      }
      stringify() {
        if (this.error)
          throw this.error;
        if (this.stringified)
          return this.result;
        this.stringified = true;
        this.sync();
        let opts = this.result.opts;
        let str = stringify;
        if (opts.syntax)
          str = opts.syntax.stringify;
        if (opts.stringifier)
          str = opts.stringifier;
        if (str.stringify)
          str = str.stringify;
        let map = new MapGenerator(str, this.result.root, this.result.opts);
        let data = map.generate();
        this.result.css = data[0];
        this.result.map = data[1];
        return this.result;
      }
      walkSync(node) {
        node[isClean] = true;
        let events = getEvents(node);
        for (let event of events) {
          if (event === CHILDREN) {
            if (node.nodes) {
              node.each((child) => {
                if (!child[isClean])
                  this.walkSync(child);
              });
            }
          } else {
            let visitors = this.listeners[event];
            if (visitors) {
              if (this.visitSync(visitors, node.toProxy()))
                return;
            }
          }
        }
      }
      visitSync(visitors, node) {
        for (let [plugin, visitor] of visitors) {
          this.result.lastPlugin = plugin;
          let promise;
          try {
            promise = visitor(node, this.helpers);
          } catch (e) {
            throw this.handleError(e, node.proxyOf);
          }
          if (node.type !== "root" && node.type !== "document" && !node.parent) {
            return true;
          }
          if (isPromise(promise)) {
            throw this.getAsyncError();
          }
        }
      }
      runOnRoot(plugin) {
        this.result.lastPlugin = plugin;
        try {
          if (typeof plugin === "object" && plugin.Once) {
            if (this.result.root.type === "document") {
              let roots = this.result.root.nodes.map(
                (root) => plugin.Once(root, this.helpers)
              );
              if (isPromise(roots[0])) {
                return Promise.all(roots);
              }
              return roots;
            }
            return plugin.Once(this.result.root, this.helpers);
          } else if (typeof plugin === "function") {
            return plugin(this.result.root, this.result);
          }
        } catch (error) {
          throw this.handleError(error);
        }
      }
      getAsyncError() {
        throw new Error("Use process(css).then(cb) to work with async plugins");
      }
      handleError(error, node) {
        let plugin = this.result.lastPlugin;
        try {
          if (node)
            node.addToError(error);
          this.error = error;
          if (error.name === "CssSyntaxError" && !error.plugin) {
            error.plugin = plugin.postcssPlugin;
            error.setMessage();
          } else if (plugin.postcssVersion) {
            if (true) {
              let pluginName = plugin.postcssPlugin;
              let pluginVer = plugin.postcssVersion;
              let runtimeVer = this.result.processor.version;
              let a = pluginVer.split(".");
              let b = runtimeVer.split(".");
              if (a[0] !== b[0] || parseInt(a[1]) > parseInt(b[1])) {
                console.error(
                  "Unknown error from PostCSS plugin. Your current PostCSS version is " + runtimeVer + ", but " + pluginName + " uses " + pluginVer + ". Perhaps this is the source of the error below."
                );
              }
            }
          }
        } catch (err) {
          if (console && console.error)
            console.error(err);
        }
        return error;
      }
      async runAsync() {
        this.plugin = 0;
        for (let i = 0; i < this.plugins.length; i++) {
          let plugin = this.plugins[i];
          let promise = this.runOnRoot(plugin);
          if (isPromise(promise)) {
            try {
              await promise;
            } catch (error) {
              throw this.handleError(error);
            }
          }
        }
        this.prepareVisitors();
        if (this.hasListener) {
          let root = this.result.root;
          while (!root[isClean]) {
            root[isClean] = true;
            let stack = [toStack(root)];
            while (stack.length > 0) {
              let promise = this.visitTick(stack);
              if (isPromise(promise)) {
                try {
                  await promise;
                } catch (e) {
                  let node = stack[stack.length - 1].node;
                  throw this.handleError(e, node);
                }
              }
            }
          }
          if (this.listeners.OnceExit) {
            for (let [plugin, visitor] of this.listeners.OnceExit) {
              this.result.lastPlugin = plugin;
              try {
                if (root.type === "document") {
                  let roots = root.nodes.map(
                    (subRoot) => visitor(subRoot, this.helpers)
                  );
                  await Promise.all(roots);
                } else {
                  await visitor(root, this.helpers);
                }
              } catch (e) {
                throw this.handleError(e);
              }
            }
          }
        }
        this.processed = true;
        return this.stringify();
      }
      prepareVisitors() {
        this.listeners = {};
        let add = (plugin, type, cb) => {
          if (!this.listeners[type])
            this.listeners[type] = [];
          this.listeners[type].push([plugin, cb]);
        };
        for (let plugin of this.plugins) {
          if (typeof plugin === "object") {
            for (let event in plugin) {
              if (!PLUGIN_PROPS[event] && /^[A-Z]/.test(event)) {
                throw new Error(
                  `Unknown event ${event} in ${plugin.postcssPlugin}. Try to update PostCSS (${this.processor.version} now).`
                );
              }
              if (!NOT_VISITORS[event]) {
                if (typeof plugin[event] === "object") {
                  for (let filter in plugin[event]) {
                    if (filter === "*") {
                      add(plugin, event, plugin[event][filter]);
                    } else {
                      add(
                        plugin,
                        event + "-" + filter.toLowerCase(),
                        plugin[event][filter]
                      );
                    }
                  }
                } else if (typeof plugin[event] === "function") {
                  add(plugin, event, plugin[event]);
                }
              }
            }
          }
        }
        this.hasListener = Object.keys(this.listeners).length > 0;
      }
      visitTick(stack) {
        let visit = stack[stack.length - 1];
        let { node, visitors } = visit;
        if (node.type !== "root" && node.type !== "document" && !node.parent) {
          stack.pop();
          return;
        }
        if (visitors.length > 0 && visit.visitorIndex < visitors.length) {
          let [plugin, visitor] = visitors[visit.visitorIndex];
          visit.visitorIndex += 1;
          if (visit.visitorIndex === visitors.length) {
            visit.visitors = [];
            visit.visitorIndex = 0;
          }
          this.result.lastPlugin = plugin;
          try {
            return visitor(node.toProxy(), this.helpers);
          } catch (e) {
            throw this.handleError(e, node);
          }
        }
        if (visit.iterator !== 0) {
          let iterator = visit.iterator;
          let child;
          while (child = node.nodes[node.indexes[iterator]]) {
            node.indexes[iterator] += 1;
            if (!child[isClean]) {
              child[isClean] = true;
              stack.push(toStack(child));
              return;
            }
          }
          visit.iterator = 0;
          delete node.indexes[iterator];
        }
        let events = visit.events;
        while (visit.eventIndex < events.length) {
          let event = events[visit.eventIndex];
          visit.eventIndex += 1;
          if (event === CHILDREN) {
            if (node.nodes && node.nodes.length) {
              node[isClean] = true;
              visit.iterator = node.getIterator();
            }
            return;
          } else if (this.listeners[event]) {
            visit.visitors = this.listeners[event];
            return;
          }
        }
        stack.pop();
      }
    };
    LazyResult.registerPostcss = (dependant) => {
      postcss = dependant;
    };
    module.exports = LazyResult;
    LazyResult.default = LazyResult;
    Root.registerLazyResult(LazyResult);
    Document.registerLazyResult(LazyResult);
  }
});

// node_modules/postcss/lib/no-work-result.js
var require_no_work_result = __commonJS({
  "node_modules/postcss/lib/no-work-result.js"(exports, module) {
    "use strict";
    var MapGenerator = require_map_generator();
    var stringify = require_stringify2();
    var warnOnce = require_warn_once();
    var parse = require_parse();
    var Result = require_result();
    var NoWorkResult = class {
      constructor(processor, css, opts) {
        css = css.toString();
        this.stringified = false;
        this._processor = processor;
        this._css = css;
        this._opts = opts;
        this._map = void 0;
        let root;
        let str = stringify;
        this.result = new Result(this._processor, root, this._opts);
        this.result.css = css;
        let self = this;
        Object.defineProperty(this.result, "root", {
          get() {
            return self.root;
          }
        });
        let map = new MapGenerator(str, root, this._opts, css);
        if (map.isMap()) {
          let [generatedCSS, generatedMap] = map.generate();
          if (generatedCSS) {
            this.result.css = generatedCSS;
          }
          if (generatedMap) {
            this.result.map = generatedMap;
          }
        }
      }
      get [Symbol.toStringTag]() {
        return "NoWorkResult";
      }
      get processor() {
        return this.result.processor;
      }
      get opts() {
        return this.result.opts;
      }
      get css() {
        return this.result.css;
      }
      get content() {
        return this.result.css;
      }
      get map() {
        return this.result.map;
      }
      get root() {
        if (this._root) {
          return this._root;
        }
        let root;
        let parser = parse;
        try {
          root = parser(this._css, this._opts);
        } catch (error) {
          this.error = error;
        }
        if (this.error) {
          throw this.error;
        } else {
          this._root = root;
          return root;
        }
      }
      get messages() {
        return [];
      }
      warnings() {
        return [];
      }
      toString() {
        return this._css;
      }
      then(onFulfilled, onRejected) {
        if (true) {
          if (!("from" in this._opts)) {
            warnOnce(
              "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
            );
          }
        }
        return this.async().then(onFulfilled, onRejected);
      }
      catch(onRejected) {
        return this.async().catch(onRejected);
      }
      finally(onFinally) {
        return this.async().then(onFinally, onFinally);
      }
      async() {
        if (this.error)
          return Promise.reject(this.error);
        return Promise.resolve(this.result);
      }
      sync() {
        if (this.error)
          throw this.error;
        return this.result;
      }
    };
    module.exports = NoWorkResult;
    NoWorkResult.default = NoWorkResult;
  }
});

// node_modules/postcss/lib/processor.js
var require_processor = __commonJS({
  "node_modules/postcss/lib/processor.js"(exports, module) {
    "use strict";
    var NoWorkResult = require_no_work_result();
    var LazyResult = require_lazy_result();
    var Document = require_document();
    var Root = require_root();
    var Processor = class {
      constructor(plugins = []) {
        this.version = "8.4.18";
        this.plugins = this.normalize(plugins);
      }
      use(plugin) {
        this.plugins = this.plugins.concat(this.normalize([plugin]));
        return this;
      }
      process(css, opts = {}) {
        if (this.plugins.length === 0 && typeof opts.parser === "undefined" && typeof opts.stringifier === "undefined" && typeof opts.syntax === "undefined") {
          return new NoWorkResult(this, css, opts);
        } else {
          return new LazyResult(this, css, opts);
        }
      }
      normalize(plugins) {
        let normalized = [];
        for (let i of plugins) {
          if (i.postcss === true) {
            i = i();
          } else if (i.postcss) {
            i = i.postcss;
          }
          if (typeof i === "object" && Array.isArray(i.plugins)) {
            normalized = normalized.concat(i.plugins);
          } else if (typeof i === "object" && i.postcssPlugin) {
            normalized.push(i);
          } else if (typeof i === "function") {
            normalized.push(i);
          } else if (typeof i === "object" && (i.parse || i.stringify)) {
            if (true) {
              throw new Error(
                "PostCSS syntaxes cannot be used as plugins. Instead, please use one of the syntax/parser/stringifier options as outlined in your PostCSS runner documentation."
              );
            }
          } else {
            throw new Error(i + " is not a PostCSS plugin");
          }
        }
        return normalized;
      }
    };
    module.exports = Processor;
    Processor.default = Processor;
    Root.registerProcessor(Processor);
    Document.registerProcessor(Processor);
  }
});

// node_modules/postcss/lib/fromJSON.js
var require_fromJSON = __commonJS({
  "node_modules/postcss/lib/fromJSON.js"(exports, module) {
    "use strict";
    var Declaration = require_declaration();
    var PreviousMap = require_previous_map();
    var Comment = require_comment();
    var AtRule = require_at_rule();
    var Input = require_input();
    var Root = require_root();
    var Rule = require_rule();
    function fromJSON(json, inputs) {
      if (Array.isArray(json))
        return json.map((n) => fromJSON(n));
      let { inputs: ownInputs, ...defaults } = json;
      if (ownInputs) {
        inputs = [];
        for (let input of ownInputs) {
          let inputHydrated = { ...input, __proto__: Input.prototype };
          if (inputHydrated.map) {
            inputHydrated.map = {
              ...inputHydrated.map,
              __proto__: PreviousMap.prototype
            };
          }
          inputs.push(inputHydrated);
        }
      }
      if (defaults.nodes) {
        defaults.nodes = json.nodes.map((n) => fromJSON(n, inputs));
      }
      if (defaults.source) {
        let { inputId, ...source } = defaults.source;
        defaults.source = source;
        if (inputId != null) {
          defaults.source.input = inputs[inputId];
        }
      }
      if (defaults.type === "root") {
        return new Root(defaults);
      } else if (defaults.type === "decl") {
        return new Declaration(defaults);
      } else if (defaults.type === "rule") {
        return new Rule(defaults);
      } else if (defaults.type === "comment") {
        return new Comment(defaults);
      } else if (defaults.type === "atrule") {
        return new AtRule(defaults);
      } else {
        throw new Error("Unknown node type: " + json.type);
      }
    }
    module.exports = fromJSON;
    fromJSON.default = fromJSON;
  }
});

// node_modules/postcss/lib/postcss.js
var require_postcss = __commonJS({
  "node_modules/postcss/lib/postcss.js"(exports, module) {
    "use strict";
    var CssSyntaxError = require_css_syntax_error();
    var Declaration = require_declaration();
    var LazyResult = require_lazy_result();
    var Container = require_container();
    var Processor = require_processor();
    var stringify = require_stringify2();
    var fromJSON = require_fromJSON();
    var Document = require_document();
    var Warning = require_warning();
    var Comment = require_comment();
    var AtRule = require_at_rule();
    var Result = require_result();
    var Input = require_input();
    var parse = require_parse();
    var list = require_list();
    var Rule = require_rule();
    var Root = require_root();
    var Node = require_node2();
    function postcss(...plugins) {
      if (plugins.length === 1 && Array.isArray(plugins[0])) {
        plugins = plugins[0];
      }
      return new Processor(plugins);
    }
    postcss.plugin = function plugin(name, initializer) {
      let warningPrinted = false;
      function creator(...args) {
        if (console && console.warn && !warningPrinted) {
          warningPrinted = true;
          console.warn(
            name + ": postcss.plugin was deprecated. Migration guide:\nhttps://evilmartians.com/chronicles/postcss-8-plugin-migration"
          );
          if (process.env.LANG && process.env.LANG.startsWith("cn")) {
            console.warn(
              name + ": \u91CC\u9762 postcss.plugin \u88AB\u5F03\u7528. \u8FC1\u79FB\u6307\u5357:\nhttps://www.w3ctech.com/topic/2226"
            );
          }
        }
        let transformer = initializer(...args);
        transformer.postcssPlugin = name;
        transformer.postcssVersion = new Processor().version;
        return transformer;
      }
      let cache;
      Object.defineProperty(creator, "postcss", {
        get() {
          if (!cache)
            cache = creator();
          return cache;
        }
      });
      creator.process = function(css, processOpts, pluginOpts) {
        return postcss([creator(pluginOpts)]).process(css, processOpts);
      };
      return creator;
    };
    postcss.stringify = stringify;
    postcss.parse = parse;
    postcss.fromJSON = fromJSON;
    postcss.list = list;
    postcss.comment = (defaults) => new Comment(defaults);
    postcss.atRule = (defaults) => new AtRule(defaults);
    postcss.decl = (defaults) => new Declaration(defaults);
    postcss.rule = (defaults) => new Rule(defaults);
    postcss.root = (defaults) => new Root(defaults);
    postcss.document = (defaults) => new Document(defaults);
    postcss.CssSyntaxError = CssSyntaxError;
    postcss.Declaration = Declaration;
    postcss.Container = Container;
    postcss.Processor = Processor;
    postcss.Document = Document;
    postcss.Comment = Comment;
    postcss.Warning = Warning;
    postcss.AtRule = AtRule;
    postcss.Result = Result;
    postcss.Input = Input;
    postcss.Rule = Rule;
    postcss.Root = Root;
    postcss.Node = Node;
    LazyResult.registerPostcss(postcss);
    module.exports = postcss;
    postcss.default = postcss;
  }
});

// node_modules/sanitize-html/index.js
var require_sanitize_html = __commonJS({
  "node_modules/sanitize-html/index.js"(exports, module) {
    var htmlparser = require_lib6();
    var escapeStringRegexp = require_escape_string_regexp();
    var { isPlainObject } = require_is_plain_object();
    var deepmerge = require_cjs();
    var parseSrcset = require_parse_srcset();
    var { parse: postcssParse } = require_postcss();
    var mediaTags = [
      "img",
      "audio",
      "video",
      "picture",
      "svg",
      "object",
      "map",
      "iframe",
      "embed"
    ];
    var vulnerableTags = ["script", "style"];
    function each(obj, cb) {
      if (obj) {
        Object.keys(obj).forEach(function(key) {
          cb(obj[key], key);
        });
      }
    }
    function has(obj, key) {
      return {}.hasOwnProperty.call(obj, key);
    }
    function filter(a, cb) {
      const n = [];
      each(a, function(v) {
        if (cb(v)) {
          n.push(v);
        }
      });
      return n;
    }
    function isEmptyObject(obj) {
      for (const key in obj) {
        if (has(obj, key)) {
          return false;
        }
      }
      return true;
    }
    function stringifySrcset(parsedSrcset) {
      return parsedSrcset.map(function(part) {
        if (!part.url) {
          throw new Error("URL missing");
        }
        return part.url + (part.w ? ` ${part.w}w` : "") + (part.h ? ` ${part.h}h` : "") + (part.d ? ` ${part.d}x` : "");
      }).join(", ");
    }
    module.exports = sanitizeHtml;
    var VALID_HTML_ATTRIBUTE_NAME = /^[^\0\t\n\f\r /<=>]+$/;
    function sanitizeHtml(html, options, _recursing) {
      if (html == null) {
        return "";
      }
      let result = "";
      let tempResult = "";
      function Frame(tag, attribs) {
        const that = this;
        this.tag = tag;
        this.attribs = attribs || {};
        this.tagPosition = result.length;
        this.text = "";
        this.mediaChildren = [];
        this.updateParentNodeText = function() {
          if (stack.length) {
            const parentFrame = stack[stack.length - 1];
            parentFrame.text += that.text;
          }
        };
        this.updateParentNodeMediaChildren = function() {
          if (stack.length && mediaTags.includes(this.tag)) {
            const parentFrame = stack[stack.length - 1];
            parentFrame.mediaChildren.push(this.tag);
          }
        };
      }
      options = Object.assign({}, sanitizeHtml.defaults, options);
      options.parser = Object.assign({}, htmlParserDefaults, options.parser);
      vulnerableTags.forEach(function(tag) {
        if (options.allowedTags !== false && (options.allowedTags || []).indexOf(tag) > -1 && !options.allowVulnerableTags) {
          console.warn(`

\u26A0\uFE0F Your \`allowedTags\` option includes, \`${tag}\`, which is inherently
vulnerable to XSS attacks. Please remove it from \`allowedTags\`.
Or, to disable this warning, add the \`allowVulnerableTags\` option
and ensure you are accounting for this risk.

`);
        }
      });
      const nonTextTagsArray = options.nonTextTags || [
        "script",
        "style",
        "textarea",
        "option"
      ];
      let allowedAttributesMap;
      let allowedAttributesGlobMap;
      if (options.allowedAttributes) {
        allowedAttributesMap = {};
        allowedAttributesGlobMap = {};
        each(options.allowedAttributes, function(attributes, tag) {
          allowedAttributesMap[tag] = [];
          const globRegex = [];
          attributes.forEach(function(obj) {
            if (typeof obj === "string" && obj.indexOf("*") >= 0) {
              globRegex.push(escapeStringRegexp(obj).replace(/\\\*/g, ".*"));
            } else {
              allowedAttributesMap[tag].push(obj);
            }
          });
          if (globRegex.length) {
            allowedAttributesGlobMap[tag] = new RegExp("^(" + globRegex.join("|") + ")$");
          }
        });
      }
      const allowedClassesMap = {};
      const allowedClassesGlobMap = {};
      const allowedClassesRegexMap = {};
      each(options.allowedClasses, function(classes, tag) {
        if (allowedAttributesMap) {
          if (!has(allowedAttributesMap, tag)) {
            allowedAttributesMap[tag] = [];
          }
          allowedAttributesMap[tag].push("class");
        }
        allowedClassesMap[tag] = [];
        allowedClassesRegexMap[tag] = [];
        const globRegex = [];
        classes.forEach(function(obj) {
          if (typeof obj === "string" && obj.indexOf("*") >= 0) {
            globRegex.push(escapeStringRegexp(obj).replace(/\\\*/g, ".*"));
          } else if (obj instanceof RegExp) {
            allowedClassesRegexMap[tag].push(obj);
          } else {
            allowedClassesMap[tag].push(obj);
          }
        });
        if (globRegex.length) {
          allowedClassesGlobMap[tag] = new RegExp("^(" + globRegex.join("|") + ")$");
        }
      });
      const transformTagsMap = {};
      let transformTagsAll;
      each(options.transformTags, function(transform, tag) {
        let transFun;
        if (typeof transform === "function") {
          transFun = transform;
        } else if (typeof transform === "string") {
          transFun = sanitizeHtml.simpleTransform(transform);
        }
        if (tag === "*") {
          transformTagsAll = transFun;
        } else {
          transformTagsMap[tag] = transFun;
        }
      });
      let depth;
      let stack;
      let skipMap;
      let transformMap;
      let skipText;
      let skipTextDepth;
      let addedText = false;
      initializeState();
      const parser = new htmlparser.Parser({
        onopentag: function(name, attribs) {
          if (options.enforceHtmlBoundary && name === "html") {
            initializeState();
          }
          if (skipText) {
            skipTextDepth++;
            return;
          }
          const frame = new Frame(name, attribs);
          stack.push(frame);
          let skip = false;
          const hasText = !!frame.text;
          let transformedTag;
          if (has(transformTagsMap, name)) {
            transformedTag = transformTagsMap[name](name, attribs);
            frame.attribs = attribs = transformedTag.attribs;
            if (transformedTag.text !== void 0) {
              frame.innerText = transformedTag.text;
            }
            if (name !== transformedTag.tagName) {
              frame.name = name = transformedTag.tagName;
              transformMap[depth] = transformedTag.tagName;
            }
          }
          if (transformTagsAll) {
            transformedTag = transformTagsAll(name, attribs);
            frame.attribs = attribs = transformedTag.attribs;
            if (name !== transformedTag.tagName) {
              frame.name = name = transformedTag.tagName;
              transformMap[depth] = transformedTag.tagName;
            }
          }
          if (options.allowedTags !== false && (options.allowedTags || []).indexOf(name) === -1 || options.disallowedTagsMode === "recursiveEscape" && !isEmptyObject(skipMap) || options.nestingLimit != null && depth >= options.nestingLimit) {
            skip = true;
            skipMap[depth] = true;
            if (options.disallowedTagsMode === "discard") {
              if (nonTextTagsArray.indexOf(name) !== -1) {
                skipText = true;
                skipTextDepth = 1;
              }
            }
            skipMap[depth] = true;
          }
          depth++;
          if (skip) {
            if (options.disallowedTagsMode === "discard") {
              return;
            }
            tempResult = result;
            result = "";
          }
          result += "<" + name;
          if (name === "script") {
            if (options.allowedScriptHostnames || options.allowedScriptDomains) {
              frame.innerText = "";
            }
          }
          if (!allowedAttributesMap || has(allowedAttributesMap, name) || allowedAttributesMap["*"]) {
            each(attribs, function(value, a) {
              if (!VALID_HTML_ATTRIBUTE_NAME.test(a)) {
                delete frame.attribs[a];
                return;
              }
              let passedAllowedAttributesMapCheck = false;
              if (!allowedAttributesMap || has(allowedAttributesMap, name) && allowedAttributesMap[name].indexOf(a) !== -1 || allowedAttributesMap["*"] && allowedAttributesMap["*"].indexOf(a) !== -1 || has(allowedAttributesGlobMap, name) && allowedAttributesGlobMap[name].test(a) || allowedAttributesGlobMap["*"] && allowedAttributesGlobMap["*"].test(a)) {
                passedAllowedAttributesMapCheck = true;
              } else if (allowedAttributesMap && allowedAttributesMap[name]) {
                for (const o of allowedAttributesMap[name]) {
                  if (isPlainObject(o) && o.name && o.name === a) {
                    passedAllowedAttributesMapCheck = true;
                    let newValue = "";
                    if (o.multiple === true) {
                      const splitStrArray = value.split(" ");
                      for (const s of splitStrArray) {
                        if (o.values.indexOf(s) !== -1) {
                          if (newValue === "") {
                            newValue = s;
                          } else {
                            newValue += " " + s;
                          }
                        }
                      }
                    } else if (o.values.indexOf(value) >= 0) {
                      newValue = value;
                    }
                    value = newValue;
                  }
                }
              }
              if (passedAllowedAttributesMapCheck) {
                if (options.allowedSchemesAppliedToAttributes.indexOf(a) !== -1) {
                  if (naughtyHref(name, value)) {
                    delete frame.attribs[a];
                    return;
                  }
                }
                if (name === "script" && a === "src") {
                  let allowed = true;
                  try {
                    const parsed = parseUrl(value);
                    if (options.allowedScriptHostnames || options.allowedScriptDomains) {
                      const allowedHostname = (options.allowedScriptHostnames || []).find(function(hostname) {
                        return hostname === parsed.url.hostname;
                      });
                      const allowedDomain = (options.allowedScriptDomains || []).find(function(domain) {
                        return parsed.url.hostname === domain || parsed.url.hostname.endsWith(`.${domain}`);
                      });
                      allowed = allowedHostname || allowedDomain;
                    }
                  } catch (e) {
                    allowed = false;
                  }
                  if (!allowed) {
                    delete frame.attribs[a];
                    return;
                  }
                }
                if (name === "iframe" && a === "src") {
                  let allowed = true;
                  try {
                    const parsed = parseUrl(value);
                    if (parsed.isRelativeUrl) {
                      allowed = has(options, "allowIframeRelativeUrls") ? options.allowIframeRelativeUrls : !options.allowedIframeHostnames && !options.allowedIframeDomains;
                    } else if (options.allowedIframeHostnames || options.allowedIframeDomains) {
                      const allowedHostname = (options.allowedIframeHostnames || []).find(function(hostname) {
                        return hostname === parsed.url.hostname;
                      });
                      const allowedDomain = (options.allowedIframeDomains || []).find(function(domain) {
                        return parsed.url.hostname === domain || parsed.url.hostname.endsWith(`.${domain}`);
                      });
                      allowed = allowedHostname || allowedDomain;
                    }
                  } catch (e) {
                    allowed = false;
                  }
                  if (!allowed) {
                    delete frame.attribs[a];
                    return;
                  }
                }
                if (a === "srcset") {
                  try {
                    let parsed = parseSrcset(value);
                    parsed.forEach(function(value2) {
                      if (naughtyHref("srcset", value2.url)) {
                        value2.evil = true;
                      }
                    });
                    parsed = filter(parsed, function(v) {
                      return !v.evil;
                    });
                    if (!parsed.length) {
                      delete frame.attribs[a];
                      return;
                    } else {
                      value = stringifySrcset(filter(parsed, function(v) {
                        return !v.evil;
                      }));
                      frame.attribs[a] = value;
                    }
                  } catch (e) {
                    delete frame.attribs[a];
                    return;
                  }
                }
                if (a === "class") {
                  const allowedSpecificClasses = allowedClassesMap[name];
                  const allowedWildcardClasses = allowedClassesMap["*"];
                  const allowedSpecificClassesGlob = allowedClassesGlobMap[name];
                  const allowedSpecificClassesRegex = allowedClassesRegexMap[name];
                  const allowedWildcardClassesGlob = allowedClassesGlobMap["*"];
                  const allowedClassesGlobs = [
                    allowedSpecificClassesGlob,
                    allowedWildcardClassesGlob
                  ].concat(allowedSpecificClassesRegex).filter(function(t) {
                    return t;
                  });
                  if (allowedSpecificClasses && allowedWildcardClasses) {
                    value = filterClasses(value, deepmerge(allowedSpecificClasses, allowedWildcardClasses), allowedClassesGlobs);
                  } else {
                    value = filterClasses(value, allowedSpecificClasses || allowedWildcardClasses, allowedClassesGlobs);
                  }
                  if (!value.length) {
                    delete frame.attribs[a];
                    return;
                  }
                }
                if (a === "style") {
                  try {
                    const abstractSyntaxTree = postcssParse(name + " {" + value + "}");
                    const filteredAST = filterCss(abstractSyntaxTree, options.allowedStyles);
                    value = stringifyStyleAttributes(filteredAST);
                    if (value.length === 0) {
                      delete frame.attribs[a];
                      return;
                    }
                  } catch (e) {
                    delete frame.attribs[a];
                    return;
                  }
                }
                result += " " + a;
                if (value && value.length) {
                  result += '="' + escapeHtml(value, true) + '"';
                }
              } else {
                delete frame.attribs[a];
              }
            });
          }
          if (options.selfClosing.indexOf(name) !== -1) {
            result += " />";
          } else {
            result += ">";
            if (frame.innerText && !hasText && !options.textFilter) {
              result += escapeHtml(frame.innerText);
              addedText = true;
            }
          }
          if (skip) {
            result = tempResult + escapeHtml(result);
            tempResult = "";
          }
        },
        ontext: function(text) {
          if (skipText) {
            return;
          }
          const lastFrame = stack[stack.length - 1];
          let tag;
          if (lastFrame) {
            tag = lastFrame.tag;
            text = lastFrame.innerText !== void 0 ? lastFrame.innerText : text;
          }
          if (options.disallowedTagsMode === "discard" && (tag === "script" || tag === "style")) {
            result += text;
          } else {
            const escaped = escapeHtml(text, false);
            if (options.textFilter && !addedText) {
              result += options.textFilter(escaped, tag);
            } else if (!addedText) {
              result += escaped;
            }
          }
          if (stack.length) {
            const frame = stack[stack.length - 1];
            frame.text += text;
          }
        },
        onclosetag: function(name) {
          if (skipText) {
            skipTextDepth--;
            if (!skipTextDepth) {
              skipText = false;
            } else {
              return;
            }
          }
          const frame = stack.pop();
          if (!frame) {
            return;
          }
          if (frame.tag !== name) {
            stack.push(frame);
            return;
          }
          skipText = options.enforceHtmlBoundary ? name === "html" : false;
          depth--;
          const skip = skipMap[depth];
          if (skip) {
            delete skipMap[depth];
            if (options.disallowedTagsMode === "discard") {
              frame.updateParentNodeText();
              return;
            }
            tempResult = result;
            result = "";
          }
          if (transformMap[depth]) {
            name = transformMap[depth];
            delete transformMap[depth];
          }
          if (options.exclusiveFilter && options.exclusiveFilter(frame)) {
            result = result.substr(0, frame.tagPosition);
            return;
          }
          frame.updateParentNodeMediaChildren();
          frame.updateParentNodeText();
          if (options.selfClosing.indexOf(name) !== -1) {
            if (skip) {
              result = tempResult;
              tempResult = "";
            }
            return;
          }
          result += "</" + name + ">";
          if (skip) {
            result = tempResult + escapeHtml(result);
            tempResult = "";
          }
          addedText = false;
        }
      }, options.parser);
      parser.write(html);
      parser.end();
      return result;
      function initializeState() {
        result = "";
        depth = 0;
        stack = [];
        skipMap = {};
        transformMap = {};
        skipText = false;
        skipTextDepth = 0;
      }
      function escapeHtml(s, quote) {
        if (typeof s !== "string") {
          s = s + "";
        }
        if (options.parser.decodeEntities) {
          s = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          if (quote) {
            s = s.replace(/"/g, "&quot;");
          }
        }
        s = s.replace(/&(?![a-zA-Z0-9#]{1,20};)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        if (quote) {
          s = s.replace(/"/g, "&quot;");
        }
        return s;
      }
      function naughtyHref(name, href) {
        href = href.replace(/[\x00-\x20]+/g, "");
        while (true) {
          const firstIndex = href.indexOf("<!--");
          if (firstIndex === -1) {
            break;
          }
          const lastIndex = href.indexOf("-->", firstIndex + 4);
          if (lastIndex === -1) {
            break;
          }
          href = href.substring(0, firstIndex) + href.substring(lastIndex + 3);
        }
        const matches = href.match(/^([a-zA-Z][a-zA-Z0-9.\-+]*):/);
        if (!matches) {
          if (href.match(/^[/\\]{2}/)) {
            return !options.allowProtocolRelative;
          }
          return false;
        }
        const scheme = matches[1].toLowerCase();
        if (has(options.allowedSchemesByTag, name)) {
          return options.allowedSchemesByTag[name].indexOf(scheme) === -1;
        }
        return !options.allowedSchemes || options.allowedSchemes.indexOf(scheme) === -1;
      }
      function parseUrl(value) {
        value = value.replace(/^(\w+:)?\s*[\\/]\s*[\\/]/, "$1//");
        if (value.startsWith("relative:")) {
          throw new Error("relative: exploit attempt");
        }
        let base = "relative://relative-site";
        for (let i = 0; i < 100; i++) {
          base += `/${i}`;
        }
        const parsed = new URL(value, base);
        const isRelativeUrl = parsed && parsed.hostname === "relative-site" && parsed.protocol === "relative:";
        return {
          isRelativeUrl,
          url: parsed
        };
      }
      function filterCss(abstractSyntaxTree, allowedStyles) {
        if (!allowedStyles) {
          return abstractSyntaxTree;
        }
        const astRules = abstractSyntaxTree.nodes[0];
        let selectedRule;
        if (allowedStyles[astRules.selector] && allowedStyles["*"]) {
          selectedRule = deepmerge(
            allowedStyles[astRules.selector],
            allowedStyles["*"]
          );
        } else {
          selectedRule = allowedStyles[astRules.selector] || allowedStyles["*"];
        }
        if (selectedRule) {
          abstractSyntaxTree.nodes[0].nodes = astRules.nodes.reduce(filterDeclarations(selectedRule), []);
        }
        return abstractSyntaxTree;
      }
      function stringifyStyleAttributes(filteredAST) {
        return filteredAST.nodes[0].nodes.reduce(function(extractedAttributes, attrObject) {
          extractedAttributes.push(
            `${attrObject.prop}:${attrObject.value}${attrObject.important ? " !important" : ""}`
          );
          return extractedAttributes;
        }, []).join(";");
      }
      function filterDeclarations(selectedRule) {
        return function(allowedDeclarationsList, attributeObject) {
          if (has(selectedRule, attributeObject.prop)) {
            const matchesRegex = selectedRule[attributeObject.prop].some(function(regularExpression) {
              return regularExpression.test(attributeObject.value);
            });
            if (matchesRegex) {
              allowedDeclarationsList.push(attributeObject);
            }
          }
          return allowedDeclarationsList;
        };
      }
      function filterClasses(classes, allowed, allowedGlobs) {
        if (!allowed) {
          return classes;
        }
        classes = classes.split(/\s+/);
        return classes.filter(function(clss) {
          return allowed.indexOf(clss) !== -1 || allowedGlobs.some(function(glob) {
            return glob.test(clss);
          });
        }).join(" ");
      }
    }
    var htmlParserDefaults = {
      decodeEntities: true
    };
    sanitizeHtml.defaults = {
      allowedTags: [
        // Sections derived from MDN element categories and limited to the more
        // benign categories.
        // https://developer.mozilla.org/en-US/docs/Web/HTML/Element
        // Content sectioning
        "address",
        "article",
        "aside",
        "footer",
        "header",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "hgroup",
        "main",
        "nav",
        "section",
        // Text content
        "blockquote",
        "dd",
        "div",
        "dl",
        "dt",
        "figcaption",
        "figure",
        "hr",
        "li",
        "main",
        "ol",
        "p",
        "pre",
        "ul",
        // Inline text semantics
        "a",
        "abbr",
        "b",
        "bdi",
        "bdo",
        "br",
        "cite",
        "code",
        "data",
        "dfn",
        "em",
        "i",
        "kbd",
        "mark",
        "q",
        "rb",
        "rp",
        "rt",
        "rtc",
        "ruby",
        "s",
        "samp",
        "small",
        "span",
        "strong",
        "sub",
        "sup",
        "time",
        "u",
        "var",
        "wbr",
        // Table content
        "caption",
        "col",
        "colgroup",
        "table",
        "tbody",
        "td",
        "tfoot",
        "th",
        "thead",
        "tr"
      ],
      disallowedTagsMode: "discard",
      allowedAttributes: {
        a: ["href", "name", "target"],
        // We don't currently allow img itself by default, but
        // these attributes would make sense if we did.
        img: ["src", "srcset", "alt", "title", "width", "height", "loading"]
      },
      // Lots of these won't come up by default because we don't allow them
      selfClosing: ["img", "br", "hr", "area", "base", "basefont", "input", "link", "meta"],
      // URL schemes we permit
      allowedSchemes: ["http", "https", "ftp", "mailto", "tel"],
      allowedSchemesByTag: {},
      allowedSchemesAppliedToAttributes: ["href", "src", "cite"],
      allowProtocolRelative: true,
      enforceHtmlBoundary: false
    };
    sanitizeHtml.simpleTransform = function(newTagName, newAttribs, merge) {
      merge = merge === void 0 ? true : merge;
      newAttribs = newAttribs || {};
      return function(tagName, attribs) {
        let attrib;
        if (merge) {
          for (attrib in newAttribs) {
            attribs[attrib] = newAttribs[attrib];
          }
        } else {
          attribs = newAttribs;
        }
        return {
          tagName: newTagName,
          attribs
        };
      };
    };
  }
});

// src/util.ts
function isNil(value) {
  return value === void 0 || value === null;
}
function isStringEmpty(value) {
  return isNil(value) || value.trim().length === 0;
}
function areArraysEqual(first, second) {
  if (first.length !== second.length) {
    return false;
  } else {
    first.sort();
    second.sort();
    for (let i = 0; i < first.length; i++) {
      if (first[i] !== second[i]) {
        return false;
      }
    }
    return true;
  }
}
function isMobileBrowser() {
  return /Mobile/i.test(window.navigator.userAgent);
}
function normalizeSpaces(inputText) {
  return inputText.trim().replace(/[^\S\n]+/g, " ");
}
var _DebounceOptions = class {
  constructor(leadingEdge, trailingEdge) {
    this.leadingEdge = leadingEdge;
    this.trailingEdge = trailingEdge;
  }
};
var DebounceOptions = _DebounceOptions;
__publicField(DebounceOptions, "LEADING", new _DebounceOptions(true, false));
__publicField(DebounceOptions, "TRAILING", new _DebounceOptions(false, true));
__publicField(DebounceOptions, "BOTH_EDGES", new _DebounceOptions(true, true));

// src/options/misc.ts
var SortKey = /* @__PURE__ */ ((SortKey2) => {
  SortKey2["POPULARITY"] = "popularity";
  SortKey2["OLDEST"] = "oldest";
  SortKey2["NEWEST"] = "newest";
  SortKey2["ATTACHMENTS"] = "attachments";
  return SortKey2;
})(SortKey || {});

// src/css/stylesheet.ts
var mainStyle = `
.jquery-comments * {
    box-sizing: border-box;
    text-shadow: none;
}

.jquery-comments a[href]:not(.tag) {
    color: #2793e6;
    text-decoration: none;
}

.jquery-comments a[href]:not(.tag):hover {
    text-decoration: underline;
}

.jquery-comments .textarea,
.jquery-comments input,
.jquery-comments button {
    appearance: none;

    vertical-align: top;
    border-radius: 0;
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    background: rgba(0, 0, 0, 0);
}

.jquery-comments button {
    vertical-align: inherit;
}

.jquery-comments .tag {
    color: inherit;
    font-size: 0.9em;
    line-height: 1.2em;
    background: #ddd;
    border: 1px solid #ccc;
    padding: 0.05em 0.4em;
    cursor: pointer;
    font-weight: normal;
    border-radius: 1em;
    transition: all 0.2s linear;
    white-space: nowrap;
    display: inline-block;
    text-decoration: none;
}

.jquery-comments .attachments .tag {
    white-space: normal;
    word-break: break-all;

    padding: 0.05em 0.5em;
    line-height: 1.3em;

    margin-top: 0.3em;
    margin-right: 0.5em;
}

.jquery-comments .attachments .tag > i:first-child {
    margin-right: 0.4em;
}

.jquery-comments .attachments .tag .delete {
    display: inline;
    font-size: 14px;
    color: #888;

    position: relative;
    padding: 2px;
    padding-right: 4px;
    right: -4px;
}

.jquery-comments .attachments .tag:hover .delete {
    color: black;
}

.jquery-comments .tag:hover {
    text-decoration: none;
}

.jquery-comments .tag:not(.deletable):hover {
    background-color: #d8edf8;
    border-color: #2793e6;
}

.jquery-comments textarea.textarea:focus::placeholder {
    color: transparent;
    resize: vertical;
}

.jquery-comments textarea.textarea:not(:focus)::placeholder {
    color: #CCC;
    resize: vertical;
}

.jquery-comments i.fa {
    width: 1em;
    height: 1em;
    background-size: cover;
    text-align: center;
}

.jquery-comments i.fa.image:before {
    content: "";
}

.jquery-comments .spinner {
    font-size: 2em;
    text-align: center;
    padding: 0.5em;
    margin: 0;
    color: #666;
}

.jquery-comments .spinner.inline {
    font-size: inherit;
    padding: 0;
    color: #fff;
}

.jquery-comments .spinner.inline:not(.hidden) ~ * {
    margin-left: 0.4em;
}

.jquery-comments ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.jquery-comments .profile-picture {
    float: left;
    width: 3.6rem;
    height: 3.6rem;
    max-width: 50px;
    max-height: 50px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
}

.jquery-comments i.profile-picture {
    font-size: 3.4em;
    text-align: center;
}

.jquery-comments .profile-picture.round {
    border-radius: 50%;
}

.jquery-comments .commenting-field.main .textarea-wrapper {
    margin-bottom: 0.75em;
}

.jquery-comments .commenting-field.main .profile-picture {
    margin-bottom: 1rem;
}

.jquery-comments .textarea-wrapper {
    overflow: hidden;
    padding-left: 15px;
    position: relative;
}

.jquery-comments .textarea-wrapper:before {
    content: " ";
    position: absolute;
    border: 5px solid #D5D5D5;
    left: 5px;
    top: 0;
    width: 10px;
    height: 10px;
    box-sizing: border-box;
    border-bottom-color: rgba(0, 0, 0, 0);
    border-left-color: rgba(0, 0, 0, 0);
}

.jquery-comments .textarea-wrapper:after {
    content: " ";
    position: absolute;
    border: 7px solid #FFF;
    left: 7px;
    top: 1px;
    width: 10px;
    height: 10px;
    box-sizing: border-box;
    border-bottom-color: rgba(0, 0, 0, 0);
    border-left-color: rgba(0, 0, 0, 0);
}

.jquery-comments .textarea-wrapper .inline-button {
    cursor: pointer;
    right: 0;
    z-index: 10;
    position: absolute;
    border: .5em solid rgba(0,0,0,0);
    box-sizing: content-box;
    font-size: inherit;
    overflow: hidden;
    opacity: 0.5;

    user-select: none;
}

.jquery-comments .textarea-wrapper .inline-button:hover {
    opacity: 1;
}

.jquery-comments:not(.mobile) .textarea-wrapper.textarea-scrollable .inline-button {
    /* Because of scrollbar */
    margin-right: 15px;
}

.jquery-comments .textarea-wrapper .inline-button i {
    font-size: 1.2em;
}

.jquery-comments .textarea-wrapper .upload input {
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
    min-width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    opacity: 0;
}

.jquery-comments .textarea-wrapper .close {
    width: 1em;
    height: 1em;
}

.jquery-comments .textarea-wrapper .textarea {
    width: 100%;
    margin: 0;
    outline: 0;
    overflow-y: auto;
    overflow-x: hidden;
    resize: vertical;
    cursor: text;

    border: 1px solid #CCC;
    background: #FFF;
    font-family: inherit;
    font-size: 1em;
    line-height: 1.45em;
    padding: .25em .8em;
    padding-right: 2em;
}

.jquery-comments:not(.mobile) .textarea-wrapper.textarea-scrollable .textarea {
    /* Because of scrollbar */
    padding-right: calc(2em + 15px);
}

.jquery-comments .textarea-wrapper .control-row > .attachments {
    padding-top: .3em;
}

.jquery-comments .textarea-wrapper .control-row > button {
    float: right;
    line-height: 1.6em;
    margin-top: .4em;
    border: 1px solid rgba(0, 0, 0, 0);
    color: #FFF;
    padding: 0 1em;
    font-size: 1em;
    opacity: .5;
}

.jquery-comments button .hidden {
    display: none !important;
}

.jquery-comments .textarea-wrapper .control-row > button:not(:first-child) {
    margin-right: .5em;
}

.jquery-comments .textarea-wrapper .control-row > button.enabled {
    opacity: 1;
    cursor: pointer;
}

.jquery-comments .textarea-wrapper .control-row > button:not(.enabled) {
    pointer-events: none;
}

.jquery-comments .textarea-wrapper .control-row > button.enabled:hover {
    opacity: .9;
}

.jquery-comments .textarea-wrapper .control-row > button.upload {
    position: relative;
    overflow: hidden;
    background-color: #999;
}

.jquery-comments ul.navigation {
    clear: both;

    color: #999;
    border-bottom: 2px solid #CCC;
    line-height: 2em;
    font-size: 1em;
    margin-bottom: 0.5em;
}

.jquery-comments ul.navigation .navigation-wrapper {
    position: relative;
}

.jquery-comments ul.navigation li {
    display: inline-block;
    position: relative;
    padding: 0 1em;
    cursor: pointer;
    text-align: center;

    user-select: none;
}

.jquery-comments ul.navigation li.active,
.jquery-comments ul.navigation li:hover {
    color: #000;
}

.jquery-comments ul.navigation li.active:after {
    content: " ";
    display: block;
    right: 0;
    height: 2px;
    background: #000;
    position: absolute;
    bottom: -2px;
    left: 0;
}

.jquery-comments ul.navigation li[data-sort-key="attachments"] {
    float: right;
}

.jquery-comments ul.navigation li[data-sort-key="attachments"] i {
    margin-right: 0.25em;
}

.jquery-comments ul.navigation .navigation-wrapper.responsive {
    display: none;
}

@media screen and (max-width: 600px) {
    .jquery-comments ul.navigation .navigation-wrapper {
        display: none;
    }
    .jquery-comments ul.navigation .navigation-wrapper.responsive {
        display: inline;
    }
}

.jquery-comments.responsive ul.navigation .navigation-wrapper {
    display: none;
}
.jquery-comments.responsive ul.navigation .navigation-wrapper.responsive {
    display: inline;
}

.jquery-comments ul.navigation .navigation-wrapper.responsive li.title {
    padding: 0 1.5em;
}

.jquery-comments ul.navigation .navigation-wrapper.responsive li.title header:after {
    display: inline-block;
    content: "";
    border-left: 0.3em solid rgba(0, 0, 0, 0) !important;
    border-right: 0.3em solid rgba(0, 0, 0, 0) !important;
    border-top: 0.4em solid #CCC;
    margin-left: 0.5em;
    position: relative;
    top: -0.1em;
}

.jquery-comments ul.navigation .navigation-wrapper.responsive li.title.active header:after,
.jquery-comments ul.navigation .navigation-wrapper.responsive li.title:hover header:after {
    border-top-color: #000;
}

.jquery-comments ul.dropdown {
    display: none;
    position: absolute;
    background: #FFF;
    z-index: 99;
    line-height: 1.2em;

    border: 1px solid #CCC;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
}

.jquery-comments ul.dropdown.autocomplete {
    margin-top: 0.25em;
}

.jquery-comments ul.dropdown li {
    display: block;
    white-space: nowrap;
    clear: both;
    padding: 0.6em;
    font-weight: normal;
    cursor: pointer;
}

.jquery-comments ul.dropdown li.active {
    background: #EEE;
}

.jquery-comments ul.dropdown li .result {
    display: block;
    margin: 0;
    text-decoration: none;
    color: inherit;
}

.jquery-comments ul.dropdown li .profile-picture {
    float: left;
    width: 2.4em;
    height: 2.4em;
    margin-right: 0.5em;
}

.jquery-comments ul.dropdown li .hashtag {
    float: left;
    font-size: 2.4em;
    margin-left: 0.1em;
    margin-right: 0.25em;
}

.jquery-comments ul.dropdown li .info {
    display: inline-block;
}

.jquery-comments ul.dropdown li .info > span {
    display: block;
}

.jquery-comments ul.dropdown li .info.no-details {
    line-height: 2.4em;
}

.jquery-comments ul.dropdown li .name {
    font-weight: bold;
}

.jquery-comments ul.dropdown li .details {
    color: #999;
    font-size: 0.95em;
    margin-top: 0.1em;
}

.jquery-comments ul.dropdown .textcomplete-header {
    display: none;
}

.jquery-comments ul.dropdown .textcomplete-footer {
    display: none;
}

.jquery-comments ul.navigation .navigation-wrapper.responsive ul.dropdown {
    left: 0;
    width: 100%;
}

.jquery-comments ul.navigation .navigation-wrapper.responsive ul.dropdown li {
    color: #000;
}

.jquery-comments ul.navigation .navigation-wrapper.responsive ul.dropdown li.active {
    color: #FFF;
}

.jquery-comments ul.navigation .navigation-wrapper.responsive ul.dropdown li:hover:not(.active) {
    background: #F5F5F5;
}

.jquery-comments ul.navigation .navigation-wrapper.responsive ul.dropdown li:after {
    display: none;
}

.jquery-comments .no-data {
    display: none;
    margin: 1em;
    text-align: center;
    font-size: 1.5em;
    color: #CCC;
}

.jquery-comments ul.main:empty ~ .no-comments {
    display: inherit;
}

.jquery-comments ul#attachment-list:empty ~ .no-attachments {
    display: inherit;
}

.jquery-comments ul.main li.comment {
    clear: both;
}

.jquery-comments ul.main li.comment .comment-wrapper,
.jquery-comments ul.main button.toggle-all,
.jquery-comments ul.main li.comment .commenting-field > .commenting-field-container {
    padding: .5em;
}

.jquery-comments ul.main li.comment .comment-wrapper {
    border-top: 1px solid #DDD;
    overflow: hidden;
}

.jquery-comments ul.main > li.comment:first-child > ax-comment-container > .comment-wrapper {
    border-top: none;
}

.jquery-comments ul.main li.comment .comment-wrapper > .profile-picture {
    margin-right: 1rem;
}

.jquery-comments ul.main li.comment time {
    float: right;
    line-height: 1.4em;
    margin-left: .5em;
    font-size: 0.8em;
    color: #666;
}

.jquery-comments ul.main li.comment .comment-header {
    line-height: 1.4em;
    word-break: break-word;
}

.jquery-comments ul.main li.comment .comment-header > * {
    margin-right: .5rem;
}

.jquery-comments ul.main li.comment .comment-header .name {
    font-weight: bold;
}

.jquery-comments ul.main li.comment .comment-header .reply-to {
    color: #999;
    font-size: .8em;
    font-weight: normal;
    vertical-align: top;
}

.jquery-comments ul.main li.comment .comment-header .reply-to i {
    margin-right: .25rem;
}

.jquery-comments ul.main li.comment .comment-header .new {
    background: #2793e6;
    font-size: 0.8em;
    padding: 0.2em 0.6em;
    color: #fff;
    font-weight: normal;
    border-radius: 1em;
    vertical-align: bottom;
    word-break: normal;
}

.jquery-comments ul.main li.comment .wrapper {
    line-height: 1.4em;
    overflow: hidden;
}

.jquery-comments.mobile ul.main li.comment .child-comments li.comment .wrapper {
    overflow: visible;
}
`;
var contentStyle = `
.jquery-comments ul.main li.comment .wrapper .content {
    white-space: pre-line;
    word-break: break-word;
}

.jquery-comments ul.main li.comment .wrapper .content time.edited {
    float: inherit;
    margin: 0;
    font-size: .9em;
    font-style: italic;
    color: #999;
}

.jquery-comments ul.main li.comment .wrapper .content time.edited:before {
    content: " - ";
}
`;
var attachmentsStyle = `
.jquery-comments ul.main li.comment .wrapper .attachments .tags:not(:empty) {
    margin-bottom: 0.5em;
}

.jquery-comments ul.main li.comment .wrapper .attachments .previews .preview {
    display: inline-block;
    margin-top: .25em;
    margin-right: .25em;
}

.jquery-comments ul.main li.comment .wrapper .attachments .previews .preview > * {
    max-width: 100%;
    max-height: 200px;
    width: auto;
    height: auto;
}

.jquery-comments ul.main li.comment .wrapper .attachments .previews .preview > *:focus {
    outline: none;
}
`;
var actionsStyle = `
.jquery-comments.mobile ul.main li.comment .actions {
    font-size: 1em;
}

.jquery-comments ul.main li.comment .actions > * {
    color: #999;
    font-weight: bold;
}

.jquery-comments ul.main li.comment .actions .action {
    display: inline-block;
    cursor: pointer;
    margin-left: 1em;
    margin-right: 1em;
    line-height: 1.5em;
    font-size: 0.9em;
}

.jquery-comments ul.main li.comment .actions .action.disabled {
    opacity: 0.5;
    pointer-events: none;
}

.jquery-comments ul.main li.comment .actions .action:first-child {
    margin-left: 0;
}

.jquery-comments ul.main li.comment .actions .action.upvote {
    cursor: inherit;
}

.jquery-comments ul.main li.comment .actions .action.upvote .upvote-count {
    margin-right: .5em;
}

.jquery-comments ul.main li.comment .actions .action.upvote .upvote-count:empty {
    display: none;
}

.jquery-comments ul.main li.comment .actions .action.upvote i {
    cursor: pointer;
}

.jquery-comments ul.main li.comment .actions .action:not(.upvote):hover,
.jquery-comments ul.main li.comment .actions .action.upvote:not(.highlight-font) i:hover {
    color: #666;
}

.jquery-comments ul#attachment-list li.comment .actions .action:not(.delete) {
    display: none;
}

.jquery-comments ul#attachment-list li.comment .actions .action.delete {
    margin: 0;
}

.jquery-comments ul#attachment-list li.comment .actions .separator {
    display: none;
}
`;
var childCommentsStyle = `
/* Margin for second level content */
.jquery-comments ul.main li.comment .child-comments > *::before,
.jquery-comments ul.main li.comment ax-commenting-field > *::before {
    content: "";
    height: 1px;
    float: left;

    /* Profile picture width plus margin */
    width: calc(3.6em + .5em);
    /* Profile picture max width plus margin */
    max-width: calc(50px + .5em);
}

.jquery-comments ul.main li.comment .child-comments .profile-picture,
.jquery-comments ul.main li.comment .child-comments ~ ax-commenting-field .profile-picture {
    width: 2.4rem;
    height: 2.4rem;
}

.jquery-comments ul.main li.comment .child-comments i.profile-picture,
.jquery-comments ul.main li.comment .child-comments ~ ax-commenting-field i.profile-picture {
    font-size: 2.4em;
}

.jquery-comments ul.main li.comment .child-comments button.toggle-all {
    padding-top: 0;
}

.jquery-comments ul.main li.comment .child-comments button.toggle-all span:first-child {
    vertical-align: middle;
}

.jquery-comments ul.main li.comment .child-comments button.toggle-all span:first-child:hover {
    cursor: pointer;
    text-decoration: underline;
}

.jquery-comments ul.main li.comment .child-comments button.toggle-all .caret {
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 0;

    margin-left: .5em;
    border: .3em solid;
    margin-top: .35em;

    border-left-color: rgba(0, 0, 0, 0);
    border-bottom-color: rgba(0, 0, 0, 0);
    border-right-color: rgba(0, 0, 0, 0);
}

.jquery-comments ul.main li.comment .child-comments button.toggle-all .caret.up {
    border-top-color: rgba(0, 0, 0, 0);
    border-bottom-color: inherit;
    margin-top: -.2em;
}

.jquery-comments ul.main li.comment .child-comments .togglable-reply {
    display: none;
}

.jquery-comments ul.main li.comment .child-comments .visible {
    display: inherit;
}

.jquery-comments ul.main li.comment.hidden {
    display: none;
}
`;
var editingCommentStyle = `
.jquery-comments ul.main li.comment.edit > .comment-wrapper > *:not(.commenting-field) {
    display: none;
}

.jquery-comments ul.main li.comment.edit > .comment-wrapper .commenting-field {
    padding-left: 0 !important;
    padding-right: 0 !important;
}
`;
var dragAndDropAttachmentsStyle = `
.jquery-comments.drag-ongoing {
    overflow-y: hidden !important;
}

.jquery-comments .droppable-overlay {
    display: table;
    position: fixed;
    z-index: 99;

    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.3)
}

.jquery-comments .droppable-overlay .droppable-container {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
}

.jquery-comments .droppable-overlay .droppable-container .droppable {
    background: #FFF;
    color: #CCC;
    padding: 6em;
}

.jquery-comments .droppable-overlay .droppable-container .droppable.drag-over {
    color: #999;
}

.jquery-comments .droppable-overlay .droppable-container .droppable i {
    margin-bottom: 5px;
}
`;
var readOnlyStyle = `
.jquery-comments.read-only .commenting-field {
    display: none;
}
.jquery-comments.read-only .actions {
    display: none;
}
`;
var STYLE_SHEET = (() => {
  const styleSheet = new CSSStyleSheet();
  styleSheet.replaceSync(mainStyle + contentStyle + attachmentsStyle + actionsStyle + childCommentsStyle + editingCommentStyle + dragAndDropAttachmentsStyle + readOnlyStyle);
  return styleSheet;
})();

// src/default-options-factory.ts
function getDefaultOptions() {
  return {
    // CurrentUser
    profilePictureURL: "",
    currentUserIsAdmin: false,
    currentUserId: "",
    // Icons
    spinnerIconURL: "",
    upvoteIconURL: "",
    replyIconURL: "",
    uploadIconURL: "",
    attachmentIconURL: "",
    noCommentsIconURL: "",
    closeIconURL: "",
    // Labels
    textareaPlaceholderText: "Add a comment",
    newestText: "Newest",
    oldestText: "Oldest",
    popularText: "Popular",
    attachmentsText: "Attachments",
    sendText: "Send",
    replyText: "Reply",
    editText: "Edit",
    editedText: "Edited",
    youText: "You",
    saveText: "Save",
    deleteText: "Delete",
    newText: "New",
    viewAllRepliesText: "View all __replyCount__ replies",
    hideRepliesText: "Hide replies",
    noCommentsText: "No comments",
    noAttachmentsText: "No attachments",
    attachmentDropText: "Drop files here",
    // Functionalities
    enableReplying: true,
    enableEditing: true,
    enableUpvoting: true,
    enableDeleting: true,
    enableAttachments: false,
    enableHashtags: false,
    enablePinging: false,
    enableDeletingCommentWithReplies: false,
    postCommentOnEnter: false,
    forceResponsive: false,
    readOnly: false,
    defaultNavigationSortKey: "newest" /* NEWEST */,
    // Callbacks
    searchUsers: (term, success, error) => success([]),
    searchTags: (term, success, error) => success([{ tag: term }]),
    getComments: (success, error) => success([]),
    postComment: (comment, success, error) => success(comment),
    putComment: (comment, success, error) => success(comment),
    deleteComment: (comment, success, error) => success({
      ...comment,
      content: "Deleted"
    }),
    upvoteComment: (comment, success, error) => success(comment),
    validateAttachments: (attachments, accept) => accept(attachments),
    hashtagClicked: (hashtag) => {
    },
    pingClicked: (userId) => {
    },
    refresh: () => {
    },
    // Formatters
    timeFormatter: getDefaultTimeFormatter(),
    // Misc
    styles: [STYLE_SHEET],
    highlightColor: "#2793e6",
    deleteButtonColor: "#c9302c",
    roundProfilePictures: false,
    textareaRows: 2,
    textareaRowsOnFocus: 3,
    maxRepliesVisible: 2
  };
}
function getDefaultTimeFormatter() {
  const rtf = new Intl.RelativeTimeFormat();
  return (timestamp) => {
    const epochNow = Math.floor(new Date().getTime() / 1e3);
    const epochTimestamp = Math.floor(timestamp.getTime() / 1e3);
    const diff = epochTimestamp - epochNow;
    if (diff > -60) {
      return rtf.format(diff, "second");
    } else if (diff > -3600) {
      return rtf.format(Math.floor(diff / 60), "minute");
    } else if (diff > -86400) {
      return rtf.format(Math.floor(diff / 3600), "hour");
    } else if (diff > -2620800) {
      return rtf.format(Math.floor(diff / 86400), "day");
    } else if (diff > -7862400) {
      return rtf.format(Math.floor(diff / 2620800), "week");
    } else {
      return timestamp.toLocaleDateString(void 0, { dateStyle: "short" }) + " " + timestamp.toLocaleTimeString(void 0, { timeStyle: "short" });
    }
  };
}

// src/comment-transformer.ts
var CommentTransformer = class {
  constructor(container) {
  }
  deplete(comment) {
    const result = Object.assign({}, comment);
    delete result.childIds;
    delete result.hasAttachments;
    return result;
  }
  enrichMany(comments) {
    const commentsById = {};
    const rootCommentsById = {};
    const childCommentsById = {};
    comments.forEach((c) => {
      const enriched = this.enrich(c);
      commentsById[enriched.id] = enriched;
      if (enriched.parentId) {
        childCommentsById[enriched.id] = enriched;
      } else {
        rootCommentsById[enriched.id] = enriched;
      }
    });
    Object.values(childCommentsById).forEach((c) => {
      this.#getOutermostParent(c.parentId, commentsById).childIds.push(c.id);
      if (!commentsById[c.parentId].childIds.includes(c.id)) {
        commentsById[c.parentId].childIds.push(c.id);
      }
    });
    return Object.values(commentsById);
  }
  enrich(comment) {
    const commentModel = Object.assign({}, comment);
    if (isNil(commentModel.childIds)) {
      commentModel.childIds = [];
      commentModel.hasAttachments = function() {
        return this.attachments?.length > 0;
      };
    }
    return commentModel;
  }
  #getOutermostParent(directParentId, commentsById) {
    let parentId = directParentId;
    let parentComment;
    do {
      parentComment = commentsById[parentId];
      parentId = parentComment.parentId;
    } while (!isNil(parentId));
    return parentComment;
  }
};

// src/events.ts
var EVENT_HANDLERS_MAP = new Map([
  // Close dropdowns
  of(eventOf("click"), "closeDropdowns"),
  // Paste attachments
  of(eventOf("paste"), "preSavePastedAttachments"),
  // Drag & dropping attachments
  of(eventOf("dragenter"), "showDroppableOverlay"),
  of(eventOf("dragenter", ".droppable-overlay"), "handleDragEnter"),
  of(eventOf("dragleave", ".droppable-overlay"), "handleDragLeaveForOverlay"),
  of(eventOf("dragenter", ".droppable-overlay .droppable"), "handleDragEnter"),
  of(eventOf("dragleave", ".droppable-overlay .droppable"), "handleDragLeaveForDroppable"),
  of(eventOf("dragover", ".droppable-overlay"), "handleDragOverForOverlay"),
  of(eventOf("drop", ".droppable-overlay"), "handleDrop")
]);
function of(event, ...handlerNames) {
  return [event, handlerNames];
}
function eventOf(type, selector) {
  return {
    type,
    selector
  };
}

// src/comment-view-model.ts
var import_EventEmitter3 = __toESM(require_EventEmitter3(), 1);
var CommentViewModel = class {
  #commentsById;
  #eventEmitter;
  constructor(commentsById) {
    this.#commentsById = commentsById;
    this.#eventEmitter = new import_EventEmitter3.default();
  }
  initComments(comments) {
    if (Object.keys(this.#commentsById).length) {
      console.warn(`[CommentViewModel] View model already initialized`);
      return;
    }
    comments.forEach((c) => this.#commentsById[c.id] = c);
  }
  getComment(id) {
    return this.#commentsById[id];
  }
  getComments(sorter) {
    const comments = Object.keys(this.#commentsById).map((id) => this.#commentsById[id]);
    return sorter ? comments.sort(sorter) : comments;
  }
  getRootComments(sorter) {
    const comments = this.getComments().filter((comment) => !comment.parentId);
    return sorter ? comments.sort(sorter) : comments;
  }
  getChildComments(parentId, sorter) {
    const parent = this.#commentsById[parentId];
    const children = parent.childIds.map((childId) => this.#commentsById[childId]);
    return sorter ? children.sort(sorter) : children;
  }
  getAttachments() {
    return this.getComments().filter((comment) => comment.hasAttachments());
  }
  subscribe(type, listener) {
    this.#eventEmitter.addListener(type, listener);
    return {
      unsubscribe: () => this.unsubscribe(type, listener)
    };
  }
  unsubscribe(type, listener) {
    this.#eventEmitter.removeListener(type, listener);
  }
  unsubscribeAll(type) {
    this.#eventEmitter.removeAllListeners(type);
  }
  addComment(comment) {
    if (this.#commentsById[comment.id])
      return;
    this.#commentsById[comment.id] = comment;
    if (comment.parentId) {
      this.#commentsById[comment.parentId].childIds.push(comment.id);
    }
    this.#eventEmitter.emit(CommentViewModelEvent.COMMENT_ADDED, comment.id);
  }
  updateComment(comment) {
    const existingComment = this.#commentsById[comment.id];
    if (!existingComment)
      return;
    Object.assign(comment, {
      id: existingComment.id,
      parentId: existingComment.parentId,
      createdAt: existingComment.createdAt,
      creatorUserId: existingComment.creatorUserId,
      creatorDisplayName: existingComment.creatorDisplayName
    });
    Object.assign(existingComment, comment);
    this.#eventEmitter.emit(CommentViewModelEvent.COMMENT_UPDATED, comment.id);
  }
  deleteComment(commentId) {
    const existingComment = this.#commentsById[commentId];
    if (!existingComment)
      return;
    delete this.#commentsById[commentId];
    this.#eventEmitter.emit(CommentViewModelEvent.COMMENT_DELETED, commentId);
  }
};
var CommentViewModelEvent = /* @__PURE__ */ ((CommentViewModelEvent2) => {
  CommentViewModelEvent2["COMMENT_ADDED"] = "COMMENT_ADDED";
  CommentViewModelEvent2["COMMENT_UPDATED"] = "COMMENT_UPDATED";
  CommentViewModelEvent2["COMMENT_DELETED"] = "COMMENT_DELETED";
  return CommentViewModelEvent2;
})(CommentViewModelEvent || {});

// src/provider.ts
var OptionsProvider = class {
  static set(container, options) {
    if (this.OPTIONS.has(container)) {
      console.warn("[OptionsProvider] Options reference cannot be changed after initialization");
    }
    this.OPTIONS.set(container, options);
  }
  static get(container) {
    return this.OPTIONS.get(container);
  }
};
__publicField(OptionsProvider, "OPTIONS", /* @__PURE__ */ new WeakMap());
var _CommentViewModelProvider = class {
  static set(container, commentsById) {
    if (this.COMMENTS.has(container)) {
      console.warn("[CommentsProvider] Comments reference cannot be changed after initialization");
    } else {
      this.COMMENTS.set(container, new CommentViewModel(commentsById));
    }
    return _CommentViewModelProvider.get(container);
  }
  static get(container) {
    return this.COMMENTS.get(container);
  }
};
var CommentViewModelProvider = _CommentViewModelProvider;
__publicField(CommentViewModelProvider, "COMMENTS", /* @__PURE__ */ new WeakMap());
var ServiceProvider = class {
  static get(container, ctor) {
    if (this.SERVICES.has(container)) {
      const instances = this.SERVICES.get(container);
      for (let i = 0; i < instances.length; i++) {
        if (instances[i] instanceof ctor) {
          return instances[i];
        }
      }
      const instance = this.instantiate(container, ctor);
      instances.push(instance);
      return instance;
    } else {
      const instance = this.instantiate(container, ctor);
      this.SERVICES.set(container, [instance]);
      return instance;
    }
  }
  static instantiate(container, ctor) {
    return new ctor(container);
  }
};
__publicField(ServiceProvider, "SERVICES", /* @__PURE__ */ new WeakMap());

// src/html-util.ts
var PREVIOUS_DISPLAY_VALUE = /* @__PURE__ */ new WeakMap();
function getHostContainer(child) {
  const container = findParentsBySelector(child, "#comments-container").first();
  if (!container) {
    throw new Error(`${child.constructor.name} will not work outside ax-comments.`);
  }
  return container;
}
function showElement(element) {
  element.style.display = PREVIOUS_DISPLAY_VALUE.get(element) ?? "block";
}
function hideElement(element) {
  PREVIOUS_DISPLAY_VALUE.set(element, element.style.display);
  element.style.display = "none";
}
function toggleElementVisibility(element) {
  if (element.style.display !== "none") {
    hideElement(element);
  } else {
    showElement(element);
  }
}
function findSiblingsBySelector(element, selectors) {
  const siblings = [];
  for (const sibling of element.parentElement.children) {
    if (sibling !== element)
      siblings.push(sibling);
  }
  if (!selectors) {
    return new QueryableElementArray(...siblings);
  }
  const results = [];
  for (const sibling of siblings) {
    if (sibling.matches(selectors)) {
      results.push(sibling);
    }
  }
  return new QueryableElementArray(...results);
}
function findParentsBySelector(element, selectors) {
  const results = [];
  for (let parent = element && element.parentElement; parent; parent = parent.parentElement) {
    if (!selectors || parent.matches(selectors)) {
      results.push(parent);
    }
  }
  return new QueryableElementArray(...results);
}
var QueryableElementArray = class extends Array {
  querySelector(selectors) {
    for (const element of this) {
      const foundElement = element.querySelector(selectors);
      if (foundElement) {
        return foundElement;
      }
    }
    return null;
  }
  querySelectorAll(selectors) {
    const results = [];
    for (const element of this) {
      const foundElements = element.querySelectorAll(selectors);
      if (foundElements.length > 0) {
        results.push(...foundElements);
      }
    }
    return results;
  }
  first() {
    return this.length > 0 ? this[0] : null;
  }
  last() {
    return this.length > 0 ? this[this.length - 1] : null;
  }
};

// src/element-event-handler.ts
var CommentsElementEventHandler = class {
  constructor(container) {
    this.container = container;
    this.#options = OptionsProvider.get(container);
  }
  #options;
  closeDropdowns() {
    const escPressEvent = new KeyboardEvent("keydown", {
      key: "Escape",
      keyCode: 27
    });
    this.container.querySelectorAll(".textarea").forEach((el) => el.dispatchEvent(escPressEvent));
  }
  preSavePastedAttachments(e) {
    const clipboardData = e.clipboardData;
    const files = clipboardData.files;
    if (files?.length === 1) {
      const parentCommentingField = findParentsBySelector(e.target, "ax-commenting-field.commenting-field").first() || this.container.querySelector("ax-commenting-field.commenting-field.main");
      parentCommentingField.preSaveAttachments(files);
      e.preventDefault();
    }
  }
  showDroppableOverlay(e) {
    if (this.#options.enableAttachments) {
      this.container.querySelectorAll(".droppable-overlay").forEach((element) => {
        element.style.top = this.container.scrollTop + "px";
        showElement(element);
      });
      this.container.classList.add("drag-ongoing");
    }
  }
  handleDragEnter(e) {
    const currentTarget = e.currentTarget;
    let count = Number(currentTarget.getAttribute("data-dnd-count")) || 0;
    currentTarget.setAttribute("data-dnd-count", `${++count}`);
    currentTarget.classList.add("drag-over");
  }
  handleDragLeaveForOverlay(e) {
    this.#handleDragLeave(e, () => {
      this.#hideDroppableOverlay();
    });
  }
  #handleDragLeave(e, onDragLeft) {
    const currentTarget = e.currentTarget;
    let count = Number(currentTarget.getAttribute("data-dnd-count"));
    currentTarget.setAttribute("data-dnd-count", `${--count}`);
    if (count === 0) {
      e.currentTarget.classList.remove("drag-over");
      onDragLeft?.();
    }
  }
  #hideDroppableOverlay() {
    this.container.querySelectorAll(".droppable-overlay").forEach(hideElement);
    this.container.classList.remove("drag-ongoing");
  }
  handleDragLeaveForDroppable(e) {
    this.#handleDragLeave(e);
  }
  handleDragOverForOverlay(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }
  handleDrop(e) {
    e.preventDefault();
    e.target.dispatchEvent(new DragEvent("dragleave"));
    this.#hideDroppableOverlay();
    this.container.querySelector("ax-commenting-field.commenting-field.main").preSaveAttachments(e.dataTransfer.files);
  }
};

// src/comment-sorter.ts
var CommentSorter = class {
  #options;
  constructor(container) {
    this.#options = OptionsProvider.get(container);
  }
  sortComments(comments, sortKey) {
    return comments.sort(this.getSorter(sortKey));
  }
  getSorter(sortKey) {
    if (sortKey === "popularity" /* POPULARITY */) {
      return (commentA, commentB) => {
        let pointsOfA = commentA.childIds?.length ?? 0;
        let pointsOfB = commentB.childIds?.length ?? 0;
        if (this.#options.enableUpvoting) {
          pointsOfA += commentA.upvoteCount ?? 0;
          pointsOfB += commentB.upvoteCount ?? 0;
        }
        if (pointsOfB != pointsOfA) {
          return pointsOfB - pointsOfA;
        } else {
          const createdA = commentA.createdAt.getTime();
          const createdB = commentB.createdAt.getTime();
          return createdB - createdA;
        }
      };
    } else {
      return (commentA, commentB) => {
        const createdA = commentA.createdAt.getTime();
        const createdB = commentB.createdAt.getTime();
        if (sortKey == "oldest" /* OLDEST */) {
          return createdA - createdB;
        } else {
          return createdB - createdA;
        }
      };
    }
  }
};

// src/register-custom-element.ts
function RegisterCustomElement(selector, options) {
  return (target) => {
    customElements.define(selector, target, options);
  };
}

// src/subcomponent/navigation-element.ts
var NavigationElement = class extends HTMLElement {
  sortKey = "newest" /* NEWEST */;
  onSortKeyChanged = () => {
  };
  #options;
  static create(options) {
    const navigationEl = document.createElement("ax-navigation");
    Object.assign(navigationEl, options);
    return navigationEl;
  }
  connectedCallback() {
    this.#initServices();
    this.#initElement();
    this.querySelectorAll(".navigation li[data-sort-key]").forEach((nav) => nav.addEventListener("click", this.#navigationElementClicked));
    this.querySelector(".navigation li.title").addEventListener("click", this.#toggleNavigationDropdown);
  }
  disconnectedCallback() {
    this.querySelectorAll(".navigation li[data-sort-key]").forEach((nav) => nav.removeEventListener("click", this.#navigationElementClicked));
    this.querySelector(".navigation li.title").removeEventListener("click", this.#toggleNavigationDropdown);
  }
  #initServices() {
    const container = getHostContainer(this);
    this.#options = OptionsProvider.get(container);
  }
  #initElement() {
    const navigationEl = document.createElement("ul");
    navigationEl.classList.add("navigation");
    const navigationWrapper = document.createElement("div");
    navigationWrapper.classList.add("navigation-wrapper");
    navigationEl.append(navigationWrapper);
    const newest = document.createElement("li");
    newest.textContent = this.#options.newestText;
    newest.setAttribute("data-sort-key", "newest" /* NEWEST */);
    newest.setAttribute("data-container-name", "comments");
    const oldest = document.createElement("li");
    oldest.textContent = this.#options.oldestText;
    oldest.setAttribute("data-sort-key", "oldest" /* OLDEST */);
    oldest.setAttribute("data-container-name", "comments");
    const popular = document.createElement("li");
    popular.textContent = this.#options.popularText;
    popular.setAttribute("data-sort-key", "popularity" /* POPULARITY */);
    popular.setAttribute("data-container-name", "comments");
    const attachments = document.createElement("li");
    attachments.textContent = this.#options.attachmentsText;
    attachments.setAttribute("data-sort-key", "attachments" /* ATTACHMENTS */);
    attachments.setAttribute("data-container-name", "attachments");
    const attachmentsIcon = document.createElement("i");
    attachmentsIcon.classList.add("fa", "fa-paperclip");
    if (this.#options.attachmentIconURL.length) {
      attachmentsIcon.style.backgroundImage = `url("${this.#options.attachmentIconURL}")`;
      attachmentsIcon.classList.add("image");
    }
    attachments.prepend(attachmentsIcon);
    const dropdownNavigationWrapper = document.createElement("div");
    dropdownNavigationWrapper.classList.add("navigation-wrapper", "responsive");
    const dropdownNavigation = document.createElement("ul");
    dropdownNavigation.classList.add("dropdown");
    const dropdownTitle = document.createElement("li");
    dropdownTitle.classList.add("title");
    const dropdownTitleHeader = document.createElement("header");
    dropdownTitle.append(dropdownTitleHeader);
    dropdownNavigationWrapper.append(dropdownTitle);
    dropdownNavigationWrapper.append(dropdownNavigation);
    navigationEl.append(dropdownNavigationWrapper);
    navigationWrapper.append(newest, oldest);
    dropdownNavigation.append(newest.cloneNode(true), oldest.cloneNode(true));
    if (this.#options.enableReplying || this.#options.enableUpvoting) {
      navigationWrapper.append(popular);
      dropdownNavigation.append(popular.cloneNode(true));
    }
    if (this.#options.enableAttachments) {
      navigationWrapper.append(attachments);
      dropdownNavigationWrapper.append(attachments.cloneNode(true));
    }
    if (this.#options.forceResponsive) {
      this.#forceResponsive();
    }
    this.append(navigationEl);
  }
  #navigationElementClicked = (e) => {
    const navigationEl = e.currentTarget;
    const sortKey = navigationEl.getAttribute("data-sort-key");
    this.sortKey = sortKey;
    this.onSortKeyChanged(sortKey);
  };
  #toggleNavigationDropdown = (e) => {
    e.stopPropagation();
    const dropdown = e.currentTarget.querySelector("~ .dropdown");
    toggleElementVisibility(dropdown);
  };
  #forceResponsive() {
    getHostContainer(this).classList.add("responsive");
  }
};
NavigationElement = __decorateClass([
  RegisterCustomElement("ax-navigation")
], NavigationElement);

// src/subcomponent/spinner-factory.ts
var SpinnerFactory = class {
  #options;
  constructor(container) {
    this.#options = OptionsProvider.get(container);
  }
  createSpinner(inline = false) {
    const spinner = document.createElement("span");
    spinner.classList.add("spinner");
    if (inline) {
      spinner.classList.add("inline");
    }
    const spinnerIcon = document.createElement("i");
    spinnerIcon.classList.add("fa", "fa-circle-notch", "fa-spin");
    if (this.#options.spinnerIconURL?.length) {
      spinnerIcon.style.backgroundImage = `url("${this.#options.spinnerIconURL}")`;
      spinnerIcon.classList.add("image");
    }
    spinner.appendChild(spinnerIcon);
    return spinner;
  }
};

// src/css/dynamic-stylesheet-factory.ts
function createDynamicStylesheet(options) {
  let css = "";
  css += `.jquery-comments ul.navigation li.active:after {background: ${options.highlightColor} !important;}`;
  css += `.jquery-comments ul.navigation ul.dropdown li.active {background: ${options.highlightColor} !important;}`;
  css += `.jquery-comments .highlight-background {background: ${options.highlightColor} !important;}`;
  css += `.jquery-comments .highlight-font {color: ${options.highlightColor} !important;}`;
  css += `.jquery-comments .highlight-font-bold {color: ${options.highlightColor} !important;font-weight: bold;}`;
  return createStyle(css);
}
function createStyle(css) {
  const styleSheet = new CSSStyleSheet();
  styleSheet.replaceSync(css);
  return styleSheet;
}

// src/subcomponent/toggle-all-button-element.ts
var ToggleAllButtonElement = class extends HTMLLIElement {
  #options;
  connectedCallback() {
    this.#initServices();
    this.#initElement();
  }
  #initServices() {
    if (this.#options)
      return;
    const container = getHostContainer(this);
    this.#options = OptionsProvider.get(container);
  }
  #initElement() {
    this.innerHTML = "";
    const button = document.createElement("button");
    button.classList.add("toggle-all", "highlight-font-bold");
    const toggleAllButtonText = document.createElement("span");
    toggleAllButtonText.classList.add("text");
    const caret = document.createElement("span");
    caret.classList.add("caret");
    button.append(toggleAllButtonText, caret);
    this.onclick = this.#toggleReplies;
    this.append(button);
    this.#setToggleAllButtonText(false);
  }
  static create() {
    return document.createElement("li", { is: "ax-toggle-all-button" });
  }
  static updateToggleAllButton(parentEl, options) {
    if (options.maxRepliesVisible === false) {
      return;
    }
    const childCommentsEl = parentEl.querySelector(".child-comments");
    const childComments = [...childCommentsEl.querySelectorAll(".comment:not(.hidden)")];
    let toggleAllButton = childCommentsEl.querySelector("button.toggle-all")?.parentElement;
    childComments.forEach((childComment) => {
      childComment.classList.remove("togglable-reply");
      childComment.classList.add("visible");
    });
    let togglableReplies;
    if (options.maxRepliesVisible === 0) {
      togglableReplies = childComments;
    } else {
      togglableReplies = childComments.slice(0, -options.maxRepliesVisible);
    }
    const allRepliesExpanded = toggleAllButton?.querySelector("span.text").textContent === options.hideRepliesText;
    for (let i = 0; i < togglableReplies.length; i++) {
      togglableReplies[i].classList.add("togglable-reply");
      togglableReplies[i].classList.toggle("visible", allRepliesExpanded);
    }
    if (childComments.length > options.maxRepliesVisible) {
      if (isNil(toggleAllButton)) {
        toggleAllButton = ToggleAllButtonElement.create();
        childCommentsEl.prepend(toggleAllButton);
      }
      toggleAllButton.#setToggleAllButtonText(false);
    } else {
      toggleAllButton?.remove();
    }
  }
  #toggleReplies = (e) => {
    const toggleAllButton = e.currentTarget;
    findSiblingsBySelector(toggleAllButton, ".togglable-reply").forEach((togglableReply) => togglableReply.classList.toggle("visible"));
    toggleAllButton.#setToggleAllButtonText(true);
  };
  #setToggleAllButtonText(toggle) {
    const textContainer = this.querySelector("span.text");
    const caret = this.querySelector(".caret");
    const showExpandingText = () => {
      let text = this.#options.viewAllRepliesText;
      const replyCount = this.parentElement.querySelectorAll(".comment:not(.hidden)").length;
      text = text.replace("__replyCount__", `${replyCount}`);
      textContainer.textContent = text;
    };
    const hideRepliesText = this.#options.hideRepliesText;
    if (toggle) {
      if (textContainer.textContent === hideRepliesText) {
        showExpandingText();
      } else {
        textContainer.textContent = hideRepliesText;
      }
      caret.classList.toggle("up");
    } else {
      if (textContainer.textContent !== hideRepliesText) {
        showExpandingText();
      }
    }
  }
};
ToggleAllButtonElement = __decorateClass([
  RegisterCustomElement("ax-toggle-all-button", { extends: "li" })
], ToggleAllButtonElement);

// src/subcomponent/profile-picture-factory.ts
var ProfilePictureFactory = class {
  #options;
  constructor(container) {
    this.#options = OptionsProvider.get(container);
  }
  createProfilePictureElement(userId, pictureUrl) {
    let profilePicture;
    if (pictureUrl) {
      profilePicture = document.createElement("span");
      profilePicture.style.backgroundImage = `url(${pictureUrl})`;
    } else {
      profilePicture = document.createElement("i");
      profilePicture.classList.add("fa", "fa-duotone", "fa-user");
    }
    profilePicture.classList.add("profile-picture");
    profilePicture.setAttribute("data-user-id", userId);
    if (this.#options.roundProfilePictures) {
      profilePicture.classList.add("round");
    }
    return profilePicture;
  }
};

// src/subcomponent/button-element.ts
var ButtonElement = class extends HTMLButtonElement {
  set inline(value) {
    if (value)
      this.classList.add("inline-button");
  }
  onInitialized = () => {
  };
  #initialized = false;
  #options;
  #spinnerFactory;
  connectedCallback() {
    this.#initServices();
    this.type = "button";
    if (!this.#initialized) {
      const spinner = this.#spinnerFactory.createSpinner(true);
      spinner.classList.add("hidden");
      this.prepend(spinner);
      this.onInitialized(this);
      this.#initialized = true;
    }
  }
  #initServices() {
    if (this.#options)
      return;
    const container = getHostContainer(this);
    this.#options = OptionsProvider.get(container);
    this.#spinnerFactory = ServiceProvider.get(container, SpinnerFactory);
  }
  static createCloseButton(options, className) {
    const closeButton = document.createElement("button", { is: "ax-button" });
    Object.assign(closeButton, options);
    closeButton.classList.add(className || "close");
    closeButton.onInitialized = (button) => {
      const icon = document.createElement("i");
      icon.classList.add("fa", "fa-times");
      if (button.#options.closeIconURL.length) {
        icon.style.backgroundImage = `url("${button.#options.closeIconURL}")`;
        icon.classList.add("image");
      }
      button.append(icon);
    };
    return closeButton;
  }
  static createSaveButton(options, existingCommentId) {
    const saveButton = document.createElement("button", { is: "ax-button" });
    Object.assign(saveButton, options);
    saveButton.onInitialized = (button) => {
      const saveButtonClass = existingCommentId ? "update" : "send";
      const saveButtonText = existingCommentId ? button.#options.saveText : button.#options.sendText;
      saveButton.classList.add(saveButtonClass, "save", "highlight-background");
      saveButton.append(ButtonElement.createLabel(saveButtonText));
    };
    return saveButton;
  }
  static createUploadButton(options) {
    const uploadButton = document.createElement("button", { is: "ax-button" });
    Object.assign(uploadButton, options);
    uploadButton.classList.add("upload", "enabled");
    uploadButton.onInitialized = (button) => {
      const uploadIcon = document.createElement("i");
      uploadIcon.classList.add("fa", "fa-paperclip");
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.multiple = true;
      if (button.#options.uploadIconURL.length) {
        uploadIcon.style.backgroundImage = `url("${button.#options.uploadIconURL}")`;
        uploadIcon.classList.add("image");
      }
      button.append(uploadIcon, fileInput);
    };
    return uploadButton;
  }
  static createActionButton(className, label, options) {
    const actionButton = document.createElement("button", { is: "ax-button" });
    Object.assign(actionButton, options);
    actionButton.classList.add("action", className);
    actionButton.append(ButtonElement.createLabel(label));
    return actionButton;
  }
  static createDeleteButton(options) {
    const deleteButton = ButtonElement.createActionButton("delete", "", options);
    deleteButton.classList.add("enabled");
    deleteButton.onInitialized = (button) => {
      const deleteButtonText = button.#options.deleteText;
      const label = button.querySelector("span.label");
      label.style.color = button.#options.deleteButtonColor;
      label.textContent = deleteButtonText;
    };
    return deleteButton;
  }
  static createUpvoteButton(commentModel) {
    const upvoteButton = document.createElement("button", { is: "ax-button" });
    upvoteButton.classList.add("action", "upvote");
    upvoteButton.classList.toggle("disabled", !!commentModel.createdByCurrentUser);
    const upvoteCount = document.createElement("span");
    upvoteCount.classList.add("upvote-count");
    const reRenderUpvotes = () => {
      if (commentModel.upvotedByCurrentUser)
        upvoteButton.classList.add("highlight-font");
      else
        upvoteButton.classList.remove("highlight-font");
      upvoteCount.textContent = isNil(commentModel.upvoteCount) ? "" : `${commentModel.upvoteCount}`;
    };
    reRenderUpvotes();
    upvoteButton.onInitialized = (button) => {
      const upvoteIcon = document.createElement("i");
      upvoteIcon.classList.add("fa", "fa-thumbs-up");
      if (button.#options.upvoteIconURL.length) {
        upvoteIcon.style.backgroundImage = `url("${button.#options.upvoteIconURL}")`;
        upvoteIcon.classList.add("image");
      }
      button.append(upvoteCount, upvoteIcon);
    };
    const upvoteComment = (e) => {
      const previousUpvoteCount = commentModel.upvoteCount ?? 0;
      let newUpvoteCount;
      if (commentModel.upvotedByCurrentUser) {
        newUpvoteCount = previousUpvoteCount - 1;
      } else {
        newUpvoteCount = previousUpvoteCount + 1;
      }
      commentModel.upvotedByCurrentUser = !commentModel.upvotedByCurrentUser;
      commentModel.upvoteCount = newUpvoteCount;
      reRenderUpvotes();
      const commentTransformer = ServiceProvider.get(getHostContainer(upvoteButton), CommentTransformer);
      const success = (updatedComment) => {
        const commentModel2 = commentTransformer.enrich(updatedComment);
        Object.assign(commentModel2, commentModel2);
        reRenderUpvotes();
      };
      const error = () => {
        commentModel.upvotedByCurrentUser = !commentModel.upvotedByCurrentUser;
        commentModel.upvoteCount = previousUpvoteCount;
        reRenderUpvotes();
      };
      upvoteButton.#options.upvoteComment(commentTransformer.deplete(commentModel), success, error);
    };
    upvoteButton.onclick = upvoteComment;
    return upvoteButton;
  }
  static createLabel(text) {
    const label = document.createElement("span");
    label.classList.add("label");
    label.textContent = text;
    return label;
  }
  setButtonState(enabled, loading) {
    this.classList.toggle("enabled", enabled);
    this.querySelector(".spinner").classList.toggle("hidden", !loading);
  }
};
ButtonElement = __decorateClass([
  RegisterCustomElement("ax-button", { extends: "button" })
], ButtonElement);

// src/subcomponent/tag-factory.ts
var TagFactory = class {
  constructor(container) {
    this.container = container;
    this.#options = OptionsProvider.get(container);
  }
  #options;
  createTagElement(text, extraClasses, value, extraAttributes) {
    const tagEl = document.createElement("input");
    tagEl.classList.add("tag");
    tagEl.type = "button";
    if (extraClasses) {
      tagEl.classList.add(extraClasses);
    }
    tagEl.value = text;
    tagEl.setAttribute("data-value", value);
    if (extraAttributes) {
      for (const attributeName in extraAttributes) {
        tagEl.setAttribute(attributeName, extraAttributes[attributeName]);
      }
    }
    return tagEl;
  }
  createAttachmentTagElement(attachment, onDeleted) {
    const attachmentTag = document.createElement("a");
    attachmentTag.classList.add("tag", "attachment");
    attachmentTag.target = "_blank";
    attachmentTag.setAttribute("id", attachment.id);
    attachmentTag.attachmentTagData = {
      id: attachment.id,
      mime_type: attachment.mime_type,
      file: attachment.file
    };
    let fileName = "";
    if (attachment.file instanceof File) {
      fileName = attachment.file.name;
    } else {
      const parts = attachment.file.split("/");
      fileName = parts[parts.length - 1];
      fileName = fileName.split("?")[0];
      fileName = decodeURIComponent(fileName);
    }
    const attachmentIcon = document.createElement("i");
    attachmentIcon.classList.add("fa", "fa-paperclip");
    if (this.#options.attachmentIconURL.length) {
      attachmentIcon.style.backgroundImage = `url("${this.#options.attachmentIconURL}")`;
      attachmentIcon.classList.add("image");
    }
    attachmentTag.append(attachmentIcon, fileName);
    if (onDeleted) {
      attachmentTag.classList.add("deletable");
      const closeButton = ButtonElement.createCloseButton({
        inline: false,
        onclick: (e) => {
          e.currentTarget.parentElement.remove();
          onDeleted();
        }
      }, "delete");
      attachmentTag.append(closeButton);
    } else {
      attachmentTag.setAttribute("href", attachment.file);
    }
    return attachmentTag;
  }
};

// src/subcomponent/textarea-element.ts
var TextareaElement = class extends HTMLTextAreaElement {
  parentId = null;
  existingCommentId = null;
  valueBeforeChange = "";
  pingedUsers = [];
  referencedHashtags = [];
  #options;
  #commentViewModel;
  connectedCallback() {
    this.#initServices();
    this.#initElement();
  }
  disconnectedCallback() {
    this.removeEventListener("keydown", this.#addOnKeydown);
    this.removeEventListener("input", this.#checkEditedValueForChange);
    this.removeEventListener("focusin", this.#increaseTextareaHeight);
    this.removeEventListener("change", this.#increaseTextareaHeight);
  }
  #initServices() {
    const container = getHostContainer(this);
    this.#options = OptionsProvider.get(container);
    this.#commentViewModel = CommentViewModelProvider.get(container);
  }
  #initElement() {
    this.classList.add("textarea");
    this.placeholder = this.#options.textareaPlaceholderText;
    if (this.existingCommentId) {
      const existingComment = this.#commentViewModel.getComment(this.existingCommentId);
      this.value = existingComment.content;
    }
    this.adjustTextareaHeight(false);
    this.addEventListener("keydown", this.#addOnKeydown);
    this.addEventListener("input", this.#checkEditedValueForChange);
    this.addEventListener("focusin", this.#increaseTextareaHeight);
    this.addEventListener("change", this.#increaseTextareaHeight);
  }
  static create(options) {
    const textarea = document.createElement("textarea", { is: "ax-textarea" });
    Object.assign(textarea, options);
    return textarea;
  }
  #addOnKeydown = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      const metaKey = e.metaKey || e.ctrlKey;
      if (this.#options.postCommentOnEnter || metaKey) {
        const el = e.currentTarget;
        findSiblingsBySelector(el, ".control-row").querySelector(".save").click();
        e.stopPropagation();
        e.preventDefault();
      }
    }
  };
  #checkEditedValueForChange = (e) => {
    const el = e.currentTarget;
    if (el.valueBeforeChange !== el.value) {
      el.valueBeforeChange = el.value;
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };
  #increaseTextareaHeight = (e) => {
    const textarea = e.currentTarget;
    textarea.adjustTextareaHeight(true);
    textarea.parentElement.classList.toggle("textarea-scrollable", textarea.scrollHeight > textarea.clientHeight);
  };
  adjustTextareaHeight(focus) {
    let rowCount = focus ? this.#options.textareaRowsOnFocus : this.#options.textareaRows;
    this.rows = rowCount;
  }
  clearTextarea() {
    this.value = "";
    this.dispatchEvent(new InputEvent("input", { inputType: "deleteContent" }));
  }
  getTextareaContent() {
    return normalizeSpaces(this.value ?? "");
  }
  getPings() {
    return this.pingedUsers.reduce((acc, user) => {
      acc[user.id] = user.displayName;
      return acc;
    }, {});
  }
};
TextareaElement = __decorateClass([
  RegisterCustomElement("ax-textarea", { extends: "textarea" })
], TextareaElement);

// src/subcomponent/textcomplete-factory.ts
var import_core = __toESM(require_dist(), 1);
var import_textarea = __toESM(require_dist4(), 1);
var _options, _profilePictureFactory, _createUserItem, createUserItem_fn, _createHashtagItem, createHashtagItem_fn, _createResult, createResult_fn, _replaceUserPingText, replaceUserPingText_fn, _replaceHashtagReferenceText, replaceHashtagReferenceText_fn, _isUser, isUser_fn;
var _TextcompleteFactory = class {
  constructor(container) {
    this.container = container;
    __privateAdd(this, _createUserItem);
    __privateAdd(this, _createHashtagItem);
    __privateAdd(this, _createResult);
    __privateAdd(this, _replaceUserPingText);
    __privateAdd(this, _replaceHashtagReferenceText);
    __privateAdd(this, _options, void 0);
    __privateAdd(this, _profilePictureFactory, void 0);
    __privateSet(this, _options, OptionsProvider.get(container));
    __privateSet(this, _profilePictureFactory, ServiceProvider.get(this.container, ProfilePictureFactory));
  }
  createTextcomplete(textarea) {
    const textcompleteEditor = new import_textarea.TextareaEditor(textarea);
    let startsWithSpace = false;
    const textcompleteStrategy = {
      // Starts with '@' or '#' and has at least 3 other characters
      match: /(?:^|\s)([@#][\w-]{3,})$/i,
      search: (term, callback, match) => {
        startsWithSpace = match[0].startsWith(" ");
        term = normalizeSpaces(term);
        const prefix = term[0];
        term = term.substring(1);
        const error = () => callback([]);
        if (isStringEmpty(term)) {
          error();
          return;
        }
        if (prefix === "@") {
          __privateGet(this, _options).searchUsers(term, callback, error);
        } else if (prefix === "#") {
          __privateGet(this, _options).searchTags(term, callback, error);
        } else {
          error();
        }
      },
      template: (userOrHashtag) => {
        var _a;
        return __privateMethod(_a = _TextcompleteFactory, _isUser, isUser_fn).call(_a, userOrHashtag) ? __privateMethod(this, _createUserItem, createUserItem_fn).call(this, userOrHashtag).outerHTML : __privateMethod(this, _createHashtagItem, createHashtagItem_fn).call(this, userOrHashtag).outerHTML;
      },
      replace: (userOrHashtag) => {
        var _a;
        return __privateMethod(_a = _TextcompleteFactory, _isUser, isUser_fn).call(_a, userOrHashtag) ? __privateMethod(this, _replaceUserPingText, replaceUserPingText_fn).call(this, userOrHashtag, textarea, startsWithSpace) : __privateMethod(this, _replaceHashtagReferenceText, replaceHashtagReferenceText_fn).call(this, userOrHashtag, textarea, startsWithSpace);
      },
      cache: true
    };
    const textcompleteOptions = {
      dropdown: {
        parent: this.container,
        className: "dropdown autocomplete",
        maxCount: 8,
        rotate: true
      }
    };
    return new import_core.Textcomplete(textcompleteEditor, [textcompleteStrategy], textcompleteOptions);
  }
};
var TextcompleteFactory = _TextcompleteFactory;
_options = new WeakMap();
_profilePictureFactory = new WeakMap();
_createUserItem = new WeakSet();
createUserItem_fn = function(user) {
  const profilePic = __privateGet(this, _profilePictureFactory).createProfilePictureElement(user.id, user.profilePictureURL);
  return __privateMethod(this, _createResult, createResult_fn).call(this, profilePic, user.displayName || user.id, user.email || user.displayName && user.id);
};
_createHashtagItem = new WeakSet();
createHashtagItem_fn = function(hashtag) {
  const hash = document.createElement("i");
  hash.classList.add("fas", "fa-hashtag", "hashtag");
  return __privateMethod(this, _createResult, createResult_fn).call(this, hash, hashtag.tag, hashtag.description);
};
_createResult = new WeakSet();
createResult_fn = function(pic, nameContent, detailsContent) {
  const info = document.createElement("span");
  info.classList.add("info");
  const name = document.createElement("span");
  name.classList.add("name");
  name.textContent = nameContent;
  if (detailsContent) {
    const details = document.createElement("span");
    details.classList.add("details");
    details.textContent = detailsContent;
    info.append(name, details);
  } else {
    info.classList.add("no-details");
    info.append(name);
  }
  const result = document.createElement("p");
  result.classList.add("result");
  result.append(pic, info);
  return result;
};
_replaceUserPingText = new WeakSet();
replaceUserPingText_fn = function(user, textarea, startsWithSpace) {
  textarea.pingedUsers.push(user);
  return `${startsWithSpace ? " " : ""}@${user.id} `;
};
_replaceHashtagReferenceText = new WeakSet();
replaceHashtagReferenceText_fn = function(hashtag, textarea, startsWithSpace) {
  textarea.referencedHashtags.push(hashtag.tag);
  return `${startsWithSpace ? " " : ""}#${hashtag.tag} `;
};
_isUser = new WeakSet();
isUser_fn = function(obj) {
  return !isStringEmpty(obj.id);
};
__privateAdd(TextcompleteFactory, _isUser);

// src/subcomponent/commenting-field-element.ts
var CommentingFieldElement = class extends HTMLElement {
  parentId = null;
  existingCommentId = null;
  isMain = false;
  onClosed = () => {
  };
  #textcomplete;
  #options;
  #commentViewModel;
  #commentTransformer;
  #profilePictureFactory;
  #textcompleteFactory;
  #tagFactory;
  static create(options) {
    const commentingFieldEl = document.createElement("ax-commenting-field");
    Object.assign(commentingFieldEl, options);
    return commentingFieldEl;
  }
  connectedCallback() {
    this.#initServices();
    this.#initElement();
    this.querySelector(".textarea").addEventListener("input", this.#changeSaveButtonState);
  }
  disconnectedCallback() {
    this.#textcomplete?.destroy(true);
    this.querySelector(".textarea").removeEventListener("input", this.#changeSaveButtonState);
    this.#removeElement();
  }
  #initServices() {
    const container = getHostContainer(this);
    this.#options = OptionsProvider.get(container);
    this.#commentViewModel = CommentViewModelProvider.get(container);
    this.#commentTransformer = ServiceProvider.get(container, CommentTransformer);
    this.#profilePictureFactory = ServiceProvider.get(container, ProfilePictureFactory);
    this.#textcompleteFactory = ServiceProvider.get(container, TextcompleteFactory);
    this.#tagFactory = ServiceProvider.get(container, TagFactory);
  }
  #initElement() {
    let profilePictureURL;
    let userId;
    let attachments;
    this.classList.add("commenting-field");
    if (this.isMain) {
      this.classList.add("main");
    }
    const textarea = TextareaElement.create({
      parentId: this.parentId,
      existingCommentId: this.existingCommentId,
      onclick: this.isMain ? this.#showMainField : null
    });
    if (this.existingCommentId) {
      const existingComment = this.#commentViewModel.getComment(this.existingCommentId);
      profilePictureURL = existingComment.creatorProfilePictureURL;
      userId = existingComment.creatorUserId;
      attachments = existingComment.attachments ?? [];
      const pings = Object.entries(existingComment.pings ?? {});
      if (this.#options.enablePinging && pings.length) {
        pings.forEach((ping) => {
          textarea.pingedUsers.push({
            id: ping[0],
            displayName: ping[1]
          });
        });
      }
    } else {
      profilePictureURL = this.#options.profilePictureURL;
      userId = this.#options.currentUserId;
      attachments = [];
      if (this.#options.enablePinging && this.parentId) {
        const parentModel = this.#commentViewModel.getComment(this.parentId);
        textarea.value = "@" + parentModel.creatorUserId + " ";
        textarea.pingedUsers.push({
          id: parentModel.creatorUserId,
          displayName: parentModel.creatorDisplayName
        });
      }
    }
    const profilePicture = this.#profilePictureFactory.createProfilePictureElement(userId, profilePictureURL);
    const textareaWrapper = document.createElement("div");
    textareaWrapper.classList.add("textarea-wrapper");
    const controlRow = document.createElement("div");
    controlRow.classList.add("control-row");
    const closeButton = ButtonElement.createCloseButton({
      inline: true,
      onclick: this.isMain ? this.#hideMainField : this.#removeElement
    });
    const saveButton = ButtonElement.createSaveButton({
      onclick: this.existingCommentId ? this.#updateComment : this.#addComment
    }, this.existingCommentId);
    controlRow.append(saveButton);
    if (this.#options.enableAttachments) {
      const mainUploadButton = ButtonElement.createUploadButton({
        inline: false,
        onclick: this.#fileInputChanged
      });
      controlRow.append(mainUploadButton);
      if (this.isMain) {
        const inlineUploadButton = ButtonElement.createUploadButton({
          inline: true,
          onclick: this.#fileInputChanged
        });
        textareaWrapper.append(inlineUploadButton);
      }
      const attachmentsContainer = document.createElement("div");
      attachmentsContainer.classList.add("attachments");
      attachments.forEach((attachment) => {
        const attachmentTag = this.#tagFactory.createAttachmentTagElement(attachment, this.#toggleSaveButton.bind(this));
        attachmentsContainer.append(attachmentTag);
      });
      controlRow.append(attachmentsContainer);
    }
    textareaWrapper.append(closeButton, textarea, controlRow);
    const container = document.createElement("div");
    container.classList.add("commenting-field-container");
    container.append(profilePicture, textareaWrapper);
    this.append(container);
    if (this.#options.enablePinging) {
      this.#textcomplete = this.#textcompleteFactory.createTextcomplete(textarea);
    }
  }
  #showMainField = (e) => {
    if (!this.isMain)
      return;
    const mainTextarea = e.currentTarget;
    findSiblingsBySelector(mainTextarea, ".control-row").forEach(showElement);
    showElement(mainTextarea.parentElement.querySelector(".close"));
    hideElement(mainTextarea.parentElement.querySelector(".upload.inline-button"));
    mainTextarea.focus();
  };
  #hideMainField = (e) => {
    if (!this.isMain)
      return;
    const closeButton = e.currentTarget;
    const mainTextarea = this.querySelector(".textarea");
    const mainControlRow = this.querySelector(".control-row");
    mainTextarea.clearTextarea();
    this.querySelector(".attachments").innerHTML = "";
    this.#toggleSaveButton();
    mainTextarea.adjustTextareaHeight(false);
    hideElement(mainControlRow);
    hideElement(closeButton);
    showElement(mainTextarea.parentElement.querySelector(".upload.inline-button"));
    mainTextarea.blur();
    this.onClosed();
  };
  #removeElement = () => {
    if (this.isMain)
      return;
    this.onClosed();
    this.remove();
  };
  #addComment = (e) => {
    const addButton = e.currentTarget;
    if (!addButton.classList.contains("enabled")) {
      return;
    }
    addButton.setButtonState(false, true);
    const comment = this.getCommentModel();
    const success = (postedComment) => {
      this.#commentViewModel.addComment(this.#commentTransformer.enrich(postedComment));
      this.querySelector(".close").click();
      addButton.setButtonState(false, false);
    };
    const error = () => {
      addButton.setButtonState(true, false);
    };
    this.#options.postComment(comment, success, error);
  };
  #updateComment = (e) => {
    const updateButton = e.currentTarget;
    if (!updateButton.classList.contains("enabled")) {
      return;
    }
    const textarea = this.querySelector(".textarea");
    updateButton.setButtonState(false, true);
    const commentEnriched = Object.assign(
      {},
      this.#commentViewModel.getComment(this.existingCommentId),
      {
        parentId: textarea.parentId,
        content: textarea.getTextareaContent(),
        pings: textarea.getPings(),
        modifiedAt: new Date(),
        attachments: this.getAttachments()
      }
    );
    const success = (updatedComment) => {
      this.#commentViewModel.updateComment(updatedComment);
      this.querySelector(".close").click();
      updateButton.setButtonState(false, false);
    };
    const error = () => {
      updateButton.setButtonState(true, false);
    };
    this.#options.putComment(this.#commentTransformer.deplete(commentEnriched), success, error);
  };
  #fileInputChanged = (e) => {
    const uploadButton = e.currentTarget;
    if (!uploadButton.classList.contains("enabled")) {
      return;
    }
    const input = uploadButton.querySelector('input[type="file"]');
    this.preSaveAttachments(input.files);
  };
  #changeSaveButtonState = (e) => {
    const textarea = e.currentTarget;
    const currentContent = textarea.getTextareaContent();
    const originalContent = this.existingCommentId ? this.#commentViewModel.getComment(this.existingCommentId).content : null;
    this.querySelector("button.save").setButtonState(!isStringEmpty(currentContent) && currentContent !== originalContent, false);
  };
  getCommentModel() {
    const textarea = this.querySelector(".textarea");
    const time = new Date();
    const commentModel = {
      id: "c" + (this.#commentViewModel.getComments().length + 1),
      // Temporary id
      parentId: textarea.parentId || void 0,
      createdAt: time,
      modifiedAt: time,
      content: textarea.getTextareaContent(),
      pings: textarea.getPings(),
      creatorUserId: this.#options.currentUserId,
      createdByAdmin: this.#options.currentUserIsAdmin,
      creatorDisplayName: this.#options.youText,
      creatorProfilePictureURL: this.#options.profilePictureURL,
      createdByCurrentUser: true,
      upvoteCount: 0,
      upvotedByCurrentUser: false,
      attachments: this.getAttachments()
    };
    return commentModel;
  }
  getAttachments() {
    const attachmentElements = this.querySelectorAll(".attachments .attachment");
    const attachments = [];
    for (let i = 0; i < attachmentElements.length; i++) {
      attachments[i] = attachmentElements[i].attachmentTagData;
    }
    return attachments;
  }
  #toggleSaveButton() {
    const textarea = this.querySelector(".textarea");
    const saveButton = findSiblingsBySelector(textarea, ".control-row").querySelector(".save");
    const content = textarea.getTextareaContent();
    const attachments = this.getAttachments();
    let enabled;
    const commentModel = this.#commentViewModel.getComment(textarea.existingCommentId);
    if (commentModel) {
      const contentChanged = content !== commentModel.content;
      const parentFromModel = commentModel.parentId || "";
      const parentFromTextarea = textarea.parentId;
      const parentChanged = !isStringEmpty(parentFromTextarea) && parentFromTextarea !== parentFromModel;
      let attachmentsChanged = false;
      if (this.#options.enableAttachments) {
        const savedAttachmentIds = (commentModel.attachments ?? []).map((attachment) => attachment.id);
        const currentAttachmentIds = attachments.map((attachment) => attachment.id);
        attachmentsChanged = !areArraysEqual(savedAttachmentIds, currentAttachmentIds);
      }
      enabled = contentChanged || parentChanged || attachmentsChanged;
    } else {
      enabled = !!content.length || !!attachments.length;
    }
    saveButton.classList.toggle("enabled", enabled);
  }
  preSaveAttachments(files) {
    const uploadButton = this.querySelector(".control-row .upload");
    const attachmentsContainer = this.querySelector(".control-row .attachments");
    if (!files.length) {
      return;
    }
    let attachments = [...files].map((file) => ({
      mime_type: file.type,
      file
    }));
    const existingAttachments = this.getAttachments();
    attachments = attachments.filter((attachment) => {
      let duplicate = false;
      for (let i = 0; i < existingAttachments.length; i++) {
        const existingAttachment = existingAttachments[i];
        if (attachment.file.name === existingAttachment.file.name && attachment.file.size === existingAttachment.file.size) {
          duplicate = true;
          break;
        }
      }
      return !duplicate;
    });
    if (this.classList.contains("main")) {
      this.querySelector(".textarea").dispatchEvent(new MouseEvent("click"));
    }
    uploadButton.setButtonState(false, true);
    this.#options.validateAttachments(attachments, (validatedAttachments) => {
      if (validatedAttachments.length) {
        validatedAttachments.forEach((attachment) => {
          const attachmentTag = this.#tagFactory.createAttachmentTagElement(attachment, () => {
            this.#toggleSaveButton();
          });
          attachmentsContainer.append(attachmentTag);
        });
        this.#toggleSaveButton();
      }
      uploadButton.setButtonState(true, false);
    });
    uploadButton.querySelector("input").value = "";
  }
};
CommentingFieldElement = __decorateClass([
  RegisterCustomElement("ax-commenting-field")
], CommentingFieldElement);

// src/subcomponent/comment-content-formatter.ts
var import_sanitize_html = __toESM(require_sanitize_html(), 1);
var _options2, _tagFactory, _hashtagClicked, _pingClicked;
var _CommentContentFormatter = class {
  constructor(container) {
    __privateAdd(this, _options2, void 0);
    __privateAdd(this, _tagFactory, void 0);
    __privateAdd(this, _hashtagClicked, (e) => {
      const el = e.currentTarget;
      const value = el.getAttribute("data-value");
      __privateGet(this, _options2).hashtagClicked(value);
    });
    __privateAdd(this, _pingClicked, (e) => {
      const el = e.currentTarget;
      const value = el.getAttribute("data-value");
      __privateGet(this, _options2).pingClicked(value);
    });
    __privateSet(this, _options2, OptionsProvider.get(container));
    __privateSet(this, _tagFactory, ServiceProvider.get(container, TagFactory));
  }
  getFormattedCommentContent(commentModel, replaceNewLines) {
    let html = this.escape((0, import_sanitize_html.default)(commentModel.content));
    html = this.linkify(html);
    html = this.highlightTags(commentModel, html);
    if (replaceNewLines) {
      html = html.replace(/(?:\n)/g, "<br>");
    }
    const content = document.createElement("span");
    content.innerHTML = html;
    content.querySelectorAll(".hashtag").forEach((hashtag) => hashtag.onclick = __privateGet(this, _hashtagClicked));
    content.querySelectorAll(".ping").forEach((hashtag) => hashtag.onclick = __privateGet(this, _pingClicked));
    return content;
  }
  escape(inputText) {
    const escaped = document.createElement("pre");
    escaped.textContent = normalizeSpaces(inputText);
    return escaped.innerHTML;
  }
  linkify(inputText) {
    let replacedText;
    const replacePattern1 = /(\b(https?|ftp|file):\/\/[-A-ZÄÖÅ0-9+&@#\/%?=~_|!:,.;{}]*[-A-ZÄÖÅ0-9+&@#\/%=~_|{}])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
    const replacePattern2 = /(^|[^\/f])(www\.[-A-ZÄÖÅ0-9+&@#\/%?=~_|!:,.;{}]*[-A-ZÄÖÅ0-9+&@#\/%=~_|{}])/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="https://$2" target="_blank">$2</a>');
    const replacePattern3 = /(([A-ZÄÖÅ0-9\-\_\.])+@[A-ZÄÖÅ\_]+?(\.[A-ZÄÖÅ]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1" target="_blank">$1</a>');
    const count = inputText.match(/<a href/g) || [];
    if (count.length > 0) {
      const splitInput = inputText.split(/(<\/a>)/g);
      for (let i = 0; i < splitInput.length; i++) {
        if (isNil(splitInput[i].match(/<a href/g))) {
          splitInput[i] = splitInput[i].replace(replacePattern1, '<a href="$1" target="_blank">$1</a>').replace(replacePattern2, '$1<a href="https://$2" target="_blank">$2</a>').replace(replacePattern3, '<a href="mailto:$1" target="_blank">$1</a>');
        }
      }
      const combinedReplacedText = splitInput.join("");
      return combinedReplacedText;
    } else {
      return replacedText;
    }
  }
  highlightTags(commentModel, html) {
    if (__privateGet(this, _options2).enableHashtags) {
      html = this.highlightHashtags(commentModel, html);
    }
    if (__privateGet(this, _options2).enablePinging) {
      html = this.highlightPings(commentModel, html);
    }
    return html;
  }
  highlightHashtags(commentModel, html) {
    if (html.indexOf("#") !== -1) {
      const regex = _CommentContentFormatter.HASHTAG_REGEXP;
      html = html.replace(regex, ($0, $1, $2) => $1 + this.createHashTag($2));
    }
    return html;
  }
  createHashTag(hashTagText) {
    const tag = __privateGet(this, _tagFactory).createTagElement("#" + hashTagText, "hashtag", hashTagText, {
      "data-type": "#"
    });
    return tag.outerHTML;
  }
  highlightPings(commentModel, html) {
    if (html.indexOf("@") !== -1) {
      for (const userId in commentModel.pings) {
        const displayName = commentModel.pings[userId] || userId;
        const pingText = "@" + userId;
        html = html.replace(new RegExp(pingText, "g"), this.createUserTag(`@${displayName}`, userId));
      }
    }
    return html;
  }
  createUserTag(pingText, userId) {
    const tag = __privateGet(this, _tagFactory).createTagElement(pingText, "ping", userId, {
      "data-user-id": userId,
      "data-type": "@"
    });
    return tag.outerHTML;
  }
};
var CommentContentFormatter = _CommentContentFormatter;
_options2 = new WeakMap();
_tagFactory = new WeakMap();
_hashtagClicked = new WeakMap();
_pingClicked = new WeakMap();
__publicField(CommentContentFormatter, "PING_REGEXP", /(^|\s)@([a-z\u00C0-\u00FF\d-_]+)/gim);
__publicField(CommentContentFormatter, "HASHTAG_REGEXP", /(^|\s)#([a-z\u00C0-\u00FF\d-_]+)/gim);

// src/subcomponent/comment-container-element.ts
var CommentContainerElement = class extends HTMLElement {
  commentModel;
  #subscriptions = [];
  #options;
  #commentViewModel;
  #commentTransformer;
  #commentContentFormatter;
  #profilePictureFactory;
  #tagFactory;
  static create(options) {
    const commentContainer = document.createElement("ax-comment-container");
    Object.assign(commentContainer, options);
    return commentContainer;
  }
  connectedCallback() {
    this.#initServices();
    this.#initElement();
    this.#subscriptions.push(this.#commentViewModel.subscribe("COMMENT_UPDATED" /* COMMENT_UPDATED */, (commentId) => {
      if (commentId !== this.commentModel.id) {
        return;
      }
      this.#initElement();
    }));
  }
  disconnectedCallback() {
    this.#subscriptions.forEach((s) => s.unsubscribe());
    this.#subscriptions = [];
  }
  #initServices() {
    if (this.#options)
      return;
    const container = getHostContainer(this);
    this.#options = OptionsProvider.get(container);
    this.#commentViewModel = CommentViewModelProvider.get(container);
    this.#commentTransformer = ServiceProvider.get(container, CommentTransformer);
    this.#commentContentFormatter = ServiceProvider.get(container, CommentContentFormatter);
    this.#profilePictureFactory = ServiceProvider.get(container, ProfilePictureFactory);
    this.#tagFactory = ServiceProvider.get(container, TagFactory);
  }
  #initElement() {
    this.innerHTML = "";
    const commentWrapper = document.createElement("div");
    commentWrapper.classList.add("comment-wrapper");
    const profilePicture = this.#profilePictureFactory.createProfilePictureElement(
      this.commentModel.creatorUserId,
      this.commentModel.creatorProfilePictureURL
    );
    const time = document.createElement("time");
    time.textContent = this.#options.timeFormatter(this.commentModel.createdAt);
    time.setAttribute("title", this.commentModel.createdAt.toLocaleString());
    time.setAttribute("datetime", this.commentModel.createdAt.toISOString());
    const commentHeaderEl = document.createElement("div");
    commentHeaderEl.classList.add("comment-header");
    const nameEl = document.createElement("span");
    nameEl.textContent = this.commentModel.createdByCurrentUser ? this.#options.youText : this.commentModel.creatorDisplayName || this.commentModel.creatorUserId;
    nameEl.classList.add("name");
    nameEl.setAttribute("data-user-id", this.commentModel.creatorUserId);
    commentHeaderEl.append(nameEl);
    if (this.commentModel.createdByAdmin) {
      nameEl.classList.add("highlight-font-bold");
    }
    if (this.commentModel.parentId) {
      const parent = this.#commentViewModel.getComment(this.commentModel.parentId);
      if (parent.parentId) {
        const replyTo = document.createElement("span");
        replyTo.textContent = parent.creatorDisplayName || parent.creatorUserId;
        replyTo.classList.add("reply-to");
        replyTo.setAttribute("data-user-id", parent.creatorUserId);
        const replyIcon = document.createElement("i");
        replyIcon.classList.add("fa", "fa-share");
        if (this.#options.replyIconURL.length) {
          replyIcon.style.backgroundImage = `url("${this.#options.replyIconURL}")`;
          replyIcon.classList.add("image");
        }
        replyTo.prepend(replyIcon);
        commentHeaderEl.append(replyTo);
      }
    }
    if (this.commentModel.isNew) {
      const newTag = document.createElement("span");
      newTag.classList.add("new", "highlight-background");
      newTag.textContent = this.#options.newText;
      commentHeaderEl.append(newTag);
    }
    const wrapper = document.createElement("div");
    wrapper.classList.add("wrapper");
    const content = document.createElement("div");
    content.classList.add("content");
    content.append(this.#commentContentFormatter.getFormattedCommentContent(this.commentModel));
    if (this.commentModel.modifiedAt && this.commentModel.modifiedAt !== this.commentModel.createdAt) {
      const editedTime = this.#options.timeFormatter(this.commentModel.modifiedAt);
      const edited = document.createElement("time");
      edited.classList.add("edited");
      edited.textContent = `${this.#options.editedText} ${editedTime}`;
      edited.setAttribute("title", this.commentModel.modifiedAt.toLocaleString());
      edited.setAttribute("datetime", this.commentModel.modifiedAt.toISOString());
      content.append(edited);
    }
    const attachments = document.createElement("div");
    attachments.classList.add("attachments");
    const attachmentPreviews = document.createElement("div");
    attachmentPreviews.classList.add("previews");
    const attachmentTags = document.createElement("div");
    attachmentTags.classList.add("tags");
    attachments.append(attachmentPreviews, attachmentTags);
    if (this.#options.enableAttachments && this.commentModel.hasAttachments()) {
      this.commentModel.attachments?.forEach((attachment) => {
        let format = void 0;
        let type = void 0;
        if (attachment.mime_type) {
          const mimeTypeParts = attachment.mime_type.split("/");
          if (mimeTypeParts.length === 2) {
            format = mimeTypeParts[1];
            type = mimeTypeParts[0];
          }
        }
        if (type === "image" || type === "video") {
          const previewRow = document.createElement("div");
          const preview = document.createElement("a");
          preview.classList.add("preview");
          preview.href = attachment.file;
          preview.target = "_blank";
          previewRow.append(preview);
          if (type === "image") {
            const image = document.createElement("img");
            image.src = attachment.file;
            preview.append(image);
          } else {
            const video = document.createElement("video");
            video.controls = true;
            const videoSource = document.createElement("source");
            videoSource.src = attachment.file;
            videoSource.type = attachment.mime_type;
            video.append(videoSource);
            preview.append(video);
          }
          attachmentPreviews.append(previewRow);
        }
        const attachmentTag = this.#tagFactory.createAttachmentTagElement(attachment);
        attachmentTags.append(attachmentTag);
      });
    }
    const actions = this.#createActions(this.commentModel);
    wrapper.append(content, attachments, actions);
    commentWrapper.append(profilePicture, time, commentHeaderEl, wrapper);
    this.append(commentWrapper);
  }
  #createActions(commentModel) {
    const actions = document.createElement("span");
    actions.classList.add("actions");
    const separator = document.createElement("span");
    separator.classList.add("separator");
    separator.textContent = "\xB7";
    if (this.#options.enableReplying) {
      const reply = ButtonElement.createActionButton("reply", this.#options.replyText, {
        onclick: this.#replyButtonClicked
      });
      actions.append(reply);
    }
    if (this.#options.enableUpvoting) {
      const upvotes = ButtonElement.createUpvoteButton(commentModel);
      actions.append(upvotes);
    }
    if (commentModel.createdByCurrentUser || this.#options.currentUserIsAdmin) {
      const editButton = ButtonElement.createActionButton("edit", this.#options.editText, {
        onclick: this.#editButtonClicked
      });
      actions.append(editButton);
    }
    if (this.#isAllowedToDelete(commentModel)) {
      const deleteButton = ButtonElement.createDeleteButton({
        onclick: this.#deleteButtonClicked
      });
      actions.append(deleteButton);
    }
    const actionsChildren = [...actions.children];
    for (let i = 0; i < actionsChildren.length; i++) {
      const action = actionsChildren[i];
      if (action.nextSibling) {
        action.after(separator.cloneNode(true));
      }
    }
    return actions;
  }
  #replyButtonClicked = (e) => {
    const replyButton = e.currentTarget;
    const outermostParent = findParentsBySelector(replyButton, "li.comment").last();
    const parentId = findParentsBySelector(replyButton, ".comment").first().getAttribute("data-id");
    let replyField = outermostParent.querySelector(":scope > .commenting-field");
    let previousParentId = null;
    if (replyField) {
      previousParentId = replyField.querySelector(".textarea").parentId;
      replyField.remove();
    }
    if (previousParentId !== parentId) {
      replyField = CommentingFieldElement.create({ parentId });
      outermostParent.append(replyField);
      const textarea = replyField.querySelector(".textarea");
      this.#moveCursorToEnd(textarea);
      replyField.scrollIntoView(false);
    }
  };
  #editButtonClicked = (e) => {
    const editButton = e.currentTarget;
    const commentEl = findParentsBySelector(editButton, "li.comment").first();
    const commentModel = commentEl.commentModel;
    commentEl.classList.add("edit");
    const editField = CommentingFieldElement.create({
      parentId: commentModel.parentId,
      existingCommentId: commentModel.id,
      onClosed: () => {
        commentEl.classList.remove("edit");
      }
    });
    commentEl.querySelector(".comment-wrapper").append(editField);
    const textarea = editField.querySelector(".textarea");
    this.#moveCursorToEnd(textarea);
    editField.scrollIntoView(false);
  };
  #isAllowedToDelete(commentModel) {
    if (!commentModel.createdByCurrentUser || !this.#options.enableDeleting) {
      return false;
    } else {
      return this.#options.enableDeletingCommentWithReplies || !commentModel.childIds.length;
    }
  }
  #deleteButtonClicked = (e) => {
    const deleteButton = e.currentTarget;
    if (!deleteButton.classList.contains("enabled")) {
      return;
    }
    const commentEnriched = Object.assign({}, this.commentModel);
    deleteButton.setButtonState(false, true);
    const success = (deletedComment) => {
      deletedComment.isDeleted = true;
      this.#commentViewModel.updateComment(deletedComment);
      deleteButton.setButtonState(false, false);
    };
    const error = () => {
      deleteButton.setButtonState(true, false);
    };
    this.#options.deleteComment(this.#commentTransformer.deplete(commentEnriched), success, error);
  };
  #moveCursorToEnd(element) {
    element.focus();
  }
  reRenderCommentActionBar() {
    const commentModel = this.commentModel;
    const actions = this.#createActions(commentModel);
    this.querySelector(".actions").replaceWith(actions);
  }
};
CommentContainerElement = __decorateClass([
  RegisterCustomElement("ax-comment-container")
], CommentContainerElement);

// src/subcomponent/comment-element.ts
var CommentElement = class extends HTMLLIElement {
  #commentModel;
  #initialized = false;
  get commentModel() {
    return this.#commentModel;
  }
  set commentModel(newValue) {
    this.#commentModel = newValue;
  }
  static create(options) {
    const commentEl = document.createElement("li", { is: "ax-comment" });
    Object.assign(commentEl, options);
    return commentEl;
  }
  connectedCallback() {
    if (this.#initialized)
      return;
    this.#initElement();
    this.#initialized = true;
  }
  #initElement() {
    this.classList.add("comment");
    this.setAttribute("data-id", this.#commentModel.id);
    if (this.#commentModel.createdByCurrentUser) {
      this.classList.add("by-current-user");
    }
    if (this.#commentModel.createdByAdmin) {
      this.classList.add("by-admin");
    }
    const childComments = document.createElement("ul");
    childComments.classList.add("child-comments");
    const commentContainer = CommentContainerElement.create({ commentModel: this.#commentModel });
    this.append(commentContainer);
    if (isNil(this.#commentModel.parentId)) {
      this.append(childComments);
    }
  }
  reRenderCommentActionBar() {
    const commentContainer = this.querySelector("ax-comment-container");
    commentContainer.reRenderCommentActionBar();
  }
};
CommentElement = __decorateClass([
  RegisterCustomElement("ax-comment", { extends: "li" })
], CommentElement);

// src/comments-element.ts
var CommentsElement = class extends HTMLElement {
  container;
  #options = {};
  #commentViewModel;
  #elementEventHandler;
  #commentTransformer;
  #commentSorter;
  #spinnerFactory;
  #currentSortKey;
  #dataFetched = false;
  constructor() {
    super();
    this.#initShadowDom(this.attachShadow({ mode: "open" }));
  }
  static create(options) {
    const commentsElement = document.createElement("ax-comments");
    Object.assign(commentsElement, options);
    return commentsElement;
  }
  connectedCallback() {
    if (!Object.keys(this.#options).length) {
      throw new Error("ax-comments options not set, element could not be initialized.");
    }
    this.#initServices();
    this.#initElement();
    this.#initEmitterListeners();
  }
  disconnectedCallback() {
    this.#commentViewModel.unsubscribeAll();
    this.#unsubscribeEvents();
    this.container.innerHTML = "";
  }
  get options() {
    return this.#options;
  }
  set options(options) {
    if (Object.keys(this.#options).length) {
      console.warn(`<ax-comments> Options already set, component can not be reinitialized.`);
      return;
    }
    Object.assign(this.#options, getDefaultOptions(), options);
    Object.freeze(this.#options);
  }
  /**
   * Define our shadowDOM for the component
   */
  #initShadowDom(shadowRoot) {
    shadowRoot.innerHTML = `
            <section id="comments-container" class="jquery-comments">
            </section>
        `;
    shadowRoot.adoptedStyleSheets = [STYLE_SHEET];
    this.container = shadowRoot.querySelector("#comments-container");
  }
  #initServices() {
    OptionsProvider.set(this.container, this.#options);
    this.#commentViewModel = CommentViewModelProvider.set(this.container, {});
    this.#elementEventHandler = new CommentsElementEventHandler(this.container);
    this.#commentTransformer = ServiceProvider.get(this.container, CommentTransformer);
    this.#commentSorter = ServiceProvider.get(this.container, CommentSorter);
    this.#spinnerFactory = ServiceProvider.get(this.container, SpinnerFactory);
  }
  #initElement() {
    if (isMobileBrowser()) {
      this.container.classList.add("mobile");
    }
    if (this.#options.readOnly) {
      this.container.classList.add("read-only");
    }
    this.#currentSortKey = this.#options.defaultNavigationSortKey;
    let allStyles = [createDynamicStylesheet(this.#options)];
    if (this.#options.styles) {
      allStyles = allStyles.concat(this.#options.styles);
    }
    this.shadowRoot.adoptedStyleSheets = allStyles;
    this.#fetchDataAndRender();
  }
  #initEmitterListeners() {
    this.#commentViewModel.subscribe("COMMENT_ADDED" /* COMMENT_ADDED */, (commentId) => {
      const comment = this.#commentViewModel.getComment(commentId);
      this.#createComment(comment);
    });
  }
  #subscribeEvents() {
    this.#toggleEventHandlers("addEventListener");
  }
  #unsubscribeEvents() {
    this.#toggleEventHandlers("removeEventListener");
  }
  #toggleEventHandlers(bindFunction) {
    EVENT_HANDLERS_MAP.forEach((handlerNames, event) => {
      handlerNames.forEach((handlerName) => {
        const method = this.#elementEventHandler[handlerName].bind(this.#elementEventHandler);
        if (isNil(event.selector)) {
          this.container[bindFunction](event.type, method);
        } else {
          this.container.querySelectorAll(event.selector).forEach((element) => {
            element[bindFunction](event.type, method);
          });
        }
      });
    });
  }
  #fetchDataAndRender() {
    this.container.innerHTML = "";
    this.#createHTML();
    const success = (comments) => {
      const commentModels = this.#commentTransformer.enrichMany([...comments]);
      this.#commentViewModel.initComments(commentModels);
      this.#dataFetched = true;
      this.#render();
    };
    const error = () => {
    };
    this.#options.getComments(success, error);
  }
  #fetchNext() {
    const spinner = this.#spinnerFactory.createSpinner();
    this.container.querySelector("ul#comment-list").append(spinner);
    const success = (comments) => {
      comments.forEach((comment) => {
        const commentEnriched = this.#commentTransformer.enrich(comment);
        this.#commentViewModel.addComment(commentEnriched);
        this.#createComment(commentEnriched);
      });
      spinner.remove();
    };
    const error = () => {
      spinner.remove();
    };
    this.#options.getComments(success, error);
  }
  #render() {
    if (!this.#dataFetched) {
      return;
    }
    this.#showActiveContainer();
    this.#createComments();
    if (this.#options.enableAttachments)
      this.#createAttachments();
    this.#subscribeEvents();
    this.container.querySelectorAll(":scope > .spinner").forEach((spinner) => spinner.remove());
    this.#options.refresh();
  }
  #showActiveContainer() {
    const activeNavigationEl = this.container.querySelector(".navigation li[data-container-name].active");
    const containerName = activeNavigationEl.getAttribute("data-container-name");
    const containerEl = this.container.querySelector('[data-container="' + containerName + '"]');
    findSiblingsBySelector(containerEl, "[data-container]").forEach(hideElement);
    showElement(containerEl);
  }
  #createComments() {
    this.container.querySelector("#comment-list")?.remove();
    const commentList = document.createElement("ul");
    commentList.id = "comment-list";
    commentList.classList.add("main");
    const rootComments = [];
    const replies = [];
    this.#commentViewModel.getComments().forEach((commentModel) => {
      if (isNil(commentModel.parentId)) {
        rootComments.push(commentModel);
      } else {
        replies.push(commentModel);
      }
    });
    this.#commentSorter.sortComments(rootComments, this.#currentSortKey);
    this.#commentSorter.sortComments(replies, "oldest" /* OLDEST */);
    this.container.querySelector('[data-container="comments"]').prepend(commentList);
    rootComments.forEach((commentModel) => {
      this.#addComment(commentModel, commentList);
    });
    replies.forEach((commentModel) => {
      this.#addComment(commentModel, commentList);
    });
  }
  #createAttachments() {
    this.container.querySelector("#attachment-list")?.remove();
    const attachmentList = document.createElement("ul");
    attachmentList.id = "attachment-list";
    attachmentList.classList.add("main");
    const attachments = this.#commentViewModel.getAttachments();
    this.#commentSorter.sortComments(attachments, "newest" /* NEWEST */);
    attachments.forEach((commentModel) => {
      this.#addAttachment(commentModel, attachmentList);
    });
    this.container.querySelector('[data-container="attachments"]').prepend(attachmentList);
  }
  #addComment(commentModel, commentList = this.container.querySelector("#comment-list"), prependComment = false) {
    const commentEl = CommentElement.create({ commentModel });
    if (commentModel.parentId) {
      const directParentEl = commentList.querySelector(`li.comment[data-id="${commentModel.parentId}"]`);
      directParentEl.reRenderCommentActionBar();
      let outerMostParent = findParentsBySelector(directParentEl, ".comment").last();
      if (isNil(outerMostParent)) {
        outerMostParent = directParentEl;
      }
      const childCommentsEl = outerMostParent.querySelector(".child-comments");
      childCommentsEl.append(commentEl);
      ToggleAllButtonElement.updateToggleAllButton(outerMostParent, this.#options);
    } else {
      if (prependComment) {
        commentList.prepend(commentEl);
      } else {
        commentList.append(commentEl);
      }
    }
  }
  #addAttachment(commentModel, commentList = this.container.querySelector("#attachment-list")) {
    const commentEl = CommentElement.create({ commentModel });
    commentList.prepend(commentEl);
  }
  #showActiveSort() {
    const activeElements = this.container.querySelectorAll(`.navigation li[data-sort-key="${this.#currentSortKey}"]`);
    this.container.querySelectorAll(".navigation li").forEach((el) => el.classList.remove("active"));
    activeElements.forEach((el) => el.classList.add("active"));
    const titleEl = this.container.querySelector(".navigation .title");
    if (this.#currentSortKey !== "attachments" /* ATTACHMENTS */) {
      titleEl.classList.add("active");
      titleEl.querySelector("header").innerHTML = activeElements.item(0).innerHTML;
    } else {
      const defaultDropdownEl = this.container.querySelector(".navigation ul.dropdown").firstElementChild;
      titleEl.querySelector("header").innerHTML = defaultDropdownEl.innerHTML;
    }
    this.#showActiveContainer();
  }
  #createComment(comment) {
    const commentList = this.container.querySelector("#comment-list");
    const prependComment = this.#currentSortKey === "newest" /* NEWEST */;
    this.#addComment(comment, commentList, prependComment);
    if (this.#currentSortKey === "attachments" /* ATTACHMENTS */ && comment.hasAttachments()) {
      this.#addAttachment(comment);
    }
  }
  #createHTML() {
    const mainCommentingField = CommentingFieldElement.create({ isMain: true });
    this.container.append(mainCommentingField);
    const mainControlRow = mainCommentingField.querySelector(".control-row");
    hideElement(mainControlRow);
    hideElement(mainCommentingField.querySelector(".close"));
    this.container.append(NavigationElement.create({
      sortKey: this.#currentSortKey,
      onSortKeyChanged: this.#navigationSortKeyChanged
    }));
    const spinner = this.#spinnerFactory.createSpinner();
    this.container.append(spinner);
    const commentsContainer = document.createElement("div");
    commentsContainer.classList.add("data-container");
    commentsContainer.setAttribute("data-container", "comments");
    this.container.append(commentsContainer);
    const noComments = document.createElement("div");
    noComments.classList.add("no-comments", "no-data");
    noComments.textContent = this.#options.noCommentsText;
    const noCommentsIcon = document.createElement("i");
    noCommentsIcon.classList.add("fa", "fa-comments", "fa-2x");
    if (this.#options.noCommentsIconURL.length) {
      noCommentsIcon.style.backgroundImage = `url("${this.#options.noCommentsIconURL}")`;
      noCommentsIcon.classList.add("image");
    }
    noComments.prepend(document.createElement("br"), noCommentsIcon);
    commentsContainer.append(noComments);
    if (this.#options.enableAttachments) {
      const attachmentsContainer = document.createElement("div");
      attachmentsContainer.classList.add("data-container");
      attachmentsContainer.setAttribute("data-container", "attachments");
      this.container.append(attachmentsContainer);
      const noAttachments = document.createElement("div");
      noAttachments.classList.add("no-attachments", "no-data");
      noAttachments.textContent = this.#options.noAttachmentsText;
      const noAttachmentsIcon = document.createElement("i");
      noAttachmentsIcon.classList.add("fa", "fa-paperclip", "fa-2x");
      if (this.#options.attachmentIconURL.length) {
        noAttachmentsIcon.style.backgroundImage = `url("${this.#options.attachmentIconURL}")`;
        noAttachmentsIcon.classList.add("image");
      }
      noAttachments.prepend(document.createElement("br"), noAttachmentsIcon);
      attachmentsContainer.append(noAttachments);
      const droppableOverlay = document.createElement("div");
      droppableOverlay.classList.add("droppable-overlay");
      const droppableContainer = document.createElement("div");
      droppableContainer.classList.add("droppable-container");
      const droppable = document.createElement("div");
      droppable.classList.add("droppable");
      const uploadIcon = document.createElement("i");
      uploadIcon.classList.add("fa", "fa-paperclip", "fa-4x");
      if (this.#options.uploadIconURL.length) {
        uploadIcon.style.backgroundImage = `url("${this.#options.uploadIconURL}")`;
        uploadIcon.classList.add("image");
      }
      const dropAttachmentText = document.createElement("div");
      dropAttachmentText.textContent = this.#options.attachmentDropText;
      droppable.append(uploadIcon);
      droppable.append(dropAttachmentText);
      droppableContainer.append(droppable);
      droppableOverlay.append(droppableContainer);
      hideElement(droppableOverlay);
      this.container.append(droppableOverlay);
    }
    this.#showActiveSort();
  }
  #navigationSortKeyChanged = (newSortKey) => {
    this.#currentSortKey = newSortKey;
    if (newSortKey === "attachments" /* ATTACHMENTS */) {
      this.#createAttachments();
    }
    if (newSortKey !== "attachments" /* ATTACHMENTS */) {
      this.#sortAndReArrangeComments(newSortKey);
    }
    this.#showActiveSort();
  };
  #sortAndReArrangeComments(sortKey) {
    const commentList = this.container.querySelector("#comment-list");
    const rootComments = this.#commentViewModel.getRootComments(this.#commentSorter.getSorter(sortKey));
    rootComments.forEach((commentModel) => {
      const commentEl = commentList.querySelector(`:scope > li.comment[data-id="${commentModel.id}"]`);
      commentList.append(commentEl);
    });
  }
};
CommentsElement = __decorateClass([
  RegisterCustomElement("ax-comments")
], CommentsElement);
export {
  CommentsElement,
  STYLE_SHEET,
  SortKey
};
