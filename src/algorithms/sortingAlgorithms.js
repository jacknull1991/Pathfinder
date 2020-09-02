//============= Merge Sort ========================
export const mergeSort = array => {
    const animations = [];
    if (array.length <= 1) return animations;
    const copy = array.slice();
    mergeSortHelper(array, 0, array.length - 1, copy, animations);
    return animations;
}

function mergeSortHelper(array, lo, hi, copy, animations) {
    if (lo === hi) return;
    const mid = Math.floor((lo + hi) / 2);
    mergeSortHelper(copy, lo, mid, array, animations);
    mergeSortHelper(copy, mid + 1, hi, array, animations);
    doMerge(array, lo, mid, hi, copy, animations);
}

// use a copy of the original array to do in-place swapping
// and add to animations
function doMerge(array, lo, mid, hi, copy, animations) {
    let k = lo, i = lo, j = mid + 1;
    while (i <= mid && j <= hi) {
        // Current indices we're comparing; add to animation to change their color
        animations.push([i, j]);
        // add to animations to revert their color
        animations.push([i, j]); 

        if (copy[i] <= copy[j]) {
            // overwrite the value at index k in the original array with the value at 
            // index i in the copy array so we don't mess up the two parts
            animations.push([k, copy[i]]);
            array[k++] = copy[i++];
        } else {
            // same as above
            animations.push([k, copy[j]]);
            array[k++] = copy[j++];
        }
    }

    while (i <= mid) {
        // push twice to change color and revert back
        animations.push([i, i]);
        animations.push([i, i]);
        animations.push([k, copy[i]]);
        array[k++] = copy[i++];
    }
    while (j <= hi) {
        // same as above
        animations.push([j, j]);
        animations.push([j, j]);
        animations.push([k, copy[j]]);
        array[k++] = copy[j++];
    }

}


//============= Quick Sort ========================
export const quickSort = array => {
    const animations = [];
    if (array.length <= 1) return animations;
    quickSortHelper(array, 0, array.length - 1, animations);
    // return array;
    return animations;
}

// not optimized for random pivoting
function quickSortHelper(array, lo, hi, animations) {
    if (lo >= hi) return;
    // partition
    const pivot = quickSortPartition(array, lo, hi, animations);
    // sort recursively
    quickSortHelper(array, lo, pivot - 1, animations);
    quickSortHelper(array, pivot + 1, hi, animations);
}

function quickSortPartition(array, lo, hi, animations) {
    const animation = [];
    let pivot = array[hi];
    let i = lo;
    // mark pivot for this iteration
    animation.push([hi, hi, array[hi], array[hi]]);

    for (let j = lo; j < hi; j++) {
        animation.push([i, j, array[i], array[j]]);
        if (array[j] < pivot) {
            animation.push([i, j, array[i], array[j]]);
            arraySwap(array, i, j);
            i++;
        } else {
            animation.push([i, j, -1, -1]);
        }
    }
    // swap pivot to correct position
    animation.push([i, hi, array[i], array[hi]]);
    arraySwap(array, i, hi);
    animations.push(animation);
    return i;
}

//============= Heap Sort =========================
export const heapSort = array => {
    const animations = [];
    if (array.length <= 1) return animations;
    heapSortHelper(array, animations);
    return animations;
}

function heapSortHelper(array, animations) {
    let len = array.length;

    // Build heap (rearrange array)
    heapify(array, animations);

    let end = len - 1;
    while (end > 0) {
        // first for visualizing comparison 
        animations.push([end, 0, -1, -1]);
        // second for visualizing swapping
        animations.push([end, 0, array[end], array[0]]);
        arraySwap(array, end, 0);
        end--;
        swapDown(array, 0, end, animations);
    }
}

