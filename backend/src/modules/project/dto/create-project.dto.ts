export class CreateProjectDto {
    readonly title: string;
    readonly description?: string;
    readonly userId: number;
}