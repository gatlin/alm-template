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

    /* hunt down any doubles and fill in the spaces around them */
    private solve_doubles() {

        /*
          Assumption: grid is in a state where
          - no more than two of the same color are in a row
          - ... other preconditions to follow ?
         */
        // first: look for horizontal doubles
        for (let j = 0; j < this.size; j++) {
            for (let i = 0; i < (this.size - 1); i++) {
                const kernel = [this.at(i, j), this.at(i + 1, j)];

                if (kernel[0] !== 2 && (kernel[0] === kernel[1])) {
                    const k0 = kernel[0];
                    if ((i > 0 && this.at(i - 1, j) === k0) ||
                        (i < (this.size - 1) && this.at(i + 2, j) === k0)) {
                        continue;
                    }

                    if (i > 0 && this.at(i - 1, j) === 2) {
                        this.set(i - 1, j, (k0 + 1) % 2);
                    }
                    if (i < (this.size - 1) && this.at(i + 2, j) === 2) {
                        this.set(i + 2, j, (k0 + 1) % 2);
                    }

                }
            }
        }

        // now vertical doubles
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < (this.size - 1); j++) {
                const kernel = [this.at(i, j), this.at(i, j + 1)];
                if (kernel[0] !== 2 && (kernel[0] === kernel[1])) {
                    const k0 = kernel[0];
                    if ((j > 0 && this.at(i, j - 1) === k0) ||
                        (j < (this.size - 1) && this.at(i, j + 2) === k0)) {
                        continue;
                    }
                    if (j > 0 && this.at(i, j - 1) === 2) {
                        this.set(i, j - 1, (k0 + 1) % 2);
                    }

                    if (j < (this.size - 1) && this.at(i, j + 2) === 2) {
                        this.set(i, j + 2, (k0 + 1) % 2);
                    }
                }
            }
        }
    }

    // for each row see if there is only one choice left for remaining spaces
    private solve_rows() {
        const max_num = this.size / 2;
        for (let j = 0; j < this.size; j++) {
            const totals = [0, 0];
            for (let i = 0; i < this.size; i++) {
                const n = this.at(i, j);
                if (n !== 2) {
                    totals[n] += 1;
                }
            }

            let color_to_fill;
            if (totals[0] === max_num) {
                color_to_fill = 1;
            } else if (totals[1] === max_num) {
                color_to_fill = 0;
            } else {
                continue;
            }

            this.dirty = true;
            for (let i = 0; i < this.size; i++) {
                if (this.at(i, j) === 2) {
                    this.set(i, j, color_to_fill);
                }
            }
        }
    }

    // for each column see if there is only one choice left for remaining spaces
    private solve_cols() {
        const max_num = this.size / 2;
        for (let i = 0; i < this.size; i++) {
            const totals = [0, 0];
            for (let j = 0; j < this.size; j++) {
                const n = this.at(i, j);
                if (n !== 2) {
                    totals[n] += 1;
                }
            }

            let color_to_fill;
            if (totals[0] === max_num) {
                color_to_fill = 1;
            } else if (totals[1] === max_num) {
                color_to_fill = 0;
            } else {
                continue;
            }

            for (let j = 0; j < this.size; j++) {
                if (this.at(i, j) === 2) {
                    this.set(i, j, color_to_fill);
                }
            }
        }
    }

    // find the pattern X_X, where X is a color, and fill with Y
    private solve_row_gaps() {
        for (let j = 0; j < this.size; j++) {
            for (let i = 1; i < (this.size - 1); i++) {
                const krnl = [this.at(i - 1, j),
                this.at(i, j),
                this.at(i + 1, j)];
                // take care not to create a horizontal three

                if ((krnl[0] === krnl[2]) &&
                    (krnl[1] === 2) &&
                    (krnl[0] !== 2)) {
                    this.set(i, j, (krnl[0] + 1) % 2);
                }
            }
        }
    }

    private solve_col_gaps() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 1; j < (this.size - 1); j++) {
                const krnl = [this.at(i, j - 1),
                this.at(i, j),
                this.at(i, j + 1)];
                if ((krnl[0] === krnl[2]) &&
                    (krnl[1] === 2) &&
                    (krnl[0] !== 2)) {
                    this.set(i, j, (krnl[0] + 1) % 2);
                }
            }
        }
    }

    private solve_row_dupe() {

        const finished_rows = [];
        const unfinished_rows = [];

        // extract each column
        for (let j = 0; j < this.size; j++) {
            const row = new Array(this.size);

            // we only care about columns that have two to go
            let num_left = 0;
            for (let i = 0; i < this.size; i++) {
                const val = this.at(i, j);
                if (val === 2) {
                    num_left++;
                }
                row[i] = val;
            }
            if (num_left === 0) {
                finished_rows.push({ idx: j, row: row });
            } else if (num_left === 2) {
                unfinished_rows.push({ idx: j, row: row });
            } else {
                continue;
            }
        }

        // for each unfinished column, find a finished one it's close to
        for (let urow of unfinished_rows) {
            for (let frow of finished_rows) {
                let diff = array_diff(urow.row, frow.row);
                if (diff === 2) {
                    for (let i = 0; i < this.size; i++) {
                        const val = urow.row[i];
                        if (val === 2) {
                            this.set(i,
                                urow.idx,
                                (frow.row[i] + 1) % 2);
                        }
                    }
                }
            }
        }
    }

    private solve_col_dupe() {

        const finished_cols = [];
        const unfinished_cols = [];

        // extract each column
        for (let i = 0; i < this.size; i++) {
            const col = new Array(this.size);

            // we only care about columns that have two to go
            let num_left = 0;
            for (let j = 0; j < this.size; j++) {
                const val = this.at(i, j);
                if (val === 2) {
                    num_left++;
                }
                col[j] = val;
            }
            if (num_left === 0) {
                finished_cols.push({ idx: i, col: col });
            } else if (num_left === 2) {
                unfinished_cols.push({ idx: i, col: col });
            } else {
                continue;
            }
        }

        // for each unfinished column, find a finished one it's close to
        for (let ucol of unfinished_cols) {
            for (let fcol of finished_cols) {
                let diff = array_diff(ucol.col, fcol.col);
                if (diff === 2) {
                    for (let j = 0; j < this.size; j++) {
                        const val = ucol.col[j];
                        if (val === 2) {
                            this.set(ucol.idx,
                                j,
                                (fcol.col[j] + 1) % 2);
                        }
                    }
                }
            }
        }
    }

    private completed(): boolean {
        return this.data.reduce((res, v) => res && (v !== 2), true);
    }

    public solve() {
        let limit = 0;
        while ((!this.completed()) && limit++ < 100) {
            this.solve_rows();
            this.solve_cols();
            this.solve_row_gaps();
            this.solve_col_gaps();
            this.solve_doubles();
            this.solve_row_dupe();
            this.solve_col_dupe();
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
