import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { jwtDecode } from 'jwt-decode';
import { JwtGuard } from 'src/guards/jwt/jwt.guard';
import { JWT } from 'src/guards/jwt/jwt.interface';
import { UsersService } from 'src/modules/users/users.service';

@UseGuards(JwtGuard)
@Controller()
export class AuthController {
  constructor(private userService: UsersService) {}

  @MessagePattern('auth.user', Transport.TCP)
  async getUserByJwt(@Payload() jwt: string) {
    const { sub } = jwtDecode<JWT>(jwt);

    return this.userService.findBySubjectId(sub);
  }
}
