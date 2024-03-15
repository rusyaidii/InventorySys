/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';

const rolePermissions = {
    admin: ["read", "create", "update", "delete"],
    manager: ["read", "create", "update"],
    user: ["read"]
  };

const PermissionCheck = ({ requiredPermission, children }) => {
  const { userInfo } = useSelector(state => state.auth);

  const userRoleFromRedux = userInfo?.role;
  const userPermissions = rolePermissions[userRoleFromRedux] || [];
  const hasPermission = userPermissions.includes(requiredPermission);

  return hasPermission ? <>{children}</> : null;
};

export default PermissionCheck;
