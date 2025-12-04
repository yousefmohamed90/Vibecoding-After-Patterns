import React, { createContext, useContext, ReactNode } from 'react';
import { DatabaseProxy } from '../database/DatabaseProxy';
import { Repository } from '../repositories/Repository';
import { Controller } from '../controllers/Controller';
import { AuthenticationService } from '../services/implementations/AuthenticationService';
import { AuthorizationService } from '../services/implementations/AuthorizationService';
import { PaymentService } from '../services/implementations/PaymentService';
import { AccommodationService } from '../services/implementations/AccommodationService';
import { TransportService } from '../services/implementations/TransportService';
import { MealService } from '../services/implementations/MealService';
import { ClubService } from '../services/implementations/ClubService';
import { NotificationService } from '../services/implementations/NotificationService';
import { VisaPayment } from '../patterns/adapter/VisaPayment';
import { VCAdapter } from '../patterns/adapter/VCAdapter';

interface ServiceContextType {
  controller: Controller;
  authService: AuthenticationService;
  accommodationService: AccommodationService;
  transportService: TransportService;
  mealService: MealService;
  clubService: ClubService;
  notificationService: NotificationService;
  paymentService: PaymentService;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize architecture (Singleton) - memoized to prevent re-creation
  const services = React.useMemo(() => {
    const dbProxy = new DatabaseProxy();
    dbProxy.connect();

    const repository = new Repository(dbProxy);

    // Initialize services
    const authService = new AuthenticationService(repository);
    const authorizationService = new AuthorizationService(repository);

    // Payment processor (can switch between Visa and VirtualCoins)
    const paymentProcessor = new VisaPayment(); // or new VCAdapter()
    const paymentService = new PaymentService(repository, paymentProcessor);

    const accommodationService = new AccommodationService(repository, paymentService);
    const transportService = new TransportService(repository, paymentService);
    const mealService = new MealService(repository, paymentService);
    const clubService = new ClubService(repository, paymentService);
    const notificationService = new NotificationService(repository);

    // Initialize controller
    const controller = new Controller(
      accommodationService,
      transportService,
      mealService,
      clubService,
      notificationService,
      authorizationService
    );

    return {
      controller,
      authService,
      accommodationService,
      transportService,
      mealService,
      clubService,
      notificationService,
      paymentService,
    };
  }, []);

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useServices = (): ServiceContextType => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
};
