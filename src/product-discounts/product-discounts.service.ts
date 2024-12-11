import { Injectable } from '@nestjs/common';
import { CreateProductDiscountDto } from './dto/create-product-discount.dto';
import { UpdateProductDiscountDto } from './dto/update-product-discount.dto';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { ManagerError } from 'src/common/errors/manager.error';
import { AllApiResponse } from 'src/common/interfaces/response-api.interface';
import { ProductDiscountEntity } from './entities/product-discount.entity';

@Injectable()
export class ProductDiscountService {
  constructor(
    @InjectRepository(ProductDiscountEntity)
    private readonly productdiscountRepository: Repository<ProductDiscountEntity>
  ) { }

  async create(createDiscountDto: CreateProductDiscountDto): Promise<ProductDiscountEntity> {
    try {
      const DiscountEntity = await this.productdiscountRepository.save(createDiscountDto);
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

  async findAll(paginationDto: PaginationDto): Promise<AllApiResponse<ProductDiscountEntity>> {
    const { limit, page } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      // const total = await this.categoryRepository.count({ where: { isActive: true } });
      // const data = await this.categoryRepository.find({ where: { isActive: true }, take: limit, skip: skip })
      const [total, data] = await Promise.all([
        this.productdiscountRepository.count({ where: { isActive: true } }),
        this.productdiscountRepository.createQueryBuilder('DiscountEntity')
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

  async findOne(id: string): Promise<ProductDiscountEntity> {
    try {
      const ProductDiscountEntity = await this.productdiscountRepository.createQueryBuilder('DiscountEntity')
        .where({ id, isActive: true })
        .leftJoinAndSelect('DiscountEntity.supplier', 'supplier')
        .leftJoinAndSelect('DiscountEntity.category', 'category')
        .leftJoinAndSelect('DiscountEntity.stocks', 'stocks')
        .getOne()

      if (!ProductDiscountEntity) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'DiscountEntity not found',
        });
      }

      return ProductDiscountEntity;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async update(id: string, updateDiscountDto: UpdateProductDiscountDto): Promise<UpdateResult> {
    try {
      const DiscountEntity = await this.productdiscountRepository.update(id, updateDiscountDto)
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
      const DiscountEntity = await this.productdiscountRepository.update({ id }, { isActive: false })
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