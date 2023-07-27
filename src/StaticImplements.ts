export type StaticImplements<
  I extends new (...args: any[]) => any,
  C extends I
> = InstanceType<C>;

/*

https://stackoverflow.com/a/69571314/294171

Usage:

interface InstanceInterface {
  instanceMethod();
}

interface StaticInterface {
  new(...args: any[]): InstanceInterface;
  staticMethod();
}

class MyClass implements StaticImplements<StaticInterface, typeof MyClass> {
  static staticMethod() { }
  static ownStaticMethod() { }
  instanceMethod() { }
  ownInstanceMethod() { }
}

*/
