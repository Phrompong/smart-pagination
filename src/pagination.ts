import {
  Repository,
  ObjectLiteral,
  SelectQueryBuilder,
  FindManyOptions,
} from "typeorm";
import { IPaginate, IPaginationResult } from "./pagination.interface";

/**
 * Cache time in milliseconds
 */
const CacheTime = 60 * 1 * 1000; // 1 minute

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

export async function queryPaginate<T extends ObjectLiteral>(
  params: IQueryPaginate<T>
): Promise<IPaginationResult<T>> {
  const { select, query, options, queryRepositoryOption } = params;

  return query instanceof Repository
    ? queryRepository<T>(query, options, queryRepositoryOption)
    : queryBuilder<T>(select, query, options);
}

export async function queryBuilder<T extends ObjectLiteral>(
  select: string[],
  query: SelectQueryBuilder<T>,
  options: IPaginate
): Promise<IPaginationResult<T>> {
  const { page, limit } = options;

  const _page = page > 0 ? page : 1;
  const _limit = limit > 0 ? limit : 10;

  const [data, totalItems] = await query
    .select(select)
    .skip((_page - 1) * _limit)
    .take(_limit)
    .cache(CacheTime)
    .getManyAndCount();

  return {
    data,
    meta: {
      totalItems,
      itemCount: data.length,
      itemsPerPage: Number(_limit),
      totalPages: Math.ceil(totalItems / _limit),
      currentPage: Number(_page),
    },
  };
}

export async function queryRepository<T extends ObjectLiteral>(
  query: Repository<T>,
  options: IPaginate,
  queryRepositoryOptions?: FindManyOptions<T>
): Promise<IPaginationResult<T>> {
  const { page, limit } = options;

  const _page = page > 0 ? page : 1;
  const _limit = limit > 0 ? limit : 10;

  const [data, totalItems] = await query.findAndCount({
    ...queryRepositoryOptions,
    skip: (_page - 1) * _limit,
    take: _limit,
    cache: CacheTime,
  });
  return {
    data,
    meta: {
      totalItems,
      itemCount: data.length,
      itemsPerPage: Number(_limit),
      totalPages: Math.ceil(totalItems / _limit),
      currentPage: Number(_page),
    },
  };
}
