import GlobalProofr from './extra/global';

/** Add the global proofr element to window, so its globally available */
window.proofr = new GlobalProofr();

/** Class representing a proofr instance */
export default class Proofr {
  constructor(form) {
    this.fields = {};

    this.form = this.parseForm(form);
    this.fields = this.parseFields();

    console.log('this.fields', this.fields);
  }

  /**
   * Gets the form as node by the given param
   * @param {string|Node|HTMLElement} form
   */
  parseForm(form) {
    const isNode = form instanceof Node || form instanceof HTMLElement;

    if (isNode) {
      return form;
    }

    if (typeof form !== 'string') return proofr.error(`Passed element to Proofr instance has not the correct type, you submitted a ${typeof form}`);
    
    return document.querySelector(form);
  }

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
            profers: this.getProofersByField(fieldNode, nodeType),
            range: fieldNode.hasAttribute('data-proof-range') ? this.getRangeByField(fieldNode) : undefined,
          };

          fields[nodeName] = field;
        }
      }
    });

    return fields;
  }

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
}
