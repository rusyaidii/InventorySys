import useAxios from 'axios-hooks';

import { useAxiosQuery } from '../hooks';

export const useAxiosSupplierList = () => useAxios('/api/suppliers/supplier');

export const useAxiosReadSupplier = (supplierID) => {
  const [props, refetch] = useAxios(`/api/suppliers/supplier/${supplierID}`);
  return [props, () => refetch({ url: `/api/suppliers/supplier/${supplierID}` })];
};

export const useLazyAxiosCreateSupplier = () => {
  const [props, createSupplier] = useAxios(
    { method: 'POST', url: '/api/suppliers/supplier' },
    { manual: true },
  );
  return [
    props,
    (supplierName, supplierAddress, supplierContact) =>
    createSupplier({
        data: {
          supplierName,
          supplierAddress,
          supplierContact
        },
      }),
  ];
};

export const useLazyAxiosUpdateSupplier = (supplierID) => {
    const [props, updateSupplier] = useAxios(
      { method: 'PUT', url: `/api/suppliers/supplier/${supplierID}` }, // Template ID should be encoded for URL.
      { manual: true },
    );
    return [
      props,
      (supplierName, supplierAddress, supplierContact) =>
        updateSupplier({
          data: {
            supplierName,
            supplierAddress,
            supplierContact
          },
        }),
    ];
  };

export const useLazyAxiosDeleteSupplier = () => {
    const [props, deleteSupplier] = useAxios(
      { method: 'DELETE' },
      { manual: true },
    );
    return [
      props,
      (supplierID) =>
        deleteSupplier({
          url: `/api/suppliers/supplier/${supplierID}`,
        }),
    ];
  };