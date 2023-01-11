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

// node_modules/dompurify/dist/purify.js
var require_purify = __commonJS({
  "node_modules/dompurify/dist/purify.js"(exports, module) {
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.DOMPurify = factory());
    })(exports, function() {
      "use strict";
      function _typeof(obj) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
          return typeof obj2;
        } : function(obj2) {
          return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        }, _typeof(obj);
      }
      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
          o2.__proto__ = p2;
          return o2;
        };
        return _setPrototypeOf(o, p);
      }
      function _isNativeReflectConstruct() {
        if (typeof Reflect === "undefined" || !Reflect.construct)
          return false;
        if (Reflect.construct.sham)
          return false;
        if (typeof Proxy === "function")
          return true;
        try {
          Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
          }));
          return true;
        } catch (e) {
          return false;
        }
      }
      function _construct(Parent, args, Class) {
        if (_isNativeReflectConstruct()) {
          _construct = Reflect.construct;
        } else {
          _construct = function _construct2(Parent2, args2, Class2) {
            var a = [null];
            a.push.apply(a, args2);
            var Constructor = Function.bind.apply(Parent2, a);
            var instance = new Constructor();
            if (Class2)
              _setPrototypeOf(instance, Class2.prototype);
            return instance;
          };
        }
        return _construct.apply(null, arguments);
      }
      function _toConsumableArray(arr) {
        return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
      }
      function _arrayWithoutHoles(arr) {
        if (Array.isArray(arr))
          return _arrayLikeToArray(arr);
      }
      function _iterableToArray(iter) {
        if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
          return Array.from(iter);
      }
      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return;
        if (typeof o === "string")
          return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor)
          n = o.constructor.name;
        if (n === "Map" || n === "Set")
          return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen);
      }
      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++)
          arr2[i] = arr[i];
        return arr2;
      }
      function _nonIterableSpread() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      var hasOwnProperty = Object.hasOwnProperty, setPrototypeOf = Object.setPrototypeOf, isFrozen = Object.isFrozen, getPrototypeOf = Object.getPrototypeOf, getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
      var freeze = Object.freeze, seal = Object.seal, create = Object.create;
      var _ref = typeof Reflect !== "undefined" && Reflect, apply = _ref.apply, construct = _ref.construct;
      if (!apply) {
        apply = function apply2(fun, thisValue, args) {
          return fun.apply(thisValue, args);
        };
      }
      if (!freeze) {
        freeze = function freeze2(x) {
          return x;
        };
      }
      if (!seal) {
        seal = function seal2(x) {
          return x;
        };
      }
      if (!construct) {
        construct = function construct2(Func, args) {
          return _construct(Func, _toConsumableArray(args));
        };
      }
      var arrayForEach = unapply(Array.prototype.forEach);
      var arrayPop = unapply(Array.prototype.pop);
      var arrayPush = unapply(Array.prototype.push);
      var stringToLowerCase = unapply(String.prototype.toLowerCase);
      var stringToString = unapply(String.prototype.toString);
      var stringMatch = unapply(String.prototype.match);
      var stringReplace = unapply(String.prototype.replace);
      var stringIndexOf = unapply(String.prototype.indexOf);
      var stringTrim = unapply(String.prototype.trim);
      var regExpTest = unapply(RegExp.prototype.test);
      var typeErrorCreate = unconstruct(TypeError);
      function unapply(func) {
        return function(thisArg) {
          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }
          return apply(func, thisArg, args);
        };
      }
      function unconstruct(func) {
        return function() {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }
          return construct(func, args);
        };
      }
      function addToSet(set, array, transformCaseFunc) {
        transformCaseFunc = transformCaseFunc ? transformCaseFunc : stringToLowerCase;
        if (setPrototypeOf) {
          setPrototypeOf(set, null);
        }
        var l = array.length;
        while (l--) {
          var element = array[l];
          if (typeof element === "string") {
            var lcElement = transformCaseFunc(element);
            if (lcElement !== element) {
              if (!isFrozen(array)) {
                array[l] = lcElement;
              }
              element = lcElement;
            }
          }
          set[element] = true;
        }
        return set;
      }
      function clone(object) {
        var newObject = create(null);
        var property;
        for (property in object) {
          if (apply(hasOwnProperty, object, [property]) === true) {
            newObject[property] = object[property];
          }
        }
        return newObject;
      }
      function lookupGetter(object, prop) {
        while (object !== null) {
          var desc = getOwnPropertyDescriptor(object, prop);
          if (desc) {
            if (desc.get) {
              return unapply(desc.get);
            }
            if (typeof desc.value === "function") {
              return unapply(desc.value);
            }
          }
          object = getPrototypeOf(object);
        }
        function fallbackValue(element) {
          console.warn("fallback value for", element);
          return null;
        }
        return fallbackValue;
      }
      var html$1 = freeze(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]);
      var svg$1 = freeze(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]);
      var svgFilters = freeze(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]);
      var svgDisallowed = freeze(["animate", "color-profile", "cursor", "discard", "fedropshadow", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]);
      var mathMl$1 = freeze(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover"]);
      var mathMlDisallowed = freeze(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]);
      var text = freeze(["#text"]);
      var html = freeze(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "xmlns", "slot"]);
      var svg = freeze(["accent-height", "accumulate", "additive", "alignment-baseline", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]);
      var mathMl = freeze(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]);
      var xml = freeze(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]);
      var MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm);
      var ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
      var TMPLIT_EXPR = seal(/\${[\w\W]*}/gm);
      var DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]/);
      var ARIA_ATTR = seal(/^aria-[\-\w]+$/);
      var IS_ALLOWED_URI = seal(
        /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
        // eslint-disable-line no-useless-escape
      );
      var IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
      var ATTR_WHITESPACE = seal(
        /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
        // eslint-disable-line no-control-regex
      );
      var DOCTYPE_NAME = seal(/^html$/i);
      var getGlobal = function getGlobal2() {
        return typeof window === "undefined" ? null : window;
      };
      var _createTrustedTypesPolicy = function _createTrustedTypesPolicy2(trustedTypes, document2) {
        if (_typeof(trustedTypes) !== "object" || typeof trustedTypes.createPolicy !== "function") {
          return null;
        }
        var suffix = null;
        var ATTR_NAME = "data-tt-policy-suffix";
        if (document2.currentScript && document2.currentScript.hasAttribute(ATTR_NAME)) {
          suffix = document2.currentScript.getAttribute(ATTR_NAME);
        }
        var policyName = "dompurify" + (suffix ? "#" + suffix : "");
        try {
          return trustedTypes.createPolicy(policyName, {
            createHTML: function createHTML(html2) {
              return html2;
            },
            createScriptURL: function createScriptURL(scriptUrl) {
              return scriptUrl;
            }
          });
        } catch (_) {
          console.warn("TrustedTypes policy " + policyName + " could not be created.");
          return null;
        }
      };
      function createDOMPurify() {
        var window2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
        var DOMPurify2 = function DOMPurify3(root) {
          return createDOMPurify(root);
        };
        DOMPurify2.version = "2.4.3";
        DOMPurify2.removed = [];
        if (!window2 || !window2.document || window2.document.nodeType !== 9) {
          DOMPurify2.isSupported = false;
          return DOMPurify2;
        }
        var originalDocument = window2.document;
        var document2 = window2.document;
        var DocumentFragment = window2.DocumentFragment, HTMLTemplateElement = window2.HTMLTemplateElement, Node = window2.Node, Element = window2.Element, NodeFilter = window2.NodeFilter, _window$NamedNodeMap = window2.NamedNodeMap, NamedNodeMap = _window$NamedNodeMap === void 0 ? window2.NamedNodeMap || window2.MozNamedAttrMap : _window$NamedNodeMap, HTMLFormElement = window2.HTMLFormElement, DOMParser = window2.DOMParser, trustedTypes = window2.trustedTypes;
        var ElementPrototype = Element.prototype;
        var cloneNode = lookupGetter(ElementPrototype, "cloneNode");
        var getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
        var getChildNodes = lookupGetter(ElementPrototype, "childNodes");
        var getParentNode = lookupGetter(ElementPrototype, "parentNode");
        if (typeof HTMLTemplateElement === "function") {
          var template = document2.createElement("template");
          if (template.content && template.content.ownerDocument) {
            document2 = template.content.ownerDocument;
          }
        }
        var trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, originalDocument);
        var emptyHTML = trustedTypesPolicy ? trustedTypesPolicy.createHTML("") : "";
        var _document = document2, implementation = _document.implementation, createNodeIterator = _document.createNodeIterator, createDocumentFragment = _document.createDocumentFragment, getElementsByTagName = _document.getElementsByTagName;
        var importNode = originalDocument.importNode;
        var documentMode = {};
        try {
          documentMode = clone(document2).documentMode ? document2.documentMode : {};
        } catch (_) {
        }
        var hooks = {};
        DOMPurify2.isSupported = typeof getParentNode === "function" && implementation && typeof implementation.createHTMLDocument !== "undefined" && documentMode !== 9;
        var MUSTACHE_EXPR$1 = MUSTACHE_EXPR, ERB_EXPR$1 = ERB_EXPR, TMPLIT_EXPR$1 = TMPLIT_EXPR, DATA_ATTR$1 = DATA_ATTR, ARIA_ATTR$1 = ARIA_ATTR, IS_SCRIPT_OR_DATA$1 = IS_SCRIPT_OR_DATA, ATTR_WHITESPACE$1 = ATTR_WHITESPACE;
        var IS_ALLOWED_URI$1 = IS_ALLOWED_URI;
        var ALLOWED_TAGS = null;
        var DEFAULT_ALLOWED_TAGS = addToSet({}, [].concat(_toConsumableArray(html$1), _toConsumableArray(svg$1), _toConsumableArray(svgFilters), _toConsumableArray(mathMl$1), _toConsumableArray(text)));
        var ALLOWED_ATTR = null;
        var DEFAULT_ALLOWED_ATTR = addToSet({}, [].concat(_toConsumableArray(html), _toConsumableArray(svg), _toConsumableArray(mathMl), _toConsumableArray(xml)));
        var CUSTOM_ELEMENT_HANDLING = Object.seal(Object.create(null, {
          tagNameCheck: {
            writable: true,
            configurable: false,
            enumerable: true,
            value: null
          },
          attributeNameCheck: {
            writable: true,
            configurable: false,
            enumerable: true,
            value: null
          },
          allowCustomizedBuiltInElements: {
            writable: true,
            configurable: false,
            enumerable: true,
            value: false
          }
        }));
        var FORBID_TAGS = null;
        var FORBID_ATTR = null;
        var ALLOW_ARIA_ATTR = true;
        var ALLOW_DATA_ATTR = true;
        var ALLOW_UNKNOWN_PROTOCOLS = false;
        var SAFE_FOR_TEMPLATES = false;
        var WHOLE_DOCUMENT = false;
        var SET_CONFIG = false;
        var FORCE_BODY = false;
        var RETURN_DOM = false;
        var RETURN_DOM_FRAGMENT = false;
        var RETURN_TRUSTED_TYPE = false;
        var SANITIZE_DOM = true;
        var SANITIZE_NAMED_PROPS = false;
        var SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
        var KEEP_CONTENT = true;
        var IN_PLACE = false;
        var USE_PROFILES = {};
        var FORBID_CONTENTS = null;
        var DEFAULT_FORBID_CONTENTS = addToSet({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
        var DATA_URI_TAGS = null;
        var DEFAULT_DATA_URI_TAGS = addToSet({}, ["audio", "video", "img", "source", "image", "track"]);
        var URI_SAFE_ATTRIBUTES = null;
        var DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]);
        var MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
        var SVG_NAMESPACE = "http://www.w3.org/2000/svg";
        var HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
        var NAMESPACE = HTML_NAMESPACE;
        var IS_EMPTY_INPUT = false;
        var ALLOWED_NAMESPACES = null;
        var DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
        var PARSER_MEDIA_TYPE;
        var SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
        var DEFAULT_PARSER_MEDIA_TYPE = "text/html";
        var transformCaseFunc;
        var CONFIG = null;
        var formElement = document2.createElement("form");
        var isRegexOrFunction = function isRegexOrFunction2(testValue) {
          return testValue instanceof RegExp || testValue instanceof Function;
        };
        var _parseConfig = function _parseConfig2(cfg) {
          if (CONFIG && CONFIG === cfg) {
            return;
          }
          if (!cfg || _typeof(cfg) !== "object") {
            cfg = {};
          }
          cfg = clone(cfg);
          PARSER_MEDIA_TYPE = // eslint-disable-next-line unicorn/prefer-includes
          SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? PARSER_MEDIA_TYPE = DEFAULT_PARSER_MEDIA_TYPE : PARSER_MEDIA_TYPE = cfg.PARSER_MEDIA_TYPE;
          transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
          ALLOWED_TAGS = "ALLOWED_TAGS" in cfg ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
          ALLOWED_ATTR = "ALLOWED_ATTR" in cfg ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
          ALLOWED_NAMESPACES = "ALLOWED_NAMESPACES" in cfg ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString) : DEFAULT_ALLOWED_NAMESPACES;
          URI_SAFE_ATTRIBUTES = "ADD_URI_SAFE_ATTR" in cfg ? addToSet(
            clone(DEFAULT_URI_SAFE_ATTRIBUTES),
            // eslint-disable-line indent
            cfg.ADD_URI_SAFE_ATTR,
            // eslint-disable-line indent
            transformCaseFunc
            // eslint-disable-line indent
          ) : DEFAULT_URI_SAFE_ATTRIBUTES;
          DATA_URI_TAGS = "ADD_DATA_URI_TAGS" in cfg ? addToSet(
            clone(DEFAULT_DATA_URI_TAGS),
            // eslint-disable-line indent
            cfg.ADD_DATA_URI_TAGS,
            // eslint-disable-line indent
            transformCaseFunc
            // eslint-disable-line indent
          ) : DEFAULT_DATA_URI_TAGS;
          FORBID_CONTENTS = "FORBID_CONTENTS" in cfg ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
          FORBID_TAGS = "FORBID_TAGS" in cfg ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : {};
          FORBID_ATTR = "FORBID_ATTR" in cfg ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : {};
          USE_PROFILES = "USE_PROFILES" in cfg ? cfg.USE_PROFILES : false;
          ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
          ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
          ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
          SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
          WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
          RETURN_DOM = cfg.RETURN_DOM || false;
          RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
          RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
          FORCE_BODY = cfg.FORCE_BODY || false;
          SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
          SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
          KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
          IN_PLACE = cfg.IN_PLACE || false;
          IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI$1;
          NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;
          if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck)) {
            CUSTOM_ELEMENT_HANDLING.tagNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck;
          }
          if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)) {
            CUSTOM_ELEMENT_HANDLING.attributeNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck;
          }
          if (cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements === "boolean") {
            CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements;
          }
          if (SAFE_FOR_TEMPLATES) {
            ALLOW_DATA_ATTR = false;
          }
          if (RETURN_DOM_FRAGMENT) {
            RETURN_DOM = true;
          }
          if (USE_PROFILES) {
            ALLOWED_TAGS = addToSet({}, _toConsumableArray(text));
            ALLOWED_ATTR = [];
            if (USE_PROFILES.html === true) {
              addToSet(ALLOWED_TAGS, html$1);
              addToSet(ALLOWED_ATTR, html);
            }
            if (USE_PROFILES.svg === true) {
              addToSet(ALLOWED_TAGS, svg$1);
              addToSet(ALLOWED_ATTR, svg);
              addToSet(ALLOWED_ATTR, xml);
            }
            if (USE_PROFILES.svgFilters === true) {
              addToSet(ALLOWED_TAGS, svgFilters);
              addToSet(ALLOWED_ATTR, svg);
              addToSet(ALLOWED_ATTR, xml);
            }
            if (USE_PROFILES.mathMl === true) {
              addToSet(ALLOWED_TAGS, mathMl$1);
              addToSet(ALLOWED_ATTR, mathMl);
              addToSet(ALLOWED_ATTR, xml);
            }
          }
          if (cfg.ADD_TAGS) {
            if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
              ALLOWED_TAGS = clone(ALLOWED_TAGS);
            }
            addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
          }
          if (cfg.ADD_ATTR) {
            if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
              ALLOWED_ATTR = clone(ALLOWED_ATTR);
            }
            addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
          }
          if (cfg.ADD_URI_SAFE_ATTR) {
            addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
          }
          if (cfg.FORBID_CONTENTS) {
            if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
              FORBID_CONTENTS = clone(FORBID_CONTENTS);
            }
            addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
          }
          if (KEEP_CONTENT) {
            ALLOWED_TAGS["#text"] = true;
          }
          if (WHOLE_DOCUMENT) {
            addToSet(ALLOWED_TAGS, ["html", "head", "body"]);
          }
          if (ALLOWED_TAGS.table) {
            addToSet(ALLOWED_TAGS, ["tbody"]);
            delete FORBID_TAGS.tbody;
          }
          if (freeze) {
            freeze(cfg);
          }
          CONFIG = cfg;
        };
        var MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ["mi", "mo", "mn", "ms", "mtext"]);
        var HTML_INTEGRATION_POINTS = addToSet({}, ["foreignobject", "desc", "title", "annotation-xml"]);
        var COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ["title", "style", "font", "a", "script"]);
        var ALL_SVG_TAGS = addToSet({}, svg$1);
        addToSet(ALL_SVG_TAGS, svgFilters);
        addToSet(ALL_SVG_TAGS, svgDisallowed);
        var ALL_MATHML_TAGS = addToSet({}, mathMl$1);
        addToSet(ALL_MATHML_TAGS, mathMlDisallowed);
        var _checkValidNamespace = function _checkValidNamespace2(element) {
          var parent = getParentNode(element);
          if (!parent || !parent.tagName) {
            parent = {
              namespaceURI: NAMESPACE,
              tagName: "template"
            };
          }
          var tagName = stringToLowerCase(element.tagName);
          var parentTagName = stringToLowerCase(parent.tagName);
          if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
            return false;
          }
          if (element.namespaceURI === SVG_NAMESPACE) {
            if (parent.namespaceURI === HTML_NAMESPACE) {
              return tagName === "svg";
            }
            if (parent.namespaceURI === MATHML_NAMESPACE) {
              return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
            }
            return Boolean(ALL_SVG_TAGS[tagName]);
          }
          if (element.namespaceURI === MATHML_NAMESPACE) {
            if (parent.namespaceURI === HTML_NAMESPACE) {
              return tagName === "math";
            }
            if (parent.namespaceURI === SVG_NAMESPACE) {
              return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
            }
            return Boolean(ALL_MATHML_TAGS[tagName]);
          }
          if (element.namespaceURI === HTML_NAMESPACE) {
            if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
              return false;
            }
            if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
              return false;
            }
            return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
          }
          if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) {
            return true;
          }
          return false;
        };
        var _forceRemove = function _forceRemove2(node) {
          arrayPush(DOMPurify2.removed, {
            element: node
          });
          try {
            node.parentNode.removeChild(node);
          } catch (_) {
            try {
              node.outerHTML = emptyHTML;
            } catch (_2) {
              node.remove();
            }
          }
        };
        var _removeAttribute = function _removeAttribute2(name, node) {
          try {
            arrayPush(DOMPurify2.removed, {
              attribute: node.getAttributeNode(name),
              from: node
            });
          } catch (_) {
            arrayPush(DOMPurify2.removed, {
              attribute: null,
              from: node
            });
          }
          node.removeAttribute(name);
          if (name === "is" && !ALLOWED_ATTR[name]) {
            if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
              try {
                _forceRemove(node);
              } catch (_) {
              }
            } else {
              try {
                node.setAttribute(name, "");
              } catch (_) {
              }
            }
          }
        };
        var _initDocument = function _initDocument2(dirty) {
          var doc;
          var leadingWhitespace;
          if (FORCE_BODY) {
            dirty = "<remove></remove>" + dirty;
          } else {
            var matches = stringMatch(dirty, /^[\r\n\t ]+/);
            leadingWhitespace = matches && matches[0];
          }
          if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) {
            dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + "</body></html>";
          }
          var dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
          if (NAMESPACE === HTML_NAMESPACE) {
            try {
              doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
            } catch (_) {
            }
          }
          if (!doc || !doc.documentElement) {
            doc = implementation.createDocument(NAMESPACE, "template", null);
            try {
              doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
            } catch (_) {
            }
          }
          var body = doc.body || doc.documentElement;
          if (dirty && leadingWhitespace) {
            body.insertBefore(document2.createTextNode(leadingWhitespace), body.childNodes[0] || null);
          }
          if (NAMESPACE === HTML_NAMESPACE) {
            return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
          }
          return WHOLE_DOCUMENT ? doc.documentElement : body;
        };
        var _createIterator = function _createIterator2(root) {
          return createNodeIterator.call(
            root.ownerDocument || root,
            root,
            // eslint-disable-next-line no-bitwise
            NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT,
            null,
            false
          );
        };
        var _isClobbered = function _isClobbered2(elm) {
          return elm instanceof HTMLFormElement && (typeof elm.nodeName !== "string" || typeof elm.textContent !== "string" || typeof elm.removeChild !== "function" || !(elm.attributes instanceof NamedNodeMap) || typeof elm.removeAttribute !== "function" || typeof elm.setAttribute !== "function" || typeof elm.namespaceURI !== "string" || typeof elm.insertBefore !== "function" || typeof elm.hasChildNodes !== "function");
        };
        var _isNode = function _isNode2(object) {
          return _typeof(Node) === "object" ? object instanceof Node : object && _typeof(object) === "object" && typeof object.nodeType === "number" && typeof object.nodeName === "string";
        };
        var _executeHook = function _executeHook2(entryPoint, currentNode, data) {
          if (!hooks[entryPoint]) {
            return;
          }
          arrayForEach(hooks[entryPoint], function(hook) {
            hook.call(DOMPurify2, currentNode, data, CONFIG);
          });
        };
        var _sanitizeElements = function _sanitizeElements2(currentNode) {
          var content;
          _executeHook("beforeSanitizeElements", currentNode, null);
          if (_isClobbered(currentNode)) {
            _forceRemove(currentNode);
            return true;
          }
          if (regExpTest(/[\u0080-\uFFFF]/, currentNode.nodeName)) {
            _forceRemove(currentNode);
            return true;
          }
          var tagName = transformCaseFunc(currentNode.nodeName);
          _executeHook("uponSanitizeElement", currentNode, {
            tagName,
            allowedTags: ALLOWED_TAGS
          });
          if (currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && (!_isNode(currentNode.content) || !_isNode(currentNode.content.firstElementChild)) && regExpTest(/<[/\w]/g, currentNode.innerHTML) && regExpTest(/<[/\w]/g, currentNode.textContent)) {
            _forceRemove(currentNode);
            return true;
          }
          if (tagName === "select" && regExpTest(/<template/i, currentNode.innerHTML)) {
            _forceRemove(currentNode);
            return true;
          }
          if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
            if (!FORBID_TAGS[tagName] && _basicCustomElementTest(tagName)) {
              if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName))
                return false;
              if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName))
                return false;
            }
            if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
              var parentNode = getParentNode(currentNode) || currentNode.parentNode;
              var childNodes = getChildNodes(currentNode) || currentNode.childNodes;
              if (childNodes && parentNode) {
                var childCount = childNodes.length;
                for (var i = childCount - 1; i >= 0; --i) {
                  parentNode.insertBefore(cloneNode(childNodes[i], true), getNextSibling(currentNode));
                }
              }
            }
            _forceRemove(currentNode);
            return true;
          }
          if (currentNode instanceof Element && !_checkValidNamespace(currentNode)) {
            _forceRemove(currentNode);
            return true;
          }
          if ((tagName === "noscript" || tagName === "noembed") && regExpTest(/<\/no(script|embed)/i, currentNode.innerHTML)) {
            _forceRemove(currentNode);
            return true;
          }
          if (SAFE_FOR_TEMPLATES && currentNode.nodeType === 3) {
            content = currentNode.textContent;
            content = stringReplace(content, MUSTACHE_EXPR$1, " ");
            content = stringReplace(content, ERB_EXPR$1, " ");
            content = stringReplace(content, TMPLIT_EXPR$1, " ");
            if (currentNode.textContent !== content) {
              arrayPush(DOMPurify2.removed, {
                element: currentNode.cloneNode()
              });
              currentNode.textContent = content;
            }
          }
          _executeHook("afterSanitizeElements", currentNode, null);
          return false;
        };
        var _isValidAttribute = function _isValidAttribute2(lcTag, lcName, value) {
          if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document2 || value in formElement)) {
            return false;
          }
          if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR$1, lcName))
            ;
          else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$1, lcName))
            ;
          else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
            if (// First condition does a very basic check if a) it's basically a valid custom element tagname AND
            // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
            _basicCustomElementTest(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName)) || // Alternative, second condition checks if it's an `is`-attribute, AND
            // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value)))
              ;
            else {
              return false;
            }
          } else if (URI_SAFE_ATTRIBUTES[lcName])
            ;
          else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE$1, "")))
            ;
          else if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag])
            ;
          else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$1, stringReplace(value, ATTR_WHITESPACE$1, "")))
            ;
          else if (!value)
            ;
          else {
            return false;
          }
          return true;
        };
        var _basicCustomElementTest = function _basicCustomElementTest2(tagName) {
          return tagName.indexOf("-") > 0;
        };
        var _sanitizeAttributes = function _sanitizeAttributes2(currentNode) {
          var attr;
          var value;
          var lcName;
          var l;
          _executeHook("beforeSanitizeAttributes", currentNode, null);
          var attributes = currentNode.attributes;
          if (!attributes) {
            return;
          }
          var hookEvent = {
            attrName: "",
            attrValue: "",
            keepAttr: true,
            allowedAttributes: ALLOWED_ATTR
          };
          l = attributes.length;
          while (l--) {
            attr = attributes[l];
            var _attr = attr, name = _attr.name, namespaceURI = _attr.namespaceURI;
            value = name === "value" ? attr.value : stringTrim(attr.value);
            lcName = transformCaseFunc(name);
            hookEvent.attrName = lcName;
            hookEvent.attrValue = value;
            hookEvent.keepAttr = true;
            hookEvent.forceKeepAttr = void 0;
            _executeHook("uponSanitizeAttribute", currentNode, hookEvent);
            value = hookEvent.attrValue;
            if (hookEvent.forceKeepAttr) {
              continue;
            }
            _removeAttribute(name, currentNode);
            if (!hookEvent.keepAttr) {
              continue;
            }
            if (regExpTest(/\/>/i, value)) {
              _removeAttribute(name, currentNode);
              continue;
            }
            if (SAFE_FOR_TEMPLATES) {
              value = stringReplace(value, MUSTACHE_EXPR$1, " ");
              value = stringReplace(value, ERB_EXPR$1, " ");
              value = stringReplace(value, TMPLIT_EXPR$1, " ");
            }
            var lcTag = transformCaseFunc(currentNode.nodeName);
            if (!_isValidAttribute(lcTag, lcName, value)) {
              continue;
            }
            if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name")) {
              _removeAttribute(name, currentNode);
              value = SANITIZE_NAMED_PROPS_PREFIX + value;
            }
            if (trustedTypesPolicy && _typeof(trustedTypes) === "object" && typeof trustedTypes.getAttributeType === "function") {
              if (namespaceURI)
                ;
              else {
                switch (trustedTypes.getAttributeType(lcTag, lcName)) {
                  case "TrustedHTML":
                    value = trustedTypesPolicy.createHTML(value);
                    break;
                  case "TrustedScriptURL":
                    value = trustedTypesPolicy.createScriptURL(value);
                    break;
                }
              }
            }
            try {
              if (namespaceURI) {
                currentNode.setAttributeNS(namespaceURI, name, value);
              } else {
                currentNode.setAttribute(name, value);
              }
              arrayPop(DOMPurify2.removed);
            } catch (_) {
            }
          }
          _executeHook("afterSanitizeAttributes", currentNode, null);
        };
        var _sanitizeShadowDOM = function _sanitizeShadowDOM2(fragment) {
          var shadowNode;
          var shadowIterator = _createIterator(fragment);
          _executeHook("beforeSanitizeShadowDOM", fragment, null);
          while (shadowNode = shadowIterator.nextNode()) {
            _executeHook("uponSanitizeShadowNode", shadowNode, null);
            if (_sanitizeElements(shadowNode)) {
              continue;
            }
            if (shadowNode.content instanceof DocumentFragment) {
              _sanitizeShadowDOM2(shadowNode.content);
            }
            _sanitizeAttributes(shadowNode);
          }
          _executeHook("afterSanitizeShadowDOM", fragment, null);
        };
        DOMPurify2.sanitize = function(dirty) {
          var cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          var body;
          var importedNode;
          var currentNode;
          var oldNode;
          var returnNode;
          IS_EMPTY_INPUT = !dirty;
          if (IS_EMPTY_INPUT) {
            dirty = "<!-->";
          }
          if (typeof dirty !== "string" && !_isNode(dirty)) {
            if (typeof dirty.toString !== "function") {
              throw typeErrorCreate("toString is not a function");
            } else {
              dirty = dirty.toString();
              if (typeof dirty !== "string") {
                throw typeErrorCreate("dirty is not a string, aborting");
              }
            }
          }
          if (!DOMPurify2.isSupported) {
            if (_typeof(window2.toStaticHTML) === "object" || typeof window2.toStaticHTML === "function") {
              if (typeof dirty === "string") {
                return window2.toStaticHTML(dirty);
              }
              if (_isNode(dirty)) {
                return window2.toStaticHTML(dirty.outerHTML);
              }
            }
            return dirty;
          }
          if (!SET_CONFIG) {
            _parseConfig(cfg);
          }
          DOMPurify2.removed = [];
          if (typeof dirty === "string") {
            IN_PLACE = false;
          }
          if (IN_PLACE) {
            if (dirty.nodeName) {
              var tagName = transformCaseFunc(dirty.nodeName);
              if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
                throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
              }
            }
          } else if (dirty instanceof Node) {
            body = _initDocument("<!---->");
            importedNode = body.ownerDocument.importNode(dirty, true);
            if (importedNode.nodeType === 1 && importedNode.nodeName === "BODY") {
              body = importedNode;
            } else if (importedNode.nodeName === "HTML") {
              body = importedNode;
            } else {
              body.appendChild(importedNode);
            }
          } else {
            if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && // eslint-disable-next-line unicorn/prefer-includes
            dirty.indexOf("<") === -1) {
              return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
            }
            body = _initDocument(dirty);
            if (!body) {
              return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
            }
          }
          if (body && FORCE_BODY) {
            _forceRemove(body.firstChild);
          }
          var nodeIterator = _createIterator(IN_PLACE ? dirty : body);
          while (currentNode = nodeIterator.nextNode()) {
            if (currentNode.nodeType === 3 && currentNode === oldNode) {
              continue;
            }
            if (_sanitizeElements(currentNode)) {
              continue;
            }
            if (currentNode.content instanceof DocumentFragment) {
              _sanitizeShadowDOM(currentNode.content);
            }
            _sanitizeAttributes(currentNode);
            oldNode = currentNode;
          }
          oldNode = null;
          if (IN_PLACE) {
            return dirty;
          }
          if (RETURN_DOM) {
            if (RETURN_DOM_FRAGMENT) {
              returnNode = createDocumentFragment.call(body.ownerDocument);
              while (body.firstChild) {
                returnNode.appendChild(body.firstChild);
              }
            } else {
              returnNode = body;
            }
            if (ALLOWED_ATTR.shadowroot) {
              returnNode = importNode.call(originalDocument, returnNode, true);
            }
            return returnNode;
          }
          var serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
          if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
            serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
          }
          if (SAFE_FOR_TEMPLATES) {
            serializedHTML = stringReplace(serializedHTML, MUSTACHE_EXPR$1, " ");
            serializedHTML = stringReplace(serializedHTML, ERB_EXPR$1, " ");
            serializedHTML = stringReplace(serializedHTML, TMPLIT_EXPR$1, " ");
          }
          return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
        };
        DOMPurify2.setConfig = function(cfg) {
          _parseConfig(cfg);
          SET_CONFIG = true;
        };
        DOMPurify2.clearConfig = function() {
          CONFIG = null;
          SET_CONFIG = false;
        };
        DOMPurify2.isValidAttribute = function(tag, attr, value) {
          if (!CONFIG) {
            _parseConfig({});
          }
          var lcTag = transformCaseFunc(tag);
          var lcName = transformCaseFunc(attr);
          return _isValidAttribute(lcTag, lcName, value);
        };
        DOMPurify2.addHook = function(entryPoint, hookFunction) {
          if (typeof hookFunction !== "function") {
            return;
          }
          hooks[entryPoint] = hooks[entryPoint] || [];
          arrayPush(hooks[entryPoint], hookFunction);
        };
        DOMPurify2.removeHook = function(entryPoint) {
          if (hooks[entryPoint]) {
            return arrayPop(hooks[entryPoint]);
          }
        };
        DOMPurify2.removeHooks = function(entryPoint) {
          if (hooks[entryPoint]) {
            hooks[entryPoint] = [];
          }
        };
        DOMPurify2.removeAllHooks = function() {
          hooks = {};
        };
        return DOMPurify2;
      }
      var purify = createDOMPurify();
      return purify;
    });
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
function noop() {
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
#comments-container * {
    box-sizing: border-box;
    text-shadow: none;
}

