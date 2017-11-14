export const GLOBAL_DEFAULTS = {};

export const INSTANCE_DEFAULTS = {};

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
};
