import axios from 'axios';

const circleClient = axios.create({
  baseURL: process.env['Circle.BaseUrl'],
  headers: {
    Authorization: `Bearer ${process.env['Circle.ApiKey']}`
  }
});

circleClient.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    // @todo Save this to the database?
    console.error('New circle error occurred', {
      data: error.response.config.data,
      status: error.response.status,
      responseData: error.response.data
    });

    return Promise.reject(error.response.data);
  });


export const $circleClient = circleClient;