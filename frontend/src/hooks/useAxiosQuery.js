import useAxios from 'axios-hooks';
import qs from 'qs';

const useAxiosQuery = (url, query) => {
  const [props, refetch] = useAxios(
    `${url}${qs.stringify(query, {
      addQueryPrefix: true,
      skipNulls: true,
    })}`,
  );
  return [
    props,
    (_query) =>
      refetch({
        url: `${url}${qs.stringify(_query, {
          addQueryPrefix: true,
          skipNulls: true,
        })}`,
      }),
  ];
};

export default useAxiosQuery;
