import useAxios from 'axios-hooks';

import { useAxiosQuery } from '../hooks/';

export const useAxiosProductList = (query) =>
  useAxiosQuery('/api/products/product', query);

export const useAxiosListCat = () => useAxios('/api/products/cat');

export const useAxiosReadProduct = (productID) => {
  const [props, refetch] = useAxios(`/api/products/product/${productID}`);
  return [props, () => refetch({ url: `/api/products/product/${productID}` })];
};

export const useLazyAxiosCreateProduct = () => {
  const [props, createProduct] = useAxios(
    { method: 'POST', url: '/api/products/product' },
    { manual: true },
  );
  return [
    props,
    (productName, productCat, productPrice, supplierId) =>
    createProduct({
        data: {
          productName,
          productCat,
          productPrice,
          supplierId
        },
      }),
  ];
};

export const useLazyAxiosUpdateProduct = (productID) => {
    const [props, updateProduct] = useAxios(
      { method: 'PUT', url: `/api/products/product/${productID}` }, // Template ID should be encoded for URL.
      { manual: true },
    );
    return [
      props,
      (productName, productCat, productPrice, supplierId) =>
        updateProduct({
          data: {
            productName,
            productCat,
            productPrice,
            supplierId
          },
        }),
    ];
  };

export const useLazyAxiosDeleteProduct = () => {
    const [props, deleteProduct] = useAxios(
      { method: 'DELETE' },
      { manual: true },
    );
    return [
      props,
      (productID) =>
        deleteProduct({
          url: `/api/products/product/${productID}`,
        }),
    ];
  };