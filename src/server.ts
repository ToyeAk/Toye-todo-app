import express from "express";
import cors from "cors";
import { Client } from "pg";

//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.

const client = new Client({ database: "todoapp" });

//TODO: this request for a connection will not necessarily complete before the first HTTP request is made!
client.connect();

const app = express();

/**
 * Simplest way to connect a front-end. Unimportant detail right now, although you can read more: https://flaviocopes.com/express-cors/
 */
app.use(cors());

/**
 * Middleware to parse a JSON body in requests
 */
app.use(express.json());

//When this route is called, return the most recent 100 signatures in the db
app.get("/todo", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM todo");
    res.json(result.rows);
  } catch (error) {
    console.log("error 404");
  }

  app.get("/todo/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      const result = await client.query("SELECT * FROM todo WHERE id = $1", [
        id,
      ]);
      res.json(result.rows[0]);
    } catch (err) {
      console.log("error");
    }
  });

  app.post("/todo", async (req, res) => {
    try {
      const { description, due_date, is_complete } = req.body;
      const newToDo = await client.query(
        `INSERT INTO todo (description, due_date, is_complete) VALUES($1, $2, $3) RETURNING *`,
        [description, due_date, is_complete]
      );

      res.json(newToDo.rows);
    } catch (error) {
      console.log("error");
    }
  });

  app.put("/todo/:id", async (req, res) => {
    try {
      const { description, due_date } = req.body;
      const id = parseInt(req.params.id);
      const updateTodo = await client.query(
        "UPDATE todo SET description = $1, due_date = $2 WHERE id = $3 RETURNING *",
        [description, due_date, id]
      );

      res.status(200).json({
        status: "sucess",
        updateTodo,
      });
    } catch (error) {
      console.log("error");
    }
  });

  app.delete("/todo/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id); // params are string type
      const result = client.query("DELETE from todo WHERE id = $1", [id]);

      res.json("todo was deleted").json;
    } catch (error) {
      console.log("error");
    }
  });
});
export default app;
