import GlobalProofr from './extra/global';

/** Add the global proofr element to window, so its globally available */
window.proofr = new GlobalProofr();

/** Class representing a proofr instance */
export default class Proofr {
  constructor() {
    console.log('proofr loaded');
  }
}

