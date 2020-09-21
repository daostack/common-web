const axios = require('axios');
const FormData = require('form-data');

module.exports = class IPFSApiClient {
  constructor(ipfsUrl) {
    this.baseUrl = ipfsUrl;
  }

  get ipfsUrl() {
    return this.baseUrl;
  }

  async addString(data) {
    const bodyFormData = new FormData();
    bodyFormData.append('file', data);
    const res = await axios.post(`${this.baseUrl}/add`, bodyFormData, {
      headers: bodyFormData.getHeaders()
    });
    return res.data.Hash;
  }

  async pinHash(hash) {
    const bodyFormData = new FormData();
    bodyFormData.append('path', hash);
    await axios.post(`${this.baseUrl}/pin/add`, bodyFormData, {
      headers: bodyFormData.getHeaders()
    });
  }

  async addAndPinString(data) {
    const hash = await this.addString(data);
    await this.pinHash(hash);
    return hash;
  }
};
