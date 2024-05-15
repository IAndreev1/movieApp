

export class AuthRequest {
  constructor(
    public email: string,
    public password: string
  ) {}
}
export class UserDetail {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public password: string,
    public admin: boolean
  ) {}
}