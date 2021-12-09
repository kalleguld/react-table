import React from "react";
import { Column } from "./Column";

export interface Props<T> extends React.TableHTMLAttributes<HTMLTableElement> {
    cols: Column<T>[];
    rows: T[];
    rowKey: (t: T) => string|number;
}