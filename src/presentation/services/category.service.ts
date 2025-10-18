import { CategoryModel } from "../../data";
import { CreateCategoryDto, CustomError, UserEntity } from "../../domain";

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

  async getCategories() {
    try {
      let categories = await CategoryModel.find();

      return categories.map((category: any) => ({
        id: category.id,
        name: category.name,
        available: category.available,
      }));
    } catch (error) {
      throw CustomError.internalError("Internal error");
    }
  }
}
