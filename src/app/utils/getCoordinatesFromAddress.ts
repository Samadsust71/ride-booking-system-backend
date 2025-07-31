/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from 'node-fetch';

export const getCoordinatesFromAddress = async (address: string) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'RideBookingSystem/1.0' // required by Nominatim
    }
  });

  const data:any = await res.json();
  if (!data || data.length === 0) {
    throw new Error('Address not found');
  }

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
};
