/**
 * 서비스와 독립적인 시스템 유틸리티 설정
 */
(function (w) {
  // namespace
  w.namespace = function (nameSpaceString) {
    var parts = nameSpaceString.split('.'), parent = window;
    for (var i = 0, length = parts.length; i < length; i++) {
      if (typeof parent[parts[i]] === 'undefined') {
        parent[parts[i]] = {};
      }
      parent = parent[parts[i]];
    }
    return parent;
  };

  /**
   * 기본 자료형 관련 유틸리티는 prototype 상속으로 처리한다. cross browsing 처리가 되지 않는 함수들을 주로 정의할
   * 것!!
   */
  /* Array */
  if (typeof Array.prototype.indexOf !== 'function') {
    Array.prototype.indexOf = function (value) {
      for (var index = this.length; index >= 0; index--) {
        if (this[index] === value) {
          return index;
        }
      }
      return -1;
    };
  }

  if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, '');
    };
  }

  String.prototype.isEmpty = function () {
    return this.length === 0;
  };

  String.prototype.isBlank = function () {
    return this.trim().length === 0;
  };

  if (typeof String.prototype.startsWith !== 'function') {
    String.prototype.startsWith = function (prefix) {
      return this.indexOf(prefix) === 0;
    };
  }

  if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function (suffix) {
      return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
  }

  String.prototype.endsWithIgnoreCase = function (suffix) {
    return this.toLowerCase().indexOf(suffix.toLowerCase(), this.length - suffix.length) !== -1;
  };

  String.prototype.removeHtml = function () {
    return this.replace(/<(?:.|\n)*?>/gm, '');
  };

  String.prototype.cut = function (bytes) {
    var str = this;
    var l = 0;
    for (var i = 0; i < str.length; i++) {
      l += (str.charCodeAt(i) > 128) ? 3 : 1;
      if (l >= bytes) return str.substring(0, i);
    }
    return str;
  };

})(window);