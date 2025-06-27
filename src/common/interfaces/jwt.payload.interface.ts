export class JwtPayloadInterface {
  sub: string;
  role: string;
  iat?: number;
  exp?: number;
}
