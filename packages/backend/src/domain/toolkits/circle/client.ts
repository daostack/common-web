import axios from 'axios';

export const $circleClient = axios.create({
  baseURL: process.env['Circle.BaseUrl'],
  headers: {
    Authorization: `Bearer ${process.env['Circle.ApiKey']}`
  }
});