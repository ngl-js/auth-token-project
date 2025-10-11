import { regularExps } from "../../../config";

export class SignInUserDto {
  constructor(
    public email: string,
    public password: string,
  ) {}

  static create(obj: { [key: string]: any }): [string?, SignInUserDto?] {
    const { email, password } = obj;

    if (!email) return ["Missing email"];
    if (!regularExps.email.test(email)) return ["Email is not valid"];
    if (!password) return ["Missing password"];
    if (password.length < 5) return ["Password is too weak"];

    return [undefined, new SignInUserDto(email, password)];
  }
}
