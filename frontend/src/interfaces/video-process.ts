export interface IVideoProcess {
    operationType:VideoOperationType;
    filterType?:VideoFilterType;
    startTime?:string;
    duration?:string;
}

export enum VideoFilterType {
    GRAYSCALE = 'grayscale',
    INVERT = 'invert',
    BLUR = 'blur',
    GLITCH_EFFECT ='glich_effect',
    CARTOONIZE = 'cartoonize'
}

export enum VideoOperationType {
    TRIM = 'trim',
    FILTER = 'filter',
}