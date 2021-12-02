"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const filePath_1 = __importDefault(require("./filePath"));
//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.
dotenv_1.default.config();
const config = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
};
const client = new pg_1.Client(config);
//TODO: this request for a connection will not necessarily complete before the first HTTP request is made!
const app = express_1.default();
/**
 
/**
 * Middleware to parse a JSON body in requests
 */
app.use(express_1.default.json());
//When this route is called, return the most recent 100 signatures in the db
client.connect().then(() => {
    var _a;
    console.log("Connected to Heroku database!");
    app.use(express_1.default.json());
    app.use(cors_1.default());
    //  HOME PAGE
    app.get("/", (req, res) => {
        const pathToFile = filePath_1.default("../public/index.html");
        console.log(pathToFile);
        res.sendFile(pathToFile);
    });
    // GET ALL TODOS
    app.get("/todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield client.query("SELECT * FROM todos;");
        res.status(200).json({
            status: "success",
            result,
        });
    }));
    // GET A TODO BY ID
    app.get("/todos/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        const result = yield client.query("SELECT * FROM todos WHERE id = $1;", [
            id,
        ]);
        if (result.rowCount !== 0) {
            res.status(200).json({
                status: "success",
                result,
            });
        }
        else {
            res.status(404).json({
                status: "fail",
                data: {
                    id: "Could not find a todo with that id identifier",
                },
            });
        }
    }));
    // UPDATE A TODO BY ID
    app.put("/todos/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        const { description, due_date, is_complete } = req.body;
        const result = yield client.query("UPDATE todos SET description = $1, due_date = $2, is_complete = $3 WHERE id = $4 RETURNING *;", [description, due_date, is_complete, id]);
        if (result.rowCount !== 0) {
            res.status(200).json({
                status: "success",
                result,
            });
        }
        else {
            res.status(404).json({
                status: "fail",
                data: {
                    id: "Could not find a todo with that id identifier",
                },
            });
        }
    }));
    // ADD A TODO
    app.post("/todo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { description, due_date, is_complete } = req.body;
            const newToDo = yield client.query(`INSERT INTO todo (description, due_date, is_complete) VALUES($1, $2, $3) RETURNING *`, [description, due_date, is_complete]);
            res.json(newToDo.rows);
        }
        catch (error) {
            console.log("error");
        }
    }));
    // DELETE A TODO BY ID
    app.delete("/todos/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        const deletedTodo = yield client.query("DELETE FROM todos WHERE id = $1 RETURNING *", [id]);
        res.status(200).json({
            status: "success",
            data: {
                deletedTodo,
            },
        });
    }));
    // use the environment variable PORT, or 4000 as a fallback
    const PORT_NUMBER = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 4000;
    app.listen(PORT_NUMBER, () => {
        console.log(`Server listening on port ${PORT_NUMBER}!`);
    });
});
exports.default = app;
