import type { Props as TableProps } from './Props';
import type { Column as TableColumn } from './Column';
import { Table as _Table } from './Table';
import { SortBy } from './sortBy';

export module Table {
    export type Props<T> = TableProps<T>;
    export type Column<T> = TableColumn<T>;
    
}

const _Table2 = Object.assign(_Table, {SortBy});

export const Table = _Table2;