#comments-container a[href]:not(.tag) {
    color: #2793e6;
    text-decoration: none;
}

#comments-container a[href]:not(.tag):hover {
    text-decoration: underline;
}

#comments-container .textarea,
#comments-container input,
#comments-container button {
    appearance: none;

    vertical-align: top;
    border-radius: 0;
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    background: rgba(0, 0, 0, 0);
}

#comments-container button {
    vertical-align: inherit;
}

#comments-container .tag {
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

#comments-container .attachments .tag {
    white-space: normal;
    word-break: break-all;

    padding: 0.05em 0.5em;
    line-height: 1.3em;

    margin-top: 0.3em;
    margin-right: 0.5em;
}

#comments-container .attachments .tag > i:first-child {
    margin-right: 0.4em;
}

#comments-container .attachments .tag .delete {
    display: inline;
    font-size: 14px;
    color: #888;

    position: relative;
    padding: 2px;
    padding-right: 4px;
    right: -4px;
}

#comments-container .attachments .tag:hover .delete {
    color: black;
}

#comments-container .tag:hover {
    text-decoration: none;
}

#comments-container .tag:not(.deletable):hover {
    background-color: #d8edf8;
    border-color: #2793e6;
}

#comments-container textarea.textarea:focus::placeholder {
    color: transparent;
    resize: vertical;
}

