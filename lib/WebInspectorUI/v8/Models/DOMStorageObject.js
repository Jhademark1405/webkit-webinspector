/*
 * Copyright (C) 2013 Apple Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. AND ITS CONTRIBUTORS ``AS IS''
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL APPLE INC. OR ITS CONTRIBUTORS
 * BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
 * THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.DOMStorageObject = function (id, host, isLocalStorage) {
    this._id = id;
    this._host = host;
    this._isLocalStorage = isLocalStorage;
    this._entries = new Map();
};

WebInspector.DOMStorageObject.TypeIdentifier = "dom-storage";
WebInspector.DOMStorageObject.HostCookieKey = "dom-storage-object-host";
WebInspector.DOMStorageObject.LocalStorageCookieKey = "dom-storage-object-local-storage";

WebInspector.DOMStorageObject.Event = {
    ItemsCleared: "dom-storage-object-items-cleared",
    ItemAdded: "dom-storage-object-item-added",
    ItemRemoved: "dom-storage-object-item-removed",
    ItemUpdated: "dom-storage-object-updated"
};

WebInspector.DOMStorageObject.prototype = Object.defineProperties({
    constructor: WebInspector.DOMStorageObject,
    __proto__: WebInspector.Object.prototype,

    saveIdentityToCookie: function saveIdentityToCookie(cookie) {
        cookie[WebInspector.DOMStorageObject.HostCookieKey] = this.host;
        cookie[WebInspector.DOMStorageObject.LocalStorageCookieKey] = this.isLocalStorage();
    },

    isLocalStorage: function isLocalStorage() {
        return this._isLocalStorage;
    },

    getEntries: function getEntries(callback) {
        function innerCallback(error, entries) {
            if (error) return;

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = entries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var entry = _step.value;

                    if (!entry[0] || !entry[1]) continue;
                    this._entries.set(entry[0], entry[1]);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator["return"]) {
                        _iterator["return"]();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            callback(error, entries);
        }

        // COMPATIBILITY (iOS 6): The getDOMStorageItems function was later renamed to getDOMStorageItems.
        if (DOMStorageAgent.getDOMStorageEntries) DOMStorageAgent.getDOMStorageEntries(this._id, innerCallback.bind(this));else DOMStorageAgent.getDOMStorageItems(this._id, innerCallback.bind(this));
    },

    removeItem: function removeItem(key) {
        DOMStorageAgent.removeDOMStorageItem(this._id, key);
    },

    setItem: function setItem(key, value) {
        DOMStorageAgent.setDOMStorageItem(this._id, key, value);
    },

    itemsCleared: function itemsCleared() {
        this._entries.clear();
        this.dispatchEventToListeners(WebInspector.DOMStorageObject.Event.ItemsCleared);
    },

    itemRemoved: function itemRemoved(key) {
        this._entries["delete"](key);
        this.dispatchEventToListeners(WebInspector.DOMStorageObject.Event.ItemRemoved, { key: key });
    },

    itemAdded: function itemAdded(key, value) {
        this._entries.set(key, value);
        this.dispatchEventToListeners(WebInspector.DOMStorageObject.Event.ItemAdded, { key: key, value: value });
    },

    itemUpdated: function itemUpdated(key, oldValue, value) {
        this._entries.set(key, value);
        var data = { key: key, oldValue: oldValue, value: value };
        this.dispatchEventToListeners(WebInspector.DOMStorageObject.Event.ItemUpdated, data);
    }
}, {
    id: {
        get: function get() {
            return this._id;
        },
        configurable: true,
        enumerable: true
    },
    host: {
        get: function get() {
            return this._host;
        },
        configurable: true,
        enumerable: true
    },
    entries: {
        get: function get() {
            return this._entries;
        },
        configurable: true,
        enumerable: true
    }
});