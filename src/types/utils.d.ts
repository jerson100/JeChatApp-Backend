type MappedTypeString = {
  [key: string]: any;
};

type QueryPagination = {
  page: number;
  limit: number;
};

interface MetaDataPaginationResponse {
  totalItems: number;
  //   totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export { MappedTypeString, QueryPagination, MetaDataPaginationResponse };
