export interface IController {
  handleAccommodationRequest(studentID: string, accommodationID: string): Promise<void>;
  handleTransportRequest(studentID: string, transportID: string): Promise<void>;
  handleMealRequest(studentID: string, mealType: string): Promise<void>;
  handleClubRequest(studentID: string, clubID: string): Promise<void>;
  sendStudentNotification(studentID: string, message: string, type: 'EMAIL' | 'SMS' | 'SYSTEM'): void;
}
