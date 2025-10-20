import {
  Repository,
  ObjectLiteral,
  SelectQueryBuilder,
  FindOptionsWhere,
  FindOptionsOrder,
} from "typeorm";
import { IPaginate, IPaginationResult } from "./pagination.interface";

interface IQueryPaginate<T extends ObjectLiteral> {
  query: Repository<T> | SelectQueryBuilder<T>;
  options: IPaginate;
  where?: FindOptionsWhere<T>;
  order?: FindOptionsOrder<T>;
}

export async function queryPaginate<T extends ObjectLiteral>(
  params: IQueryPaginate<T>
): Promise<IPaginationResult<T>> {
  const { query, options, where, order } = params;

  return query instanceof Repository
    ? queryRepository<T>(query, options, where, order)
    : queryBuilder<T>(query, options);
}

export async function queryBuilder<T extends ObjectLiteral>(
  query: SelectQueryBuilder<T>,
  options: IPaginate
): Promise<IPaginationResult<T>> {
  const { page, limit } = options;

  const _page = page > 0 ? page : 1;
  const _limit = limit > 0 ? limit : 10;

  const [data, totalItems] = await query
    .skip((_page - 1) * _limit)
    .take(_limit)
    .cache(true)
    .getManyAndCount();

  return {
    data,
    meta: {
      totalItems,
      itemCount: data.length,
      itemsPerPage: _limit,
      totalPages: Math.ceil(totalItems / _limit),
      currentPage: _page,
    },
  };
}

export async function queryRepository<T extends ObjectLiteral>(
  query: Repository<T>,
  options: IPaginate,
  where?: FindOptionsWhere<T>,
  order?: FindOptionsOrder<T>
): Promise<IPaginationResult<T>> {
  const { page, limit } = options;

  const _page = page > 0 ? page : 1;
  const _limit = limit > 0 ? limit : 10;

  const [data, totalItems] = await query.findAndCount({
    skip: (_page - 1) * _limit,
    take: _limit,
    where,
    order,
    cache: true,
  });
  return {
    data,
    meta: {
      totalItems,
      itemCount: data.length,
      itemsPerPage: _limit,
      totalPages: Math.ceil(totalItems / _limit),
      currentPage: _page,
    },
  };
}
