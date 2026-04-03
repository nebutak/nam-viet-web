import { BaseEntity, StatusCommon } from "./common.types";

export type SupplierType = "local" | "foreign";

export interface Supplier extends BaseEntity {
  supplierCode: string;
  supplierName: string;
  supplierType: SupplierType;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxCode?: string;
  paymentTerms?: string;
  notes?: string;
  status: StatusCommon;
  createdBy?: number;
  updatedBy?: number;
}

export interface SupplierCards {
  totalSuppliers: number;
  activeSuppliers: number;
  totalDebt: number;
}