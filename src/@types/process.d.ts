declare namespace NodeJS {
  interface ProcessEnv {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    OAUTH_CALLBACK_HOST: string;
    MONGO_DB_NAME: string;
    MONGO_DB_PORT: string;
    MONGO_DB_HOST: string;
    BOOTSTRAP_MICROSERVICE: string;
    SERVICE_HOST: string;
    SERVICE_PORT: string;
    MICROSERVICE_HOST: string;
    MICROSERVICE_PORT: string;
  }
}
