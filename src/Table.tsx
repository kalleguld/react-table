import React, { useMemo } from "react";
import { Prop, useProp } from '@kalleguld/react-props';
import type { Column } from "./Column";
import type { Props } from "./Props";
import type { SortState } from "./SortState";

interface RowWithIndex<T>{
    value:T;
    idx:number;
    sidx: number;
}
type RowKeyFunc<T> = (row: RowWithIndex<T>) => string|number;
type RowClickFunc<T> = Props<T>['onRowClick'];
type RowClassFunc<T> = Props<T>['rowClass'];

export function Table<T>(props: Props<T>) {

    const {
        cols,
        rows,
        visibleColumns,
        onRowClick,
        rowClass,
        rowKey,
        ...rest
    } = props;

    const actualRowKey = ((rowKey)
        ? ((row: RowWithIndex<T>) => rowKey!(row.value, row.idx, row.sidx)) 
        : ((row: RowWithIndex<T>) => row.idx));

    const internalSortState = useProp<SortState>();
    const sortState = props.sortState ?? internalSortState;

    //number rows, so we have their original index before sorting
    const numberedRows: RowWithIndex<T>[] = useMemo(() => {
        return rows.map((row, idx) => ({value: row, idx, sidx: idx}));
    },[rows]);

    const sortedRows = useMemo(() => {
        if (!sortState.value){
            return numberedRows;
        }
        let col = cols.find(c => c.key === sortState.value?.colKey);
        let sorter = col?.sorter;
        if (!sorter){
            return numberedRows;
        }
        const actualSorter = sortState.value.reverse
            ? (a:T,b:T) => -sorter!(a,b)
            : sorter;
        
        const result = [...numberedRows];
        result.sort((a, b) => actualSorter(a.value, b.value));

        const numberedResult = result.map((r, sidx) => ({...r, sidx}));
        return numberedResult;
        
    }, [cols, numberedRows, sortState.value]);

    const visibleCols = useMemo(() => {
        if (!visibleColumns)
            return cols;
        return visibleColumns
            .map(key => cols.find(col => col.key === key))
            .filter(col => !!col) as Column<T>[];
    }, [cols, visibleColumns]);

    return (
        <table {...rest}>
            
            <Cols cols={visibleCols} />

            <Headers cols={visibleCols} sortState={sortState} />

            <Rows cols={visibleCols} 
                sortedRows={sortedRows} 
                rowKey={actualRowKey} 
                onRowClick={onRowClick} 
                rowClass={rowClass}
            />

            <Footers cols={visibleCols} />

        </table>
    );
}
function Cols<T>(props: {cols: Column<T>[]}) {
    return (
        <colgroup>
            {props.cols.map((c, idx) => <Col 
                col={c} 
                key={`${c.key}_${idx}`} 
            />)}
        </colgroup>
    )
}

function Col<T>(props:{col: Column<T>}) {
    return (<col className={props.col.className} />);
}

function Headers<T>(props: {cols: Column<T>[], sortState: Prop<SortState|undefined>}) {
    if (!props.cols.some(col => col.header))
        return null; //don't do a header row if there are no headers

    return (
        <thead>
            <tr>
                {props.cols.map((col, idx) => 
                    <Header col={col} 
                        sortState={props.sortState}
                        key={`${col.key}_${idx}`}
                    />
                )}
            </tr>
        </thead>
    )
}

function Header<T>(props: {
    col: Column<T>, 
    sortState: Prop<SortState|undefined>
}){
    const {
        col,
        sortState
    } = props;
    const classes: string[] = [];
    if (col.className){
        classes.push(col.className);
    }
    if (col.sorter){
        classes.push('sortable');
    }
    if (col.key === sortState.value?.colKey){
        classes.push('sorted');
        if (sortState.value?.reverse){
            classes.push('sorted-reverse');
        }
    }
    return (
        <th className={classes.join(' ')} 
            onClick={sortBy(col, sortState)}
            scope="col"
        >
            {col.header}
        </th>
    )
}

function sortBy<T>(
    col: Column<T>, 
    sortState: Prop<SortState | undefined>
): React.MouseEventHandler<HTMLTableCellElement> | undefined {
    if (!col.sorter)
    return;

    return (evt) => {
        evt.stopPropagation();
        const reverse = (col.key === sortState.value?.colKey 
            && !sortState.value?.reverse);
        sortState.set({
            colKey: col.key,
            reverse: reverse,
        });
    }
}

function Rows<T>(props: {
    cols: Column<T>[], 
    sortedRows: RowWithIndex<T>[], 
    rowKey: RowKeyFunc<T>,
    onRowClick?: RowClickFunc<T>,
    rowClass: RowClassFunc<T>
}) {
    return (
        <tbody>
            {props.sortedRows.map(r => 
                <Row cols={props.cols} 
                    row={r} 
                    key={props.rowKey(r)} 
                    rowClass={props.rowClass}
                    onRowClick={props.onRowClick} 
                />
            )}
        </tbody>
    );
}



function Row<T>(props: {
    cols: Column<T>[], 
    row: RowWithIndex<T>,
    onRowClick?: RowClickFunc<T>,
    rowClass: RowClassFunc<T>
}) {
    const {
        cols,
        row,
        onRowClick,
        rowClass,
    } = props;
    
    const classes: string[] = [];
    if (onRowClick)
        classes.push('clickable');
    const customClass = rowClass?.(row.value, row.idx, row.sidx);
    if (customClass)
        classes.push(customClass);
    
    return (
        <tr onClick={evt => onRowClick?.(row.value, row.idx, row.sidx, evt)}
            className={classes.join(' ')}
        >
            {cols.map((col, idx) => 
                <Cell col={col} 
                    row={row}
                    key={`${col.key}_${idx}`} 
                />
            )}
        </tr>
    );
}

function Cell<T>(props: {
    col: Column<T>, 
    row: RowWithIndex<T>
}) {
    const {col, row} = props;
    return (
        <td className={col.className}>
            {col.content(row.value, row.idx, row.sidx)}
        </td>
    );
}

function Footers<T>(props:{ 
    cols: Column<T>[]
}) {
    if (!props.cols.some(col => col.footer))
        return null;
    return (
        <tfoot>
            <tr>
                {props.cols.map((col, idx) => (
                    <td key={`${col.key}_${idx}`} 
                        className={col.className}>
                        {col.footer}
                    </td>
                ))}
            </tr>
        </tfoot>
    );
}

