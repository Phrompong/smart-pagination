# Smart Pagination

Smart Pagination is a lightweight TypeScript helper for TypeORM projects that need consistent, metadata-rich pagination. It supports both repositories and query builders, and it includes a NestJS-friendly DTO so you can validate and document pagination parameters without additional boilerplate.

## Highlights

- Works with TypeORM repositories or query builders
- Ships with a Swagger-ready DTO (`RequestPagination`)
- Normalises and defaults pagination input (`page = 1`, `limit = 10`)
- Returns typed pagination metadata alongside your data
- Enables TypeORM caching with a 60-second TTL for paginated queries

## Requirements

- Node.js 16 or later (matches TypeORM 0.3 minimum)
- TypeScript 5+
- TypeORM `^0.3.0`
- `class-validator`
- `@nestjs/swagger` (optional, recommended for NestJS + Swagger projects)

## Installation

```bash
npm install smart-pagination
```

The peer dependencies (`typeorm`, `class-validator`, and optionally `@nestjs/swagger`) should already exist in your application.

## Quick Start

### NestJS Controller (Repository)

```ts
import { Controller, Get, Query } from "@nestjs/common";
import { queryPaginate, RequestPagination } from "smart-pagination";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async list(@Query() request: RequestPagination) {
    const { page = "1", limit = "10" } = request; // DTO fields arrive as strings

    return queryPaginate({
      query: this.usersService.usersRepository,
      options: {
        page: Number(page),
        limit: Number(limit),
      },
      where: { isActive: true },
      order: { createdAt: "DESC" },
    });
  }
}
```

### Standalone Query Builder

```ts
import { queryBuilder } from "smart-pagination";
import { DataSource } from "typeorm";

async function listPublishedPosts(dataSource: DataSource) {
  const qb = dataSource
    .getRepository(Post)
    .createQueryBuilder("post")
    .leftJoinAndSelect("post.author", "author")
    .where("post.isPublished = :isPublished", { isPublished: true })
    .orderBy("post.publishedAt", "DESC");

  const { data, meta } = await queryBuilder(qb, { page: 2, limit: 20 });

  return { data, meta };
}
```

## API Reference

### `queryPaginate({ query, options, where?, order? })`

- **query**: TypeORM `Repository<T>` or `SelectQueryBuilder<T>`
- **options**: `{ page: number; limit: number }`
- **where**: optional `FindOptionsWhere<T>` forwarded to `findAndCount`
- **order**: optional `FindOptionsOrder<T>` forwarded to `findAndCount`
- Returns `Promise<IPaginationResult<T>>`

Internally delegates to `queryRepository` when a repository instance is supplied, or `queryBuilder` when supplied a query builder.

### `queryBuilder(query, options)`

- **query**: TypeORM `SelectQueryBuilder<T>`
- **options**: `{ page: number; limit: number }`
- Applies `.skip`, `.take`, `.cache(60 * 1000)`, then resolves via `getManyAndCount`.

### `queryRepository(query, options, where?, order?)`

- **query**: TypeORM `Repository<T>`
- **options**: `{ page: number; limit: number }`
- `where` and `order` are passed directly to `findAndCount` together with pagination and caching.

### `RequestPagination`

- Class-based DTO for NestJS
- Uses `class-validator` to mark `page` and `limit` as optional string inputs
- Decorated with `@ApiPropertyOptional` for Swagger/OpenAPI
- Convert the values to numbers before passing them to the helpers

### Pagination Result

Every helper resolves to:

```ts
interface IPaginationResult<T> {
  data: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
```

`page` and `limit` inputs that are missing or <= 0 automatically fall back to 1 and 10 respectively.

## Tips

- TypeORM caching is enabled with a 60-second TTL (`cache: 60 * 1000`) on every call. Adjust your global cache configuration if you need a different cache behaviour.
- Helper metadata values are normalised to numbers, so `meta.itemsPerPage` and `meta.currentPage` always return numeric types.
- If you accept pagination parameters from query strings, remember that they arrive as strings. Perform `Number(...)` conversion or use `class-transformer` to coerce values.
- For complex filters, pass a TypeORM query builder to keep full control over joins and projections.

## Development

```bash
npm install
npm run build
```

Compiled JavaScript and type declarations are emitted to `dist/`.

## License

ISC © 2024
