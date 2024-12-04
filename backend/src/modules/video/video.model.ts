import { AllowNull, BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { Project } from "../project/project.model";

@Table
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
    thumbnailPath: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    duration: string;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    fileSize: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    mimetype: string;

    @ForeignKey(() => Project)
    @AllowNull(false)
    @Column(DataType.UUID) 
    projectId: string;

    @BelongsTo(() => Project)
    project: Project;
}