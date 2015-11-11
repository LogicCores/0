
window.waitForLibrary(function (LIB) {
    LIB.Cores = {
        time: require("../cores/time/0-window.api").forLib(LIB),
        env: require("../cores/env/0-window.api").forLib(LIB),
        service: require("../cores/service/0-window.api").forLib(LIB),
        cache: require("../cores/cache/0-window.api").forLib(LIB),
        page: require("../cores/page/0-window.api").forLib(LIB),
        data: require("../cores/data/0-window.api").forLib(LIB),
        request: require("../cores/request/0-window.api").forLib(LIB),
        fetch: require("../cores/fetch/0-window.api").forLib(LIB),
        load: require("../cores/load/0-window.api").forLib(LIB),
        layout: require("../cores/layout/0-window.api").forLib(LIB),
        container: require("../cores/container/0-window.api").forLib(LIB),
        component: require("../cores/component/0-window.api").forLib(LIB),
        template: require("../cores/template/0-window.api").forLib(LIB),
        auth: require("../cores/auth/0-window.api").forLib(LIB)
    };
});
