export type AccessToken = {
  iss: string; //issuer
  sub: string; // subject (уникальный идентификатор пользователя)
  exp: number; // expiration (timestamp)
};
