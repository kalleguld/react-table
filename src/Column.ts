import React from "react";
import { Sorter } from "./Sorter";

export interface ColumnDescription {
    /** The column key. Should be unique across a table. */
    key: number|string;

    /** Table header for the column. */
    header?: React.ReactNode;

}

export type ColumnKey = number|string;

export interface Column<T> extends ColumnDescription {
    /** className for the cells in this column. Applied to <col>, <th> and <td> */
    className?: string;

    /** The column key. Should be unique across a table. */
    key: ColumnKey;

    /** Provides content for a cell.
     * @param t The row.
     * @param index The index of the row, before sorting.
     * @param sortedIndex The index of the row, after sorting. */
    content: (t: T, index: number, sortedIndex: number) => React.ReactNode,

    /** Table header for the column */
    header?: React.ReactNode;

    /** Table footer for the column */
    footer?: React.ReactNode;

    /** sorting function for the column - similar to the function 
     * parameter taken by Array.sort() */
    sorter?: Sorter<T>;

}