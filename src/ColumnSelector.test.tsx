import React from 'react';
import { ColumnSelector } from './ColumnSelector';
import { fireEvent, render } from '@testing-library/react';
import { BasicProp } from '@kalleguld/react-props';
import { ColumnDescription } from './Column';

const columns: ColumnDescription[] = [
    { key: 'asd' },
    { key: 'wert' },
    { key: 'gynga', header: 'Pillow' }
]

test('renders', () => {
    const sk = new BasicProp([]);
    render(<ColumnSelector selectedKeys={sk} columns={columns} />);
});