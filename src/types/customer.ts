export interface Customer {
  Id: string;
  DisplayName: string;
  GivenName?: string;
  FamilyName?: string;
  CompanyName?: string;
  PrimaryEmailAddr?: {
    Address?: string;
  };
  PrimaryPhone?: {
    FreeFormNumber?: string;
  };
  Mobile?: {
    FreeFormNumber?: string;
  };
  Balance: number;
  BillAddr?: {
    Line1?: string;
    City?: string;
    CountrySubDivisionCode?: string;
    PostalCode?: string;
  };
  Active?: boolean;
  IsInactive?: boolean;
  Status?: string;
  status?: string;
  MetaData?: {
    LastUpdatedTime?: string;
  };
}
