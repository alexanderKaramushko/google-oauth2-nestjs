import { Inject, Injectable } from '@nestjs/common';
import { type ClientProxy } from '@nestjs/microservices';
import { User } from 'src/users/user.model';
import { GOALS_SERVICE } from './tokens';

@Injectable()
export class MicroservicesService {
  constructor(@Inject(GOALS_SERVICE) private goalsService: ClientProxy) {}

  createGoalsUser(user: Omit<User, 'provider'>) {
    return this.goalsService.send('create_user', user).toPromise();
  }
}
