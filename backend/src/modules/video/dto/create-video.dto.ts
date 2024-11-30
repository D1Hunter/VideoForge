export class CreateVideoDto {
    readonly title: string;
    readonly filePath: string;
    readonly duration: number;
    readonly fileSize: number;
    readonly projectId: string;
}  