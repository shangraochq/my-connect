const connect = require("./index.js");

let app = connect();
app.use(logger);
app.use(hello);
app.use(error);
app.listen(3000);

function logger(req, res, next) {
    console.log('%s %s', req.method, req.url);
    DOMTokenList;
    next();
}

function hello(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('hello world!');
}

function error(err, req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('error');
}
