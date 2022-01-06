import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Column } from './Column';
import { Table } from './Table';
import { SortBy } from './sortBy';
import { useState } from 'react';

type TestType = {
    id:number;
    name:string;
    hobbies: string[];
    birthday: Date;
};

const divTestColumns : Column<TestType>[] = [
    {
        key: 'id',
        header: "ID",
        content: tt => <div data-testid={`cell-id-${tt.id}`} >{tt.id}</div> ,
        sorter: SortBy.number(tt => tt.id),

    },
    {
        key: 'name',
        header: 'Name',
        content: tt => <div data-testid={`cell-name-${tt.id}`} >{tt.name}</div> ,
        sorter: SortBy.string(tt => tt.name)
    },
    {
        key: 'hobbies',
        content: tt => <div data-testid={`cell-hobbies-${tt.id}`} >{tt.hobbies.join(', ')}</div> ,
        footer: 'HobbyFooter'
    },
    {
        key:'birthday',
        content: tt => tt.birthday.getUTCFullYear(),
        header: "Birthday",
        sorter: SortBy.Date(tt => tt.birthday),
    
    }
];

const testData: TestType[] = [
    {
        id:2,
        name:'Kasper',
        hobbies:[],
        birthday: new Date(Date.parse('1983-04-15T09:00:00Z'))
    },
    {
        id: 3,
        name: 'Jesper',
        hobbies:['programming'],
        birthday: new Date(Date.parse('1984-04-15T09:00:00Z'))
    },
    {
        id:1,
        name:'Jonathan',
        hobbies:['stealing', 'thieving', 'taking things'],
        birthday: new Date(Date.parse('1985-04-15T09:00:00Z'))
    }
];

test('displays headers', () => {
    const r = render(<Table rows={testData} cols={divTestColumns} />);

    expect(r.queryByText("nonExistingHeader")).toBeFalsy();
    expect(r.queryByText('ID', {exact:true})).toBeTruthy();
    expect(r.queryByText('Name', {exact:true})).toBeTruthy();
    expect(r.queryByText('hobbies')).toBeFalsy();
});
test('displays footers', () => {
    const r = render(<Table rows={testData} cols={divTestColumns} />);

    expect(r.queryByText("nonExistingFooter")).toBeFalsy();
    expect(r.queryByText("HobbyFooter")).toBeTruthy();
});

test("displays data", () => {
    const r = render(<Table rows={testData} cols={divTestColumns} />);

    expect(r.queryByText("Jesper")).toBeTruthy();
    expect(r.queryByText("programming")).toBeTruthy();

});

test("displays in given order by default", () => {
    const r = render(<Table rows={testData} cols={divTestColumns} />);

    const names = r.getAllByTestId('cell-name-', {exact: false});
    expect(names[0]).toHaveTextContent('Kasper');
    expect(names[1]).toHaveTextContent('Jesper');
    expect(names[2]).toHaveTextContent('Jonathan');
    expect(names.length).toEqual(3);
});

test("displays in name order when sorting by name", () => {
    const r = render(<Table rows={testData} cols={divTestColumns} />);

    const nameHeader = r.getByText('Name');
    fireEvent.click(nameHeader);

    const names = r.getAllByTestId('cell-name-', {exact: false});
    expect(names[0]).toHaveTextContent('Jesper');
    expect(names[1]).toHaveTextContent('Jonathan');
    expect(names[2]).toHaveTextContent('Kasper');
    expect(names.length).toEqual(3);
});

test("displays in reverse name order when sorting by name twice", () => {
    const r = render(<Table rows={testData} cols={divTestColumns} />);

    const nameHeader = r.getByText('Name');
    fireEvent.click(nameHeader);
    fireEvent.click(nameHeader);

    const names = r.getAllByTestId('cell-name-', {exact: false});
    expect(names[0]).toHaveTextContent('Kasper');
    expect(names[1]).toHaveTextContent('Jonathan');
    expect(names[2]).toHaveTextContent('Jesper');
    expect(names.length).toEqual(3);
});

