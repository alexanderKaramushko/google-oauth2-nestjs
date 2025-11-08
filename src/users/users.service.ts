import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create(user: User) {
    const newUser = new this.userModel(user);

    return newUser.save();
  }

  findByProvider(subjectId: string, provider: string) {
    return this.userModel.find({ subjectId, provider });
  }

  findByUserId(userId: string) {
    return this.userModel.find({ subjectId: userId });
  }
}
