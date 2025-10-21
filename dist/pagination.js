"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryPaginate = queryPaginate;
exports.queryBuilder = queryBuilder;
exports.queryRepository = queryRepository;
const typeorm_1 = require("typeorm");
const CacheTime = 60 * 1 * 1000; // 1 minute
async function queryPaginate(params) {
    const { select, query, options, queryRepositoryOption } = params;
    return query instanceof typeorm_1.Repository
        ? queryRepository(query, options, queryRepositoryOption)
        : queryBuilder(select, query, options);
}
async function queryBuilder(select, query, options) {
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
async function queryRepository(query, options, queryRepositoryOptions) {
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
//# sourceMappingURL=pagination.js.map