"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryPaginate = queryPaginate;
exports.queryBuilder = queryBuilder;
exports.queryRepository = queryRepository;
const typeorm_1 = require("typeorm");
async function queryPaginate(params) {
    const { query, options, where, order } = params;
    return query instanceof typeorm_1.Repository
        ? queryRepository(query, options, where, order)
        : queryBuilder(query, options);
}
async function queryBuilder(query, options) {
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
async function queryRepository(query, options, where, order) {
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
//# sourceMappingURL=pagination.js.map