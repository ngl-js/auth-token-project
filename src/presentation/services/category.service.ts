import { CategoryModel } from "../../data";
import {
  CreateCategoryDto,
  CustomError,
  PaginationDto,
  UserEntity,
} from "../../domain";

export class CategoryService {
  constructor() {}

  public async createCategory(ccDto: CreateCategoryDto, user: UserEntity) {
    const exist = await CategoryModel.findOne({ name: ccDto.name });
    if (exist) throw CustomError.badRequest("Category already exist");

    try {
      const category = new CategoryModel({
        ...ccDto,
        user: user.id,
      });

      category.save();

      return {
        id: category.id,
        name: category.name,
        available: category.available,
      };
    } catch (error) {
      console.log(error);
      throw CustomError.internalError(`${error}`);
    }
  }

  async getCategories(pagination: PaginationDto) {
    const { page, limit } = pagination;

    try {
      const [total, categories] = await Promise.all<any>([
        CategoryModel.countDocuments(),
        CategoryModel.find()
          .skip((page - 1) * limit)
          .limit(limit),
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/categories?page=${page + 1}&limit=${limit}`,
        prev:
          page - 1 > 0
            ? `/api/categories?page=${page - 1}&limit=${limit}`
            : null,
        categories: categories.map((category: any) => ({
          id: category.id,
          name: category.name,
          available: category.available,
        })),
      };
    } catch (error) {
      throw CustomError.internalError("Internal error");
    }
  }
}
