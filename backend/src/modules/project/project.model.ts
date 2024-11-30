import { AllowNull, BelongsTo, Column, DataType, Default, ForeignKey, HasMany, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { User } from "../user/user.model";
import { Video } from "../video/video.model";

@Table
export class Project extends Model {
    @PrimaryKey
    @Unique
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string;

    @AllowNull(false)
    @Column({type: DataType.STRING})
    title: string;

    @AllowNull(true)
    @Column({type: DataType.STRING})
    description: string;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.UUID)
    userId: string;

    @BelongsTo(() => User)
    user: User;

    @HasMany(()=>Video)
    videos:Video[];
}