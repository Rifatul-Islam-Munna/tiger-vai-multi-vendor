export type BasicUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  address?: string;

  // vendor only
  shopName?: string;
  shopLogo?: string;
  shopAddress?: string;
};
