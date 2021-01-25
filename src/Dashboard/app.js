// ██████ Integrations █████████████████████████████████████████████████████████

// —— HTTP interfaces in Node.js
const http          = require("http")
// —— Node.JS path module
    , path          = require("path")
// —— Fast, unopinionated, minimalist web framework for Node.js
    , express       = require("express")
// —— Simple session middleware for Express
    , session       = require("express-session")
// —— Create HTTP error objects
    , createError   = require("http-errors")
// —— Parse HTTP request cookies
    , cookieParser  = require("cookie-parser");

// ██████ Routes ███████████████████████████████████████████████████████████████

const indexRouter = require("./routes/index");

const authRouter  = require("./routes/OAuth2");

module.exports = (client) => {

    const app = express();

    app
        .use(express.json())
        .use(express.urlencoded({ extended: true }))
        .use(cookieParser())
        .use(express.static(path.join(__dirname, "public")))

        .use("/jquery", express.static(path.join(__dirname, "../node_modules/jquery/dist")))

        .use(session({
            secret: client.config.dashboard.expressSPass,
            resave: true,
            saveUninitialized: true,
        }))

		.use(async function(req, res, next) {
			req.user = req.session.user;
            req.client = client;
			next();
		})

        .use("/", indexRouter)
        .use("/auth", authRouter)

        .set("view engine", "ejs")
        .set("views", path.join(__dirname, "/views"))
        .set("port", normalizePort(client.config.dashboard.port || "3000"));

        const server = http.createServer(app);

        server.listen(app.get("port"));
        server.on("error", onError);
        server.on("listening", onListening);

    // —— Catch 404 and forward to error handler
    app.use(function(req, res, next) {
        next(createError(404));
    });

    // —— Error handler
    app.use(function(err, req, res) {
        // —— Set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get("env") === "development" ? err : {};

        // —— Render the error page
        res.status(err.status || 500);
        res.render("error");
    });

    function normalizePort(val) {
        const port = parseInt(val, 10);

        if (isNaN(port))
          return val;

        if (port >= 0)
          return port;

        return false;
    }

    // —— Event listener for HTTP server "error" event.
    function onError(error) {
        if (error.syscall !== "listen") {
            throw error;
        }

        const bind = typeof port === "string"
          ? "Pipe " + port
          : "Port " + port;

        // —— Handle specific listen errors with friendly messages
        switch (error.code) {
          case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
          case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
          default:
            throw error;
        }
      }

    // —— Event listener for HTTP server "listening" event.
    function onListening() {
        const addr = server.address();
        const bind = typeof addr === "string"
            ? "pipe " + addr
            : "port " + addr.port;
        console.log("Listening on " + bind);
    }
};