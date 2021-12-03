import express from "express";
import cors from "cors";
import { client } from "./db";
import dotenv from "dotenv";
import filePath from "./filePath";

//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.

dotenv.config();

//TODO: this request for a connection will not necessarily complete before the first HTTP request is made!

const app = express();

/**
 
/**
 * Middleware to parse a JSON body in requests
 */

//When this route is called, return the most recent 100 signatures in the db
client.connect().then(() => {
  console.log("Connected to Heroku database!");
  app.use(express.json());
  app.use(cors());

  // GET ALL TODOS
  app.get("/todos", async (req, res) => {
    const result = await client.query("SELECT * FROM todos;");
    res.status(200).json({
      status: "success",
      result,
    });
  });

  // GET A TODO BY ID
  app.get("/todos/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await client.query("SELECT * FROM todos WHERE id = $1;", [
      id,
    ]);
    if (result.rowCount !== 0) {
      res.status(200).json({
        status: "success",
        result,
      });
    } else {
      res.status(404).json({
        status: "fail",
        data: {
          id: "Could not find a todo with that id identifier",
        },
      });
    }
  });

  // UPDATE A TODO BY ID
  app.put("/todos/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { description, due_date, is_complete } = req.body;
    const result = await client.query(
      "UPDATE todos SET description = $1, due_date = $2, is_complete = $3 WHERE id = $4 RETURNING *;",
      [description, due_date, is_complete, id]
    );
    if (result.rowCount !== 0) {
      res.status(200).json({
        status: "success",
        result,
      });
    } else {
      res.status(404).json({
        status: "fail",
        data: {
          id: "Could not find a todo with that id identifier",
        },
      });
    }
  });

  // ADD A TODO
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

  // DELETE A TODO BY ID
  app.delete("/todos/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const deletedTodo = await client.query(
      "DELETE FROM todos WHERE id = $1 RETURNING *",
      [id]
    );
    res.status(200).json({
      status: "success",
      data: {
        deletedTodo,
      },
    });
  });
});

export default app;
