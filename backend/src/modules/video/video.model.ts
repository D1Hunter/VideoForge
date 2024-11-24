import { AllowNull, BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Unique } from "sequelize-typescript";
import { Project } from "../project/project.model";

export class Video extends Model {
    @PrimaryKey
    @Unique
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string;
    
    @AllowNull(false)
    @Column(DataType.STRING)
    title: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    filePath: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    duration: number;

    @ForeignKey(() => Project)
    @AllowNull(false)
    @Column(DataType.STRING)
    projectId: number;

    @BelongsTo(() => Project)
    project: Project;
}