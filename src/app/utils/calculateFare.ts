import { perKmRate } from "../constants";

export interface Coordinates {
  lat: number;
  lng: number;
}

export const calculateDistanceInKm = (from: Coordinates, to: Coordinates): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; 

  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.lat)) *
      Math.cos(toRad(to.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
};

export const calculateFare = (from: Coordinates, to: Coordinates): number => {
  const distanceKm = calculateDistanceInKm(from, to)
  const baseFare = 0; 
  return parseFloat((baseFare + distanceKm * perKmRate).toFixed(2));
};
