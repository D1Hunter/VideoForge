import { AllowNull, Column, DataType, Default, HasMany, HasOne, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { Token } from "../auth/token.model";
import { Project } from "../project/project.model";

@Table
export class User extends Model {
    @PrimaryKey
    @Unique
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string;
  
    @Unique
    @Column(DataType.STRING)
    nickname: string;

    @Unique
    @Column(DataType.STRING)
    email: string;
  
    @AllowNull(true)
    @Column(DataType.STRING)
    firstname: string;
  
    @AllowNull(true)
    @Column(DataType.STRING)
    lastname: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    password: string;

    @HasOne(()=>Token)
    token:Token;
    
    @HasMany(()=>Project)
    projects:Project[];
}