import { User } from 'src/users/user.model';

type Photo = {
  value: string;
  type?: string;
};

type RawJson = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
};

export type GoogleProfile = {
  provider: 'google';
  sub: string;
  id: string;
  displayName: string;
  name: {
    givenName: string;
    familyName: string;
  };
  given_name: string;
  family_name: string;
  photos: Photo[];
  picture?: string;
  _raw: string;
  _json: RawJson;
};

export type AuthInfo = {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: 'Bearer';
  id_token: string;
};

export type AuthResult = {
  user: AuthInfo & User;
};