#comments-container textarea.textarea:not(:focus)::placeholder {
    color: #CCC;
    resize: vertical;
}

#comments-container i.fa {
    width: 1em;
    height: 1em;
    background-size: cover;
    text-align: center;
}

#comments-container i.fa.image:before {
    content: "";
}

#comments-container .spinner {
    font-size: 2em;
    text-align: center;
    padding: 0.5em;
    margin: 0;
    color: #666;
}

#comments-container .spinner.inline {
    font-size: inherit;
    padding: 0;
    color: #fff;
}

#comments-container .spinner.inline:not(.hidden) ~ * {
    margin-left: 0.4em;
}

#comments-container ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

#comments-container .profile-picture {
    float: left;
    width: 3.6rem;
    height: 3.6rem;
    max-width: 50px;
    max-height: 50px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
}

#comments-container i.profile-picture {
    font-size: 3.4em;
    text-align: center;
}

#comments-container .profile-picture.round {
    border-radius: 50%;
}

#comments-container .commenting-field.main .textarea-wrapper {
    margin-bottom: 0.75em;
}

#comments-container .commenting-field.main .profile-picture {
    margin-bottom: 1rem;
}

#comments-container .textarea-wrapper {
    overflow: hidden;
    padding-left: 15px;
    position: relative;
}

