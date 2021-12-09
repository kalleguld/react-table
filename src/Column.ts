import React from "react";
import { Sorter } from "./Sorter";

export interface Column<T>{
    className?: string;
    key: string;
    content: (t: T) => React.ReactNode,
    header?: React.ReactNode;
    footer?: React.ReactNode;
    sorter?: Sorter<T>;
}