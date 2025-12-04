export class Accommodation {
  constructor(
    public accommodationID: string,
    public name: string,
    public location: string,
    public capacity: number,
    public pricePerNight: number,
    public imageUrl?: string,
    public description?: string,
    public amenities?: string[]
  ) {}
}
