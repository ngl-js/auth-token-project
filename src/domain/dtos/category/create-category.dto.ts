export class CreateCategoryDto {
  constructor(
    public name: string,
    public available: boolean,
  ) {}

  static create(obj: { [key: string]: any }): [string?, CreateCategoryDto?] {
    const { name, available } = obj;
    let setAvailable: boolean = available;

    if (!name) return ["Missing name"];
    if (typeof setAvailable !== "boolean") setAvailable = available === "true";

    return [undefined, new CreateCategoryDto(name, setAvailable)];
  }
}
