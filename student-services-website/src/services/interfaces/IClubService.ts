export interface IClubService {
  joinClub(studentId: string, clubId: string): Promise<boolean>
}
