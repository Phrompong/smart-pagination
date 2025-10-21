import { Repository, ObjectLiteral, SelectQueryBuilder, FindManyOptions } from "typeorm";
import { IPaginate, IPaginationResult } from "./pagination.interface";
interface IQueryPaginate<T extends ObjectLiteral> {
    /**
     * Select fields to be returned
     */
    select: string[];
    /**
     * TypeORM Repository or QueryBuilder instance
     */
    query: Repository<T> | SelectQueryBuilder<T>;
    /**
     * Pagination options
     */
    options: IPaginate;
    /**
     * Additional options for repository queries
     */
    queryRepositoryOption?: FindManyOptions<T>;
}
export declare function queryPaginate<T extends ObjectLiteral>(params: IQueryPaginate<T>): Promise<IPaginationResult<T>>;
export declare function queryBuilder<T extends ObjectLiteral>(select: string[], query: SelectQueryBuilder<T>, options: IPaginate): Promise<IPaginationResult<T>>;
export declare function queryRepository<T extends ObjectLiteral>(query: Repository<T>, options: IPaginate, queryRepositoryOptions?: FindManyOptions<T>): Promise<IPaginationResult<T>>;
export {};
