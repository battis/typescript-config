(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["BattisTypescriptTricks"] = factory();
	else
		root["BattisTypescriptTricks"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
/*!******************!*\
  !*** ./index.ts ***!
  \******************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isConstructor = exports.instanceOf = void 0;
// https://stackoverflow.com/a/65152869/294171
function instanceOf(array, filterType) {
    return array.filter((e) => e instanceof filterType);
}
exports.instanceOf = instanceOf;
// https://stackoverflow.com/a/48036194
const handler = {
    construct() {
        return handler;
    },
};
const isConstructor = (value) => {
    return !!value && !!value.prototype && !!value.prototype.constructor;
};
exports.isConstructor = isConstructor;

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87Ozs7Ozs7OztBQ1ZhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELHFCQUFxQixHQUFHLGtCQUFrQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQiIsInNvdXJjZXMiOlsid2VicGFjazovL0JhdHRpc1R5cGVzY3JpcHRUcmlja3Mvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL0JhdHRpc1R5cGVzY3JpcHRUcmlja3MvLi9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJCYXR0aXNUeXBlc2NyaXB0VHJpY2tzXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkJhdHRpc1R5cGVzY3JpcHRUcmlja3NcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCAoKSA9PiB7XG5yZXR1cm4gIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmlzQ29uc3RydWN0b3IgPSBleHBvcnRzLmluc3RhbmNlT2YgPSB2b2lkIDA7XG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNjUxNTI4NjkvMjk0MTcxXG5mdW5jdGlvbiBpbnN0YW5jZU9mKGFycmF5LCBmaWx0ZXJUeXBlKSB7XG4gICAgcmV0dXJuIGFycmF5LmZpbHRlcigoZSkgPT4gZSBpbnN0YW5jZW9mIGZpbHRlclR5cGUpO1xufVxuZXhwb3J0cy5pbnN0YW5jZU9mID0gaW5zdGFuY2VPZjtcbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS80ODAzNjE5NFxuY29uc3QgaGFuZGxlciA9IHtcbiAgICBjb25zdHJ1Y3QoKSB7XG4gICAgICAgIHJldHVybiBoYW5kbGVyO1xuICAgIH0sXG59O1xuY29uc3QgaXNDb25zdHJ1Y3RvciA9ICh2YWx1ZSkgPT4ge1xuICAgIHJldHVybiAhIXZhbHVlICYmICEhdmFsdWUucHJvdG90eXBlICYmICEhdmFsdWUucHJvdG90eXBlLmNvbnN0cnVjdG9yO1xufTtcbmV4cG9ydHMuaXNDb25zdHJ1Y3RvciA9IGlzQ29uc3RydWN0b3I7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=