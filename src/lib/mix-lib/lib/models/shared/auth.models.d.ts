export declare class LoginModel {
    email: string | undefined;
    username: string | undefined;
    password: string | undefined;
    rememberMe: boolean;
    returnUrl: string | undefined;
}
export declare class Token {
    accessToken: string | undefined;
    tokenType: string | undefined;
    refreshToken: string | undefined;
    expiresIn: number | undefined;
    clientId: string | undefined;
    issuedAt: Date | undefined;
    expiresAt: Date | undefined;
    deviceId: string | undefined;
    info: UserInfo | undefined;
}
export declare class UserInfo {
    additionalData: never | undefined;
    roles: string[] | undefined;
}
