'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _opts = require('./opts');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GlobalProofr = function () {
  function GlobalProofr() {
    _classCallCheck(this, GlobalProofr);

    this.proofers = _opts.DEFAULT_PROOFERS;
    this.typeMap = _opts.TYPE_MAP;

    this.lang = this.getBrowserOrDocLang();
  }

  /**
   * Proofs the given value with the validator
   * @param {string} representing the name of the validator
   * See the docs for a full list of all available validators
   * @param {string} the value to validate
   * @param {Node} the input which has to be validated
   */


  _createClass(GlobalProofr, [{
    key: 'proof',
    value: function proof(proofer, value, input) {
      if (_typeof(this.proofers[proofer]) === (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined))) return this.error('the given validator ' + proofer + ' doesn\'t exist');

      return this.proofers[proofer](value, input);
    }

    /**
     * add a new proofer method
     * @param {string} name string
     * @param {function} given handler fn
     */

  }, {
    key: 'addProofer',
    value: function addProofer(name, handler) {
      if (typeof handler !== 'function') this.error('A handler for a proofer has to be function');

      this.proofers[name] = handler;
    }

    /**
     * Read the browser or doc lang and return it to the global
     * script to save the language for message strings
     */

  }, {
    key: 'getBrowserOrDocLang',
    value: function getBrowserOrDocLang() {
      return document.documentElement.lang !== '' ? document.documentElement.lang : navigator.language || navigator.userLanguage;
    }
  }, {
    key: 'getRange',
    value: function getRange(rangeAttr) {
      var minRange = /min\s\d+/;
      var maxRange = /max\s\d+/;

      return {
        min: minRange.test(rangeAttr) ? minRange.exec(rangeAttr)[0].replace(/min\s/g, '') : null,
        max: maxRange.test(rangeAttr) ? maxRange.exec(rangeAttr)[0].replace(/max\s/g, '') : null
      };
    }

    /**
     * Consoles an error message and returns false
     * @param {string} msg
     */

  }, {
    key: 'error',
    value: function error(msg) {
      console.error('Proof/r:', msg); //eslint-disable-line

      return false;
    }
  }]);

  return GlobalProofr;
}();

exports.default = GlobalProofr;