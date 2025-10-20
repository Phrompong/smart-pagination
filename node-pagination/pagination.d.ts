import { Repository, ObjectLiteral, SelectQueryBuilder, FindOptionsWhere, FindOptionsOrder } from "typeorm";
import { IPaginate, IPaginationResult } from "./pagination.interface";
interface IQueryPaginate<T extends ObjectLiteral> {
    query: Repository<T> | SelectQueryBuilder<T>;
    options: IPaginate;
    where?: FindOptionsWhere<T>;
    order?: FindOptionsOrder<T>;
}
export declare function queryPaginate<T extends ObjectLiteral>(params: IQueryPaginate<T>): Promise<IPaginationResult<T>>;
export declare function queryBuilder<T extends ObjectLiteral>(query: SelectQueryBuilder<T>, options: IPaginate): Promise<IPaginationResult<T>>;
export declare function queryRepository<T extends ObjectLiteral>(query: Repository<T>, options: IPaginate, where?: FindOptionsWhere<T>, order?: FindOptionsOrder<T>): Promise<IPaginationResult<T>>;
export {};
