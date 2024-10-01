// IProviderWebpartProps.ts
import { IDepartment } from './IDepartment';

export interface IProviderWebpartProps {
  description: string;
  context: any; // Update to your specific context type
  siteUrl: string;
  onDepartmentSelected: (department: IDepartment) => void; // Ensure this is included
}
