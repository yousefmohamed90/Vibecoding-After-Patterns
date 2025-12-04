export class Student {
  constructor(
    public studentID: string,
    public name: string,
    public email: string,
    public passwordHash: string,
    public role: string = 'STUDENT',
    public registrationDate: Date = new Date()
  ) {}
}
