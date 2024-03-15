/* eslint-disable react-hooks/exhaustive-deps */
import { DataGrid } from "@mui/x-data-grid";

import { useAxiosListRoles } from "../api/role";

const RoleListScreen = () => {
  const [{ data: listRoleResp }] = useAxiosListRoles();

  const getRowId = (row) => row._id;

  const columns = [
    //{ field: '_id', headerName: 'ID', width: 70, valueGetter: (params) => params.rowIndex + 1 },
    { field: "name", headerName: "Role Name", width: 150 },
    { field: "permissions", headerName: "Permissions", width: 250 },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={listRoleResp || []}
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

export default RoleListScreen;
