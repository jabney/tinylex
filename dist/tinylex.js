(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
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
    onError: 'tokenize'
};

var TinyLex = exports.TinyLex = function () {
    function TinyLex(code, rules) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : opts;

        _classCallCheck(this, TinyLex);

        this._code = code || '';
        this._rules = rules || [];
        this._cursor = 0;
        this._tokens = [];
        this._onToken = function (token) {
            return token;
        };
        this._errorAction = options.onError || 'tokenize';
    }

    _createClass(TinyLex, [{
        key: 'onToken',
        value: function onToken(fn) {
            this._onToken = fn;
            return this;
        }
    }, {
        key: 'done',
        value: function done() {
            return this._done;
        }
    }, {
        key: 'lex',
        value: function lex() {
            if (this._done) {
                throw new Error('lexer is consumed');
            }
            while (!this._done) {
                var token = this._scan();
                if (token) {
                    var _token = this._onToken(token, this._lastMatch);
                    if (_token) {
                        return _token;
                    }
                }
                if (this._cursor >= this._code.length && this._tokens.length === 0) {
                    this._done = true;
                    var eofToken = ['EOF', 'EOF'];
                    var newToken = this._onToken(eofToken, null);
                    return newToken || null;
                }
            }
        }
    }, {
        key: 'tokenize',
        value: function tokenize() {
            return [].concat(_toConsumableArray(this));
        }
    }, {
        key: '_scan',
        value: function _scan() {
            if (this._tokens.length) {
                return this._tokens.shift();
            }
            while (this._cursor < this._code.length) {
                var chunk = this._code.slice(this._cursor);

                var _testRuleSet2 = this._testRuleSet(chunk),
                    _testRuleSet3 = _slicedToArray(_testRuleSet2, 2),
                    rule = _testRuleSet3[0],
                    match = _testRuleSet3[1];

                if (match) {
                    this._lastMatch = match;
                    if (!this._handleMatch(rule, match, chunk)) {
                        return null;
                    }
                } else {
                    this._handleError(chunk);
                }
            }
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
        key: '_handleMatch',
        value: function _handleMatch(rule, match, chunk) {
            var tokens = [];
            var specifier = rule[1];
            if (typeof specifier === 'string') {
                tokens.push([specifier, match[1] != null ? match[1] : match[0]]);
                this._cursor += match[0].length;
            } else if (typeof specifier === 'number') {
                var value = match[specifier];
                tokens.push([value.toLocaleUpperCase(), value]);
                this._cursor += match[0].length;
            } else if (typeof specifier === 'function') {
                var num = specifier.call(this, match, tokens, chunk);
                var size = match[0].length;
                this._cursor += typeof num === 'number' ? Math.floor(Math.abs(num)) || size : size;
            } else if (specifier == null) {
                this._cursor += match[0].length;
                return false;
            }
            this._tokens.push.apply(this._tokens, tokens);
            return tokens.length ? true : false;
        }
    }, {
        key: '_handleError',
        value: function _handleError(chunk) {
            switch (this._errorAction) {
                case 'throw':
                    throw new Error(this._getErrorStr(chunk));
                case 'ignore':
                    this._cursor += 1;
                    break;
                default:
                    this._tokenizeChar(chunk);
            }
        }
    }, {
        key: '_tokenizeChar',
        value: function _tokenizeChar(chunk) {
            var char = chunk.slice(0, 1);
            this._tokens.push([char.toLocaleUpperCase(), char]);
            this._cursor += 1;
        }
    }, {
        key: '_getErrorStr',
        value: function _getErrorStr(chunk) {
            return 'lex error:' + this._lineAndCol() + '\n  match not found for chunk:' + (' "' + chunk.replace(/\s+/g, ' ').slice(0, 32) + '..."');
        }
    }, {
        key: '_lineAndCol',
        value: function _lineAndCol() {
            var lines = this._code.slice(0, this._cursor).split('\n');
            var col = lines[lines.length - 1].length + 1;
            return lines.length + ':' + col;
        }
    }]);

    return TinyLex;
}();

/***/ })
/******/ ]);
});
//# sourceMappingURL=tinylex.js.map