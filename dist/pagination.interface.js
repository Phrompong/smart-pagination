"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestPagination = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
/**
 * RequestPagination class defines the structure for pagination parameters (swagger)
 */
class RequestPagination {
}
exports.RequestPagination = RequestPagination;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        title: 'Page Number',
        description: 'The page number to retrieve',
        example: '1',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], RequestPagination.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        title: 'Items Per Page',
        description: 'The number of items to retrieve per page',
        example: '10',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], RequestPagination.prototype, "limit", void 0);
//# sourceMappingURL=pagination.interface.js.map