import React, { useMemo } from "react";
import { Prop, useProp } from '@kalleguld/react-props';
import type { Column } from "./Column";
import type { Props } from "./Props";
import type { SortState } from "./SortState";

export function Table<T>(props: Props<T>){

    const {
        cols,
        rows,
        rowKey,
        ...rest
    } = props;

    const internalSortState = useProp<SortState>();
    const sortState = props.sortState ?? internalSortState;

    //number rows, so we have their original index before sorting
    const numberedRows = useMemo(() => {
        return rows.map((row, idx) => ({row, idx}));
    },[rows]);

    const sortedRows = useMemo(() => {
        if (!sortState.value){
            return numberedRows;
        }
        let sorter = cols[sortState.value.colIndex]?.sorter;
        if (!sorter){
            return numberedRows;
        }
        const actualSorter = sortState.value.reverse
            ? (a:T,b:T) => -sorter!(a,b)
            : sorter;
        
        const result = [...numberedRows];
        result.sort((a, b) => actualSorter(a.row, b.row));
        return result;
        
    }, [cols, numberedRows, sortState.value?.colIndex, sortState.value?.reverse]);

    return (
        <table {...rest}>
            
            {getCols(cols)}

            {getHeaders(cols, sortState)}

            {getRows(cols, sortedRows, rowKey)}

            {getFooters(cols)}

        </table>
    );
}
function getCols<T>(cols: Column<T>[]): React.ReactNode {
    return (
        <colgroup>
            {cols.map(getCol)}
        </colgroup>
    )
}

function getCol<T>(col: Column<T>): React.ReactNode{
    return (<col className={col.className} />);
}

function getHeaders<T>(cols: Column<T>[], sortState: Prop<SortState|undefined>){
    if (!cols.some(col => col.header))
        return; //don't do a header row if there are no headers

    return (
        <thead>
            <tr>
                {cols.map((col, idx) => getHeader(col, idx, sortState))}
            </tr>
        </thead>
    )
}

function getHeader<T>(col: Column<T>, idx: number, sortState: Prop<SortState|undefined>){
    const classes: string[] = [];
    if (col.className){
        classes.push(col.className);
    }
    if (col.sorter){
        classes.push('sortable');
    }
    if (idx === sortState.value?.colIndex){
        classes.push('sorted');
        if (sortState.value?.reverse){
            classes.push('sorted-reverse');
        }
    }
    return (
        <th className={classes.join(' ')} 
            onClick={sortBy(col, idx, sortState)}
            scope="col"
        >
            {col.header}
        </th>
    )
}

function sortBy<T>(col: Column<T>, idx: number, sortState: Prop<SortState | undefined>): React.MouseEventHandler<HTMLTableDataCellElement> | undefined {
    if (!col.sorter)
    return;

    return (evt) => {
        evt.stopPropagation();
        const reverse = (idx === sortState.value?.colIndex 
            && !sortState.value?.reverse);
        sortState.set({
            colIndex: idx,
            reverse: reverse,
        });
    }
}
function getRows<T>(
    cols: Column<T>[], 
    sortedRows: {row:T, idx:number}[], 
    rowKey?: (t: T) => string | number
): React.ReactNode {
    return (
        <tbody>
            {sortedRows.map(r => getRow(cols, r.row, rowKey ? rowKey(r.row) : r.idx))}
        </tbody>
    );
}



function getRow<T>(cols: Column<T>[], row: T, key: string|number): React.ReactNode{
    return (
        <tr key={key}>
            {cols.map(col => getCell(col, row))}
        </tr>
    );
}

function getCell<T>(col: Column<T>, row: T): any {
    if (col.isKey){
        return (
            <th key={col.key} scope="row">
                {col.content(row)}
            </th>
        );
    }
    return (
        <td key={col.key}>
            {col.content(row)}
        </td>
    );
}

function getFooters<T>(cols: Column<T>[]): React.ReactNode {
    if (!cols.some(col => col.footer))
        return;
    return (
        <tfoot>
            <tr>
                {cols.map(col => <td>{col.footer}</td>)}
            </tr>
        </tfoot>
    );
}

