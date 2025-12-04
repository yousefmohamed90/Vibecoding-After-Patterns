export interface IClubService {
  chooseClub(studentID: string, clubID: string): void;
  cancelClubMembership(studentID: string, clubID: string): void;
  getAvailableClubs(): any[];
  getStudentMemberships(studentID: string): any[];
}
