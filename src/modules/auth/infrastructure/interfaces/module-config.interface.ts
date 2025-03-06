export interface AuthModuleOptions {
  secret: string;
}

export interface AuthModuleOptionsAsync {
  inject: any[];
  useFactory: (
    ...args: any[]
  ) => AuthModuleOptions | Promise<AuthModuleOptions>;
}
