export class CreateProjectDto {
    readonly name: string;
    readonly description?: string;
    readonly userId: number;
}