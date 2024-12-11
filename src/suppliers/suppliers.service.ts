import { Injectable } from "@nestjs/common";

import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";
import { SupplierEntity } from "./entities/supplier.entity";
import { ManagerError } from "src/common/errors/manager.error";
import { PaginationDto } from '../common/dtos/pagination/pagination.dto';
import { ResponseAllSuppliers } from "./interfaces/response-suppliers.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";

@Injectable()
export class SuppliersService {

    constructor(
        @InjectRepository(SupplierEntity)
        private readonly supplierRepository: Repository<SupplierEntity>
    ) { }


    async create(createSupplierDto: CreateSupplierDto): Promise<SupplierEntity> {
        try {
            const supplier = await this.supplierRepository.save(createSupplierDto)
            if (!supplier) {
                throw new ManagerError({
                    type: 'CONFLICT',
                    message: 'Supplier not created!',
                });
            }
            return supplier;
        } catch (error) {
            ManagerError.createSignatureError(error.message);
        }
    }

    async findAll(paginationDto: PaginationDto): Promise<ResponseAllSuppliers> {
        const { limit, page } = paginationDto;
        const skip = (page - 1) * limit;
        try {
            const [total, data] = await Promise.all([
                this.supplierRepository.count({ where: { isActive: true } }),
                this.supplierRepository.find({ where: { isActive: true }, take: limit, skip: skip })
            ])
            const lastPage = Math.ceil(total / limit);

            if (!data) {
                new ManagerError({
                    type: "NOT_FOUND",
                    message: "No hay Suppliers"
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

    async findOne(id: string): Promise<SupplierEntity> {
        try {
            const supplier = await this.supplierRepository.findOne({ where: { id: id } })
            if (!supplier) {
                throw new ManagerError({
                    type: 'NOT_FOUND',
                    message: 'Supplier not found',
                });
            }
            return supplier;
        } catch (error) {
            ManagerError.createSignatureError(error.message);
        }
    }

    async update(id: string, updateSupplierDto: UpdateSupplierDto): Promise<UpdateResult> {
        try {
            const supplier = await this.supplierRepository.update(id, updateSupplierDto)
            if (supplier.affected === 0) {
                throw new ManagerError({
                    type: 'NOT_FOUND',
                    message: 'Supplier not found',
                });
            }
            return supplier
        } catch (error) {
            ManagerError.createSignatureError(error.message);
        }
    }

    async remove(id: string): Promise<UpdateResult> {
        try {
            const supplier = await this.supplierRepository.update({ id }, { isActive: false })
            if (supplier.affected === 0) {
                throw new ManagerError({
                    type: 'NOT_FOUND',
                    message: 'Supplier not found',
                });
            }

            return supplier
        } catch (error) {
            ManagerError.createSignatureError(error.message);
        }
    }
}