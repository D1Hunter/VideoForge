import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '../../interfaces/base.abstract.repository';

@Injectable()
export class UserRepository extends BaseAbstractRepository<User> {
  constructor(@InjectModel(User) userModel: typeof User) {
    super(userModel);
  }
  findOneByEmail(email: string) {
    return this.findOne({ where: { email } });
  }
}
