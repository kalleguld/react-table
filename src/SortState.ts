import type {Column} from './Column'

export interface SortState{
    sorters: {
        /** The {@link Column.key} to sort by. */
        colKey: number|string;
        /** Sort A-Z or Z-A  */
        reverse: boolean;
    }[];
}