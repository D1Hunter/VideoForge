import { InjectModel } from '@nestjs/sequelize';
import { IBaseRepository } from './base.interfrace.repository';
import { Model, ModelCtor } from 'sequelize-typescript';
import {
  CreationAttributes,
  Attributes,
  WhereAttributeHashValue,
  FindOptions,
} from 'sequelize';

export abstract class BaseAbstractRepository<T extends Model<T>>
  implements IBaseRepository<T>
{
  constructor(@InjectModel(Model) private readonly entityModel: ModelCtor<T>) {}
  create(dto: CreationAttributes<T>): Promise<T> {
    return this.entityModel.create(dto);
  }
  findOneById(id: string): Promise<T | null> {
    return this.entityModel.findByPk(id);
  }
  findOne(options?: FindOptions<Attributes<T>>) {
    return this.entityModel.findOne(options);
  }
  findMany(options?: FindOptions<Attributes<T>>): Promise<T[]> {
    return this.entityModel.findAll(options);
  }
  update(entity: T, dto: Attributes<T>): Promise<T> {
    return entity.update(dto);
  }
  delete(id: WhereAttributeHashValue<Attributes<T>['id']>): Promise<number> {
    return this.entityModel.destroy({ where: { id } });
  }
}
