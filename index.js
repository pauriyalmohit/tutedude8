 const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const app = express();


app.set("view engine","ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));
app.use(methodOverride("_method"));

mongoose.connect('mongodb+srv://mohitpouriyalmonu7088:ownUzLi1VsCF9O4f@cluster0.vcu2vvv.mongodb.net/',{
  useNewUrlParser:true,
  useUnifiedTopology:true
})
.then(()=>console.log("MongoDB Atlas connected"))
.catch(err=> console.error("connection error:",err));

const taskSchema = new mongoose.Schema({
  name: string
});

const Task = mongoose.model("Task",taskSchema);


const defaultTasks =[
  new Task({name: "Learn DSA"}),
  new Task({name:"complete Project"}),
  new Task({name:"Real Documentation"})
];

app.get("/",async(req,res)=>{
  try{
    const tasks = await Task.find();

    if(tasks.length ===0){
      await Task.insertMany(defaultTasks);
      return res.redirect("/");
    }
    res.render("list",{dayej: tasks});
  } catch (err){
    console.log(err);
    res.status(500).send("Error loading tasks");
  }
});

app.post("/",async (req,res)=>{
  const itemName = req.body.elel;
  const newTask = new Task({name: itemName});
  await newTask.save("/");
  res.redirect("/");
});

app.delete("/delete/:id",async (req,res)=>{
  const id= req.params.id;
  await Task.findByIdAndDelete(id);
  res.redirect("/");
});

app.put("/update/:id",async(req,res)=>{
  const id =req.params.id;
  const newName= req.body.name;
  await Task.findByIdAndUpdate(id,{name: newName});
  res.redirect("/");
});

app.listen(3000,()=>{
  console.log("server running on http://localhost:3000");
});
