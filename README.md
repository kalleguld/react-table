# react-table

A  `<table />` for React

## Main features:

* Define a table from rows and columns.
* Supports optional headers and footers for columns.
* Supports sorting by column, and even multiple columns.
* Sane, optional css styling.
* Typescript definitions.

## Example

```typescript

import React from 'react';
import { Table } from '@kalleguld/react-table';
import '@kalleguld/react-table/dist/table.css'; //optional

interface Person {
    name:string;
    subs:number;
    topic:string;
}
export function PersonTable() {

    const persons: Person[] = [
        {name: 'Tom Scott', subs:4780000, topic:'Infrastructure'},
        {name: 'James Hoffmann', subs:1090000, topic:'Coffee'},
        {name: 'RMTransit', subs:69000, topic:'Transit'}
    ];
    const formatNumber = new Intl.NumberFormat().format;
    const columns: Table.Column<Person>[] = [
        { key:'name', 
            header: 'Name', 
            content: p => p.name, 
            sorter: Table.SortBy.string(p => p.name),
        },
        { key: 'subs', 
            header: 'Topic', 
            content: p => formatNumber( p.subs), 
            sorter: Table.SortBy.number(p => p.subs),
            footer: formatNumber(persons
                .map(p => p.subs)
                .reduce((total,subs) => total+subs, 0)
            ),
        },
        { key: 'topic', 
            header: 'Topic',
            content: p => p.topic 
        }
    ];

    return <Table rows={persons} cols={columns} className='table' />;
}

```