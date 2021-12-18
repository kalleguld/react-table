import React from "react";
import { Sorter } from "./Sorter";

export interface Column<T>{
    /** className for the cells in this column. Applied to <col>, <th> and <td> */
    className?: string;

    /** The column key. Should be unique across a table. */
    key: number|string;

    /** Provides content for a cell, 
     * based on the rowdata and the original index of the row (before sorting). */
    content: (t: T, index: number) => React.ReactNode,

    /** Table header for the column */
    header?: React.ReactNode;

    /** Table footer for the column */
    footer?: React.ReactNode;

    /** sorting function for the column - similar to the function 
     * parameter taken by Array.sort() */
    sorter?: Sorter<T>;

}