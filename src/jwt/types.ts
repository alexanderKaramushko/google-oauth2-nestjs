export type JWT = {
  iss: string; //issuer
  azp: string; // authorized party
  aud: string; // audience
  sub: string; // subject (уникальный идентификатор пользователя)
  at_hash: string; // hash access token
  name: string;
  picture: string; // URL фотографии
  given_name: string;
  family_name: string;
  iat: number; // issued at (timestamp)
  exp: number; // expiration (timestamp)
};
