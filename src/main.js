function logObj(obj) {
    console.log(JSON.stringify(obj, null, 4));
}

function hasMatchedItems(searchList, queryList = []) {
    let res = false;
    queryList.forEach((query) => {
        if (searchList.indexOf(query) > -1) {
            res = true;
        }
    });
    return res;
}

function getParentKeys(parentKeys = [], key, isArray) {
    const res = [];

    if (isArray) {
        parentKeys.forEach((parentKey) => {
            res.push(`${parentKey}.$`);
        });
    }

    if (parentKeys.length) {
        parentKeys.forEach((parentKey) => {
            res.push(`${parentKey}.${key}`);
        });
    } else {
        res.push(key);
    }

    return res;
}

function isEmpty(value) {
    if (typeof value === 'object') {
        if (Array.isArray(value)) {
            return !value.length;
        }
        return !Object.keys(value).length;
    }
    return false;
}

function shouldBeIncluded(includeKeys, excludeKeys, keysWithParent) {
    if (includeKeys.length) {
        return hasMatchedItems(includeKeys, keysWithParent);
    } else if (excludeKeys.length) {
        return !hasMatchedItems(excludeKeys, keysWithParent);
    } else {
        return true;
    }
}

function updateIncludeExcludeKeys(
    obj,
    include = [],
    exclude = [],
    parentKeys = [],
    includeKeys = {},
    excludeKeys = {},
) {
    const keys = Object.keys(obj);
    const isArray = Array.isArray(obj);

    let commonIncludeKeys = [];
    let commonExcludeKeys = [];

    let childCommonIncludeKeys = [];
    let childCommonExcludeKeys = [];

    keys.forEach((key) => {
        const value = obj[key];
        const keysWithParent = getParentKeys(parentKeys, key, isArray);
        const baseKeysWithParent = (parentKeys[0] || '&');

        includeKeys[baseKeysWithParent] = includeKeys[baseKeysWithParent] || [];
        excludeKeys[baseKeysWithParent] = excludeKeys[baseKeysWithParent] || [];

        keysWithParent.forEach((keyWithParent) => {
            if ((include || []).indexOf(keyWithParent) > -1) {
                includeKeys[baseKeysWithParent].push(keyWithParent);
                commonIncludeKeys.push(keyWithParent);
            }

            if ((exclude || []).indexOf(keyWithParent) > -1) {
                excludeKeys[baseKeysWithParent].push(keyWithParent);
                commonExcludeKeys.push(keyWithParent);
            }
        });

        if (typeof value === 'object') {
            const res = updateIncludeExcludeKeys(value, include, exclude, keysWithParent, includeKeys, excludeKeys);
        }

    });

    if (typeof obj === 'object') {
        let baseArrayKeysWithParent = (parentKeys[0] || '&');
        if (Array.isArray(obj)) {
            baseArrayKeysWithParent = (parentKeys[0] || '&') + '.$';
        }

        includeKeys[baseArrayKeysWithParent] = (includeKeys[baseArrayKeysWithParent] || []).concat(childCommonIncludeKeys);
        commonIncludeKeys = commonIncludeKeys.concat(childCommonIncludeKeys);
        excludeKeys[baseArrayKeysWithParent] = (excludeKeys[baseArrayKeysWithParent] || []).concat(childCommonExcludeKeys);
        commonExcludeKeys = commonIncludeKeys.concat(childCommonExcludeKeys);
    }

    return {
        commonIncludeKeys,
        commonExcludeKeys,
    };
}

function applyIncludeExclude(
    obj,
    include = [],
    exclude = [],
    parentKeys = [],
    includeKeysObj = {},
    excludeKeysObj = {}
) {
    if (typeof obj !== 'object') {
        return obj;
    }

    const keys = Object.keys(obj);
    const isArray = Array.isArray(obj);
    const res = isArray ? [] : {};

    const parentKey = (parentKeys[0] || '&');
    const includeKeys = includeKeysObj[parentKey] || [];
    const excludeKeys = excludeKeysObj[parentKey] || [];

    // fill final result
    keys.forEach((key) => {
        const value = obj[key];
        const keysWithParent = getParentKeys(parentKeys, key, isArray);

        if (shouldBeIncluded(includeKeys, excludeKeys, keysWithParent)) {
            const clonedValue = applyIncludeExclude(value, include, exclude, keysWithParent, includeKeysObj, excludeKeysObj);
            if (!isEmpty(clonedValue)) {
                if (isArray) {
                    res.push(clonedValue);
                } else {
                    res[key] = clonedValue;
                }
            }
        }
    });

    return res;
}

function cloneObject(
    obj,
    include = [],
    exclude = [],
) {
    const includeKeysObj = {};
    const excludeKeysObj = {};
    updateIncludeExcludeKeys(obj, include, exclude, [], includeKeysObj, excludeKeysObj);

    // console.log('includeKeysObj');
    // logObj(includeKeysObj);
    // console.log('excludeKeysObj');
    // logObj(excludeKeysObj);

    const res = applyIncludeExclude(obj, include, exclude, [], includeKeysObj, excludeKeysObj);

    return res;
}

module.exports = {
    cloneObject,
};