// parent(i) = (i-1)/2
// leftChild(i) = i*2 + 1
// rightChild(i) = i*2 + 2
function heapify(array, animations) {
    let len = array.length;
    let start = Math.floor(len / 2 - 1); // crucial using floor function

    while (start >= 0) {
        // swap down the node at start s.t. all nodes below the start index are in heap order
        swapDown(array, start, len - 1, animations);
        start--;
    }
}

function swapDown(array, start, end, animations) {
    let root = start;

    // while the root has atleast 1 child
    while (root * 2 + 1 <= end) {
        let child = root * 2 + 1;
        let swap = root; // keep track of which node to swap with

        if (array[swap] < array[child]) {
            swap = child;
        }
        // if there is a right child and it is greater than whatever is to be swapped
        if (child + 1 <= end && array[swap] < array[child + 1]) {
            swap = child + 1;
        }
        if (swap === root) {
            return; // no swap needed
        } else {
            animations.push([root, swap, -1, -1]);
            animations.push([root, swap, array[root], array[swap]]);
            arraySwap(array, root, swap, animations);
            root = swap;
        }
    }
}


//============= Bubble Sort =======================
export const bubbleSort = array => {
    const animations = [];
    if (array.length <= 1) return animations;
    bubbleSortHelper(array, animations);
    return animations;
}

// naive implementation
function bubbleSortHelper(array, animations) {
    let len = array.length;
    let swapped;
    do {
        swapped = false;
        for (let i = 1; i < len; i++) {
            animations.push([i - 1, i, array[i-1], array[i]]);
            if (array[i - 1] > array[i]) {
                animations.push([i - 1, i, array[i-1], array[i]]);
                arraySwap(array, i - 1, i);
                swapped = true;
            } else {
                // do-nothing animation
                animations.push([i - 1, i, -1, -1]);
            }
        }
        len = len - 1;
    } while (swapped)
}

//============ selection Sort =====================
export const selectionSort = array => {
    const animations = [];
    if (array.length <= 1) return animations;
    selectionSortHelper(array, 0, animations);
    return animations;
}

function selectionSortHelper(array, start, animations) {
    if (start >= array.length - 1) return;

    let min_idx = start;
    for (let i = start + 1; i < array.length; i++) {
        animations.push([min_idx, i, -1, -1]);
        animations.push([min_idx, i, -1, -1]);
        if (array[i] < array[min_idx]) {
            min_idx = i;
        }
    }
    animations.push([min_idx, start, -1, -1]);
    animations.push([min_idx, start, array[min_idx], array[start]]);
    arraySwap(array, start, min_idx);
    selectionSortHelper(array, start + 1, animations);
}

//============ cocktail Sort ======================
export const cocktailSort = array => {
    const animations = [];
    if (array.length <= 1) return animations;
    cocktailSortHelper(array, 0, array.length - 1, animations);
    return animations;
}

function cocktailSortHelper(array, start, end, animations) {
    if (start >= end) return;
    let swapped = false;
    // forward
    for (let i = start + 1; i <= end; i++) {
        animations.push([i - 1, i, array[i-1], array[i]]);
        if (array[i - 1] > array[i]) {
            animations.push([i - 1, i, array[i-1], array[i]]);
            arraySwap(array, i - 1, i);
            swapped = true;
        } else {
            animations.push([i - 1, i, -1, -1]);
        }
    }

    // backward
    for (let i = end - 2; i >= start; i--) {
        animations.push([i, i + 1, array[i], array[i + 1]]);
        if (array[i] > array[i + 1]) {
            animations.push([i, i + 1, array[i], array[i + 1]]);
            arraySwap(array, i, i + 1);
            swapped = true;
        } else {
            animations.push([i, i + 1, -1, -1]);
        }
    }

    if (swapped) {
        cocktailSortHelper(array, start + 1, end - 1, animations);
    }
}

//==============Common Helper Functions============
function arraySwap(array, idx1, idx2) {
    const tmp = array[idx1];
    array[idx1] = array[idx2];
    array[idx2] = tmp;
}