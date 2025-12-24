var h = (t) => {
  throw TypeError(t);
};
var p = (t, s, e) => s.has(t) || h("Cannot " + e);
var n = (t, s, e) => (p(t, s, "read from private field"), e ? e.call(t) : s.get(t)), r = (t, s, e) => s.has(t) ? h("Cannot add the same private member more than once") : s instanceof WeakSet ? s.add(t) : s.set(t, e), F = (t, s, e, g) => (p(t, s, "write to private field"), g ? g.call(t, e) : s.set(t, e), e);
var i;
class c {
  constructor() {
    r(this, i, {});
  }
  get types() {
    return n(this, i);
  }
  setFields(s) {
    F(this, i, { ...n(this, i), ...s });
  }
}
i = new WeakMap();
const o = new c();
export {
  c as RFSettings,
  o as WFSettings
};
//# sourceMappingURL=index.js.map
