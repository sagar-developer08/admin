import apiClient from '../utils/api';
import Cookies from 'js-cookie';

// Add a request interceptor
apiClient.interceptors.request.use(function (config) {
  // Do something before request is sent
  let adminInfo;
  if (Cookies.get('adminInfo')) {
    adminInfo = JSON.parse(Cookies.get('adminInfo'));
  }

  let company;

  if (Cookies.get('company')) {
    company = Cookies.get('company');
  }

  // console.log('Admin Http Services Cookie Read : ' + company);
  // let companyName = JSON.stringify(company);

  return {
    ...config,
    headers: {
      ...config.headers,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      authorization: adminInfo ? `Bearer ${adminInfo.token}` : null,
      company: company ? company : null,
    },
  };
});

const responseBody = (response) => response.data;

const requests = {
  get: (url, body, headers) => apiClient.get(url, { params: body, headers }),
  post: (url, body) => apiClient.post(url, body),
  put: (url, body, headers) => apiClient.put(url, body, headers),
  patch: (url, body) => apiClient.patch(url, body),
  delete: (url, body) => apiClient.delete(url, { data: body }),
};

export default requests;
