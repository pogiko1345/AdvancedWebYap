const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const Student = require("./models/Student");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });


app.get("/", (req, res) => {
  res.send("Server is running!");
});


app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post("/students", async (req, res) => {
  try {
    const { name, course, age } = req.body;

    const newStudent = new Student({
      name,
      course,
      age,
    });

    await newStudent.save();

    res.json(newStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.put("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, course, age } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, course, age },
      { new: true }
    );

    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.delete("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Student.findByIdAndDelete(id);

    res.json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});