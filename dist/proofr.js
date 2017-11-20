'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _global = require('./extra/global');

var _global2 = _interopRequireDefault(_global);

var _opts = require('./extra/opts');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** Add the global proofr element to window, so its globally available */
window.proofr = new _global2.default();

/** Class representing a proofr instance */

var Proofr = function () {
  function Proofr(form) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Proofr);

    this.fields = {};
    this.customErrors = [];
    this.errors = [];

    this.options = Object.assign({}, _opts.INSTANCE_DEFAULTS, options);

    this.form = this.parseForm(form);

    if (this.form) {
      this.fields = this.parseFields();
      this.events = [];

      this.form.setAttribute('novalidate', 'novalidate');

      this.addEventListener();
    }
  }

  /**
   * adding all the event listeners
   */


  _createClass(Proofr, [{
    key: 'addEventListener',
    value: function addEventListener() {
      if (this.options.proofOnFocus) {
        this.addFocusOutListeners();
      }

      if (this.options.proofOnSubmit) {
        this.addSubmitListener();
      }
    }

    /**
     * Adding submit listener
     */

  }, {
    key: 'addSubmitListener',
    value: function addSubmitListener() {
      var _this = this;

      this.form.addEventListener('submit', function (e) {
        if (!_this.proof()) e.preventDefault();
      });
    }

    /**
     * Add the listener for focus out events
     */

  }, {
    key: 'addFocusOutListeners',
    value: function addFocusOutListeners() {
      var _this2 = this;

      var fieldKeys = Object.keys(this.fields);

      fieldKeys.forEach(function (key) {
        var field = _this2.fields[key];
        var isArray = field.node instanceof Array;

        if (isArray) {
          field.node.forEach(function (node) {
            var handler = function handler() {
              _this2.proofField(field, key);
            };

            node.addEventListener('focusout', handler);
            _this2.events.push({
              node: node,
              handler: handler
            });
          });
        } else {
          var handler = function handler() {
            _this2.proofField(field, key);
          };

          field.node.addEventListener('focusout', handler);
          _this2.events.push({
            node: field.node,
            handler: handler
          });
        }
      });
    }

    /**
     * Proof all fields
     */

  }, {
    key: 'proof',
    value: function proof() {
      var _this3 = this;

      var fieldKeys = Object.keys(this.fields);

      this.errors = [];

      fieldKeys.forEach(function (field) {
        _this3.proofField(_this3.fields[field]);
      });

      var customEvent = new CustomEvent('proofed', {
        hasErrors: this.hasErrors(),
        errors: this.errors()
      });

      this.form.dispatchEvent(customEvent);

      return !this.hasErrors();
    }

    /**
     * Returns bool if there are errors
     */

  }, {
    key: 'hasErrors',
    value: function hasErrors() {
      return this.errors.length > 0;
    }

    /**
     * Returns bool if there are user added errors
     */

  }, {
    key: 'hasCustomErrors',
    value: function hasCustomErrors() {
      return this.customErrors.length > 0;
    }

    /**
     * Proofing a field and calling necessary functions
     * @param {Node|Array} field
     * @param {String} key of the field in the fields object
     */

  }, {
    key: 'proofField',
    value: function proofField(field, key) {
      var results = {};
      var value = field.node instanceof Array ? '' : field.node.value;
      var errorMessages = [];

      this.removeErrorClass(field.group);
      this.removeErrorMessages(field.group);

      field.proofers.forEach(function (proof) {
        results[proof] = proofr.proof(proof, value, field.node);
      });

      var resultsKey = Object.keys(results);
      var failedProofs = resultsKey.filter(function (proofName) {
        return !results[proofName];
      });
      var isOkay = failedProofs.length === 0;

      if (!isOkay) {
        failedProofs.forEach(function (failedProof) {
          var message = proofr.getLangMessage(failedProof, 'field');

          if (message) errorMessages.push(message);
        });

        this.addErrorClass(field.group);

        if (this.options.hasErrorMessages) {
          this.addErrorMessages(field.group, errorMessages);
        }

        this.errors.push(key);
      } else {
        this.errors = this.errors.filter(function (error) {
          return error !== key;
        });
      }

      this.dispatchFieldEvent(field.node, isOkay, errorMessages);
    }

    /**
     * Dispatching the proof event
     * @param {Node|Array} node of the input or the array
     * @param {boolean} isOkay proofr result
     * @param {Array} errorMessages array with all error messages
     */

  }, {
    key: 'dispatchFieldEvent',
    value: function dispatchFieldEvent(node, isOkay, errorMessages) {
      var customEv = new CustomEvent('proofed', {
        result: isOkay,
        errorMessages: errorMessages
      });

      if (node instanceof Array) {
        node.forEach(function (nodeItem) {
          nodeItem.dispatchEvent(customEv);
        });
      } else {
        node.dispatchEvent(customEv);
      }
    }

    /**
     * Gets the form as node by the given param
     * @param {string|Node|HTMLElement} form
     */

  }, {
    key: 'parseForm',
    value: function parseForm(form) {
      var isNode = form instanceof Node || form instanceof HTMLElement;

      if (isNode && form.tagName === 'FORM') {
        return form;
      }

      if (typeof form !== 'string') return proofr.error('Passed element to Proofr instance has not the correct type, you submitted a ' + (typeof form === 'undefined' ? 'undefined' : _typeof(form)) + ' and is a ' + form.tagName + ' tag');

      return document.querySelector(form);
    }

    /**
     * Placing the errorerror class
     * @param {Node} Group to which to add the error class
     */

  }, {
    key: 'addErrorClass',
    value: function addErrorClass(group) {
      group.classList.add(this.options.errorClass);
    }

    /**
     * Adding the error messages
     * @param {Node} group which to append the error messages
     * @param {Array} messages array with all the error messages
     */

  }, {
    key: 'addErrorMessages',
    value: function addErrorMessages(group, messages) {
      var list = group.querySelector('.' + this.options.listClass);
      var hasAlreadyList = list !== null;

      if (!hasAlreadyList) {
        list = document.createElement('UL');
        list.classList.add(this.options.listClass);

        group.appendChild(list);
      }

      messages.forEach(function (message) {
        var listItem = document.createElement('LI');

        listItem.textContent = message;

        list.appendChild(listItem);
      });
    }

    /**
     * Removing the error classes
     * @param {Node} group of the field
     */

  }, {
    key: 'removeErrorClass',
    value: function removeErrorClass(group) {
      group.classList.remove(this.options.errorClass);
    }

    /**
     * Removes the error messages on the given group
     * @param {Node} group
     */

  }, {
    key: 'removeErrorMessages',
    value: function removeErrorMessages(group) {
      var list = group.querySelector('.' + this.options.listClass);

      if (list !== null) group.removeChild(list);
    }

    /**
     * Parsin the form fields and saves them in instance,
     * so we can access them without requerying them
     */

  }, {
    key: 'parseFields',
    value: function parseFields() {
      var _this4 = this;

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
              proofers: _this4.getProofersByField(fieldNode, nodeType),
              range: fieldNode.hasAttribute('data-proof-range') ? _this4.getRangeByField(fieldNode) : undefined,
              group: fieldNode.closest('.' + _this4.options.groupClass)
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

    /**
     * Adding a custom error, for e.g. when a server validation fails by a server validation
     * @param {string} fieldName
     * @param {string} message
     */

  }, {
    key: 'addCustomError',
    value: function addCustomError(fieldName, message) {
      if (_typeof(this.fields[fieldName]) === (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined))) return proofr.error('adding custom error: There is no such field as ' + fieldName);

      var field = this.fields[fieldName];

      this.addErrorClass(field.group);
      this.addErrorMessages(field.group, [message]);

      return true;
    }
  }]);

  return Proofr;
}();

exports.default = Proofr;