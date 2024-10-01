
export interface IAnnonymousapiProps {
  id: number;
  username: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  company: string;
  description?: string; // Make sure this matches if you are passing it or not
}
