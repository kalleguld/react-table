import { Prop } from "@kalleguld/react-props";
import React from "react";
import type { Column } from "./Column";
import { SortState } from "./SortState";

export interface Props<T> extends React.TableHTMLAttributes<HTMLTableElement> {
    cols: Column<T>[];
    rows: T[];
    rowKey?: (t: T) => string|number;
    sortState?: Prop<SortState|undefined>;
}