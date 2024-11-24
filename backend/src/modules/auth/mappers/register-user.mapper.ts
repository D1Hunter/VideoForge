import { User } from "../../user/user.model";
import { CreateUserDto } from "../../user/dto/create-user.dto";
import { RegisterUserDto } from "../dto/register-user.dto";

class RegisterUserMapper {
    fromFrontToController(dto: CreateUserDto): RegisterUserDto {
        return {
            nickname: dto.nickname,
            email:dto.email,
            password: dto.password
        }
    }
    fromControllerToFront(dto:User,token:string){
        return {
            user:{
                id: dto.id,
                email:dto.email
            },
            token:token
        }
    }
}

export const registerUserMapper = new RegisterUserMapper();