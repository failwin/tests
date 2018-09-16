const { PivotDataSortService } = require('@sisense/pivot2-sorting');

function getJaql(sortDetails) {
    const jaql = {
        "datasource": {
            "title": "Sample Healthcare",
            "fullname": "LocalHost/Sample Healthcare",
            "id": "aLOCALHOST_aSAMPLEIAAaHEALTHCARE",
            "address": "LocalHost",
            "database": "aSampleIAAaHealthcare",
            "lastBuildTime": "2017-10-19T17:31:21"
        },
        "format": "pivot",
        "count": 100000,
        "offset": 0,
        "grandTotals": {
            "title": "Grand Total"
        },
        "metadata": [{
            "jaql": {
                "table": "Divisions",
                "column": "Divison_name",
                "dim": "[Divisions.Divison_name]",
                "datatype": "text",
                "merged": true,
                "title": "Divison_name"
            },
            "field": {
                "id": "[Divisions.Divison_name]",
                "index": 0
            },
            "format": {
                "width": 144,
                "subtotal": false
            },
            "panel": "rows"
        }, {
            "jaql": {
                "table": "Doctors",
                "column": "Specialty",
                "dim": "[Doctors.Specialty]",
                "datatype": "text",
                "merged": true,
                "title": "Specialty"
            },
            "panel": "rows",
            "field": {
                "id": "[Doctors.Specialty]",
                "index": 1
            },
            "format": {
                "width": 190
            }
        }, {
            "jaql": {
                "table": "Admissions",
                "column": "Admission_Time",
                "dim": "[Admissions.Admission_Time (Calendar)]",
                "datatype": "datetime",
                "merged": true,
                "level": "years",
                "title": "Years in Admission_Time"
            },
            "format": {
                "mask": {
                    "years": "yyyy",
                    "quarters": "yyyy Q",
                    "months": "MM/yyyy",
                    "weeks": "ww yyyy",
                    "days": "shortDate",
                    "minutes": "HH:mm"
                },
                "width": 136,
                "subtotal": false
            },
            "field": {
                "index": 2
            },
            "hierarchies": ["calendar", "calendar - weeks"],
            "panel": "columns",
            "disabled": false
        }, {
            "jaql": {
                "table": "Admissions",
                "column": "Admission_Time",
                "dim": "[Admissions.Admission_Time (Calendar)]",
                "datatype": "datetime",
                "merged": true,
                "level": "quarters",
                "title": "Quarters in Admission_Time"
            },
            "format": {
                "mask": {
                    "years": "yyyy",
                    "quarters": "yyyy Q",
                    "months": "MM/yyyy",
                    "weeks": "ww yyyy",
                    "days": "shortDate",
                    "minutes": "HH:mm",
                    "isdefault": true
                }
            },
            "hierarchies": ["calendar", "calendar - weeks"],
            "field": {
                "index": 3
            },
            "disabled": false,
            "panel": "columns"
        }, {
            "jaql": {
                "table": "Conditions time of stay",
                "column": "Positive",
                "dim": "[Conditions.Positive1]",
                "datatype": "numeric",
                "agg": "sum",
                "title": "Total Positive",
                "sort": null
            },
            "format": {
                "color": {
                    "type": "color",
                    "color": "transparent"
                },
                "mask": {
                    "type": "number",
                    "t": true,
                    "b": true,
                    "separated": true,
                    "decimals": "auto",
                    "isdefault": true
                },
                "width": 113
            },
            "field": {
                "id": "[Conditions.Positive1]_sum",
                "index": 4
            },
            "panel": "measures"
        }, {
            "jaql": {
                "table": "Admissions",
                "column": "Admission_Time",
                "dim": "[Admissions.Admission_Time (Calendar)]",
                "datatype": "datetime",
                "merged": true,
                "title": "Admission_Time",
                "level": "years",
                "filter": {
                    "explicit": false,
                    "multiSelection": true,
                    "all": true
                },
                "collapsed": false,
                "datasource": {
                    "title": "Sample Healthcare",
                    "fullname": "LocalHost/Sample Healthcare",
                    "id": "aLOCALHOST_aSAMPLEIAAaHEALTHCARE",
                    "address": "LocalHost",
                    "database": "aSampleIAAaHealthcare",
                    "lastBuildTime": "2017-10-19T17:31:21"
                }
            },
            "format": {
                "mask": {
                    "years": "yyyy",
                    "quarters": "yyyy Q",
                    "months": "MM/yyyy",
                    "weeks": "ww yyyy",
                    "days": "shortDate",
                    "minutes": "HH:mm",
                    "isdefault": true
                }
            },
            "field": {
                "id": "[Admissions.Admission_Time (Calendar)]",
                "index": 5
            },
            "panel": "scope"
        }],
        "m2mThresholdFlag": 1,
        "isMaskedResult": true,
        "widget": "5b56c827492148118447eeef;",
        "dashboard": "5b56c750492148118447eee5;Pivot 2",
        "queryGuid": "6f093a49-b75a-444b-9758-a15ad81305fa"
    };

    const metadata = jaql.metadata;

    sortDetails.forEach((sortPanel) => {
        const { index, data } = sortPanel;
        metadata.forEach((panel) => {
            if (panel.field.index === index) {
                panel.jaql = {
                    ...panel.jaql,
                    ...data
                }
            }
        })
    });

    return jaql;
}

