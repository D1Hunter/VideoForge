export class CreateVideoDto {
    readonly title: string;
    readonly filePath: string;
    readonly thumbnailPath: string;
    readonly duration: number;
    readonly fileSize: number;
    readonly mimetype: string;
    readonly projectId: string;
}  