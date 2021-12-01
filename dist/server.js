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
//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.
const client = new pg_1.Client({ database: "todoapp" });
//TODO: this request for a connection will not necessarily complete before the first HTTP request is made!
client.connect();
const app = express_1.default();
/**
 * Simplest way to connect a front-end. Unimportant detail right now, although you can read more: https://flaviocopes.com/express-cors/
 */
app.use(cors_1.default());
/**
 * Middleware to parse a JSON body in requests
 */
app.use(express_1.default.json());
//When this route is called, return the most recent 100 signatures in the db
app.get("/todo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield client.query("SELECT * FROM todo");
        res.json(result.rows);
    }
    catch (error) {
        console.log("error 404");
    }
    app.get("/todo/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = parseInt(req.params.id);
            const result = yield client.query("SELECT * FROM todo WHERE id = $1", [
                id,
            ]);
            res.json(result.rows[0]);
        }
        catch (err) {
            console.log("error");
        }
    }));
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
    app.put("/todo/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { description, due_date } = req.body;
            const id = parseInt(req.params.id);
            const updateTodo = yield client.query("UPDATE todo SET description = $1, due_date = $2 WHERE id = $3 RETURNING *", [description, due_date, id]);
            res.status(200).json({
                status: "sucess",
                updateTodo,
            });
        }
        catch (error) {
            console.log("error");
        }
    }));
    app.delete("/todo/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = parseInt(req.params.id); // params are string type
            const result = client.query("DELETE from todo WHERE id = $1", [id]);
            res.json("todo was deleted").json;
        }
        catch (error) {
            console.log("error");
        }
    }));
}));
exports.default = app;
