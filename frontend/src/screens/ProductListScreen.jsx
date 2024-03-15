/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

import { useAxiosProductList, useLazyAxiosDeleteProduct } from "../api/product";
import PermissionCheck from "../components/PermissionCheck";

const ProductListScreen = () => {
  const navigate = useNavigate();
  const [
    { data: listProductResp },
    refetchProductList,
  ] = useAxiosProductList();

  const { userInfo } = useSelector((state) => state.auth);

  const [, deleteProduct] = useLazyAxiosDeleteProduct();

  useEffect(() => {
    const refetchList = async () => {
      await refetchProductList();
    };
  
    // Refetch product list only when component mounts
    refetchList();
  }, []);

  const handleEdit = (id) => {
    // Navigate to the view page with the ID
    navigate(`/view-product/${id}`);
  };

  const handleDelete = async (productID) => {
    try {
        await deleteProduct(productID);
    } catch (err) {
        console.log('Error - ', err.message)
    } finally {
        await refetchProductList();
    }
  }

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
      {userInfo && <Link to="/new-product" style={{ textDecoration: "none" }}>
        <PermissionCheck requiredPermission="create">
            <Button
            variant="contained"
            color="primary"
            style={{ marginBottom: 16 }}
            >
            Create New Product
            </Button>
        </PermissionCheck>
      </Link>}
      <DataGrid
        rows={listProductResp?.data || []}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        getRowId={getRowId}
        pageSizeOptions={[5, 10]}
      />
    </div>
  );
};

export default ProductListScreen;
