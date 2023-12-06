export type PropertyType = {
    name: string;
    values: string[];
};

export type CategoryType = {
    name: string;
    parent: {
        name: string;
        properties: PropertyType[];
        __v: number;
        _id: string;
    };
    properties: PropertyType[];
    __v: number;
    _id: string;
};

export type CategoryChangeType = {
    newName: string;
    index: number;
    property: PropertyType;
};

export type CategoryInitialState = {
    categories: CategoryType[];
};
