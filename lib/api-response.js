'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  function ApiResponse() {
    (0, _classCallCheck3.default)(this, ApiResponse);

    this.success = { dataset: [] };
    this.error = { code: null, message: null, details: {} };
    this.metas = {};
    this.source = null;
    this.detailSanitizers = [];
  }

  /**
   * Full reset
   */


  (0, _createClass3.default)(ApiResponse, [{
    key: 'reset',
    value: function reset() {
      this.resetError();
      this.resetErrorDetails();
      this.resetData();
      this.resetSource();
      this.resetMetas();
      this.resetSuccess();
    }

    // Error ---------------------------------------------------------------------

  }, {
    key: 'setError',
    value: function setError(error) {
      if (error.code) {
        this.error.code = error.code;
      }
      this.error.message = error.message || '';
    }
  }, {
    key: 'getError',
    value: function getError() {
      return this.error;
    }
  }, {
    key: 'isError',
    value: function isError() {
      return this.error.message !== null;
    }
  }, {
    key: 'resetError',
    value: function resetError() {
      this.error.code = null;
      this.error.message = null;
    }

    // Error details -------------------------------------------------------------

  }, {
    key: 'setErrorDetails',
    value: function setErrorDetails(err) {
      this.resetErrorDetails();
      this.addErrorDetails(err);
    }
  }, {
    key: 'addErrorDetails',
    value: function addErrorDetails(err) {
      var _this = this;

      var property = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      if (err.constructor === Array) {
        err.forEach(function (e) {
          return _this.addErrorDetails(e);
        });
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
      (0, _keys2.default)(err).forEach(function (property) {
        var error = err[property];
        _this.detailSanitizers.forEach(function (sanitize) {
          return error = sanitize(error);
        });
        _this.error.details[property] = error;
      });
    }
  }, {
    key: 'hasErrorDetails',
    value: function hasErrorDetails() {
      return (0, _keys2.default)(this.error.details).length > 0;
    }
  }, {
    key: 'getErrorDetails',
    value: function getErrorDetails() {
      return this.error.details;
    }
  }, {
    key: 'hasErrorDetail',
    value: function hasErrorDetail(property) {
      return this.error.details.hasOwnProperty(property);
    }
  }, {
    key: 'getErrorDetail',
    value: function getErrorDetail(property) {
      return this.error.details[property];
    }
  }, {
    key: 'resetErrorDetails',
    value: function resetErrorDetails() {
      return this.error.details = {};
    }
  }, {
    key: 'addErrorDetailSanitize',
    value: function addErrorDetailSanitize(cb) {
      this.detailSanitizers.push(cb);
    }

    // Dataset -------------------------------------------------------------------

  }, {
    key: 'setData',
    value: function setData(data) {
      this.resetData();
      this.addData(data);
    }
  }, {
    key: 'addData',
    value: function addData(data) {
      var _this2 = this;

      if (data.constructor !== Array) {
        data = [data];
      }
      data.forEach(function (d) {
        return _this2.success.dataset.push(d);
      });
    }
  }, {
    key: 'getData',
    value: function getData() {
      return this.success.dataset;
    }
  }, {
    key: 'hasData',
    value: function hasData() {
      return this.success.dataset.length > 0;
    }
  }, {
    key: 'resetData',
    value: function resetData() {
      this.success.dataset = [];
    }
  }, {
    key: 'hasOneData',
    value: function hasOneData() {
      return this.getData().length === 1;
    }
  }, {
    key: 'getUniqueData',
    value: function getUniqueData() {
      if (!this.hasOneData()) throw new Error('Not unique data');
      return this.getData()[0];
    }

    // Success -------------------------------------------------------------------

  }, {
    key: 'setSuccessProperty',
    value: function setSuccessProperty(property, value) {
      this.success[property] = value;
    }
  }, {
    key: 'setSuccess',
    value: function setSuccess() {
      var _this3 = this;

      var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (data.constructor !== Object) {
        throw new Error('setSuccess require object as argument');
      }
      (0, _keys2.default)(data).forEach(function (k) {
        return _this3.setSuccessProperty(k, data[k]);
      });
    }
  }, {
    key: 'getSuccess',
    value: function getSuccess() {
      return this.success;
    }
  }, {
    key: 'hasSuccess',
    value: function hasSuccess() {
      return (0, _keys2.default)(this.success).length > 0;
    }
  }, {
    key: 'resetSuccess',
    value: function resetSuccess() {
      return this.success = { dataset: [] };
    }

    // Source --------------------------------------------------------------------

  }, {
    key: 'setSource',
    value: function setSource(source) {
      if (source.constructor !== String) {
        throw new Error('source must be a String');
      }
      this.source = source;
    }
  }, {
    key: 'getSource',
    value: function getSource() {
      return this.source;
    }
  }, {
    key: 'hasSource',
    value: function hasSource() {
      return this.source !== null;
    }
  }, {
    key: 'resetSource',
    value: function resetSource() {
      this.source = null;
    }

    // Metas ---------------------------------------------------------------------

  }, {
    key: 'setMeta',
    value: function setMeta(name, val) {
      if (name.constructor !== String) {
        throw new Error('name must be a String');
      }
      this.metas[name] = val;
    }
  }, {
    key: 'setMetas',
    value: function setMetas(metas) {
      var _this4 = this;

      var keepPrevious = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      if (!keepPrevious) {
        this.resetMetas();
      }
      (0, _keys2.default)(metas).forEach(function (key) {
        return _this4.setMeta(key, metas[key]);
      });
    }
  }, {
    key: 'getMetas',
    value: function getMetas() {
      return this.metas;
    }
  }, {
    key: 'hasMetas',
    value: function hasMetas() {
      return (0, _keys2.default)(this.metas).length > 0;
    }
  }, {
    key: 'hasMeta',
    value: function hasMeta(id) {
      return this.getMetas().hasOwnProperty(id);
    }
  }, {
    key: 'getMeta',
    value: function getMeta(id, defaultValue) {
      return this.hasMeta(id) ? this.getMetas()[id] : defaultValue;
    }
  }, {
    key: 'resetMetas',
    value: function resetMetas() {
      this.metas = {};
    }
  }]);
  return ApiResponse;
}();