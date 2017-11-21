import moment from 'moment';

export const GLOBAL_DEFAULTS = {};

export const INSTANCE_DEFAULTS = {
  proofOnFocus: true,
  proofOnSubmit: true,
  errorClass: 'proofr-error',
  groupClass: 'proofr-group',
  listClass: 'proofr-list',
  hasErrorMessages: true,
};

/** TYPE MAP which maps certain input types to validators */
export const TYPE_MAP = {
  email: 'email',
  number: 'number',
  url: 'url',
  date: 'date',
};

/** DEFAULT PROOFERS  */
export const DEFAULT_PROOFERS = {
  required: value => (
    value !== '' && value !== null && typeof value !== 'undefined'
  ),

  pattern: (value, input) => {
    if (typeof input === 'undefined') return proofr.error('There is no node defined, therefore we cant extract the pattern');

    const pattern = input.getAttribute('pattern');
    const regex = new RegExp(pattern);

    return regex.test(value);
  },

  email: value => (
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g.test(value)
  ),

  phone: value => (
    /^[().+\d -]{1,15}$/g.test(value)
  ),

  phoneCHLI: value => (
    /^(0[1-9]\d|(\+|00)(41|423))\d{7,9}/g.test(value)
  ),

  number: value => (
    !isNaN(parseFloat(value)) //eslint-disable-line
  ),

  range: (value, input, range) => {
    const parsedValue = parseFloat(value);

    if (typeof range !== 'undefined') {
      return parsedValue >= range.min && parsedValue <= range.max;
    }
    
    
    return proofr.error('There is no range provided for min and max');
  },

  min: (value, input, range) => {
    const parsedValue = parseFloat(value);
    
    if (typeof range !== 'undefined') {
      return parsedValue >= range.min;
    }
    
    return proofr.error('There is no range provided for min');
  },

  max: (value, input, range) => {
    const parsedValue = parseFloat(value);
    
    if (typeof range !== 'undefined') {
      return parsedValue <= range.max;
    }
    
    return proofr.error('There is no range provided for max');
  },

  date: value => (
    moment(value, proofr.dateFormats).isValid()
  ),

  length: (value, input, range) => {
    if (typeof range !== typeof undefined) {
      return value.length >= range.min && value.length <= range.max;
    }

    return proofr.error('There is no range provided for length proofr');
  },

  minlength: (value, input, range) => {
    if (typeof range !== typeof undefined) {
      return value.length <= range.max;
    }

    return proofr.error('There is no range provided for minlength proofr');
  },

  maxlength: (value, input, range) => {
    if (typeof range !== typeof undefined) {
      return value.length >= range.min;
    }

    return proofr.error('There is no range provided for maxlength proofr');
  },

  url: value => (
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/.test(value)
  ),

  checkrange: (value, input, range) => {
    if (input instanceof Array === false) return this.error('The proofer checkrange only works with radiobuttons or checkboxes');

    const checked = input.filter(item => (item.checked));

    console.log('checked', checked, range);
    console.log(checked.length >= range.min && checked.length <= range.max);

    return checked.length >= range.min && checked.length <= range.max;
  },
  checkmin: (value, input, range) => {
    if (input instanceof Array === false) return this.error('The proofer checkmin only works with radiobuttons or checkboxes');

    const checked = input.filter(item => (item.checked));

    return checked.length >= range.min;
  },

  checkmax: (value, input, range) => {
    if (input instanceof Array === false) return this.error('The proofer checkmax only works with radiobuttons or checkboxes');

    const checked = input.filter(item => item.checked);

    return checked.length <= range.max;
  },
};
