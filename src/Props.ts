import React from "react";
import type { Column } from "./Column";

export interface Props<T> extends React.TableHTMLAttributes<HTMLTableElement> {
    cols: Column<T>[];
    rows: T[];
    rowKey?: (t: T) => string|number;
}