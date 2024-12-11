import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';
import { ResponseAllProducts } from './interfaces/response-products.interface';
import { ManagerError } from 'src/common/errors/manager.error';
import { CategoriesService } from '../categories/categories.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>
  ) { }

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    try {
      const product = await this.productRepository.save(createProductDto);
      if (!product) {
        throw new ManagerError({
          type: 'CONFLICT',
          message: 'Product not created!',
        });
      }
      return product;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<ResponseAllProducts> {
    const { limit, page } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      // const total = await this.categoryRepository.count({ where: { isActive: true } });
      // const data = await this.categoryRepository.find({ where: { isActive: true }, take: limit, skip: skip })
      const [total, data] = await Promise.all([
        this.productRepository.count({ where: { isActive: true } }),
        this.productRepository.createQueryBuilder('product')
          .where({ isActive: true })
          .leftJoinAndSelect('product.category', 'category')
          .leftJoinAndSelect('product.supplier', 'supplier')
          .leftJoinAndSelect('product.stocks', 'stocks')
          .take(limit)
          .skip(skip)
          .getMany()
      ]);
      const lastPage = Math.ceil(total / limit);

      if (!data) {
        new ManagerError({
          type: "NOT_FOUND",
          message: "No hay productos"
        })
      }

      return {
        page,
        limit,
        lastPage,
        total,
        data,
      };
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async findOne(id: string): Promise<ProductEntity> {
    try {
      const product = await this.productRepository.createQueryBuilder('product')
        .where({ id, isActive: true })
        .leftJoinAndSelect('product.supplier', 'supplier')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.stocks', 'stocks')
        .getOne()

      if (!product) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Product not found',
        });
      }

      return product;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<UpdateResult> {
    try {
      const product = await this.productRepository.update(id, updateProductDto)
      if (product.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Producto not found',
        });
      }

      return product;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async remove(id: string): Promise<UpdateResult> {
    try {
      const product = await this.productRepository.update({ id }, { isActive: false })
      if (product.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Producto not found',
        });
      }

      return product;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }
}
