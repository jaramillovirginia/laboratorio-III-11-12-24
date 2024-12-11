import { Injectable } from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { ManagerError } from 'src/common/errors/manager.error';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';
import { AllApiResponse } from 'src/common/interfaces/response-api.interface';
import { TestEntity } from './entities/test.entity';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(TestEntity)
    private readonly testEntityRepository: Repository<TestEntity>
  ) { }

  async create(createtestDto: CreateTestDto): Promise<TestEntity> {
    try {
      const testEntity = await this.testEntityRepository.save(createtestDto);
      if (!testEntity) {
        throw new ManagerError({
          type: 'CONFLICT',
          message: 'testEntity not created!',
        });
      }
      return testEntity;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<AllApiResponse<TestEntity>> {
    const { limit, page } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      // const total = await this.categoryRepository.count({ where: { isActive: true } });
      // const data = await this.categoryRepository.find({ where: { isActive: true }, take: limit, skip: skip })
      const [total, data] = await Promise.all([
        this.testEntityRepository.count({ where: { isActive: true } }),
        this.testEntityRepository.createQueryBuilder('testEntity')
          .where({ isActive: true })
          .take(limit)
          .skip(skip)
          .getMany()
      ]);
      const lastPage = Math.ceil(total / limit);

      if (!data) {
        new ManagerError({
          type: "NOT_FOUND",
          message: "No hay testEntityos"
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

  async findOne(id: string): Promise<TestEntity> {
    try {
      const testEntity = await this.testEntityRepository.createQueryBuilder('testEntity')
        .where({ id, isActive: true })
        .leftJoinAndSelect('testEntity.supplier', 'supplier')
        .leftJoinAndSelect('testEntity.category', 'category')
        .leftJoinAndSelect('testEntity.stocks', 'stocks')
        .getOne()

      if (!testEntity) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'testEntity not found',
        });
      }

      return testEntity;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async update(id: string, updatetestDto: UpdateTestDto): Promise<UpdateResult> {
    try {
      const testEntity = await this.testEntityRepository.update(id, updatetestDto)
      if (testEntity.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'testEntityo not found',
        });
      }

      return testEntity;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async remove(id: string): Promise<UpdateResult> {
    try {
      const testEntity = await this.testEntityRepository.update({ id }, { isActive: false })
      if (testEntity.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'testEntityo not found',
        });
      }

      return testEntity;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }
}