test("displays in ID order when sorting by ID", () => {
    const r = render(<Table rows={testData} cols={divTestColumns} />);

    const nameHeader = r.getByText('ID');
    fireEvent.click(nameHeader);

    const names = r.getAllByTestId('cell-id-', {exact: false});
    expect(names[0]).toHaveTextContent('1');
    expect(names[1]).toHaveTextContent('2');
    expect(names[2]).toHaveTextContent('3');
    expect(names.length).toEqual(3);
});

test("displays in reverse ID order when sorting by ID twice", () => {
    const r = render(<Table rows={testData} cols={divTestColumns} />);

    const nameHeader = r.getByText('ID');
    fireEvent.click(nameHeader);
    fireEvent.click(nameHeader);

    const names = r.getAllByTestId('cell-id-', {exact: false});
    expect(names[0]).toHaveTextContent('3');
    expect(names[1]).toHaveTextContent('2');
    expect(names[2]).toHaveTextContent('1');
    expect(names.length).toEqual(3);
});

test("displays in birthday order when sorting by birthday", () => {
    const r = render(<Table rows={testData} cols={divTestColumns} />);

    const birthdayHeader = r.getByText('Birthday');
    fireEvent.click(birthdayHeader);

    const names = r.getAllByTestId('cell-id-', {exact: false});
    expect(names[0]).toHaveTextContent('2');
    expect(names[1]).toHaveTextContent('3');
    expect(names[2]).toHaveTextContent('1');
    expect(names.length).toEqual(3);
});

test("hides invisible columns", () => {
    const r = render(<Table 
        rows={testData} 
        cols={divTestColumns} 
        visibleColumns={['name']}
        />);

    expect(r.getByText('Name')).toBeInTheDocument();
    expect(r.queryByText("ID")).toBeFalsy();
});

/** A button that remembers if it has been clicked */
function TestClicker(props: {text:string}){
    const [clicked, setClicked] = useState(false);
    return (
        <button onClick={() => setClicked(true)}>
            {props.text} {clicked ? 'clicked' : 'not'}
        </button>
    )
}

test("supports rowKey", () =>{
    const cols : Column<string>[] = [
        {
            key: 'btn',
            content: s => <TestClicker text={s} />
        }
    ];
    const r = render(<Table rows={['foo']} 
        cols={cols}
        rowKey={(s, index, sortedIndex) => s} 
    />);

    //click the button that says foo (on the first row)
    fireEvent.click(r.getByText('foo not'));
    // Add a row to the top of the table. Then ckeck if it's 
    // the first button or the 'foo' button that has been clicked.
    // If rowKey tracking works, the foo button should be marked as clicked.
    // If it doesn't work, or if it tracks by row number, the bar button
    // would be marked as clicked because it's the first row.
    r.rerender(<Table rows={['bar', 'foo']} 
        cols={cols} 
        rowKey={(s, index, sortedIndex) => s} 
    />);
    
    expect(r.queryByText('foo clicked')).toBeInTheDocument();
    expect(r.queryByText('bar not')).toBeInTheDocument();
});

test("supports onRowClick", () => {
    const fn = jest.fn((t: TestType, index: number, sortedIndex: number) => ({}) );
    const r = render(<Table rows={testData}
         cols={divTestColumns}
         onRowClick={fn}
         />);

    fireEvent.click(r.getByText('Jonathan'));

    expect(fn).toBeCalledWith(testData[2], 2, 2, expect.anything());
});

test('supports rowClass', () => {
    const r = render(<Table rows={testData}
        cols={divTestColumns}
        rowClass={(t, idx, sidx) => t.name === 'Jesper' ? 'jesp' : 'wasp'}
        />);
    
    const jesp = r.getByTestId('cell-name-3');
    expect(jesp.parentElement.parentElement).toHaveClass('jesp');

    const kasp = r.getByTestId('cell-name-2');
    expect(kasp.parentElement.parentElement).toHaveClass('wasp');
});

test('supports column.className', () => {
    const cols: Column<TestType>[] = [
        {
            header: 'TestHeader',
            content: tt => tt.name,
            key: 'th',
            footer: 'TestFooter',
            className: 'test-class'
        }
    ];
    const r = render(<Table cols={cols} rows={testData} />);

    expect(r.getByText('TestHeader')).toHaveClass('test-class');
    expect(r.getByText('TestFooter')).toHaveClass('test-class');
    expect(r.getByText('Jesper')).toHaveClass('test-class');
})