/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';

import { useAxiosListRoles } from "../api/role";

const PermissionCheck = ({ requiredPermission, children }) => {
  const { userInfo } = useSelector(state => state.auth);

  const [{ data: listRoleResp }] = useAxiosListRoles();

  const userRoleFromRedux = userInfo?.role;
  // Find the user role object from the listRoleResp based on the user's role from Redux state
  const userRole = listRoleResp?.find(role => role.name === userRoleFromRedux);

  // Extract user permissions from the user role object
  const userPermissions = userRole ? userRole.permissions : [];

  // Check if the user has the required permission
  const hasPermission = userPermissions.includes(requiredPermission);

  return hasPermission ? <>{children}</> : null;
};

export default PermissionCheck;
