/*
----------------------------------------------------------------------
File: /src/app.module.ts
----------------------------------------------------------------------
This is the root module of the application. It imports and configures all 
the necessary modules for the entire app, including Mongoose for the 
database, Throttler for rate limiting, and Cache for caching.
*/
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    // --- Database Configuration ---
    // Connect to the MongoDB database.
    MongooseModule.forRoot('mongodb://localhost/nestjs-optimization-demo'),

    // --- Rate Limiting Configuration ---
    // Configure global rate limiting.
    ThrottlerModule.forRoot([{
      name: 'default',
      ttl: 10000, // 10 seconds
      limit: 5,   // 5 requests per 10 seconds per IP
    }]),

    // --- Caching Configuration ---
    // Configure global caching. TTL is 2 minutes.
    CacheModule.register({
      isGlobal: true, // Makes CacheModule available globally
      ttl: 120 * 1000, // 120 seconds
    }),

    // --- Feature Module ---
    // Import the module that contains our application's business logic.
    ProductsModule,
  ],
  controllers: [],
  providers: [
    // --- Global Guard for Rate Limiting ---
    // Apply the ThrottlerGuard to all routes in the application.
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}