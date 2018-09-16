const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const PQueue = require('p-queue');

const jaqlProcessor = require('../src/main');

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

describe('cloneObject', () => {
    let testObj;

    beforeEach(() => {
        testObj = {
            a: 1,
            b: '2',
            c: [3, '4'],
            d: {
                e: 1,
                f: 2,
            },
        };
    });

    it('should clone the whole object', () => {
        const include = null;
        const exclude = null;
        const res = jaqlProcessor.cloneObject(testObj, include, exclude);
        expect(res).to.be.deep.equal({
            a: 1,
            b: '2',
            c: [3, '4'],
            d: {
                e: 1,
                f: 2,
            },
        });
    });

    it('should exclude first level', () => {
        const include = null;
        const exclude = ['b'];
        const res = jaqlProcessor.cloneObject(testObj, include, exclude);
        expect(res).to.be.deep.equal({
            a: 1,
            c: [3, '4'],
            d: {
                e: 1,
                f: 2,
            },
        });
    });

    it('should include first level', () => {
        const include = ['b'];
        const exclude = null;
        const res = jaqlProcessor.cloneObject(testObj, include, exclude);
        expect(res).to.be.deep.equal({
            b: '2',
        });
    });

    it('should exclude deep level', () => {
        const include = null;
        const exclude = ['d.e'];
        const res = jaqlProcessor.cloneObject(testObj, include, exclude);
        expect(res).to.be.deep.equal({
            a: 1,
            b: '2',
            c: [3, '4'],
            d: {
                f: 2,
            },
        });
    });

    it('should include deep level', () => {
        const include = ['d.e'];
        const exclude = null;
        const res = jaqlProcessor.cloneObject(testObj, include, exclude);
        expect(res).to.be.deep.equal({
            a: 1,
            b: '2',
            c: [3, '4'],
            d: {
                e: 1,
            },
        });
    });

    it('should exclude first level array', () => {
        const include = null;
        const exclude = ['c.0'];
        const res = jaqlProcessor.cloneObject(testObj, include, exclude);
        expect(res).to.be.deep.equal({
            a: 1,
            b: '2',
            c: ['4'],
            d: {
                e: 1,
                f: 2,
            },
        });
    });

    it('should include first level array', () => {
        const include = ['c.0'];
        const exclude = null;
        const res = jaqlProcessor.cloneObject(testObj, include, exclude);
        expect(res).to.be.deep.equal({
            a: 1,
            b: '2',
            c: [3],
            d: {
                e: 1,
                f: 2,
            },
        });
    });

    describe('complex array', () => {
        let testObj;

        beforeEach(() => {
            testObj = {
                c: [
                    {
                        a: 1,
                        b: 2,
                        c: 3,
                    },
                    {
                        b: 4,
                        c: 5,
                        d: 6,
                    }
                ],
            };
        });

        it('should exclude deep level property', () => {
            const include = null;
            const exclude = ['c.$.a'];
            const res = jaqlProcessor.cloneObject(testObj, include, exclude);
            expect(res).to.be.deep.equal({
                c: [
                    {
                        b: 2,
                        c: 3,
                    },
                    {
                        b: 4,
                        c: 5,
                        d: 6,
                    }
                ],
            });
        });

        it('should include deep level property', () => {
            const include = ['c.$.b'];
            const exclude = null;
            const res = jaqlProcessor.cloneObject(testObj, include, exclude);
            expect(res).to.be.deep.equal({
                c: [
                    {
                        b: 2,
                    },
                    {
                        b: 4,
                    }
                ],
            });
        });

        it('should remove object at all if does not match after exclude', () => {
            const include = null;
            const exclude = ['c.$.a', 'c.$.b', 'c.$.c'];
            const res = jaqlProcessor.cloneObject(testObj, include, exclude);
            expect(res).to.be.deep.equal({
                c: [
                    {
                        d: 6,
                    }
                ],
            });
        });

        it('should remove object at all if does not match after include', () => {
            const include = ['c.$.a'];
            const exclude = null;
            const res = jaqlProcessor.cloneObject(testObj, include, exclude);
            expect(res).to.be.deep.equal({
                c: [
                    {
                        a: 1,
                    }
                ],
            });
        });
    });

    describe('complex examples', () => {
        let testObj;

        beforeEach(() => {
            testObj = {
                a: 1,
                b: '2',
                c: [
                    {
                        a: 1,
                    },
                    {
                        c: 20,
                        d: 40
                    },
                    {
                        d: 20,
                        e: 40
                    }
                ],
                d: {
                    e: 1,
                    f: {
                        d: 10,
                        k: [
                            [
                                {
                                    f: 10,
                                    a: 30,
                                }
                            ],
                            [
                                {
                                    a: 11,
                                    b: 12,
                                },
                                {
                                    b: 11,
                                    c: 12,
                                }
                            ]
                        ],
                    },
                },
            };
        });

        it('should include deep level property', () => {
            const include = ['d.f.k.$.$.a'];
            const exclude = null;
            const res = jaqlProcessor.cloneObject(testObj, include, exclude);
            expect(res).to.be.deep.equal({
                a: 1,
                b: '2',
                c: [
                    {
                        a: 1,
                    },
                    {
                        c: 20,
                        d: 40
                    },
                    {
                        d: 20,
                        e: 40
                    }
                ],
                d: {
                    e: 1,
                    f: {
                        d: 10,
                        k: [
                            [
                                {
                                    a: 30,
                                }
                            ],
                            [
                                {
                                    a: 11,
                                },
                            ]
                        ],
                    },
                },
            });
        });
    });
});

describe('PQueue', () => {

    function addTask(id, time) {
        return () => {
            console.log(`Task "${id}" is started`);
            return delay(time)
                .then(() => {
                    console.log(`Task "${id}" is done`);
                });
        };
    }

    it('should work', () => {
        const queue = new PQueue({ concurrency: 1 });

        const delays = [100, 10, 200, 50];

        [50, 100, 150, 200].forEach((order, id) => {
            setTimeout(() => {
                console.log(`Task "${id}" is started`);
                const time = delays[id];
                const promise = delay(time, id)
                    .then((id) => {
                        console.log(`Task "${id}" is done`);
                        return id;
                    });
                queue.add(() => {
                    return promise
                        .then((id) => {
                            console.log(`Task "${id}" is done from queue`);
                        });
                });
            }, order);
        });

        return queue.onIdle()
            .then(() => {
                console.log('All done');
            });

    });

});

describe('promises', () => {

    function test(obj) {
        return new Promise((resolve) => {
            setTimeout(() => {
                Promise.resolve()
                    .then(() => {
                        obj.true = true;
                        resolve();
                    });
            });
        });
    }

    it('should work', () => {
        const res = {};

        console.log('1111');
        Promise.resolve()
            .then(() => {
                console.log('2222');
            });
        console.log('3333');

        return test(res)
            .then(() => {
                expect(res.true).to.be.true;
            });
    });
});
