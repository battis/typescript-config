export function isRecord<
  K extends string | number | symbol = string | number | symbol,
  V = unknown
>(
  obj: unknown,
  isK?: (k: unknown) => k is K,
  isV?: (v: unknown) => v is V
): obj is Record<K, V> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    Object.keys(obj).reduce(
      (result, key) =>
        result &&
        (!isK || isK(key)) &&
        (!isV || isV(obj[key as keyof typeof obj])),
      true
    ) &&
    [
      Function,
      Boolean,
      Error,
      Number,
      Date,
      String,
      RegExp,
      Array,
      Uint8Array,
      Uint16Array,
      Uint32Array,
      Int16Array,
      Int32Array,
      Float32Array,
      Float64Array,
      Map,
      Set,
      WeakMap,
      WeakSet,
      ArrayBuffer,
      DataView,
      Promise,
      DisposableStack,
      AsyncDisposableStack,
      FormData
    ].reduce((result, T) => result && !(obj instanceof T), true)
  );
}