#comments-container .textarea-wrapper:before {
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

#comments-container .textarea-wrapper:after {
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

#comments-container .textarea-wrapper .inline-button {
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

#comments-container .textarea-wrapper .inline-button:hover {
    opacity: 1;
}

#comments-container:not(.mobile) .textarea-wrapper.textarea-scrollable .inline-button {
    /* Because of scrollbar */
    margin-right: 15px;
}

#comments-container .textarea-wrapper .inline-button i {
    font-size: 1.2em;
}

#comments-container .textarea-wrapper .upload input {
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

#comments-container .textarea-wrapper .close {
    width: 1em;
    height: 1em;
}

#comments-container .textarea-wrapper .textarea {
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

#comments-container:not(.mobile) .textarea-wrapper.textarea-scrollable .textarea {
    /* Because of scrollbar */
    padding-right: calc(2em + 15px);
}

#comments-container .textarea-wrapper .control-row > .attachments {
    padding-top: .3em;
}

#comments-container .textarea-wrapper .control-row > button {
    float: right;
    line-height: 1.6em;
    margin-top: .4em;
    border: 1px solid rgba(0, 0, 0, 0);
    color: #FFF;
    padding: 0 1em;
    font-size: 1em;
    opacity: .5;
}

#comments-container button .hidden {
    display: none !important;
}

