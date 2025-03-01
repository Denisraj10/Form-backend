const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const dotenv = require("dotenv");


dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// mongodb
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const storage = multer.memoryStorage();
const upload = multer({ storage });

const StudentSchema = new mongoose.Schema({
  name: String,
  age: String,
  dateofbrith: String,
  class: String,
  subject: String,
  bloodGroup: String,
  religion: String,
  caste: String,
  dalitChristian: String,
  fatherName: String,
  parentOccupation: String,
  parentAddress: String,
  parentMobileNo: String,
  studentMobileNo: String,
  pincode: String,
  previousSchool: String,
  residentLastYear: String,
  previousHostelName: String,
  previousHostelPlace: String,
  image: String,
});

const Student = mongoose.model("Student", StudentSchema);






app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const adminEmail = "kolass@gmail.com";
  const adminPassword = "denis";

  if (email === adminEmail && password === adminPassword) {
    return res.json({ message: "Admin login successful", role: "admin" });
  }
  if (email && password) {
    return res.json({ message: "User login successful", role: "user" });
  }

  res.status(401).json({ error: "Invalid credentials" });
});





app.post("/addForm", upload.single("image"), async (req, res) => {
  try {
    console.log("Received form data:", req.body);

    const studentData = {
      ...req.body,
      image: req.file ? req.file.buffer.toString("base64") : null,
    };

    const newStudent = new Student(studentData);
    await newStudent.save();

    res.status(201).json({ message: "Form submitted successfully", data: newStudent });
  } catch (error) {
    console.error("Error saving form:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});






app.get("/getForms", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    console.error("Error fetching forms:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


module.exports = app;