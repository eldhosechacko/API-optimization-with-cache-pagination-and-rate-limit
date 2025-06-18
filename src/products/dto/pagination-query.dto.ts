/*
----------------------------------------------------------------------
File: /src/products/dto/pagination-query.dto.ts
----------------------------------------------------------------------
This Data Transfer Object (DTO) defines the expected shape and validation
rules for pagination query parameters. Using DTOs with `class-validator`
and `class-transformer` makes request handling safer and more robust.
*/
import { Type } from 'class-transformer'; 
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // Transform incoming string to a number
  @Min(1)
  limit: number = 10; // Default value if not provided

  @IsOptional()
  @IsPositive()
  @Type(() => Number) // Transform incoming string to a number
  @Min(1)
  page: number = 1; // Default value if not provided
}
