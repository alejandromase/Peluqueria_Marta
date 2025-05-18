export interface User {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  isActive: boolean;
  roles: string[];
  address_street?: string;
  address_city?: string;
  address_state?: string;
  address_postal_code?: string;
}
