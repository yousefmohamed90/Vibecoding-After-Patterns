export interface IAccommodationService {
  bookAccommodation(studentId: string, accommodationId: string): Promise<boolean>
}
