import { Column, DataType, ForeignKey, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { User } from "../user/user.model";

@Table
export class Token extends Model {
    @PrimaryKey
    @Unique
    @Column(DataType.STRING)
    accessToken:string;

    @ForeignKey(()=>User)
    userId:User;
}