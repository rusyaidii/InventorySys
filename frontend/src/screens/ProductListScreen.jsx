/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  useAxiosProductList,
  useAxiosListCat,
  useLazyAxiosDeleteProduct,
} from "../api/product";
import PermissionCheck from "../components/PermissionCheck";

const ProductListScreen = () => {
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({ page: 0, pageSize: 5 });
  const [sortModel, setSortModel] = useState([
    { field: "productName", sort: "asc" },
  ]);
  const [filterModel, setFilterModel] = useState({ items: [] });

  const [{ data: listProductResp }, refetchProductList] = useAxiosProductList();

  const [{ data: listCatResp }] = useAxiosListCat();

  const { userInfo } = useSelector((state) => state.auth);

  const [, deleteProduct] = useLazyAxiosDeleteProduct();

  useEffect(() => {
    const refetchList = async () => {
      await refetchProductList();
    };

    // Refetch product list only when component mounts
    refetchList();
  }, []);

  useEffect(() => {
    refetchProductList({
      page: pagination.page,
      limit: pagination.pageSize,
      sortBy: sortModel[0].field,
      sortOrder: sortModel[0].sort,
      productCat:
        filterModel.items.length > 0 ? filterModel.items[0].value : "",
    });
  }, [pagination, sortModel, filterModel]);

  const handlePageChange = (newPage) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      page: newPage + 1,
    }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      pageSize: newPageSize,
    }));
  };

  const handleSortModelChange = (newSortModel) => {
    setSortModel(newSortModel);
  };

  const handleFilterChange = (event) => {
    const selectedCategory = event.target.value;
    // Update the filterModel state with the selected category
    setFilterModel({
      items: [
        {
          columnField: "productCat", // Assuming 'productCat' is the field you want to filter on
          operatorValue: "contains",
          value: selectedCategory,
        },
      ],
    });
  };

  const handleEdit = (id) => {
    // Navigate to the view page with the ID
    navigate(`/view-product/${id}`);
  };

  const handleDelete = async (productID) => {
    try {
      await deleteProduct(productID);
    } catch (err) {
      console.log("Error - ", err.message);
    } finally {
      await refetchProductList();
    }
  };

  const getRowId = (row) => row._id;

  const columns = [
    //{ field: '_id', headerName: 'ID', width: 70, valueGetter: (params) => params.rowIndex + 1 },
    { field: "productName", headerName: "Product Name", width: 150 },
    { field: "productCat", headerName: "Product Category", width: 130 },
    { field: "supplierId", headerName: "Supplier ID", width: 150 },
    {
      field: "productPrice",
      headerName: "Product Price",
      type: "number",
      width: 120,
    },
    userInfo && {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <div>
          <PermissionCheck requiredPermission="update">
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{ marginLeft: 16 }}
              onClick={() => handleEdit(params.row._id)}
            >
              Edit
            </Button>
          </PermissionCheck>

          <PermissionCheck requiredPermission="delete">
            <Button
              variant="contained"
              color="error"
              size="small"
              style={{ marginLeft: 8 }}
              onClick={() => handleDelete(params.row._id)}
            >
              Delete
            </Button>
          </PermissionCheck>
        </div>
      ),
    },
  ].filter(Boolean);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <div className="mt-5" style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <Link to="/new-product" style={{ textDecoration: "none" }}>
          <PermissionCheck requiredPermission="create">
            <Button variant="contained" color="primary">
              Create New Product
            </Button>
          </PermissionCheck>
        </Link>
        <Form.Select
          className="ms-auto"
          style={{ width: "250px" }}
          onChange={handleFilterChange}
        >
          <option value=''>Filter by Product Category</option>
          {listCatResp &&
            listCatResp.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
        </Form.Select>
      </div>
      <DataGrid
        rows={listProductResp?.data || []}
        columns={columns}
        pagination
        initialState={{
          pagination: { paginationModel: { page: 1, pageSize: 5 } },
        }}
        pageSize={pagination.pageSize}
        rowCount={listProductResp?.total || 0}
        paginationMode="server"
        paginationModel={pagination}
        onPaginationModelChange={setPagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
        getRowId={getRowId}
        pageSizeOptions={[5, 10]}
      />
    </div>
  );
};

export default ProductListScreen;
