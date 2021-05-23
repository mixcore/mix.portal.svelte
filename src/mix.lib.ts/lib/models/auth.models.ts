export class LoginModel {
  public email: string | undefined;
  public username: string | undefined;
  public password: string | undefined;
  public rememberMe = false;
  public returnUrl: string | undefined;
}

export class Token {
  public accessToken: string | undefined;
  public tokenType: string | undefined;
  public refreshToken: string | undefined;
  public expiresIn: number | undefined;
  public clientId: string | undefined;
  public issuedAt: Date | undefined;
  public expiresAt: Date | undefined;
  public deviceId: string | undefined;
  public info: UserInfo | undefined;
}

export class UserInfo {
  public additionalData: never | undefined;
  public roles: string[] | undefined;
}
