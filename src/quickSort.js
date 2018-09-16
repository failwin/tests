function arraySwap(array, indexA, indexB) {
    const temp = array[indexA];
    array[indexA] = array[indexB];
    array[indexB] = temp;
}

function partition(array, partitionSliceStart, partitionSliceEnd, valueComparator) {
    // Partition a sub-array for e.g. a quicksort
    //
    // We start processing from the leftmost element (I), and use the rightmost as the pivot (P). We also track the item to
    // the left of the pivot (L), such that we end up with
    // I . . . L P
    // We then compare I with P. If I is less than P, we leave it where is and increment the processing index, so that we have
    // < I . . L P
    // (where ' // Then, if I is larger than P, we swap the positions such that
    // < L . . P I
    // We then continue processing from L,
    // < I . . P >
    // ... and continue until we end up with all lower elements on the left, all greater than / equal elements on the right
    // < < < P > >
    // Doing it this way means we can partition our array in-place, which makes things a lot more performant.
    var pIndex = partitionSliceEnd;
    var iIndex = partitionSliceStart;
    var lIndex = pIndex - 1;
    var pValue = array[pIndex];
    var iValue = array[iIndex];
    while (iIndex < pIndex) {
        if (valueComparator(iValue, pValue) === -1) {
            // If I < P, leave I where it is and move the I index further right
            iIndex++;
        } else {
            // If I >= P, move I to the right of P, and put L in I's original place.
            // We swap I and L, then L and P. We don't increment I's index; we process L next instead.
            arraySwap(array, iIndex, lIndex);
            arraySwap(array, lIndex, pIndex);
            pIndex--;
            lIndex--;
        }
        // Update values based on changed indices
        iValue = array[iIndex];
        pValue = array[pIndex];
    }
    return pIndex; // return the pivot point so we can recursively process the left and right hand sides
}

function nonBlockingQuicksortOperation(array, subArrayStart, subArrayEnd, valueComparator, onElementLocationFinalized) {
    var sortedAreaLength = (subArrayEnd - subArrayStart) + 1;
    if (sortedAreaLength > 1) {
        var pivotLocation = partition(array, subArrayStart, subArrayEnd, valueComparator);
        // Process elements to the left of the pivot
        var lowPartitionEnd = pivotLocation - 1;
        setImmediate(function(){
            nonBlockingQuicksortOperation(array, subArrayStart, lowPartitionEnd, valueComparator, onElementLocationFinalized);
        });
        // Process elements to the right of the pivot
        var highPartitionStart = pivotLocation + 1;
        setImmediate(function(){
            nonBlockingQuicksortOperation(array, highPartitionStart, subArrayEnd, valueComparator, onElementLocationFinalized);
        });
        // The pivot's location is finalized, so we can trigger the event
        onElementLocationFinalized();
    } else if (sortedAreaLength === 1) {
        // Only one item, so we skip the partition and just trigger the event
        onElementLocationFinalized();
    }
}

function nonBlockingQuicksort(array, valueComparator, onFinishCallback) {
    var finalizations = 0;
    var arrayEnd = array.length - 1;
    nonBlockingQuicksortOperation(array, 0, arrayEnd, valueComparator, onElementLocationFinalized);
    function onElementLocationFinalized() {
        finalizations++;
        if (finalizations === array.length) {
            onFinishCallback();
            console.log('iterations', finalizations);
        }
    }
}


function valueComparator(a, b) {
    if (a === b) {
        return 0;
    }
    if (a > b) {
        return 1;
    }
    return -1;
}

function quickSort(array) {
    return new Promise((resolve) => {
        nonBlockingQuicksort(array, valueComparator, () => {
            resolve(array);
        });
    });
}

module.exports = quickSort;