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

test('non-selected columns are selectable', () => {
    const sk = new BasicProp([]);
    const r = render(<ColumnSelector selectedKeys={sk} columns={columns} />);

    expect(r.getByText('asd').parentElement).toHaveClass('selectable-columns');
    expect(r.getByText('wert').parentElement).toHaveClass('selectable-columns');
    expect(r.getByText('Pillow').parentElement).toHaveClass('selectable-columns');

});

test('selected columns are selected', () => {
    const sk = new BasicProp(['asd','wert']);
    const r = render(<ColumnSelector selectedKeys={sk} columns={columns} />);

    expect(r.getByText('asd').parentElement).toHaveClass('selected-columns');
    expect(r.getByText('wert').parentElement).toHaveClass('selected-columns');
    expect(r.getByText('Pillow').parentElement).toHaveClass('selectable-columns');
});

test('double-clicking a non-selected column selects it', () => {
    const sk = new BasicProp([]);
    const r = render(<ColumnSelector selectedKeys={sk} columns={columns} />);
    
    fireEvent.doubleClick(r.getByText('asd'));

    expect(sk.value).toEqual(['asd']);
});

test('double-clicking a selected column de-selects it', ()=> {
    const sk = new BasicProp(['asd']);
    const r = render(<ColumnSelector selectedKeys={sk} columns={columns} />);
    
    fireEvent.doubleClick(r.getByText('asd'));

    expect(sk.value).toEqual([]);
});

test('allowing duplicates works', () => {
    const sk = new BasicProp(['asd']);
    const r = render(<ColumnSelector selectedKeys={sk} 
        columns={columns} 
        allowDuplicates={true} />);

    expect(r.getAllByText('asd').length).toEqual(2);
    expect(r.getAllByText('wert').length).toEqual(1);
    
});

test('moving a column up works', () => {
    const sk = new BasicProp(['asd', 'wert', 'asd']);
    const r = render(<ColumnSelector selectedKeys={sk} 
        columns={columns} 
        allowDuplicates={true} />);

    fireEvent.click(r.getAllByText('asd')[2]); //select the second selected instance of asd
    fireEvent.click(r.getByText('↑'));
    
    expect(sk.value).toEqual(['asd', 'asd', 'wert']);
});

test('moving a column up works', () => {
    const sk = new BasicProp(['asd', 'wert', 'asd']);
    const r = render(<ColumnSelector selectedKeys={sk} 
        columns={columns} 
        allowDuplicates={true} />);

    fireEvent.click(r.getAllByText('asd')[1]); //select the first selected instance of asd
    fireEvent.click(r.getByText('↓'));
    
    expect(sk.value).toEqual(['wert', 'asd', 'asd']);
});