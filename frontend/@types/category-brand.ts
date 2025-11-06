export interface BrandResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: Brand[];
}

export interface Brand {
  _id: string;
  name: string;
  logoUrl: string;
  categories: string[];
  createdAt: string; // or Date
  updatedAt: string; // or Date
  __v: number;
  isTop: boolean;
}



export interface CategoryResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: Category[];
}

export interface Category {
  _id: string;
  name: string;
  subCategory: string[];
  logoUrl: string;
  createdAt: string; // or Date
  updatedAt: string; // or Date
  __v: number;
}
