export interface FindAllOptionsDto {
  orderBy?: string;
  order?: 'asc' | 'desc';
  skip?: number;
  limit?: number;
}
