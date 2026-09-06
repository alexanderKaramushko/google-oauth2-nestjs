import {
  AuthInfo as AuthInfoExtend,
  OAuthState,
} from 'src/modules/open-id/open-id.interface';
import { User as UserExtend } from 'src/modules/users/user.model';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends UserExtend {}

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface AuthInfo extends AuthInfoExtend {}

    interface Request {
      oauthState?: OAuthState;
    }
  }
}

export {};
