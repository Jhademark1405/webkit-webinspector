var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * Copyright (C) 2009 Google Inc. All rights reserved.
 * Copyright (C) 2013 Apple Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.Setting = (function (_WebInspector$Object) {
    _inherits(Setting, _WebInspector$Object);

    function Setting(name, defaultValue) {
        _classCallCheck(this, Setting);

        _get(Object.getPrototypeOf(Setting.prototype), "constructor", this).call(this);

        this._name = name;
        this._localStorageKey = WebInspector.Setting.LocalStorageKeyPrefix + name;
        this._defaultValue = defaultValue;
    }

    // Public

    _createClass(Setting, [{
        key: "name",
        get: function get() {
            return this._name;
        }
    }, {
        key: "value",
        get: function get() {
            if ("_value" in this) return this._value;

            // Make a copy of the default value so changes to object values don't modify the default value.
            this._value = JSON.parse(JSON.stringify(this._defaultValue));

            if (!window.InspectorTest && window.localStorage && this._localStorageKey in window.localStorage) {
                try {
                    this._value = JSON.parse(window.localStorage[this._localStorageKey]);
                } catch (e) {
                    delete window.localStorage[this._localStorageKey];
                }
            }

            return this._value;
        },
        set: function set(value) {
            this._value = value;

            if (!window.InspectorTest && window.localStorage) {
                try {
                    // Use Object.shallowEqual to properly compare objects.
                    if (Object.shallowEqual(this._value, this._defaultValue)) delete window.localStorage[this._localStorageKey];else window.localStorage[this._localStorageKey] = JSON.stringify(this._value);
                } catch (e) {
                    console.error("Error saving setting with name: " + this._name);
                }
            }

            this.dispatchEventToListeners(WebInspector.Setting.Event.Changed, this._value, { name: this._name });
        }
    }]);

    return Setting;
})(WebInspector.Object);

WebInspector.Setting.LocalStorageKeyPrefix = "com.apple.WebInspector.";

WebInspector.Setting.Event = {
    Changed: "setting-changed"
};
