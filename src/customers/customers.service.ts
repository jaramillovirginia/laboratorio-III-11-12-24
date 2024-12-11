import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';
import { Repository } from 'typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ManagerError } from 'src/common/errors/manager.error';
import { ResponseApi } from 'src/common/interfaces/response-api.interface';

@Injectable()
export class CustomersService {

  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customersRepository: Repository<CustomerEntity>
  ){}
  async create(createCustomerDto: CreateCustomerDto): Promise<ResponseApi<CustomerEntity>> {
    try {
      const custoemr = await this.customersRepository.save(createCustomerDto);
      if( !custoemr ){
        throw new ManagerError({
          type: "CONFLICT",
          message: "Customer not created!",
        })
      }
      return {
        status: {
          statusMsg: "CREATED",
          statusCode: HttpStatus.CREATED,
          error: null,
        },
        data: custoemr,
      };
    } catch (error) {
      ManagerError.createSignatureError(error.message)
    }
  }

  findAll( paginationDto: PaginationDto ) {
    return `This action returns all customers`;
  }

  async findOne(id: string) {
    try {
      const custoemr = await this.customersRepository.findOne({ where :  { id }});
      if( !custoemr ){
        throw new ManagerError({
          type: "NOT_FOUND",
          message: "Customer not found!",
        })
      }
      return {
        status: {
          statusMsg: "OK",
          statusCode: HttpStatus.OK,
          error: null,
        },
        data: custoemr,
      };
    } catch (error) {
      ManagerError.createSignatureError(error.message)
    }
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    try {
      const custoemr = await this.customersRepository.update(id, updateCustomerDto);
      if( custoemr.affected === 0 ){
        throw new ManagerError({
          type: "NOT_FOUND",
          message: "Customer not found!",
        })
      }
      return {
        status: {
          statusMsg: "OK",
          statusCode: HttpStatus.OK,
          error: null,
        },
        data: custoemr,
      };
    } catch (error) {
      ManagerError.createSignatureError(error.message)
    }
  }

  async remove(id: string) {
    try {
      const custoemr = await this.customersRepository.update(id, { isActive: false });
      if( custoemr.affected === 0 ){
        throw new ManagerError({
          type: "NOT_FOUND",
          message: "Customer not found!",
        })
      }
      return {
        status: {
          statusMsg: "OK",
          statusCode: HttpStatus.OK,
          error: null,
        },
        data: custoemr,
      };
    } catch (error) {
      ManagerError.createSignatureError(error.message)
    }
  }
}
