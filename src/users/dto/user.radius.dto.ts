export class UserRadiusDto {
  location: {
    type: string;
    coordinates: [number, number];
  };
  radius: number;
}
