import base from './billing-repro.config';
export default {...base,test:{...base.test,include:['billing-db-repro.test.ts'],testTimeout:20000}};
