const express = require("express");
const { createTodo, updateTodo } = require("./types");
const { todo } = require("./db");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());


app.post("/todo", async function(req, res) {
    const createPayload = req.body;
    const parsedPayload = createTodo.safeParse(createPayload);

    if (!parsedPayload.success) {
        res.status(411).json({
            msg: "You sent the wrong inputs",
            errors: parsedPayload.error.errors
        });
        return;
    }

   
    const newTodo = await todo.create(parsedPayload.data);
    res.status(201).json(newTodo);
});


app.get("/todos", async function(req, res) {
    const todos = await todo.find({});
    res.json({
        todos
    });
});


app.put("/completed", async function(req, res) {
    const { id, completed } = req.body;
    const parsedPayload = updateTodo.safeParse({ id, completed });

    if (!parsedPayload.success) {
        res.status(400).json({
            msg: "Invalid input data",
            errors: parsedPayload.error.errors
        });
        return;
    }

    
    const updatedTodo = await todo.findByIdAndUpdate(
        id,
        { completed },
        { new: true }
    );

    if (!updatedTodo) {
        res.status(404).json({ msg: "Todo not found" });
    } else {
        res.json(updatedTodo);
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
