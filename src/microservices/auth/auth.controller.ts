import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { jwtDecode } from 'jwt-decode';
import { JWT } from 'src/jwt/types';
import { UsersService } from 'src/users/users.service';

@Controller()
export class AuthController {
  constructor(private userService: UsersService) {}

  @MessagePattern('auth.user', Transport.TCP)
  async getUserByJwt(@Payload() jwt: string) {
    const { sub } = jwtDecode<JWT>(jwt);

    return this.userService.findBySubjectId(sub);
  }
}
