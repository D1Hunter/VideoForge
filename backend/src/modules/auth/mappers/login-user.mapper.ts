import { User } from "../../user/user.model";
import { LoginUserDto } from "../dto/login-user.dto";

class LoginUserMapper {
    fromFrontToController(dto: LoginUserDto): LoginUserDto {
        return {
            email: dto.email,
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

export const loginUserMapper = new LoginUserMapper();