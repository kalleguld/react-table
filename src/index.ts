import { Props as TableProps } from './Props';
import { Column as TableColumn } from './Column';
import { Table as _Table } from './Table';


export module Table {
    export type Props<T> = TableProps<T>;
    export type Column<T> = TableColumn<T>;
}


export const Table = _Table;