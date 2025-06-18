/*
----------------------------------------------------------------------
File: /src/products/schemas/product.schema.ts
----------------------------------------------------------------------
This file defines the Mongoose schema for a 'Product'. This schema
maps to a MongoDB collection and defines the shape of the documents
within that collection.
*/
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 'General' })
  category: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
