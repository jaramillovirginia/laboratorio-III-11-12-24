import { Module } from '@nestjs/common';
import { ProductDiscountsService } from './product-discounts.service';
import { ProductDiscountsController } from './product-discounts.controller';

@Module({
  controllers: [ProductDiscountsController],
  providers: [ProductDiscountsService],
})
export class ProductDiscountsModule {}
