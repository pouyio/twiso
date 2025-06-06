'use strict';

var _defineProperty = require('@babel/runtime/helpers/defineProperty');
var _objectWithoutPropertiesLoose = require('@babel/runtime/helpers/objectWithoutPropertiesLoose');
var React = require('react');
var useImage = require('./useImage-10828d6c.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _defineProperty__default = /*#__PURE__*/_interopDefaultLegacy(_defineProperty);
var _objectWithoutPropertiesLoose__default = /*#__PURE__*/_interopDefaultLegacy(_objectWithoutPropertiesLoose);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var _excluded = ["decode", "src", "loader", "unloader", "container", "loaderContainer", "unloaderContainer", "imgPromise", "crossorigin", "useSuspense"];
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty__default["default"](target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var passthroughContainer = function passthroughContainer(x) {
  return x;
};
function Img(_ref) {
  var _ref$decode = _ref.decode,
    decode = _ref$decode === void 0 ? true : _ref$decode,
    _ref$src = _ref.src,
    srcList = _ref$src === void 0 ? [] : _ref$src,
    _ref$loader = _ref.loader,
    loader = _ref$loader === void 0 ? null : _ref$loader,
    _ref$unloader = _ref.unloader,
    unloader = _ref$unloader === void 0 ? null : _ref$unloader,
    _ref$container = _ref.container,
    container = _ref$container === void 0 ? passthroughContainer : _ref$container,
    _ref$loaderContainer = _ref.loaderContainer,
    loaderContainer = _ref$loaderContainer === void 0 ? passthroughContainer : _ref$loaderContainer,
    _ref$unloaderContaine = _ref.unloaderContainer,
    unloaderContainer = _ref$unloaderContaine === void 0 ? passthroughContainer : _ref$unloaderContaine,
    imgPromise = _ref.imgPromise,
    crossorigin = _ref.crossorigin,
    _ref$useSuspense = _ref.useSuspense,
    useSuspense = _ref$useSuspense === void 0 ? false : _ref$useSuspense,
    imgProps = _objectWithoutPropertiesLoose__default["default"](_ref, _excluded);
  imgPromise = imgPromise || useImage.imagePromiseFactory({
    decode: decode,
    crossOrigin: crossorigin
  });
  var _useImage = useImage.useImage({
      srcList: srcList,
      imgPromise: imgPromise,
      useSuspense: useSuspense
    }),
    src = _useImage.src,
    isLoading = _useImage.isLoading;
  // console.log({src, isLoading, resolvedSrc, useSuspense})
  // show img if loaded
  if (src) return container( /*#__PURE__*/React__default["default"].createElement("img", _objectSpread({
    src: src
  }, imgProps)));
  // show loader if we have one and were still trying to load image
  if (!useSuspense && isLoading) return loaderContainer(loader);
  // show unloader if we have one and we have no more work to do
  if (!useSuspense && unloader) return unloaderContainer(unloader);
  return null;
}

module.exports = Img;
//# sourceMappingURL=Img.js.map
