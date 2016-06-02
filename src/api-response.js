module.exports = class ApiResponse {

  constructor() {
    this.success = { dataset: [] };
    this.error = { code: null, message: null, details: {} };
    this.metas = {};
    this.source = null;
    this.detailSanitizers = [];
  }

  /**
   * Full reset
   */
  reset() {
    this.resetError();
    this.resetErrorDetails();
    this.resetData();
    this.resetSource();
    this.resetMetas();
    this.resetSuccess();
  }

  // Error ---------------------------------------------------------------------
  setError(error) {
    if (error.code) {
      this.error.code = error.code;
    }
    this.error.message = error.message || '';
  }

  getError() {
    return this.error;
  }

  isError() {
    return this.error.message !== null;
  }

  resetError() {
    this.error.code = null;
    this.error.message = null;
  }

  // Error details -------------------------------------------------------------

  setErrorDetails(err) {
    this.resetErrorDetails();
    this.addErrorDetails(err);
  }

  addErrorDetails(err, property = null) {
    if (err.constructor === Array) {
      err.forEach((e) => this.addErrorDetails(e));
      return;
    }

    if (err.constructor === String) {
      if (property.constructor !== String) {
        throw new Error('missing property to set error');
      }
      this.error.details[property] = err;
      return;
    }

    if (err.constructor !== Object) {
      throw new Error('Object expected');
    }
    Object.keys(err).forEach((property) => {
      let error = err[property];
      this.detailSanitizers.forEach((sanitize) => error = sanitize(error));
      this.error.details[property] = error;
    });
  }

  hasErrorDetails() {
    return Object.keys(this.error.details).length > 0;
  }

  getErrorDetails() {
    return this.error.details;
  }

  hasErrorDetail(property) {
    return this.error.details.hasOwnProperty(property);
  }

  getErrorDetail(property) {
    return this.error.details[property];
  }

  resetErrorDetails() {
    return this.error.details = {};
  }

  addErrorDetailSanitize(cb) {
    this.detailSanitizers.push(cb);
  }

  // Dataset -------------------------------------------------------------------
  setData(data) {
    this.resetData();
    this.addData(data);
  }

  addData(data) {
    if (data.constructor !== Array) {
      data = [data];
    }
    data.forEach((d) => this.success.dataset.push(d));
  }

  getData() {
    return this.success.dataset;
  }

  hasData() {
    return this.success.dataset.length > 0;
  }

  resetData() {
    this.success.dataset = [];
  }

  hasOneData() {
    return this.getData().length === 1;
  }

  getUniqueData() {
    if (!this.hasOneData()) throw new Error('Not unique data');
    return this.getData()[0];
  }

  // Success -------------------------------------------------------------------
  setSuccessProperty(property, value) {
    this.success[property] = value;
  }

  setSuccess(data = {}) {
    if (data.constructor !== Object) {
      throw new Error('setSuccess require object as argument');
    }
    Object.keys(data).forEach((k) => (this.setSuccessProperty(k, data[k])));
  }

  getSuccess() {
    return this.success;
  }

  hasSuccess() {
    return Object.keys(this.success).length > 0;
  }

  resetSuccess() {
    return this.success = { dataset: [] };
  }

  // Source --------------------------------------------------------------------

  setSource(source) {
    if (source.constructor !== String) {
      throw new Error('source must be a String');
    }
    this.source = source;
  }

  getSource() {
    return this.source;
  }

  hasSource() {
    return this.source !== null;
  }

  resetSource() {
    this.source = null;
  }

  // Metas ---------------------------------------------------------------------
  setMeta(name, val) {
    if (name.constructor !== String) {
      throw new Error('name must be a String');
    }
    this.metas[name] = val;
  }

  setMetas(metas, keepPrevious = true) {
    if (!keepPrevious) {
      this.resetMetas();
    }
    Object.keys(metas).forEach((key) => this.setMeta(key, metas[key]));
  }

  getMetas() {
    return this.metas;
  }

  hasMetas() {
    return Object.keys(this.metas).length > 0;
  }

  hasMeta(id) {
    return this.getMetas().hasOwnProperty(id);
  }

  getMeta(id, defaultValue) {
    return this.hasMeta(id) ? this.getMetas()[id] : defaultValue;
  }

  resetMetas() {
    this.metas = {};
  }
};
