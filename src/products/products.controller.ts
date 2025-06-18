/*
----------------------------------------------------------------------
File: /src/products/products.controller.ts
----------------------------------------------------------------------
The controller is responsible for handling incoming HTTP requests and
sending back responses. It uses decorators to define routes and to
apply features like caching and validation.
*/
import { Controller, Get, Param, Post, Query, UseInterceptors, ClassSerializerInterceptor, ParseIntPipe, DefaultValuePipe, UseGuards } from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ProductsService } from './products.service';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * GET /products/paginated
   * Demonstrates pagination.
   * Uses a DTO with `class-validator` and `class-transformer` for robust query param handling.
   */
  @Get('paginated')
  async getPaginatedProducts(@Query() paginationQuery: PaginationQueryDto) {
    return this.productsService.findPaginated(paginationQuery);
  }

  /**
   * GET /products/:id
   * Demonstrates caching.
   * The response for a given ID will be cached for 2 minutes.
   */
  @UseInterceptors(CacheInterceptor) // Automatically cache the response of this endpoint
  @CacheTTL(120 * 1000) // Override global TTL to 2 minutes for this specific route
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
  
  /**
   * POST /products/seed
   * A utility endpoint to populate the database with dummy data.
   */
  @Post('seed')
  async seedDatabase() {
    return this.productsService.seed();
  }
}