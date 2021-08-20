const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");
const app=express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}))
mongoose.connect("mongodb+srv://Aman:Chaikidukan1@cluster0.kwlnx.mongodb.net/todolist?retryWrites=true&w=majority");
const workSchema=new mongoose.Schema({
 name:String   
});
const work=new mongoose.model('work',workSchema);
const item1=new work({
   name:"Welcome To The App"
});
const item2=new work({
   name:"Add Your Custom List"
});
const item3=new work({
   name:"Explore All Features"
});
const defaultItems=[item1,item2,item3]
const listSchema= new mongoose.Schema({
   name:String,
   items:[workSchema]
});
const list=new mongoose.model('list',listSchema);
app.get("/",function(req,res)
{  
    var day = date.getDate();
    var newwork=work.find({},function(err,findItems)
        {
            if(err)
            {
               console.log("error in fetching data");
            }
         else
         {
            res.render("list",{listTitle:"Today",newItem:findItems});
                   
         }
        });
   
});
app.get("/:customList",function(req,res)
{  console.log(req.params.customList);
   const listname=req.params.customList;
  list.findOne({name:listname},function(err,foundItem)
  {  
       if(!err)
       { if(!foundItem)
         {
            console.log("Doesn't Exist");
         const newlist=new list({
            name:listname,
            items:defaultItems
         });
      newlist.save();
      res.redirect("/"+listname);
      }
         else
         {
            console.log("exist");
            res.render("list",{listTitle:foundItem.name,newItem:foundItem.items});
            
         }
      }
      else
      {
         console.log(foundItem);
      }     
  });  
  }); 
app.post("/",function(req,res)
{
const a = req.body.todo;
const newListname=req.body.addlist;
const workItem=new work({
       name:a
      });


if(newListname==="Today")
{
  workItem.save(); 
  res.redirect("/");
}
else
{
   list.findOne({name:newListname},function(err,foundlist)
   {
      console.log(foundlist);
     foundlist.items.push(workItem);
     foundlist.save();
    res.redirect("/"+ newListname);
   });
}

});
app.post("/delete",function(req,res)
{ let t=req.body.chech;
  work.findByIdAndDelete(id=t,function(err)
  {
     if(err)
     {
        console.log("error in deleting");
     }
   else
   {
      return res.redirect("/");
   }
  });
});
let port=process.env.PORT;
if(port==null || port=="")
{
   port=5000;
}
app.listen(process.env.PORT||port,function(err)
{   
    if(err)
    {
        console.log("error");
    }
else
{
console.log("server has started ");
}
});
