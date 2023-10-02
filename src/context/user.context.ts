import { AuthUser } from '../auth/auth.types';

export class UserContext {
  constructor(public user: AuthUser) {}
}
