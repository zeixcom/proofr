import { TYPE_MAP, DEFAULT_PROOFERS } from './opts';

export default class GlobalProofr {
  constructor() {
    this.proofers = DEFAULT_PROOFERS;
    this.typeMap = TYPE_MAP;

    this.lang = this.getBrowserOrDocLang();
  }

  /**
   * Proofs the given value with the validator
   * @param {string} representing the name of the validator
   * See the docs for a full list of all available validators
   * @param {string} the value to validate
   */
  proof(proofer, value) {
    if (typeof this.proofrs[proofer] === typeof undefined) return this.error(`the given validator ${proofer} doesn't exist`);
    
    return this.proofrs[proofer](value);
  }

  /**
   * add a new proofer method
   * @param {string} name string
   * @param {function} given handler fn
   */
  addProofer(name, handler) {
    if (typeof handler !== 'function') this.error('A handler for a proofer has to be function');

    this.proofrs[name] = handler;
  }

  /**
   * Read the browser or doc lang and return it to the global
   * script to save the language for message strings
   */
  getBrowserOrDocLang() {
    return document.documentElement.lang !== '' ? document.documentElement.lang : navigator.language || navigator.userLanguage;
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