#comments-container .textarea-wrapper .control-row > button:not(:first-child) {
    margin-right: .5em;
}

#comments-container .textarea-wrapper .control-row > button.enabled {
    opacity: 1;
    cursor: pointer;
}

#comments-container .textarea-wrapper .control-row > button:not(.enabled) {
    pointer-events: none;
}

#comments-container .textarea-wrapper .control-row > button.enabled:hover {
    opacity: .9;
}

#comments-container .textarea-wrapper .control-row > button.upload {
    position: relative;
    overflow: hidden;
    background-color: #999;
}

#comments-container ul.navigation {
    clear: both;

    color: #999;
    border-bottom: 2px solid #CCC;
    line-height: 2em;
    font-size: 1em;
    margin-bottom: 0.5em;
}

#comments-container ul.navigation .navigation-wrapper {
    position: relative;
}

#comments-container ul.navigation li {
    display: inline-block;
    position: relative;
    padding: 0 1em;
    cursor: pointer;
    text-align: center;

    user-select: none;
}

#comments-container ul.navigation li.active,
#comments-container ul.navigation li:hover {
    color: #000;
}

#comments-container ul.navigation li.active:after {
    content: " ";
    display: block;
    right: 0;
    height: 2px;
    background: #000;
    position: absolute;
    bottom: -2px;
    left: 0;
}

