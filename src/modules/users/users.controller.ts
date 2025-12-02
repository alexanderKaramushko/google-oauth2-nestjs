import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { type Request as ExpressRequest } from 'express';
import { UsersService } from './users.service';
import { JWT } from '../../guards/jwt/types';
import { JwtGuard } from 'src/guards/jwt/jwt.guard';
import { jwtDecode } from 'jwt-decode';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('profile')
  async getUserBySubjectId(@Request() request: ExpressRequest) {
    const token = request.cookies.jwt as string;
    const { sub } = jwtDecode<JWT>(token);

    return this.userService.findBySubjectId(sub);
  }
}
