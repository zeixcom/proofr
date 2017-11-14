'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _global = require('./extra/global');

var _global2 = _interopRequireDefault(_global);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** Add the global proofr element to window, so its globally available */
window.proofr = new _global2.default();

/** Class representing a proofr instance */

var Proofr = function Proofr() {
  _classCallCheck(this, Proofr);

  console.log('proofr loaded');
};

exports.default = Proofr;