#comments-container ul.navigation li[data-sort-key="attachments"] {
    float: right;
}

#comments-container ul.navigation li[data-sort-key="attachments"] i {
    margin-right: 0.25em;
}

#comments-container ul.navigation .navigation-wrapper.responsive {
    display: none;
}

@media screen and (max-width: 600px) {
    #comments-container ul.navigation .navigation-wrapper {
        display: none;
    }
    #comments-container ul.navigation .navigation-wrapper.responsive {
        display: inline;
    }
}

#comments-container.responsive ul.navigation .navigation-wrapper {
    display: none;
}
#comments-container.responsive ul.navigation .navigation-wrapper.responsive {
    display: inline;
}

#comments-container ul.navigation .navigation-wrapper.responsive li.title {
    padding: 0 1.5em;
}

#comments-container ul.navigation .navigation-wrapper.responsive li.title header:after {
    display: inline-block;
    content: "";
    border-left: 0.3em solid rgba(0, 0, 0, 0) !important;
    border-right: 0.3em solid rgba(0, 0, 0, 0) !important;
    border-top: 0.4em solid #CCC;
    margin-left: 0.5em;
    position: relative;
    top: -0.1em;
}

#comments-container ul.navigation .navigation-wrapper.responsive li.title.active header:after,
#comments-container ul.navigation .navigation-wrapper.responsive li.title:hover header:after {
    border-top-color: #000;
}

