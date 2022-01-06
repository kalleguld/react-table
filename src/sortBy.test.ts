import { SortBy } from "./sortBy"

type TestType = {
    id:number|undefined|null;
    name:string|undefined|null;
    birthday: Date|undefined|null;
};

const testData: TestType[] = [
    {
        id:1,
        name:'Kasper',
        birthday: new Date(Date.parse('1983-04-15T09:00:00Z'))
    },
    {
        id: 2,
        name: 'Jesper',
        birthday: new Date(Date.parse('1984-04-15T09:00:00Z'))
    },
    {
        id:3,
        name:'Jonathan',
        birthday: new Date(Date.parse('1985-04-15T09:00:00Z'))
    },
    {
        id:undefined,
        name:undefined,
        birthday:undefined
    },
    {
        id:null,
        name:null,
        birthday:null
    },
    {
        id:0,
        name:'',
        birthday: new Date(0)
    }
];

test('sorts strings', () => {
    const sort = SortBy.string<TestType>(tt => tt.name);

    expect(sort(testData[0], testData[1])).toBeGreaterThan(0);
    expect(sort(testData[1], testData[2])).toBeLessThan(0);
    expect(sort(testData[1], testData[1])).toEqual(0);
    
});

test('sorts undefined/null strings like empty strings', () => {
    const sort = SortBy.string<TestType>(tt => tt.name);

    expect(sort(testData[3], testData[5])).toEqual(0);
    expect(sort(testData[4], testData[5])).toEqual(0);
    expect(sort(testData[5], testData[3])).toEqual(0);
    expect(sort(testData[5], testData[4])).toEqual(0);
});

test("sorts numbers", () => {
    const sort = SortBy.number<TestType>(tt => tt.id);

    expect(sort(testData[0], testData[1])).toBeLessThan(0);
    expect(sort(testData[2], testData[1])).toBeGreaterThan(0);
    expect(sort(testData[1], testData[1])).toEqual(0);
});

test('sorts undefined/null numbers like zero', () => {
    const sort = SortBy.number<TestType>(tt => tt.id);

    expect(sort(testData[3], testData[5])).toEqual(0);
    expect(sort(testData[4], testData[5])).toEqual(0);
    expect(sort(testData[5], testData[3])).toEqual(0);
    expect(sort(testData[5], testData[4])).toEqual(0);
});

test("sorts dates", () => {
    const sort = SortBy.Date<TestType>(tt => tt.birthday);

    expect(sort(testData[0], testData[1])).toBeLessThan(0);
    expect(sort(testData[2], testData[1])).toBeGreaterThan(0);
    expect(sort(testData[1], testData[1])).toEqual(0);
});

test('sorts undefined/null date like unix epoch', () => {
    const sort = SortBy.Date<TestType>(tt => tt.birthday);

    expect(sort(testData[3], testData[5])).toEqual(0);
    expect(sort(testData[4], testData[5])).toEqual(0);
    expect(sort(testData[5], testData[3])).toEqual(0);
    expect(sort(testData[5], testData[4])).toEqual(0);
});