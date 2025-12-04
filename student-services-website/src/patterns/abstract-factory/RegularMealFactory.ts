import { IMealFactory } from './IMealFactory'

export class RegularMealFactory implements IMealFactory {
  createMainDish() { return 'Burger' }
  createDrink() { return 'Soda' }
  createDessert() { return 'Cake' }
}
