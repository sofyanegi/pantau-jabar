export interface City {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CCTV {
  id: string;
  name: string;
  streamUrl: string;
  lat: number;
  lng: number;
  cityId: string;
  createdAt: string;
  updatedAt: string;
  city: City;
}
