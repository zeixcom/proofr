import moment from 'moment';

export const GLOBAL_DEFAULTS = {};

export const INSTANCE_DEFAULTS = {
  proofOnFocus: true,
};

/** TYPE MAP which maps certain input types to validators */
export const TYPE_MAP = {
  email: 'email',
  number: 'number',
  tel: 'phone',
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

  number: (value, input, range) => {
    let isInRange = true;
    const isNumber = !isNaN(parseFloat(value)); //eslint-disable-line
    
    if (typeof range !== 'undefined') {
      const { min } = range;
      const max = range.max !== null ? range.max : value;

      isInRange = value >= min && value <= max;
    }
    
    return isInRange && isNumber;
  },

  date: value => (
    moment(value).isValid()
  ),

  length: (value, input, range) => {
    if (typeof range !== typeof undefined) {
      const { min } = range;
      const max = range.max !== null ? range.max : value.length;

      return value.length >= min && value.length <= max;
    }

    return proofr.error('There is no range provided for length proofr');
  },

  url: value => (
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/.test(value)
  ),
};
