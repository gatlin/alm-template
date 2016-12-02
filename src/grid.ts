import { el } from './alm/alm';
import { bits2int, sum_bits, random_bit, array_diff } from './util';

export class Grid {
    private size: number;
    private data: Array<number>;
    private dirty: boolean = false;

    constructor(size: number) {
        this.size = size;
        this.data = new Array<number>(size * size);
    }

    public at(x: number, y: number) {
        return this.data[y * this.size + x];
    }

    public set(x: number, y: number, v: number) {
        this.data[y * this.size + x] = v;
        return this;
    }

    public toggle(x: number, y: number) {
        return this.set(x, y, (this.at(x, y) + 1) % 3);
    }

    public initialize() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.set(i, j, 2);
            }
        }
        return this;
    }

    public verify() {
        if (!this.completed()) {
            return false;
        }

        const len = this.size; // it's a square, dummy!
        const rowsSeen = {};
        const colsSeen = {};

        const colSet = new Array(this.size);
        for (let i = 0; i < this.size; i++) {
            colSet[i] = new Array(this.size);
        }

        for (let j = 0; j < this.size; j++) {
            let row = [];
            for (let i = 0; i < this.size; i++) {
                const val = this.at(i, j);
                if (val === 2) {
                    return false;
                }
                row.push(val);
                // build up the columns as well
                colSet[i][j] = val;
            }

            const rowNum = bits2int(row);
            if (rowNum in rowsSeen) {
                return false;
            } else {
                rowsSeen[rowNum] = 1;
            }
            if (sum_bits(row) !== (len / 2)) {
                return false;
            }
        }

        // now study the columns
        for (let c = 0; c < this.size; c++) {
            const col = colSet[c];
            const colNum = bits2int(col);
            if (colNum in colsSeen) {
                return false;
            } else {
                colsSeen[colNum] = 1;
            }
            if (sum_bits(col) !== (len / 2)) {
                return false;
            }
        }
        return true;
    }

    private completed(): boolean {
        return this.data.reduce((res, v) => res && (v !== 2), true);
    }

    private left_bounded_cell(idx: number): boolean {
        return (idx % this.size) === 0;
    }

    private right_bounded_cell(idx: number): boolean {
        return (idx % this.size) === (this.size - 1);
    }

    private top_bounded_cell(idx: number): boolean {
        return idx < this.size;
    }

    private bottom_bounded_cell(idx: number): boolean {
        return idx > (this.size * (this.size - 1));
    }

    public solve_pass() {
        const size = this.size;
        const s1 = this.size; // for brevity
        const s2 = this.size * 2;
        for (let idx = 0; idx < (size * size); idx++) {
            if (this.data[idx] === 2) {
                continue;
            }

            // look for horizontal doubles
            if (!this.right_bounded_cell(idx) &&
                this.data[idx] === this.data[idx + 1] &&
                (this.right_bounded_cell(idx + 1) ||
                    this.data[idx + 2] !== this.data[idx]) &&
                (this.left_bounded_cell(idx) ||
                    this.data[idx - 1] !== this.data[idx])) {

                if (!this.left_bounded_cell(idx) &&
                    this.data[idx - 1] === 2) {
                    this.data[idx - 1] = (this.data[idx] + 1) % 2;
                }

                if (!this.right_bounded_cell(idx + 1) &&
                    this.data[idx + 2] === 2) {
                    this.data[idx + 2] = (this.data[idx] + 1) % 2;
                }
            }

            // look for vertical doubles
            if (!this.bottom_bounded_cell(idx) &&
                this.data[idx] === this.data[idx + s1] &&
                (this.bottom_bounded_cell(idx + s1) ||
                    this.data[idx + s2] !== this.data[idx]) &&
                (this.top_bounded_cell(idx) ||
                    this.data[idx - s1] !== this.data[idx])) {

                if (!this.top_bounded_cell(idx) &&
                    this.data[idx - s1] === 2) {
                    this.data[idx - s1] =
                        (this.data[idx] + 1) % 2;
                }

                if (!this.bottom_bounded_cell(idx + s1) &&
                    this.data[idx + s2] === 2) {
                    this.data[idx + s2] = (this.data[idx] + 1) % 2;
                }
            }

            // look for horizontal gaps
            if (!this.right_bounded_cell(idx) &&
                !this.right_bounded_cell(idx + 1) &&
                this.data[idx] === this.data[idx + 2] &&
                this.data[idx + 1] === 2) {
                this.data[idx + 1] = (this.data[idx] + 1) % 2;
            }

            // look for vertical gaps
            if (!this.bottom_bounded_cell(idx) &&
                !this.bottom_bounded_cell(idx + s1) &&
                this.data[idx] === this.data[idx + s2] &&
                this.data[idx + s1] === 2) {
                this.data[idx + s1] = (this.data[idx] + 1) % 2;
            }
        }
    }

    public solve() {
        let limit = 0;
        while (limit++ < 100 && !this.completed()) {
            this.solve_pass();
        }
    }

    public render() {
        const tblRows = new Array(this.size);
        let count = 0;
        for (let j = 0; j < this.size; j++) {
            const tblRow = [];
            for (let i = 0; i < this.size; i++) {
                //const val = (i + j) % 2;
                const val = this.at(i, j);
                const td = el('td', {
                    'class': 'grid-cell-td',
                    'id': 'grid-cell-td-' + count.toString()
                }, [el('span', {
                    'class': 'grid-cell grid-cell-' + val.toString(),
                    'id': 'grid-cell-' + i.toString() + ':' + j.toString()
                }, [''])]);

                tblRow.push(td);
                count++;
            }
            tblRows[j] = el('tr', {
                'class': 'grid-row',
                'id': 'grid-row-' + j.toString()
            }, tblRow);
        }

        const gridTable = el('table', {
            'class': 'grid-table'
        }, tblRows);

        return el('div', {}, [
            gridTable,
            el('div', {
                'id': 'grid-status'
            }, [(this.verify() ? 'Correct' : 'Incorrect')]),
            el('button', {
                'id': 'solve-btn'
            }, ['Solve'])
        ]);
    }
}
