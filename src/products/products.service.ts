/*
----------------------------------------------------------------------
File: /src/products/products.service.ts
----------------------------------------------------------------------
The service file contains the business logic. It interacts directly 
with the database (via the Mongoose model) to perform CRUD operations
and implements the logic for pagination and seeding.
*/
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
  ) {}

  /**
   * Finds a single product by its ID.
   * @param id - The ID of the product to find.
   */
  async findOne(id: string): Promise<Product> {
    console.log(`Fetching from DB... ID: ${id}`); // Log to show when DB is hit
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  /**
   * Retrieves a paginated list of products.
   * @param paginationQuery - DTO containing page and limit.
   */
  async findPaginated(paginationQuery: PaginationQueryDto) {
    const { page, limit } = paginationQuery;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.productModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.productModel.countDocuments(),
    ]);
    
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  
  /**
   * Seeds the database with 200 dummy products.
   * Clears existing products before seeding.
   */
  async seed() {
    await this.productModel.deleteMany({});
    const products = [];
    for (let i = 1; i <= 200; i++) {
      products.push({
        name: `Product ${i}`,
        price: parseFloat((Math.random() * 100 + 10).toFixed(2)),
        category: `Category ${Math.ceil(i / 20)}`,
      });
    }
    await this.productModel.insertMany(products);
    return { message: 'Database seeded successfully with 200 products.' };
  }
}