import React from 'react';
import { Prop, useProp } from '@kalleguld/react-props'
import { useMemo } from "react";
import { ColumnDescription as Column, ColumnKey as Key } from './Column';


export function ColumnSelector(props: {
    columns:Column[],
    selectedKeys: Prop<Key[]>,
    allowDuplicates?: boolean,
}) {
    const selectedCol1 = useProp<Key>();
    const selectableCols = useMemo(() => {
        if (props.allowDuplicates)
            return props.columns;
        // only return columns that are not already selected;
        return props.columns.filter(col => 
            props.selectedKeys.value.indexOf(col.key) < 0);

    }, [props.allowDuplicates, props.columns, props.selectedKeys.value]);
    function addCol() {
        const key = selectedCol1.value;
        if (key === undefined)
            return;
        props.selectedKeys.set(
            [...props.selectedKeys.value, key]);
        selectedCol1.set(undefined);
    }

    const selectedCol2 = useProp<number>();
    const selectedCols = useMemo(() => {
        return props.selectedKeys.value
            .map(key => props.columns.find(col => col.key === key))
            .filter(col => !!col) as Column[];
    }, [props.selectedKeys.value, props.columns]);
    function removeCol() {
        const idx = selectedCol2.value;
        if (idx === undefined)
            return;
        const newSelection = [...props.selectedKeys.value];
        newSelection.splice(idx, 1);
        props.selectedKeys.set(newSelection);
        selectedCol2.set(undefined);
    }

    function moveSelected(diff: number){
        const oldPos = selectedCol2.value;
        if (oldPos === undefined)
            return;
        const newPos = oldPos +diff;
        if (newPos < 0)
            return;
        if (newPos >= props.selectedKeys.value.length)
            return;
        const newSelection = [...props.selectedKeys.value];
        arrayMove(newSelection, oldPos, newPos);
        props.selectedKeys.set(newSelection);
        selectedCol2.set(newPos);
    }

    return (
        <div className='column-selector'>
            <ul className='selectable-columns'>
                {selectableCols.map(col => (
                    <li key={col.key}
                        className={selectedCol1.value === col.key ? 'selected' : ''}
                        onClick={() => selectedCol1.set(col.key)}
                        onDoubleClick={() => addCol()}
                    >
                        {col.header ?? col.key}
                    </li>
                ))}
            </ul>
            <div className='buttons'>
                <button className='btn btn-secondary'
                    disabled={selectedCol1.value === undefined}
                    onClick={() => addCol()}
                >
                    →
                </button>

                <div className='spacer'></div>

                <button className='btn btn-secondary'
                    disabled={selectedCol2.value === undefined}
                    onClick={() => removeCol()}
                >
                    ←
                </button>

                <div className='spacer'></div>

                <button className='btn btn-secondary'
                    disabled={selectedCol2.value === undefined || selectedCol2.value <= 0}
                    onClick={() => moveSelected(-1)}
                >
                    ↑
                </button>


                <button className='btn btn-secondary'
                    disabled={selectedCol2.value === undefined || selectedCol2.value >= selectedCols.length - 1}
                    onClick={() => moveSelected(1)}
                >
                    ↓
                </button>

            </div>
            <ul className='selected-columns'>
                {selectedCols.map((col, idx) => (
                    <li key={idx} 
                        className={idx === selectedCol2.value ? 'selected' : ''}
                        onClick={() => selectedCol2.set(idx)}
                        onDoubleClick={() => removeCol()}
                    >
                        {col.header ?? col.key}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function arrayMove<T>(arr: T[], old_index: number, new_index: number) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined!);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
};