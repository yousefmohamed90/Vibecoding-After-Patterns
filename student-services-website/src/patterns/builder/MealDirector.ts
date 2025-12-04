import { IMealBuilder } from './IMealBuilder'

export class MealDirector {
  constructor(private builder: IMealBuilder) {}
  constructRegular() { this.builder.setMain('Burger'); this.builder.setDrink('Soda'); this.builder.setDessert('Cake'); return this.builder.build() }
}
