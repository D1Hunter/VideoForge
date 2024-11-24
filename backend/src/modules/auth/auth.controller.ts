import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { TokenService } from './token.service';
import { registerUserMapper } from './mappers/register-user.mapper';
import { LoginUserDto } from './dto/login-user.dto';
import { loginUserMapper } from './mappers/login-user.mapper';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) { }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() dto: RegisterUserDto) {
    console.log(dto);
    dto = registerUserMapper.fromFrontToController(dto);
    const newUser = await this.authService.register(dto);
    const accessToken = await this.tokenService.generateAccessToken({
      id: newUser.id,
      email: newUser.email,
    });
    await this.tokenService.saveToken(newUser.id, accessToken);
    return registerUserMapper.fromControllerToFront(newUser, accessToken);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginUserDto) {
    dto = loginUserMapper.fromFrontToController(dto);
    const user = await this.authService.login(dto);
    const accessToken = await this.tokenService.generateAccessToken({
      id: user.id,
      email: user.email,
    });
    await this.tokenService.saveToken(user.id, accessToken);
    return loginUserMapper.fromControllerToFront(user, accessToken);
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async auth(@Request() req) {
    const user = await this.authService.auth(req.user.id);
    const accessToken = await this.tokenService.generateAccessToken({
      id: user.id,
      email: user.email,
    });
    await this.tokenService.saveToken(user.id, accessToken);
    return loginUserMapper.fromControllerToFront(user, accessToken);
  }

  @Get('/logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    const user = await this.authService.auth(req.user.id);
    return this.tokenService.deleteAccessToken(user.id);
  }
}