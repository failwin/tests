const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const PQueue = require('p-queue');

const quickSort = require('../src/quickSort');

chai.use(chaiHttp);

const url = 'http://api.ok.ru';
const expect = chai.expect;
const request = chai.request(url);

function logObj(obj) {
    console.log(JSON.stringify(obj, null, 4));
}

function delay(time = 0, resolveValue, rejectValue) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (typeof rejectValue !== 'undefined') {
                reject(rejectValue);
            } else {
                resolve(resolveValue);
            }
        }, time);
    });
}

describe('quickSort', () => {
    let testObj;

    beforeEach(() => {

    });

    it('should clone the whole object', () => {
        expect(quickSort).to.be.exist;
    });

    it('should sort', () => {
        const input = [4, 4, 4, 4, 4, 4, 4];
        return quickSort(input)
            .then((output) => {
                expect(output).to.be.deep.equal([4, 4, 4, 4, 4, 4, 4]);
            });

    });
});
