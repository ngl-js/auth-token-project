import { Token, cryptPss } from "../../config";
import { UserModel } from "../../data";
import {
  CustomError,
  SignInUserDto,
  SignUpUserDto,
  UserEntity,
} from "../../domain";

export class AuthService {
  constructor() {}

  public async signupUser(suDto: SignUpUserDto) {
    const userExist = await UserModel.findOne({ email: suDto.email });
    if (userExist) throw CustomError.badRequest("Email already exist");

    try {
      const user = new UserModel(suDto);
      // Encryp
      user.password = cryptPss.hash(suDto.password);
      await user.save();
      // JWT
      // Email validation

      const { password, ..._user } = UserEntity.fromObj(user);

      return {
        user: _user,
        token: "ABC",
      };
    } catch (error) {
      throw CustomError.internalError(`${error}`);
    }
  }

  public async signinUser(siDto: SignInUserDto) {
    const user = await UserModel.findOne({ email: siDto.email });
    if (!user) throw CustomError.badRequest("Email or user not exist");

    const pssMached = cryptPss.compare(siDto.password, user.password);
    if (!pssMached) throw CustomError.badRequest("Password or email incorrect");

    const { password, ..._user } = UserEntity.fromObj(user);

    const _token = await Token.generate({ id: user.id, email: user.email });
    if (!_token) throw CustomError.internalError("Error while generate token");

    return {
      user: _user,
      token: _token,
    };
  }
}
