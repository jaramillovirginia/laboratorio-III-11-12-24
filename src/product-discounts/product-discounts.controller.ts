import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ProductDiscountService } from './product-discounts.service';
import { CreateProductDiscountDto } from './dto/create-product-discount.dto';
import { UpdateProductDiscountDto } from './dto/update-product-discount.dto';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';
import { UpdateDiscountDto } from 'src/discount/dto/update-discount.dto';

@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: ProductDiscountService) {}

  @Post()
  create(@Body() createProductDiscountDto : CreateProductDiscountDto) {
    return this.discountService.create(createProductDiscountDto);
  }

  @Get()
  findAll( @Query() paginationDto: PaginationDto ) {
    return this.discountService.findAll( paginationDto );
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.discountService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updatediscountDto: UpdateDiscountDto) {
    return this.discountService.update(id, updatediscountDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.discountService.remove(id);
  }
}
