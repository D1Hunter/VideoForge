import { IsEmail, IsString, Length } from "class-validator";

export class UpdateUserDto{
    @IsString({message:'The nickname must be a string'})
    @Length(5, 30, {message:'The nickname can contain: 5 min and 30 max characters.'})
    readonly nickname:string;

    @IsString({message:'The email must be a string'})
    @IsEmail({}, {message: `The email variable must be an email.`})
    @Length(5, 30, {message:'The email can contain: 5 min and 30 max characters.'})
    readonly email:string;
}