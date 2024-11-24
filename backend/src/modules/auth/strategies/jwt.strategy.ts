import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { TokenRepository } from "src/modules/auth/token.repository";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private readonly tokenRepository:TokenRepository){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'jwtsecret'
        });
    }

    async validate(payload:IJwtPayload){
        console.log("WHAT");
        const token = await this.tokenRepository.findOneByUserId(payload.id);
        if(!token){
            throw new UnauthorizedException();
        }
        return {...payload};
    }
}