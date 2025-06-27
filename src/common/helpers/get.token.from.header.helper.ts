import { UnauthorizedException } from '@nestjs/common';

export function getTokenFromHeaderHelper(authorizationToken: string): string {
  if (!authorizationToken || !authorizationToken.startsWith('Bearer ')) {
    throw new UnauthorizedException('Token missing');
  }

  const token = authorizationToken.split(' ')[1];
  return token;
}
