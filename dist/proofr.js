'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _global = require('./extra/global');

var _global2 = _interopRequireDefault(_global);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** Add the global proofr element to window, so its globally available */
window.proofr = new _global2.default();

/** Class representing a proofr instance */

var Proofr = function () {
  function Proofr(form) {
    _classCallCheck(this, Proofr);

    this.fields = {};

    this.form = this.parseForm(form);
    this.fields = this.parseFields();
    this.events = [];

    this.form.setAttribute('novalidate', true);

    this.addEventListener();
  }

  /**
   * adding all the event listeners
   */


  _createClass(Proofr, [{
    key: 'addEventListener',
    value: function addEventListener() {
      var _this = this;

      var fieldKeys = Object.keys(this.fields);

      fieldKeys.forEach(function (key) {
        var field = _this.fields[key];
        var isArray = typeof field.node === 'array';
      });
    }

    /**
     * Gets the form as node by the given param
     * @param {string|Node|HTMLElement} form
     */

  }, {
    key: 'parseForm',
    value: function parseForm(form) {
      var isNode = form instanceof Node || form instanceof HTMLElement;

      if (isNode) {
        return form;
      }

      if (typeof form !== 'string') return proofr.error('Passed element to Proofr instance has not the correct type, you submitted a ' + (typeof form === 'undefined' ? 'undefined' : _typeof(form)));

      return document.querySelector(form);
    }

    /**
     * Parsin the form fields and saves them in instance,
     * so we can access them without requerying them
     */

  }, {
    key: 'parseFields',
    value: function parseFields() {
      var _this2 = this;

      var fieldsQuery = this.form.querySelectorAll('input, select, textarea');
      var fields = {};
      var checkboxRegex = /(checkbox|radio)/g;
      var buttonRegex = /(submit|reset|button)/g;

      var nodeType = void 0;
      var nodeName = void 0;
      var field = void 0;
      var isButton = void 0;
      var isBoolField = void 0;
      var isValid = void 0;
      var doesAlreadyExist = void 0;

      fieldsQuery.forEach(function (fieldNode) {
        isValid = fieldNode.hasAttribute('name');

        nodeType = fieldNode.getAttribute('type') || 'text';

        isButton = buttonRegex.test(nodeType);
        isBoolField = nodeType.match(checkboxRegex) !== null;

        if (!isButton && isValid) {
          nodeName = fieldNode.getAttribute('name');
          doesAlreadyExist = typeof fields[nodeName] !== 'undefined';

          if (doesAlreadyExist && isBoolField) {
            fields[nodeName].node.push(fieldNode);
          } else {
            field = {
              node: isBoolField ? [fieldNode] : fieldNode,
              type: nodeType,
              profers: _this2.getProofersByField(fieldNode, nodeType),
              range: fieldNode.hasAttribute('data-proof-range') ? _this2.getRangeByField(fieldNode) : undefined
            };

            fields[nodeName] = field;
          }
        }
      });

      return fields;
    }

    /**
     * Receives all the proofers by field
     * @param {Node} field
     * @param {string} type
     */

  }, {
    key: 'getProofersByField',
    value: function getProofersByField(node, type) {
      var proofers = [];

      if (node.hasAttribute('required')) proofers.push('required');

      if (proofr.typeMap[type]) proofers.push(proofr.typeMap[type]);

      if (node.hasAttribute('data-proof')) {
        var proofersByAttr = node.getAttribute('data-proof').split(' ');

        proofers = proofers.concat(proofersByAttr);
      }

      return proofers;
    }

    /**
     * get the range by field
     * @param {node} the field node
     */

  }, {
    key: 'getRangeByField',
    value: function getRangeByField(node) {
      var rangeAttr = node.getAttribute('data-proof-range');
      var minRange = /min\s\d+/;
      var maxRange = /max\s\d+/;

      return {
        min: minRange.test(rangeAttr) ? minRange.exec(rangeAttr)[0].replace(/min\s/g, '') : null,
        max: maxRange.test(rangeAttr) ? maxRange.exec(rangeAttr)[0].replace(/max\s/g, '') : null
      };
    }
  }]);

  return Proofr;
}();

exports.default = Proofr;