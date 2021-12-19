import { Prop } from "@kalleguld/react-props";
import React from "react";
import type { Column, ColumnKey } from "./Column";
import { SortState } from "./SortState";

export interface Props<T> extends React.TableHTMLAttributes<HTMLTableElement> {
    /** The columns defining the table. */
    cols: Column<T>[];

    /** The rows in the table. */
    rows: T[];

    /** A function specifying the key for a row. If not defined,
     *  the row index is used for the key. 
     * @param t The row.
     * @param index The index of the row, before sorting.
     * @param sortedIndex The index of the row, after sorting.
     * */
    rowKey?: (t: T, index: number, sortedIndex: number) => string|number;

    /** The current sort state for the table. 
     * If not defined, the state is kept internally. */
    sortState?: Prop<SortState|undefined>;

    visibleColumns?: ColumnKey[];
}