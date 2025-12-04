export class Meal {
  constructor(
    public mealID: string,
    public name: string,
    public type: string,
    public price: number,
    public calories?: number,
    public description?: string,
    public ingredients?: string[]
  ) { }
}
