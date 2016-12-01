import { el, App } from './alm/alm';

/* Convert an array of ones and zeros into an integer */
function bits2int(bitArray: Array<number>) {
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

function sum_bits(bitArray: Array<number>) {
    return bitArray.reduce((total, n) => total + n, 0);
}

function random_Bit() {
    return Math.floor(Math.random() * 2);
}

class Grid {
    private rows: number;
    private cols: number;
    private data: Array<number>;

    constructor(size: number) {
        this.rows = size;
        this.cols = size;
        this.data = new Array<number>(size * size);
    }

    public at(x: number, y: number) {
        return this.data[x * this.cols + y];
    }

    public set(x: number, y: number, v: number) {
        this.data[x * this.cols + y] = v;
        return this;
    }

    public toggle(x: number, y: number) {
        return this.set(x, y, (this.at(x, y) + 1) % 3);
    }

    public initialize() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.set(i, j, 2);
            }
        }
        return this;
    }

    public verify() {
        const len = this.rows; // it's a square, dummy!
        const rowsSeen = {};
        const colsSeen = {};

        const colSet = new Array(this.cols);
        for (let i = 0; i < this.cols; i++) {
            colSet[i] = new Array(this.rows);
        }

        for (let i = 0; i < this.rows; i++) {
            let row = [];
            for (let j = 0; j < this.cols; j++) {
                const val = this.at(i, j);
                if (val === 2) {
                    return false;
                }
                row.push(val);
                // build up the columns as well
                colSet[j][i] = val;
            }
            if (sum_bits(row) !== (len / 2)) {
                return false;
            }
            const rowNum = bits2int(row);
            if (rowNum in rowsSeen) {
                return false;
            } else {
                rowsSeen[rowNum] = 1;
            }
        }

        // now study the columns
        for (let c = 0; c < this.cols; c++) {
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

    public solve() {
        return [];
    }

    public render() {
        const tblRows = new Array(this.rows);
        let count = 0;
        for (let i = 0; i < this.rows; i++) {
            const tblRow = [];
            for (let j = 0; j < this.cols; j++) {
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
            tblRows[i] = el('tr', {
                'class': 'grid-row',
                'id': 'grid-row-' + i.toString()
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

const app = new App<Grid>({
    state: new Grid(4).initialize(),
    update: (action, grid) => {
        if (action['type'] === 'click') {
            const coords = action.data;
            grid = grid.toggle(coords[0], coords[1]);
        }

        if (action['type'] === 'solve') {
            ;
        }

        return grid;
    },
    main: scope => {
        scope.events.click
            .filter(evt => evt.hasClass('grid-cell'))
            .recv(evt => {
                const coordStr = evt.getId().split('-')[2];
                const coords = coordStr.split(':').map(x => parseInt(x));
                scope.actions.send({
                    'type': 'click',
                    'data': coords
                });
            });

        scope.events.click
            .filter(evt => evt.getId() === 'solve-btn')
            .recv(evt => {
                scope.actions.send({
                    'type': 'solve'
                });
            });
    },
    render: (grid) => grid.render(),
    eventRoot: 'app',
    domRoot: 'app'
}).start();
