import { TYPE_MAP, DEFAULT_PROOFERS } from './opts';

import enMessages from './lang/en.lang';
import deMessages from './lang/de.lang';

export default class GlobalProofr {
  constructor() {
    this.proofers = DEFAULT_PROOFERS;
    this.typeMap = TYPE_MAP;

    this.lang = this.getBrowserOrDocLang();
    this.dateFormats = [
      'YYYY-MM-DD',
      'DD.MM.YYYY',
      'DD/MM/YYYY',
      'DD-MM-YYYY',
    ];

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
  proof(proofer, value, input, range) {
    if (typeof this.proofers[proofer] === typeof undefined) return this.error(`the given validator ${proofer} doesn't exist`);

    return this.proofers[proofer](value, input, range);
  }

  /**
   * add a new proofer method
   * @param {string} name string
   * @param {function} given handler fn
   */
  addProofer(name, handler) {
    if (typeof handler !== 'function') return this.error('A handler for a proofer has to be function');

    this.proofers[name] = handler;

    return this.proofers[name];
  }

  /**
   * Extending a language
   * @param {String} lang two letter code of the lang (default (de/en/fr/it))
   * @param {Objects} langStrings the lang strings for the proofers
   */
  extendOverwriteLang(lang, langStrings) {
    if (typeof this.messages[lang] === typeof undefined) return this.error(`The lang ${lang} can't be extended, because it doesn't exist`);

    this.messages[lang] = Object.assign({}, this.messages[lang], langStrings);

    return this.messages;
  }

  /**
   * Adding a new language
   * @param {String} twolettercode for lang
   * @param {Object} langStrings object with all the messages
   */
  addLang(lang, langStrings) {
    if (typeof this.messages[lang] !== typeof undefined) return this.error(`The lang ${lang} does already exist, please use proofr.extendOverwriteLang() to extend a language`);

    this.messages[lang] = langStrings;

    return this.messages;
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
   * @param {Object} max min range
   */
  getLangMessage(title, range) {
    const lang = typeof this.messages[this.lang] !== typeof undefined ? this.lang : 'en';
    let message = typeof this.messages[lang][title] !== typeof undefined
      ? this.messages[lang][title] : this.messages[lang].default;

    message = message.replace(/%min/g, range.min);
    message = message.replace(/%max/g, range.max);

    return message;
  }

  /**
   * Sets the date format according to the given string
   * @param {String} format (eu / uk / usa)
   */
  setDateFormat(format) {
    switch (format) {
      case 'eu':
        this.dateFormats = [
          'YYYY-MM-DD',
          'DD.MM.YYYY',
          'DD/MM/YYYY',
          'DD-MM-YYYY',
        ];
        break;
      case 'uk':
      case 'usa':
        this.dateFormats = [
          'YYYY-MM-DD',
          'MM.DD.YYYY',
          'MM/DD/YYYY',
          'MM-DD-YYYY',
        ];
        break;
      default:
        break;
    }
  }

  /**
   * Setting a user defined language
   * @param {String} lang two letter code for the lang
   */
  setLang(lang) {
    this.lang = lang;
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
