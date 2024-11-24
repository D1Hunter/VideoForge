import { IsEmail, IsString, Length } from "class-validator";

export class LoginUserDto {
    @IsString({message:'The email must be a string'})
    @IsEmail({}, {message: `The email variable must be an email.`})
    @Length(5, 30, {message:'The email can contain: 5 min and 30 max characters.'})
    readonly email:string;

    @IsString({message: 'The password must be a string.'})
    @Length(8, 30, {message: 'The password can contain: 8 min and 25 max characters.'})
    readonly password: string;
}
