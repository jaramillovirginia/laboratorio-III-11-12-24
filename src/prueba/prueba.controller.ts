import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { PruebaService } from './prueba.service';
import { CreatePruebaDto } from './dto/create-prueba.dto';
import { UpdatePruebaDto } from './dto/update-prueba.dto';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';

@Controller('prueba')
export class PruebaController {
  constructor(private readonly pruebaService: PruebaService) {}

  @Post()
  create(@Body() createPruebaDto: CreatePruebaDto) {
    return this.pruebaService.create(createPruebaDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.pruebaService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pruebaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updatePruebaDto: UpdatePruebaDto) {
    return this.pruebaService.update(id, updatePruebaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.pruebaService.remove(id);
  }
}
