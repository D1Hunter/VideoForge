export interface IVideo{
    id:string;
    title:string;
    duration:number;
    fileSize:number;
    thumbnailPath:string;
    createdAt:string;
}

export enum VideoFilterType {
    GRAYSCALE = 'grayscale',
    INVERT = 'invert',
    BLUR = 'blur'
}