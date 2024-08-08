import { BarberShopEntity } from "@/common/entities/barberShopEntity";

export interface UserContextType {
  updateUser: ({ id, email }: Partial<BarberShopEntity>) => void;
  allUsers?: BarberShopEntity[] | null;
  loading: Record<string, boolean>;
  fetchAllUsers: () => void;
  userObject: any;
  setUserObject: (userObject: any) => void;
}
