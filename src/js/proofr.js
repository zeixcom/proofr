import GlobalProofr from './extra/global';

window.proofr = new GlobalProofr();

export default class Proofr {
  constructor() {
    console.log('proofr loaded');
  }
}

