const sinon = require('sinon');
const chai = require('chai');
const { PivotDataSortService } = require('@sisense/pivot2-sorting');
const { getJaql, getHeader, getData } = require('../src/sorting');

const expect = chai.expect;

function log(obj) {
    console.log(JSON.stringify(obj, null, 4));
}

function getLongString(str = '', size) {
    const spaces = size - str.length;
    return str + '' + getIndentStr(spaces);
}

function getIndentStr(indent) {
    return ' '.repeat(indent + 1);
}

function logData(node, data = false, indent = 0) {
    if (Array.isArray(node)) {
        node.forEach((child) => {
            logData(child, data, indent);
        });
        return;

    }
    console.log(getIndentStr(indent) + node.value);
    if (data && node.data && node.data.length) {
        const dataStr = node.data.map((data) => {
            const str = data === null ? 'null' : data;
            return getLongString(str, 6);
        }).join('');
        console.log(getIndentStr(indent + 3) + dataStr);
    }
    if (node.children && node.children.length) {
        node.children.forEach((child) => {
            logData(child, data, indent + 3);
        })
    }
}

describe.only('sorting', () => {
    it('should work', () => {
        expect(PivotDataSortService).to.be.exist;

        const jaql = getJaql([
            // {
            //     index: 1,
            //     data: {
            //         "sort": 'asc', // asc, desc, none
            //         "sortDetails": {
            //             "field": 1,
            //             "dir": 'asc', // asc, desc, none
            //             "sortingLastDimension": true,
            //             "measurePath": null,
            //             "initialized": true
            //         }
            //     }
            // },
            {
                index: 4,
                data: {
                    "sort": "desc", // asc, desc, none
                    "sortDetails": {
                        "field": 4,
                        "dir": "desc", // asc, desc, none
                        "sortingLastDimension": "sum",
                        "measurePath": {
                            "2": "2011-01-01T00:00:00.000",
                            "3": "2011-07-01T00:00:00.000"
                        },
                        "initialized": true
                    }
                }
            }
        ]);
        const header = getHeader();
        const data = getData();

        // log(data);

        const pivotSorting = new PivotDataSortService(jaql, header);

        // pivotSorting.sortGroup(data[1]);

        // logData(data[1], true);

        pivotSorting.sortTable(data);

        logData(data, true);

    });
});