import { Sorter } from "./Sorter";

interface stringLike {
    toString():string|null|undefined;
}
type Optional<T> = T|null|undefined;
function sortByString<T>(selector: (t: T) => Optional<stringLike>): Sorter<T>{
    const sorter = (a:T,b:T) => {
        const ao = selector(a);
        const astr = ao?.toString() ?? '';
        const bo = selector(b);
        const bstr = bo?.toString() ?? '';
        return astr.localeCompare(bstr);
    };

    return sorter;
}

 function sortByNumber<T>(selector: (t: T) => Optional<number>): Sorter<T>{
    const sorter = (a:T, b:T) => {
        const an = selector(a) ?? 0;
        const bn = selector(b) ?? 0;
        return an - bn;
    }
    return sorter;
}

 function sortByDate<T>(selector: (t:T) => Optional<Date>): Sorter<T>{
    return (a:T,b:T) => {
        const ad = selector(a)?.valueOf() ?? 0;
        const bd = selector(b)?.valueOf() ?? 0;
        return ad - bd;
    };
}

export module SortBy {
    export const string = sortByString;
    export const number = sortByNumber;
    export const Date = sortByDate;
}