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

  async handleAccommodationRequest(userId: string, accommodationId: string): Promise<void> {
    console.log(`🎮 Controller: Handling accommodation request for user ${userId}`);
    // Check permission via authorization service (simplified for now)
    
    await this.accommodationService.bookAccommodation(userId, accommodationId);
    await this.notificationService.sendNotification(userId, 'Accommodation booked successfully');
  }

  async handleTransportRequest(userId: string, transportId: string): Promise<void> {
    console.log(`🎮 Controller: Handling transport request for user ${userId}`);
    await this.transportService.requestTransport(userId, { transportId });
    await this.notificationService.sendNotification(userId, 'Transport booked successfully');
  }

  async handleMealRequest(userId: string, mealId: string): Promise<void> {
    console.log(`🎮 Controller: Handling meal request for user ${userId}`);
    await this.mealService.orderMeal(userId, mealId);
    await this.notificationService.sendNotification(userId, 'Meal ordered successfully');
  }

  async handleClubRequest(userId: string, clubId: string): Promise<void> {
    console.log(`🎮 Controller: Handling club request for user ${userId}`);
    await this.clubService.joinClub(userId, clubId);
    await this.notificationService.sendNotification(userId, 'Club joined successfully');
  }

  async sendStudentNotification(userId: string, message: string): Promise<void> {
    console.log(`🎮 Controller: Sending notification to student ${userId}`);
    await this.notificationService.sendNotification(userId, message);
  }

  initializeRoutes(): void {
    console.log('🎮 Controller: Routes initialized');
    // Routing logic would go here
  }
}
