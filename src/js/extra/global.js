import { TYPE_MAP, DEFAULT_PROOFERS } from './opts';

import enMessages from './lang/en.lang';
import deMessages from './lang/de.lang';

export default class GlobalProofr {
  constructor() {
    this.proofers = DEFAULT_PROOFERS;
    this.typeMap = TYPE_MAP;

    this.lang = this.getBrowserOrDocLang();
    this.messages = {
      en: enMessages,
      de: deMessages,
    };
  }

  /**
   * Proofs the given value with the validator
   * @param {string} representing the name of the validator
   * See the docs for a full list of all available validators
   * @param {string} the value to validate
   * @param {Node} the input which has to be validated
   */
  proof(proofer, value, input) {
    if (typeof this.proofers[proofer] === typeof undefined) return this.error(`the given validator ${proofer} doesn't exist`);
    
    return this.proofers[proofer](value, input);
  }

  /**
   * add a new proofer method
   * @param {string} name string
   * @param {function} given handler fn
   */
  addProofer(name, handler) {
    if (typeof handler !== 'function') this.error('A handler for a proofer has to be function');

    this.proofers[name] = handler;
  }

  /**
   * Read the browser or doc lang and return it to the global
   * script to save the language for message strings
   */
  getBrowserOrDocLang() {
    const docLang = document.documentElement.lang !== '' ? document.documentElement.lang : navigator.language || navigator.userLanguage;

    return docLang.replace(/-[A-Z]+/g, '');
  }

  /**
   * Returns a lang message according to params
   * @param {String} title is the attribute which determines what the error says for e.g. required
   * @param {String} target normally string field or form. Determines if the
   * message is for the field only or the whole form.
   */
  getLangMessage(title) {
    return typeof this.messages[this.lang][title] !== typeof undefined
      ? this.messages[this.lang][title] : this.messages[this.lang].default;
  }

  /**
   * Consoles an error message and returns false
   * @param {string} msg
   */
  error(msg) {
    console.error('Proof/r:', msg); //eslint-disable-line

    return false;
  }
}
