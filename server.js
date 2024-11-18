const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const app = express();

mongoose.connect("mongodb://localhost:27017/sample").then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error(err);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const employeeSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: String,
    status: Boolean,
});

const Employee = mongoose.model("Employee", employeeSchema);

// Create Employee
app.post("/api/v1/employee/new", async (req, res) => {
    try {
        const employee = await Employee.create(req.body);
        res.status(200).json({
            success: true,
            employee,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Invalid JSON data",
        });
    }
});

// Retrieve Employees
app.get("/api/v1/employees", async (req, res) => {
    try {
        const employees = await Employee.find(req.query);
        res.status(200).json({
            success: true,
            employees,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// Update Employee
app.put("/api/v1/employees/:id", async (req, res) => {
    try {
        let employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }
        employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            useFindAndModify: false,
            runValidators: true,
        });
        res.status(200).json({
            success: true,
            employee,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// Delete Employee
app.delete("/api/v1/employees/:id", async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Employee deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

app.listen(4500, () => {
    console.log("Server is running on http://localhost:4500");
});
