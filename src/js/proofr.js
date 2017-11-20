import GlobalProofr from './extra/global';
import { INSTANCE_DEFAULTS } from './extra/opts';

/** Add the global proofr element to window, so its globally available */
window.proofr = new GlobalProofr();

/** Class representing a proofr instance */
export default class Proofr {
  constructor(form, options = {}) {
    this.fields = {};
    this.customErrors = [];
    this.errors = [];

    this.options = Object.assign({}, INSTANCE_DEFAULTS, options);

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
  addEventListener() {
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
  addSubmitListener() {
    this.form.addEventListener('submit', (e) => {
      if (!this.proof()) e.preventDefault();
    });
  }

  /**
   * Add the listener for focus out events
   */
  addFocusOutListeners() {
    const fieldKeys = Object.keys(this.fields);
    
    fieldKeys.forEach((key) => {
      const field = this.fields[key];
      const isArray = field.node instanceof Array;

      if (isArray) {
        field.node.forEach((node) => {
          const handler = () => {
            this.proofField(field, key);
          };

          node.addEventListener('focusout', handler);
          this.events.push({
            node,
            handler,
          });
        });
      } else {
        const handler = () => {
          this.proofField(field, key);
        };

        field.node.addEventListener('focusout', handler);
        this.events.push({
          node: field.node,
          handler,
        });
      }
    });
  }


  /**
   * Proof all fields
   */
  proof() {
    const fieldKeys = Object.keys(this.fields);

    this.errors = [];

    fieldKeys.forEach((field) => {
      this.proofField(this.fields[field]);
    });

    const customEvent = new CustomEvent('proofed', {
      hasErrors: this.hasErrors(),
      errors: this.errors(),
    });

    this.form.dispatchEvent(customEvent);

    return !this.hasErrors();
  }

  /**
   * Returns bool if there are errors
   */
  hasErrors() {
    return this.errors.length > 0;
  }

  /**
   * Returns bool if there are user added errors
   */
  hasCustomErrors() {
    return this.customErrors.length > 0;
  }

  /**
   * Proofing a field and calling necessary functions
   * @param {Node|Array} field
   * @param {String} key of the field in the fields object
   */
  proofField(field, key) {
    const results = {};
    const value = field.node instanceof Array ? '' : field.node.value;
    const errorMessages = [];

    this.removeErrorClass(field.group);
    this.removeErrorMessages(field.group);

    field.proofers.forEach((proof) => {
      results[proof] = proofr.proof(proof, value, field.node);
    });

    const resultsKey = Object.keys(results);
    const failedProofs = resultsKey.filter(proofName => (
      !results[proofName]
    ));
    const isOkay = failedProofs.length === 0;

    if (!isOkay) {
      failedProofs.forEach((failedProof) => {
        const message = proofr.getLangMessage(failedProof, 'field');

        if (message) errorMessages.push(message);
      });

      this.addErrorClass(field.group);

      if (this.options.hasErrorMessages) {
        this.addErrorMessages(field.group, errorMessages);
      }

      this.errors.push(key);
    } else {
      this.errors = this.errors.filter(error => error !== key);
    }

    this.dispatchFieldEvent(field.node, isOkay, errorMessages);
  }

  /**
   * Dispatching the proof event
   * @param {Node|Array} node of the input or the array
   * @param {boolean} isOkay proofr result
   * @param {Array} errorMessages array with all error messages
   */
  dispatchFieldEvent(node, isOkay, errorMessages) {
    const customEv = new CustomEvent('proofed', {
      result: isOkay,
      errorMessages,
    });

    if (node instanceof Array) {
      node.forEach((nodeItem) => {
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
  parseForm(form) {
    const isNode = form instanceof Node || form instanceof HTMLElement;

    if (isNode && form.tagName === 'FORM') {
      return form;
    }

    if (typeof form !== 'string') return proofr.error(`Passed element to Proofr instance has not the correct type, you submitted a ${typeof form} and is a ${form.tagName} tag`);
    
    return document.querySelector(form);
  }

  /**
   * Placing the errorerror class
   * @param {Node} Group to which to add the error class
   */
  addErrorClass(group) {
    group.classList.add(this.options.errorClass);
  }

  /**
   * Adding the error messages
   * @param {Node} group which to append the error messages
   * @param {Array} messages array with all the error messages
   */
  addErrorMessages(group, messages) {
    let list = group.querySelector(`.${this.options.listClass}`);
    const hasAlreadyList = list !== null;

    if (!hasAlreadyList) {
      list = document.createElement('UL');
      list.classList.add(this.options.listClass);

      group.appendChild(list);
    }

    messages.forEach((message) => {
      const listItem = document.createElement('LI');

      listItem.textContent = message;

      list.appendChild(listItem);
    });
  }

  /**
   * Removing the error classes
   * @param {Node} group of the field
   */
  removeErrorClass(group) {
    group.classList.remove(this.options.errorClass);
  }


  /**
   * Removes the error messages on the given group
   * @param {Node} group
   */
  removeErrorMessages(group) {
    const list = group.querySelector(`.${this.options.listClass}`);

    if (list !== null) group.removeChild(list);
  }

  /**
   * Parsin the form fields and saves them in instance,
   * so we can access them without requerying them
   */
  parseFields() {
    const fieldsQuery = this.form.querySelectorAll('input, select, textarea');
    const fields = {};
    const checkboxRegex = /(checkbox|radio)/g;
    const buttonRegex = /(submit|reset|button)/g;
    
    let nodeType;
    let nodeName;
    let field;
    let isButton;
    let isBoolField;
    let isValid;
    let doesAlreadyExist;

    fieldsQuery.forEach((fieldNode) => {
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
            proofers: this.getProofersByField(fieldNode, nodeType),
            range: fieldNode.hasAttribute('data-proof-range') ? this.getRangeByField(fieldNode) : undefined,
            group: fieldNode.closest(`.${this.options.groupClass}`),
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
  getProofersByField(node, type) {
    let proofers = [];

    if (node.hasAttribute('required')) proofers.push('required');

    if (proofr.typeMap[type]) proofers.push(proofr.typeMap[type]);

    if (node.hasAttribute('data-proof')) {
      const proofersByAttr = node.getAttribute('data-proof').split(' ');

      proofers = proofers.concat(proofersByAttr);
    }

    return proofers;
  }

  /**
   * get the range by field
   * @param {node} the field node
   */
  getRangeByField(node) {
    const rangeAttr = node.getAttribute('data-proof-range');
    const minRange = /min\s\d+/;
    const maxRange = /max\s\d+/;

    return {
      min: minRange.test(rangeAttr) ? minRange.exec(rangeAttr)[0].replace(/min\s/g, '') : null,
      max: maxRange.test(rangeAttr) ? maxRange.exec(rangeAttr)[0].replace(/max\s/g, '') : null,
    };
  }

  /**
   * Adding a custom error, for e.g. when a server validation fails by a server validation
   * @param {string} fieldName
   * @param {string} message
   */
  addCustomError(fieldName, message) {
    if (typeof this.fields[fieldName] === typeof undefined) return proofr.error(`adding custom error: There is no such field as ${fieldName}`);

    const field = this.fields[fieldName];

    this.addErrorClass(field.group);
    this.addErrorMessages(field.group, [message]);

    return true;
  }
}
