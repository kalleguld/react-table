import type {Column} from './Column'

export interface SortState{
    /** The {@link Column.key} to sort by. */
    colKey: number|string;
    /** Sort A-Z or Z-A  */
    reverse: boolean;
}