#comments-container ul.dropdown {
    display: none;
    position: absolute;
    background: #FFF;
    z-index: 99;
    line-height: 1.2em;

    border: 1px solid #CCC;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
}

#comments-container ul.dropdown.autocomplete {
    margin-top: 0.25em;
}

#comments-container ul.dropdown li {
    display: block;
    white-space: nowrap;
    clear: both;
    padding: 0.6em;
    font-weight: normal;
    cursor: pointer;
}

#comments-container ul.dropdown li.active {
    background: #EEE;
}

#comments-container ul.dropdown li .result {
    display: block;
    margin: 0;
    text-decoration: none;
    color: inherit;
}

#comments-container ul.dropdown li .profile-picture {
    float: left;
    width: 2.4em;
    height: 2.4em;
    margin-right: 0.5em;
}

#comments-container ul.dropdown li .hashtag {
    float: left;
    font-size: 2.4em;
    margin-left: 0.1em;
    margin-right: 0.25em;
}

#comments-container ul.dropdown li .info {
    display: inline-block;
}

#comments-container ul.dropdown li .info > span {
    display: block;
}

#comments-container ul.dropdown li .info.no-details {
    line-height: 2.4em;
}

#comments-container ul.dropdown li .name {
    font-weight: bold;
}

#comments-container ul.dropdown li .details {
    color: #999;
    font-size: 0.95em;
    margin-top: 0.1em;
}

#comments-container ul.dropdown .textcomplete-header {
    display: none;
}

#comments-container ul.dropdown .textcomplete-footer {
    display: none;
}

#comments-container ul.navigation .navigation-wrapper.responsive ul.dropdown {
    left: 0;
    width: 100%;
}

#comments-container ul.navigation .navigation-wrapper.responsive ul.dropdown li {
    color: #000;
}

#comments-container ul.navigation .navigation-wrapper.responsive ul.dropdown li.active {
    color: #FFF;
}

#comments-container ul.navigation .navigation-wrapper.responsive ul.dropdown li:hover:not(.active) {
    background: #F5F5F5;
}

#comments-container ul.navigation .navigation-wrapper.responsive ul.dropdown li:after {
    display: none;
}

#comments-container .no-data {
    display: none;
    margin: 1em;
    text-align: center;
    font-size: 1.5em;
    color: #CCC;
}

#comments-container ul.main:empty ~ .no-comments {
    display: inherit;
}

#comments-container ul#attachment-list:empty ~ .no-attachments {
    display: inherit;
}

#comments-container ul.main li.comment {
    clear: both;
}

#comments-container ul.main li.comment .comment-wrapper,
#comments-container ul.main button.toggle-all,
#comments-container ul.main li.comment .commenting-field > .commenting-field-container {
    padding: .5em;
}

#comments-container ul.main li.comment .comment-wrapper {
    border-top: 1px solid #DDD;
    overflow: hidden;
}

#comments-container ul.main > li.comment:first-child > ax-comment-container > .comment-wrapper {
    border-top: none;
}

#comments-container ul.main li.comment .comment-wrapper > .profile-picture {
    margin-right: 1rem;
}

#comments-container ul.main li.comment time {
    float: right;
    line-height: 1.4em;
    margin-left: .5em;
    font-size: 0.8em;
    color: #666;
}

#comments-container ul.main li.comment .comment-header {
    line-height: 1.4em;
    word-break: break-word;
}

#comments-container ul.main li.comment .comment-header > * {
    margin-right: .5rem;
}

#comments-container ul.main li.comment .comment-header .name {
    font-weight: bold;
}

#comments-container ul.main li.comment .comment-header .reply-to {
    color: #999;
    font-size: .8em;
    font-weight: normal;
    vertical-align: top;
}

#comments-container ul.main li.comment .comment-header .reply-to i {
    margin-right: .25rem;
}

#comments-container ul.main li.comment .comment-header .new {
    background: #2793e6;
    font-size: 0.8em;
    padding: 0.2em 0.6em;
    color: #fff;
    font-weight: normal;
    border-radius: 1em;
    vertical-align: bottom;
    word-break: normal;
}

#comments-container ul.main li.comment .wrapper {
    line-height: 1.4em;
    overflow: hidden;
}

#comments-container.mobile ul.main li.comment .child-comments li.comment .wrapper {
    overflow: visible;
}
`;
var contentStyle = `
#comments-container ul.main li.comment .wrapper .content {
    white-space: pre-line;
    word-break: break-word;
}

#comments-container ul.main li.comment .wrapper .content time.edited {
    float: inherit;
    margin: 0;
    font-size: .9em;
    font-style: italic;
    color: #999;
}

