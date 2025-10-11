import { regularExps } from "../../../config";

export class SignUpUserDto {
  constructor(
    public name: string,
    public email: string,
    public password: string,
  ) {}

  static create(obj: { [key: string]: any }): [string?, SignUpUserDto?] {
    const { name, email, password } = obj;

    if (!name) return ["Missing name"];
    if (!email) return ["Missing email"];
    if (!regularExps.email.test(email)) return ["Email is not valid"];
    if (!password) return ["Missing password"];
    if (password.length < 5) return ["Password is too weak"];

    return [undefined, new SignUpUserDto(name, email, password)];
  }
}
