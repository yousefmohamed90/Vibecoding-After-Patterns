import { IMealBuilder } from './IMealBuilder'
import { MealProduct } from './MealProduct'

export class HealthyMealBuilder implements IMealBuilder {
  private meal = new MealProduct()
  setMain(main: string) { this.meal.main = main }
  setDrink(drink: string) { this.meal.drink = drink }
  setDessert(dessert: string) { this.meal.dessert = dessert }
  build() { return this.meal }
}
