import useAxios from 'axios-hooks';

export const useAxiosListRoles = () => useAxios('/api/role');