function getHeader() {
    const header = {
        "children": [{
            "value": "2011-01-01T00:00:00.000",
            "children": [{
                "value": "2011-07-01T00:00:00.000",
                "index": 0
            }, {
                "value": "2011-10-01T00:00:00.000",
                "index": 1
            }]
        }, {
            "value": "2012-01-01T00:00:00.000",
            "children": [{
                "value": "2012-04-01T00:00:00.000",
                "index": 2
            }, {
                "value": "2012-07-01T00:00:00.000",
                "index": 3
            }, {
                "value": "2012-01-01T00:00:00.000",
                "index": 4
            }, {
                "value": "2012-10-01T00:00:00.000",
                "index": 5
            }]
        }, {
            "value": "2013-01-01T00:00:00.000",
            "children": [{
                "value": "2013-01-01T00:00:00.000",
                "index": 6
            }, {
                "value": "2013-04-01T00:00:00.000",
                "index": 7
            }]
        }]
    };

    return header;
}

function getData() {
    const data1 = {
        "value": "Cardiology",
        "children": [{
            "value": "Cardiology",
            "data": ["214", "1306", "2240", "3616", "2004", "3415", "4754", "5083"]
        }, {
            "value": "Neurology",
            "data": [null, "342", "1406", "1558", "1326", "2544", "2310", "2642"]
        }, {
            "value": "Oncology",
            "data": ["440", "1815", "4653", "5400", "3967", "6523", "7934", "7429"]
        }, {
            "value": "Emergency Room",
            "data": ["872", "1391", "1382", "4032", "1537", "5585", "4877", "4634"]
        }, {
            "value": "Pediatrics",
            "data": ["1183", "1624", "3171", "5596", "2479", "6680", "7494", "7541"]
        }, {
            "value": "Surgeon",
            "data": ["226", "758", "1202", "1453", "888", "2026", "2878", "3227"]
        }]
    };

    const data2 = {
        "value": "Neurology",
        "children": [{
            "value": "Cardiology",
            "data": ["470", "654", "2352", "1924", "1136", "3046", "2993", "3868"]
        }, {
            "value": "Emergency Room",
            "data": ["438", "954", "1181", "1793", "759", "3561", "3206", "3932"]
        }, {
            "value": "Neurology",
            "data": ["112", "555", "865", "549", "576", "1295", "2228", "1547"]
        }, {
            "value": "Oncology",
            "data": ["104", "884", "3102", "3186", "1508", "2398", "6562", "5396"]
        }, {
            "value": "Pediatrics",
            "data": ["435", "888", "3383", "4244", "2059", "4226", "5985", "4699"]
        }, {
            "value": "Surgeon",
            "data": [null, "547", "320", "1057", "876", "1629", "2329", "1850"]
        }]
    };

    const data3 = {
        "value": "Oncology",
        "children": [{
            "value": "Cardiology",
            "data": ["126", "319", "1781", "2774", "1079", "2593", "3907", "3329"]
        }, {
            "value": "Emergency Room",
            "data": ["220", "449", "1723", "2846", "1270", "2475", "4709", "3336"]
        }, {
            "value": "Neurology",
            "data": ["108", "336", "1296", "1819", "426", "1353", "1715", "1982"]
        }, {
            "value": "Oncology",
            "data": ["99", "1080", "2203", "4835", "2493", "4325", "5444", "5058"]
        }, {
            "value": "Pediatrics",
            "data": ["328", "1066", "3660", "4438", "2090", "4994", "6079", "6576"]
        }, {
            "value": "Surgeon",
            "data": ["226", "435", "1181", "1469", "1153", "746", "1458", "1043"]
        }]
    };

    const data4 = {
        "value": "Operating Rooms",
        "children": [{
            "value": "Cardiology",
            "data": ["116", "725", "3692", "3011", "1583", "2906", "4504", "2740"]
        }, {
            "value": "Emergency Room",
            "data": ["220", "1521", "2178", "1805", "1405", "3095", "3879", "3159"]
        }, {
            "value": "Neurology",
            "data": [null, "437", "1639", "1062", null, "1286", "2000", "2024"]
        }, {
            "value": "Oncology",
            "data": ["436", "1234", "3296", "3058", "1877", "4419", "6972", "5732"]
        }, {
            "value": "Pediatrics",
            "data": ["429", "873", "2702", "3780", "2568", "4425", "5278", "6152"]
        }, {
            "value": "Surgeon",
            "data": ["122", "558", "821", "1504", "749", "1100", "2007", "1972"]
        }]
    };

    const data5 = {
        "value": "Pediatrics",
        "children": [{
            "value": "Cardiology",
            "data": ["108", "1064", "1304", "2502", "1190", "2629", "3532", "3593"]
        }, {
            "value": "Emergency Room",
            "data": ["244", "779", "1078", "2883", "866", "2252", "2681", "3031"]
        }, {
            "value": "Neurology",
            "data": ["104", "467", "727", "1766", "466", "1078", "1403", "1646"]
        }, {
            "value": "Oncology",
            "data": ["211", "853", "3149", "3444", "1897", "2835", "3530", "4485"]
        }, {
            "value": "Pediatrics",
            "data": ["315", "1743", "2418", "2947", "1482", "4090", "4369", "4909"]
        }, {
            "value": "Surgeon",
            "data": ["230", "319", "896", "866", "571", "1353", "2066", "1732"]
        }]
    };

    return [data3, data1, data5, data2, data4];
}


module.exports = {
    getJaql,
    getHeader,
    getData,
};