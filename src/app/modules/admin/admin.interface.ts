export interface IAdminReport {
  totalUsers: number;
  totalDrivers: number;
  totalRides: number;
  totalCompletedRides: number;
  totalOngoingRides: number;
  totalEarnings: number;
  topFiveDrivers: {
    driverId: string;
    avgRating: number;
    totalRides: number;
    name: string;
    email: string;
  }[];
}