#comments-container ul.main li.comment .wrapper .content time.edited:before {
    content: " - ";
}
`;
var attachmentsStyle = `
#comments-container ul.main li.comment .wrapper .attachments .tags:not(:empty) {
    margin-bottom: 0.5em;
}

#comments-container ul.main li.comment .wrapper .attachments .previews .preview {
    display: inline-block;
    margin-top: .25em;
    margin-right: .25em;
}

#comments-container ul.main li.comment .wrapper .attachments .previews .preview > * {
    max-width: 100%;
    max-height: 200px;
    width: auto;
    height: auto;
}

#comments-container ul.main li.comment .wrapper .attachments .previews .preview > *:focus {
    outline: none;
}
`;
var actionsStyle = `
#comments-container.mobile ul.main li.comment .actions {
    font-size: 1em;
}

#comments-container ul.main li.comment .actions > * {
    color: #999;
    font-weight: bold;
}

#comments-container ul.main li.comment .actions .action {
    display: inline-block;
    cursor: pointer;
    margin-left: 1em;
    margin-right: 1em;
    line-height: 1.5em;
    font-size: 0.9em;
}

#comments-container ul.main li.comment .actions .action.disabled {
    opacity: 0.5;
    pointer-events: none;
}

#comments-container ul.main li.comment .actions .action:first-child {
    margin-left: 0;
}

#comments-container ul.main li.comment .actions .action.upvote {
    cursor: inherit;
}

#comments-container ul.main li.comment .actions .action.upvote .upvote-count {
    margin-right: .5em;
}

#comments-container ul.main li.comment .actions .action.upvote .upvote-count:empty {
    display: none;
}

#comments-container ul.main li.comment .actions .action.upvote i {
    cursor: pointer;
}

#comments-container ul.main li.comment .actions .action:not(.upvote):hover,
#comments-container ul.main li.comment .actions .action.upvote:not(.highlight-font) i:hover {
    color: #666;
}

#comments-container ul#attachment-list li.comment .actions .action:not(.delete) {
    display: none;
}

#comments-container ul#attachment-list li.comment .actions .action.delete {
    margin: 0;
}

#comments-container ul#attachment-list li.comment .actions .separator {
    display: none;
}
`;
var childCommentsStyle = `
/* Margin for second level content */
#comments-container ul.main li.comment .child-comments > *::before,
#comments-container ul.main li.comment ax-commenting-field > *::before {
    content: "";
    height: 1px;
    float: left;

    /* Profile picture width plus margin */
    width: calc(3.6em + .5em);
    /* Profile picture max width plus margin */
    max-width: calc(50px + .5em);
}

#comments-container ul.main li.comment .child-comments .profile-picture,
#comments-container ul.main li.comment .child-comments ~ ax-commenting-field .profile-picture {
    width: 2.4rem;
    height: 2.4rem;
}

#comments-container ul.main li.comment .child-comments i.profile-picture,
#comments-container ul.main li.comment .child-comments ~ ax-commenting-field i.profile-picture {
    font-size: 2.4em;
}

#comments-container ul.main li.comment .child-comments button.toggle-all {
    padding-top: 0;
}

#comments-container ul.main li.comment .child-comments button.toggle-all span:first-child {
    vertical-align: middle;
}

#comments-container ul.main li.comment .child-comments button.toggle-all span:first-child:hover {
    cursor: pointer;
    text-decoration: underline;
}

#comments-container ul.main li.comment .child-comments button.toggle-all .caret {
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

#comments-container ul.main li.comment .child-comments button.toggle-all .caret.up {
    border-top-color: rgba(0, 0, 0, 0);
    border-bottom-color: inherit;
    margin-top: -.2em;
}

#comments-container ul.main li.comment .child-comments .togglable-reply {
    display: none;
}

#comments-container ul.main li.comment .child-comments .visible {
    display: inherit;
}

#comments-container ul.main li.comment.hidden {
    display: none;
}
`;
var editingCommentStyle = `
#comments-container ul.main li.comment.edit > .comment-wrapper > *:not(.commenting-field) {
    display: none;
}

#comments-container ul.main li.comment.edit > .comment-wrapper .commenting-field {
    padding-left: 0 !important;
    padding-right: 0 !important;
}
`;
var dragAndDropAttachmentsStyle = `
#comments-container.drag-ongoing {
    overflow-y: hidden !important;
}

#comments-container .droppable-overlay {
    display: table;
    position: fixed;
    z-index: 99;

    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.3)
}

#comments-container .droppable-overlay .droppable-container {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
}

#comments-container .droppable-overlay .droppable-container .droppable {
    background: #FFF;
    color: #CCC;
    padding: 6em;
}

#comments-container .droppable-overlay .droppable-container .droppable.drag-over {
    color: #999;
}

#comments-container .droppable-overlay .droppable-container .droppable i {
    margin-bottom: 5px;
}
`;
var readOnlyStyle = `
#comments-container.read-only .commenting-field {
    display: none;
}
#comments-container.read-only .actions {
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
    hashtagClicked: noop,
    pingClicked: noop,
    refresh: noop,
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
  element.style.display = PREVIOUS_DISPLAY_VALUE.get(element) || "block";
}
function hideElement(element) {
  PREVIOUS_DISPLAY_VALUE.set(element, getElementStyle(element, "display"));
  element.style.display = "none";
}
function toggleElementVisibility(element) {
  if (getElementStyle(element, "display") !== "none") {
    hideElement(element);
  } else {
    showElement(element);
  }
}
function getElementStyle(element, prop) {
  return element.style[prop] || getComputedStyle(element)[prop];
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
  onSortKeyChanged = noop;
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
    const dropdown = e.currentTarget.nextElementSibling;
    if (dropdown.classList.contains("dropdown")) {
      toggleElementVisibility(dropdown);
    }
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
  css += `#comments-container ul.navigation li.active:after {background: ${options.highlightColor} !important;}`;
  css += `#comments-container ul.navigation ul.dropdown li.active {background: ${options.highlightColor} !important;}`;
  css += `#comments-container .highlight-background {background: ${options.highlightColor} !important;}`;
  css += `#comments-container .highlight-font {color: ${options.highlightColor} !important;}`;
  css += `#comments-container .highlight-font-bold {color: ${options.highlightColor} !important;font-weight: bold;}`;
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
  onInitialized = noop;
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
  onClosed = noop;
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
var import_dompurify = __toESM(require_purify(), 1);
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
    let html = this.escape(import_dompurify.default.sanitize(commentModel.content));
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
            <section id="comments-container">
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
    const error = noop;
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
