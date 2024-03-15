import useAxios from 'axios-hooks';

export const useAxiosListRoles = () => useAxios('/api/role');

export const useLazyAxiosCreateRole = () => {
    const [props, createRole] = useAxios(
      { method: 'POST', url: '/api/role/new' },
      { manual: true },
    );
    return [
      props,
      (role) =>
      createRole({
          data: {
            name: role.name,
            permissions: role.permissions
          },
        }),
    ];
  };