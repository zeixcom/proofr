'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_PROOFERS = exports.TYPE_MAP = exports.INSTANCE_DEFAULTS = exports.GLOBAL_DEFAULTS = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GLOBAL_DEFAULTS = exports.GLOBAL_DEFAULTS = {};

var INSTANCE_DEFAULTS = exports.INSTANCE_DEFAULTS = {};

/** TYPE MAP which maps certain input types to validators */
var TYPE_MAP = exports.TYPE_MAP = {
  email: 'email',
  number: 'number',
  tel: 'phone',
  url: 'url',
  date: 'date'
};

/** DEFAULT PROOFERS  */
var DEFAULT_PROOFERS = exports.DEFAULT_PROOFERS = {
  required: function required(value) {
    return value !== '' && value !== null && typeof value !== 'undefined';
  },

  pattern: function pattern(value, input) {
    if (typeof input === 'undefined') return proofr.error('There is no node defined, therefore we cant extract the pattern');

    var pattern = input.getAttribute('pattern');
    var regex = new RegExp(pattern);

    return regex.test(value);
  },

  email: function email(value) {
    return (/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g.test(value)
    );
  },

  phone: function phone(value) {
    return (/^[().+\d -]{1,15}$/g.test(value)
    );
  },

  phoneCHLI: function phoneCHLI(value) {
    return (/^(0[1-9]\d|(\+|00)(41|423))\d{7,9}/g.test(value)
    );
  },

  number: function number(value, input) {
    var isInRange = true;
    var isNumber = !isNaN(parseFloat(value)); //eslint-disable-line

    if (typeof input !== 'undefined') {
      if (input.hasAttribute('data-proof-range') && isNumber) {
        var range = proofr.getRange(input.getAttribute('data-proof-range'));
        var min = range.min;

        var max = range.max !== null ? range.max : value;

        isInRange = value >= min && value <= max;
      }
    }

    return isInRange && isNumber;
  },

  date: function date(value) {
    return (0, _moment2.default)(value).isValid();
  },

  length: function length(value, input) {
    if (input.hasAttribute('data-proof-range')) {
      var range = proofr.getRange(input.getAttribute('data-proof-range'));
      var min = range.min;

      var max = range.max !== null ? range.max : value.length;

      return value.length >= min && value.length <= max;
    }

    return proofr.error('There is no range provided for length proofr');
  },

  url: function url(value) {
    return (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/.test(value)
    );
  }
};