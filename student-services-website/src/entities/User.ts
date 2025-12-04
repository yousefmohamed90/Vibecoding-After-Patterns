export class User {
  constructor(
    public userID: string,
    public email: string,
    public passwordHash: string,
    public role: string,
    public createdDate: Date = new Date()
  ) { }
}
