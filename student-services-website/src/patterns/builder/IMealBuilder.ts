export interface IMealBuilder {
  setMain(main: string): void
  setDrink(drink: string): void
  setDessert(dessert: string): void
  build(): any
}
