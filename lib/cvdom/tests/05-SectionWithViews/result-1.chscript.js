h("div", [ "\n    ", h("ul", {"attributes":{}}, ch({"section":"item"}, function () { return [ "\n        ", ch({"section":"item","view":"default"}, function () { return h("li", {"attributes":{}}, [ "\n            ", h("span", {"attributes":{"component:prop":"label"}}, ch({"property":"label"}, function () { return [ "Label" ]; })), "\n            ", ch({"view":"focus"}, function () { return h("span", {"attributes":{}}, [ "Focus!" ]); }), "\n        " ]); }), "\n        ", ch({"section":"item","view":"active"}, function () { return h("li", {"attributes":{}}, [ "\n            ", h("span", {"attributes":{"component:prop":"label"}}, ch({"property":"label"}, function () { return [ "Label" ]; })), " (active)\n            ", ch({"view":"focus"}, function () { return h("span", {"attributes":{}}, [ "Focus! (active)" ]); }), "\n        " ]); }), "\n    " ]; })), "\n    \n    ", ch({"view":"focus"}, function () { return h("span", {"attributes":{}}, [ "Focus!" ]); }), "\n" ])