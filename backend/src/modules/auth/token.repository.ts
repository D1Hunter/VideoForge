import { InjectModel } from '@nestjs/sequelize';
import { Token } from './token.model';
import { BaseAbstractRepository } from 'src/interfaces/base.abstract.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenRepository extends BaseAbstractRepository<Token> {
  constructor(@InjectModel(Token) tokenModel: typeof Token) {
    super(tokenModel);
  }

  findOneByUserId(userId: string): Promise<Token> {
    return this.findOne({ where: { userId } });
  }
}
