(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["TinyLex"] = factory();
	else
		root["TinyLex"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var opts = {
    throwOnMismatch: false
};

var TinyLex = exports.TinyLex = function () {
    function TinyLex(code, rules) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : opts;

        _classCallCheck(this, TinyLex);

        if (!Array.isArray(rules)) {
            throw new Error('Invalid ruleset: rules must be a non-zero length array');
        }
        this._code = code;
        this._rules = rules;
        this._options = options;
        this._start = 0;
        this._tokens = [];
    }

    _createClass(TinyLex, [{
        key: 'done',
        value: function done() {
            var _done = !this._code || this._start >= this._code.length;
            if (_done) {
                this._destroy();
            }
            return _done;
        }
    }, {
        key: 'lex',
        value: function lex() {
            while (!this.done()) {
                var token = this._scan();
                if (token) {
                    return token;
                }
            }
            return ['EOF', 'EOF'];
        }
    }, {
        key: '_scan',
        value: function _scan() {
            while (!this._tokens.length && this._start < this._code.length) {
                var chunk = this._code.slice(this._start);
                var len = this._rules.length;

                var _testRuleSet2 = this._testRuleSet(chunk),
                    _testRuleSet3 = _slicedToArray(_testRuleSet2, 2),
                    rule = _testRuleSet3[0],
                    match = _testRuleSet3[1];

                if (match) {
                    if (!this._handleMatches(rule, match, chunk)) {
                        return null;
                    }
                } else {
                    if (this._options.throwOnMismatch) {
                        throw new Error('lex error:' + this._currentLine() + '\n  match not found for chunk:' + (' "' + chunk.replace(/\s+/g, ' ').slice(0, 32) + '..."'));
                    } else {
                        var char = chunk.slice(0, 1);
                        this._tokens.push([char.toLocaleUpperCase(), char]);
                        this._start += 1;
                    }
                }
            }
            if (this._tokens.length) {
                return this._tokens.pop();
            }
        }
    }, {
        key: 'tokenize',
        value: function tokenize() {
            return [].concat(_toConsumableArray(this));
        }
    }, {
        key: 'next',
        value: function next() {
            var _this = this;

            return {
                next: function next() {
                    return {
                        done: _this.done(), value: !_this.done() && _this.lex()
                    };
                }
            };
        }
    }, {
        key: Symbol.iterator,
        value: function value() {
            return this.next();
        }
    }, {
        key: '_testRuleSet',
        value: function _testRuleSet(chunk) {
            var len = this._rules.length;
            for (var i = 0; i < len; i++) {
                var rule = this._rules[i];
                var match = rule[0].exec(chunk);
                if (match) {
                    return [rule, match];
                }
            }
            return [null, null];
        }
    }, {
        key: '_handleMatches',
        value: function _handleMatches(rule, match, chunk) {
            var tokens = [];
            var specifier = rule[1];
            if (typeof specifier === 'string') {
                tokens.push([specifier, match[1] != null ? match[1] : match[0]]);
                this._start += match[0].length;
            } else if (typeof specifier === 'number') {
                var value = match[specifier];
                tokens.push([value.toLocaleUpperCase(), value]);
                this._start += match[0].length;
            } else if (typeof specifier === 'function') {
                var num = specifier(match, tokens, chunk);
                var size = match[0].length;
                this._start += typeof num === 'number' ? num || size : size;
            } else if (specifier == null) {
                this._start += match[0].length;
                return false;
            }
            this._tokens = this._tokens.concat(tokens.reverse());
            return tokens.length ? true : false;
        }
    }, {
        key: '_currentLine',
        value: function _currentLine() {
            var lines = this._code.slice(0, this._start).split('\n');
            return lines.length;
        }
    }, {
        key: '_destroy',
        value: function _destroy() {
            this._code = this._rules = this._tokens = null;
        }
    }]);

    return TinyLex;
}();

/***/ })
/******/ ]);
});
//# sourceMappingURL=tinylex.js.map