import { IMealFactory } from './IMealFactory'

export class HealthyMealFactory implements IMealFactory {
  createMainDish() { return 'Grilled Chicken' }
  createDrink() { return 'Water' }
  createDessert() { return 'Fruit' }
}
