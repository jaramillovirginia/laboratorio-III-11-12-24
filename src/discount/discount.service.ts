import { Injectable } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';
import { DiscountEntity } from './entities/discount.entity';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository, UpdateResult } from 'typeorm';
import { ManagerError } from 'src/common/errors/manager.error';
import { AllApiResponse } from 'src/common/interfaces/response-api.interface';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(DiscountEntity)
    private readonly discountEntityRepository: Repository<DiscountEntity>
  ) { }

  async create(createDiscountDto: CreateDiscountDto): Promise<DiscountEntity> {
    try {
      const DiscountEntity = await this.discountEntityRepository.save(createDiscountDto);
      if (!DiscountEntity) {
        throw new ManagerError({
          type: 'CONFLICT',
          message: 'DiscountEntity not created!',
        });
      }
      return DiscountEntity;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<AllApiResponse<DiscountEntity>> {
    const { limit, page } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      // const total = await this.categoryRepository.count({ where: { isActive: true } });
      // const data = await this.categoryRepository.find({ where: { isActive: true }, take: limit, skip: skip })
      const [total, data] = await Promise.all([
        this.discountEntityRepository.count({ where: { isActive: true } }),
        this.discountEntityRepository.createQueryBuilder('DiscountEntity')
          .where({ isActive: true })
          .take(limit)
          .skip(skip)
          .getMany()
      ]);
      const lastPage = Math.ceil(total / limit);

      if (!data) {
        new ManagerError({
          type: "NOT_FOUND",
          message: "No hay DiscountEntityos"
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

  async findOne(id: string): Promise<DiscountEntity> {
    try {
      const DiscountEntity = await this.discountEntityRepository.createQueryBuilder('DiscountEntity')
        .where({ id, isActive: true })
        .leftJoinAndSelect('DiscountEntity.supplier', 'supplier')
        .leftJoinAndSelect('DiscountEntity.category', 'category')
        .leftJoinAndSelect('DiscountEntity.stocks', 'stocks')
        .getOne()

      if (!DiscountEntity) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'DiscountEntity not found',
        });
      }

      return DiscountEntity;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async update(id: string, updateDiscountDto: UpdateDiscountDto): Promise<UpdateResult> {
    try {
      const DiscountEntity = await this.discountEntityRepository.update(id, updateDiscountDto)
      if (DiscountEntity.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'DiscountEntityo not found',
        });
      }

      return DiscountEntity;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async remove(id: string): Promise<UpdateResult> {
    try {
      const DiscountEntity = await this.discountEntityRepository.update({ id }, { isActive: false })
      if (DiscountEntity.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'DiscountEntityo not found',
        });
      }

      return DiscountEntity;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }
}