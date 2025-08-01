import { Types } from 'mongoose';

export enum IsApprove {
    APPROVED = "APPROVED",
    PENDING = "PENDING",
    SUSPENDED = "SUSPENDED",
    BLOCKED = "BLOCKED"
}

export enum IsAvailable {
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE"
}

export interface IDriver {
  _id?: Types.ObjectId;
  user: Types.ObjectId;

  vehicleType: string;
  vehicleModel?:string;
  vehicleNumber: string;

  approvalStatus: IsApprove;
  availabilityStatus: IsAvailable;
  drivingLocation?:string

  location: {
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
};

  earnings: number;

  createdAt?: Date;
  updatedAt?: Date;
}