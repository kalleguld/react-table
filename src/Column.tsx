import React from "react";

export interface Column<T>{
    className?: string;
    key: string;
    content: (t: T) => React.ReactNode,
    header?: React.ReactNode;
    footer?: React.ReactNode;
    sorter?: (a: T, b:T) => number;
}