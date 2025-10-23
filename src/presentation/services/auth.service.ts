import { Token, cryptPss, envs } from "../../config";
import { UserModel } from "../../data";
import {
  CustomError,
  SignInUserDto,
  SignUpUserDto,
  UserEntity,
} from "../../domain";
import { EmailService } from "./email.service";

export class AuthService {
  constructor(private readonly _email: EmailService) {}

  public async signupUser(suDto: SignUpUserDto) {
    const userExist = await UserModel.findOne({ email: suDto.email });
    if (userExist) throw CustomError.badRequest("Email already exist");

    try {
      const user = new UserModel(suDto);
      // Encryp
      user.password = cryptPss.hash(suDto.password);
      await user.save();
      // Email validation
      await this.emailValilation(user.email);

      const { password, ..._user } = UserEntity.fromObj(user);

      // JWT
      const _token = await Token.generate({ id: user.id });
      if (!_token)
        throw CustomError.internalError("Error while generate token");

      return {
        user: _user,
        token: _token,
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

    const _token = await Token.generate({ id: user.id });
    if (!_token) throw CustomError.internalError("Error while generate token");

    return {
      user: _user,
      token: _token,
    };
  }

  private emailValilation = async (email: string) => {
    const token = await Token.generate({ email });
    if (!token) throw CustomError.internalError("Error getting token");

    const link = `${envs.API_URL}/auth/validate-email/${token}`;
    const html = `
      <h1>Validate email</h1>
      <p>Cilck on the folloing link to validate your email</p>
      <a href='${link}'>Validate email</a>
    `;
    const options = {
      to: email,
      subject: "Email validation",
      htmlBody: html,
    };

    const isSent = await this._email.sendEmail(options);
    if (!isSent)
      throw CustomError.internalError("Error sending email validation");

    return true;
  };

  public validateEmail = async (token: string) => {
    const payload = await Token.validate(token);
    if (!payload) throw CustomError.unAuthtorized("Invalid token");

    const { email } = payload as { email: string };
    if (!email) throw CustomError.internalError("Email not in token");

    const user = await UserModel.findOne({ email });
    if (!user) throw CustomError.internalError("Email not exist");

    user.emailValidated = true;
    await user.save();

    return true;
  };
}
