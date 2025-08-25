const express = require("express");
const mongoose =  require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://mohit:12345@cluster0.wguoail.mongodb.net/todo?retryWrites=true&w=majority',{
  useNewUrlParser:true,
  useUnifiedTopology:true
})
.then(()=> console.log("MongoDB Atlas connected"))
.catch(err=> console.error("connection error:",err));

const trySchema= new mongoose.Schema({
    name:String
});

const Item = mongoose.model("task",trySchema);
 
const defaultTasks = [
    new Item({name: "create todo video"}),
    new Item({name: " learn DSA"}),
    new Item({name: " learn web3"}),
];

app.get("/", async (req , res)=> {
    try {
        const foundItems = await Item.find({});
        for (let def of defaultTasks) {
            const exists = await Item.findOne({ name: def.name });
            if (!exists) {
                await def.save();
            }
        }
        const updatedItems = await Item.find({});
        res.render("list",{ dayej: updatedItems });
    } catch(err) {
        console.log(err);
    }
});


app.post("/", async (req, res) => {
  try {
    const newTaskName = req.body.elel?.trim();

    if (newTaskName) {
      const existing = await Item.findOne({ name: newTaskName });
      if (!existing) {
        const newTask = new Item({ name: newTaskName });
        await newTask.save();
      }
    }

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});
 app.post("/delete",async(req,res) =>{
  try{
    const checckedId = req.body.checkbox;
    await Item.findByIdAndDelete(checckedId);
    console.log("Task Deleted:", checckedId);
    res.redirect("/");
  } catch(errr) {
    console.log(err);
    res.redirect("/");
  }
 });
 
app.listen(3000,function(){
    console.log("server is running on port 3000");
});



