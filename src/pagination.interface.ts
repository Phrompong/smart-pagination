import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/**
 * RequestPagination class defines the structure for pagination parameters (swagger)
 */
export class RequestPagination {
  @ApiPropertyOptional({
    title: 'Page Number',
    description: 'The page number to retrieve',
    example: '1',
  })
  @IsString()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    title: 'Items Per Page',
    description: 'The number of items to retrieve per page',
    example: '10',
  })
  @IsString()
  @IsOptional()
  limit?: number;
}

export interface IPaginate {
  /**
   * Page number
   */
  page: number;

  /**
   * Items per page
   */
  limit: number;
}

export interface IPaginationResult<T> {
  /**
   * Array of data items
   */
  data: T[];
  meta: {
    /**
     * Total number of items
     */
    totalItems: number;

    /**
     * Number of items on the current page
     */
    itemCount: number;

    /**
     * Number of items per page
     */
    itemsPerPage: number;

    /**
     * Total number of pages
     */
    totalPages: number;

    /**
     * Current page number
     */
    currentPage: number;
  };
}
