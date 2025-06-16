require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ Database Connection Error:", err));

// ✅ User & Task Schemas
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const TaskSchema = new mongoose.Schema({
    userId: String,
    task: String,
    completed: Boolean,
});

const User = mongoose.model("User", UserSchema);
const Task = mongoose.model("Task", TaskSchema);

// ✅ Signup Route (Stores Users in MongoDB)
app.post("/signup", async (req, res) => {
    try {
        console.log("Received Signup Request:", req.body);
        const { name, email, password } = req.body;

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });

        await newUser.save();
        console.log("User Saved:", newUser);

        res.json({ message: "Signup successful!" });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// ✅ Login Route (Authenticate Users)
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });
        res.json({ message: "Login successful!", token, userId: user._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Add Task Route (Stores Tasks for Logged-in Users)
app.post("/task", async (req, res) => {
    try {
        const { userId, task } = req.body;
        const newTask = new Task({ userId, task, completed: false });

        await newTask.save();
        res.json({ message: "Task added successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get User's Tasks Route
app.get("/tasks/:userId", async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.params.userId });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Update Task Completion
app.put("/task/:taskId", async (req, res) => {
    try {
        await Task.findByIdAndUpdate(req.params.taskId, { completed: req.body.completed });
        res.json({ message: "Task updated!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Delete Task Route
app.delete("/task/:taskId", async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.taskId);
        res.json({ message: "Task deleted!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Start Server (Deploy-Ready)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
