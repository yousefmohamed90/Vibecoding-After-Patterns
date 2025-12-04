export class Admin {
  constructor(
    public adminID: string,
    public name: string,
    public email: string,
    public passwordHash: string,
    public role: string = 'ADMIN',
    public permissions: string[] = []
  ) { }
}
