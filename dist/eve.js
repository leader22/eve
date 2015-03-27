"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Eve = (function () {
    function Eve() {
        _classCallCheck(this, Eve);

        this.events = {};
    }

    _prototypeProperties(Eve, null, {
        trigger: {
            value: function trigger(event, data) {
                var eventType = undefined;

                if (typeof event === "string") {
                    eventType = event;
                    event = __createEmptyEvent(eventType);
                } else {
                    eventType = event.type;
                }
                var eventParam = this._getEvent(eventType);

                event.data = data !== undefined ? data : null;
                eventParam.data = event;
                this._callHandlers(eventType);
            },
            writable: true,
            configurable: true
        },
        on: {
            value: function on(eventType, handler) {
                var event = this._getEvent(eventType);
                var handlers = event.handlers;

                if (__getIndexByHandler(handlers, handler) > -1) {
                    return false;
                }
                handlers[handlers.length] = __registerHandler(handler, false);
            },
            writable: true,
            configurable: true
        },
        once: {
            value: function once(eventType, handler) {
                var event = this._getEvent(eventType);
                var handlers = event.handlers;

                if (__getIndexByHandler(handlers, handler) > -1) {
                    return false;
                }
                handlers[handlers.length] = __registerHandler(handler, true);
            },
            writable: true,
            configurable: true
        },
        off: {
            value: function off(eventType, handler) {
                var event = this._getEvent(eventType);

                if (handler === undefined) {
                    delete this.events[eventType];
                } else {
                    var handlers = event.handlers;
                    var index = __getIndexByHandler(handlers, handler);

                    if (index > -1) {
                        handlers.splice(index, 1);
                    }
                }
            },
            writable: true,
            configurable: true
        },
        _getEvent: {
            value: function _getEvent(eventType) {
                return this.events[eventType] || (this.events[eventType] = {
                    isCalled: false,
                    handlers: [],
                    data: null
                });
            },
            writable: true,
            configurable: true
        },
        _callHandlers: {
            value: function _callHandlers(eventType) {
                var event = this._getEvent(eventType);
                var handlers = event.handlers;
                var data = event.data;
                var deletes = [];
                var i = undefined,
                    val = undefined;

                // 何もすることがない
                if (handlers.length === 0) {
                    return;
                }

                event.isCalled = true;
                for (i = 0; val = handlers[i]; i++) {
                    __fire(val.handler, data);
                    // Note: onceは一度呼んだら消すので一旦arrayに取っておく
                    if (val.isOnce) {
                        deletes[deletes.length] = val;
                    }
                }
                event.data = null;
                for (i = 0; val = deletes[i]; i++) {
                    var index = handlers.indexOf(val);

                    handlers.splice(index, 1);
                }
            },
            writable: true,
            configurable: true
        }
    });

    return Eve;
})();

module.exports = Eve;

function __createEmptyEvent(type) {
    var event = window.document.createEvent("Event");

    event.initEvent(type, true, true);
    return event;
}

function __getIndexByHandler(handlers, handler) {
    for (var i = 0, val = undefined; val = handlers[i]; i++) {
        if (val.handler === handler) {
            return i;
        }
    }
    return -1;
}

function __fire(handler, ev) {
    // handleEventがある場合はhandleEventをもれなく呼ぶ
    return handler.handleEvent ? handler.handleEvent(ev) :
    // 普通の関数ならそのまま呼ぶ
    handler(ev);
}

function __registerHandler(handler, isOnce) {
    return {
        handler: handler,
        isOnce: !!isOnce
    };
}
