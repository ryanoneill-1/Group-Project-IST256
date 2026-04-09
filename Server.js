const http = require("http");
const fs   = require("fs");
const path = require("path");

const PORT       = 3000;
const DATA_FILE  = path.join(__dirname, "orders.json");

function readOrders() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([]), "utf8");
    }
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw);
}

function writeOrders(orders) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2), "utf8");
}

function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    });
    res.end(JSON.stringify(data));
}

function parseBody(req, callback) {
    let body = "";
    req.on("data", chunk => { body += chunk.toString(); });
    req.on("end", () => {
        try {
            callback(JSON.parse(body));
        } catch (e) {
            callback({});
        }
    });
}

const server = http.createServer((req, res) => {
    const url    = req.url;
    const method = req.method;

    if (method === "OPTIONS") {
        res.writeHead(204, {
            "Access-Control-Allow-Origin":  "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        });
        res.end();
        return;
    }

    if (url === "/api/finalize" && method === "POST") {
        parseBody(req, (body) => {
            const orders = readOrders();
            const newOrder = {
                id:        Date.now(),
                status:    "pending",
                createdAt: new Date().toISOString(),
                ...body
            };
            orders.push(newOrder);
            writeOrders(orders);
            sendJson(res, 201, { success: true, order: newOrder });
        });
        return;
    }

    if (url === "/api/orders" && method === "GET") {
        const orders = readOrders();
        sendJson(res, 200, orders);
        return;
    }

    if (url === "/api/orders/pending" && method === "GET") {
        const orders = readOrders();
        const pending = orders.filter(o => o.status === "pending");
        sendJson(res, 200, pending);
        return;
    }

    const updateMatch = url.match(/^\/api\/orders\/(\d+)\/status$/) ;
    if (updateMatch && method === "PUT") {
        const id = parseInt(updateMatch[1]);
        parseBody(req, (body) => {
            const orders = readOrders();
            const index  = orders.findIndex(o => o.id === id);
            if (index === -1) {
                sendJson(res, 404, { error: "Order not found." });
                return;
            }
            orders[index].status = body.status;
            orders[index].updatedAt = new Date().toISOString();
            writeOrders(orders);
            sendJson(res, 200, { success: true, order: orders[index] });
        });
        return;
    }

    sendJson(res, 404, { error: "Endpoint not found." });
});

server.listen(PORT, () => {
    console.log("Server running at http://localhost:" + PORT);
    console.log("Endpoints:");
    console.log("  POST   /api/finalize");
    console.log("  GET    /api/orders");
    console.log("  GET    /api/orders/pending");
    console.log("  PUT    /api/orders/:id/status");
});