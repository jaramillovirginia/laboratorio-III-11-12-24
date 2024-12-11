import { Module } from '@nestjs/common';

import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from './common/config/data.source';
import { WarehousesModule } from './warehouses/warehouses.module';
import { StocksModule } from './stocks/stocks.module';
import { AuthModule } from './auth/auth.module';
import { PurchasesModule } from './purchases/purchases.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { PruebaModule } from './prueba/prueba.module';
import { TestModule } from './test/test.module';
import { CustomersModule } from './customers/customers.module';
import { DiscountModule } from './discount/discount.module';
import { ProductDiscountsModule } from './product-discounts/product-discounts.module';

@Module({
  imports: [ 
    ConfigModule.forRoot({
      envFilePath: `.env.development`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(DataSourceConfig),
    ProductsModule, 
    CategoriesModule, 
    SuppliersModule, 
    UsersModule, WarehousesModule, StocksModule, AuthModule, PurchasesModule, PaymentMethodsModule, PruebaModule, TestModule, CustomersModule, DiscountModule, ProductDiscountsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}