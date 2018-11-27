module.exports = createServer;

const http = require('http');

function createServer() {
    return new App();
}

class App {
    constructor() {
        this.middleWareArray = [];
    }
    use(route, handle) {
        if (typeof route !== 'string') {
            handle = route;
            route = '/';
        }
        this.middleWareArray.push({
            route,
            handle
        });
    }
    listen(port) {
        let server = http.createServer(this.handle.bind(this));
        server.listen(port || 8080);
    }
    handle(req, res) {
        let indexOfMiddleWareHandling = 0;
        const self = this;

        function next(error) {
            self.call(self.middleWareArray[indexOfMiddleWareHandling++], req, res, error, next);
        }
        next()
    }
    call(handleObj, req, res, error, next) {
        if (!handleObj && !error) {
            return;
        }
        // 代码执行错误，未设置错误处理中间件
        if (!handleObj && error) {
            res.setHeader('Content-Type', 'text/plain');
            res.end(error.stack || error.toString());
            return;
        }
        const url = req.url;
        const route = handleObj.route;
        const handle = handleObj.handle;
        if (url.toLowerCase().substr(0, route.length) !== route.toLowerCase()) {
            return next(error);
        }
        try {
            // 当前handle就是error-handler
            if (error && handle.length === 4) {
                handle(error, req, res, next);
                return;
            }
            if (!error && handle.length < 4) {
                handle(req, res, next);
                return;
            }
        } catch (e) {
            error = e;
        }
        next(error);
    }
}
