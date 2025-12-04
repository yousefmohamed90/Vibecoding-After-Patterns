import { IController } from './IController';
import { IAccommodationService } from '../services/interfaces/IAccommodationService';
import { ITransportService } from '../services/interfaces/ITransportService';
import { IMealService } from '../services/interfaces/IMealService';
import { IClubService } from '../services/interfaces/IClubService';
import { INotificationService } from '../services/interfaces/INotificationService';
import { IAuthorizationService } from '../services/interfaces/IAuthorizationService';

export class Controller implements IController {
  constructor(
    private accommodationService: IAccommodationService,
    private transportService: ITransportService,
    private mealService: IMealService,
    private clubService: IClubService,
    private notificationService: INotificationService,
    private authorizationService: IAuthorizationService
  ) {
    console.log('🎮 Controller: Created (Facade Pattern)');
  }

  async handleAccommodationRequest(studentID: string, accommodationID: string): Promise<void> {
    console.log(`🎮 Controller: Handling accommodation request for student ${studentID}`);

    // Check authorization
    if (!this.authorizationService.checkPermission(studentID, 'accommodation', 'book')) {
      throw new Error('Unauthorized: Cannot book accommodation');
    }

    try {
      // Delegate to service
      this.accommodationService.bookHousing(studentID, accommodationID);

      // Send confirmation notification
      this.notificationService.sendNotification(
        studentID,
        'Your accommodation booking has been confirmed!',
        'SYSTEM'
      );

      console.log('✅ Controller: Accommodation request handled successfully');
    } catch (error) {
      console.error('❌ Controller: Accommodation request failed:', error);

      // Send failure notification
      this.notificationService.sendNotification(
        studentID,
        `Accommodation booking failed: ${(error as Error).message}`,
        'SYSTEM'
      );

      throw error;
    }
  }

  async handleTransportRequest(studentID: string, transportID: string): Promise<void> {
    console.log(`🎮 Controller: Handling transport request for student ${studentID}`);

    if (!this.authorizationService.checkPermission(studentID, 'transport', 'book')) {
      throw new Error('Unauthorized: Cannot book transport');
    }

    try {
      this.transportService.bookTransport(studentID, transportID);

      this.notificationService.sendNotification(
        studentID,
        'Your transport booking has been confirmed!',
        'SYSTEM'
      );

      console.log('✅ Controller: Transport request handled successfully');
    } catch (error) {
      console.error('❌ Controller: Transport request failed:', error);

      this.notificationService.sendNotification(
        studentID,
        `Transport booking failed: ${(error as Error).message}`,
        'SYSTEM'
      );

      throw error;
    }
  }

  async handleMealRequest(studentID: string, mealType: string): Promise<void> {
    console.log(`🎮 Controller: Handling meal request for student ${studentID}`);

    if (!this.authorizationService.checkPermission(studentID, 'meal', 'order')) {
      throw new Error('Unauthorized: Cannot order meal');
    }

    try {
      this.mealService.selectMeal(studentID, mealType);

      this.notificationService.sendNotification(
        studentID,
        'Your meal order has been confirmed!',
        'SYSTEM'
      );

      console.log('✅ Controller: Meal request handled successfully');
    } catch (error) {
      console.error('❌ Controller: Meal request failed:', error);

      this.notificationService.sendNotification(
        studentID,
        `Meal order failed: ${(error as Error).message}`,
        'SYSTEM'
      );

      throw error;
    }
  }

  async handleClubRequest(studentID: string, clubID: string): Promise<void> {
    console.log(`🎮 Controller: Handling club request for student ${studentID}`);

    if (!this.authorizationService.checkPermission(studentID, 'club', 'join')) {
      throw new Error('Unauthorized: Cannot join club');
    }

    try {
      this.clubService.chooseClub(studentID, clubID);

      this.notificationService.sendNotification(
        studentID,
        'Your club membership has been confirmed!',
        'SYSTEM'
      );

      console.log('✅ Controller: Club request handled successfully');
    } catch (error) {
      console.error('❌ Controller: Club request failed:', error);

      this.notificationService.sendNotification(
        studentID,
        `Club membership failed: ${(error as Error).message}`,
        'SYSTEM'
      );

      throw error;
    }
  }

  sendStudentNotification(studentID: string, message: string, type: 'EMAIL' | 'SMS' | 'SYSTEM'): void {
    console.log(`🎮 Controller: Sending notification to student ${studentID}`);
    this.notificationService.sendNotification(studentID, message, type);
  }
}
