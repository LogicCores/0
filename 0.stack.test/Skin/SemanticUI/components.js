
// TODO: Load dynamically on demand and only in batch if used on initial display.
window.waitForLibrary(function (LIB) {
    LIB.Components = {
        "0-test/TableFilter/Dropdown": require("../../Components/SemanticUI/TableFilter/Dropdown/window.api").forLib(LIB)
    };
});
