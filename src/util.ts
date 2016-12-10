export function bits2int(bitArray: Array<number>): number {
    let num: number = 0;
    const mask: number = 1;
    for (let i = 0; i < bitArray.length; i++) {
        const digit = bitArray[i];
        num = num << 1;
        if (digit) {
            num = num | mask;
        }
    }
    return num;
}

export function sum_bits(bitArray: Array<number>): number {
    return bitArray.reduce((total, n) => total + n, 0);
}

export function random_bit(): number {
    return Math.floor(Math.random() * 2);
}

// compute an array of boolean values stating if two arrays have different
// values at the same indices. Eg, array_diff([1,2,3], [2,2,3]) => [1,0,0].
export function array_diff(a: Array<any>, b: Array<any>): number {
    if (a.length !== b.length) {
        return -1;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            result = result + 1;
        }
    }
    return result;
}
