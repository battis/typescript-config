"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOf = void 0;
// https://stackoverflow.com/a/65152869/294171
function instanceOf(array, filterType) {
    return array.filter((e) => e instanceof filterType);
}
exports.instanceOf = instanceOf;
