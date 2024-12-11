import { Injectable } from '@nestjs/common';
import { CreatePruebaDto } from './dto/create-prueba.dto';
import { UpdatePruebaDto } from './dto/update-prueba.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PruebaEntity } from './entities/prueba.entity';
import { Repository, UpdateResult } from 'typeorm';
import { ManagerError } from 'src/common/errors/manager.error';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';
import { AllApiResponse } from 'src/common/interfaces/response-api.interface';

@Injectable()
export class PruebaService {
  constructor(
    @InjectRepository(PruebaEntity)
    private readonly pruebaEntityRepository: Repository<PruebaEntity>
  ) { }

  async create(createPruebaDto: CreatePruebaDto): Promise<PruebaEntity> {
    try {
      const PruebaEntity = await this.pruebaEntityRepository.save(createPruebaDto);
      if (!PruebaEntity) {
        throw new ManagerError({
          type: 'CONFLICT',
          message: 'PruebaEntity not created!',
        });
      }
      return PruebaEntity;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<AllApiResponse<PruebaEntity>> {
    const { limit, page } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      // const total = await this.categoryRepository.count({ where: { isActive: true } });
      // const data = await this.categoryRepository.find({ where: { isActive: true }, take: limit, skip: skip })
      const [total, data] = await Promise.all([
        this.pruebaEntityRepository.count({ where: { isActive: true } }),
        this.pruebaEntityRepository.createQueryBuilder('PruebaEntity')
          .where({ isActive: true })
          .take(limit)
          .skip(skip)
          .getMany()
      ]);
      const lastPage = Math.ceil(total / limit);

      if (!data) {
        new ManagerError({
          type: "NOT_FOUND",
          message: "No hay PruebaEntityos"
        })
      }

      return {
        meta: {
          page,
          lastPage,
          limit,
          total,
        },
        data
      };
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async findOne(id: string): Promise<PruebaEntity> {
    try {
      const PruebaEntity = await this.pruebaEntityRepository.createQueryBuilder('PruebaEntity')
        .where({ id, isActive: true })
        .leftJoinAndSelect('PruebaEntity.supplier', 'supplier')
        .leftJoinAndSelect('PruebaEntity.category', 'category')
        .leftJoinAndSelect('PruebaEntity.stocks', 'stocks')
        .getOne()

      if (!PruebaEntity) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'PruebaEntity not found',
        });
      }

      return PruebaEntity;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async update(id: string, updatePruebaDto: UpdatePruebaDto): Promise<UpdateResult> {
    try {
      const PruebaEntity = await this.pruebaEntityRepository.update(id, updatePruebaDto)
      if (PruebaEntity.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'PruebaEntityo not found',
        });
      }

      return PruebaEntity;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async remove(id: string): Promise<UpdateResult> {
    try {
      const PruebaEntity = await this.pruebaEntityRepository.update({ id }, { isActive: false })
      if (PruebaEntity.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'PruebaEntityo not found',
        });
      }

      return PruebaEntity;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }
}
