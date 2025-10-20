/**
 * RequestPagination class defines the structure for pagination parameters (swagger)
 */
export declare class RequestPagination {
    page?: number;
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
