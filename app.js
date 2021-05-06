const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path =require("path")
const day = require(__dirname + "/date.js");
const _ = require("lodash");
console.log(day);
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-surya:turAScgDyTXryaI1@cluster0.el2dx.mongodb.net/toDoListDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
app.set('view engine', 'ejs');
const itemSchema = {
  name: String,
};
const Item = mongoose.model("item", itemSchema);
const item1 = new Item({
  name: "Welcome!"
});
const item2 = new Item({
  name: "Hit + to add!"
});
const item3 = new Item({
  name: "Hit - to delete!"
});
const defaultItems = [];

const listSchema = {
  name:String,
  item:[itemSchema],
};
const List = mongoose.model("list",listSchema);

app.get("/", function(req, res) {
    let title=req.body.list;
  Item.find({}, function(err, foundItems) {
    // if (foundItems.length === 0) {
    //   Item.insertMany(defaultItems, function(err) {
    //     if (err) console.log(err);
    //     else console.log("Success");
    //   });
    //   res.redirect("/");
    // }
    //
    //  else {
      res.render("lists", {
        listTitle: day,
        items: foundItems
      });
    });
});

app.post("/", function(req, res) {
  let title =req.body.list;
  let itemName = req.body.itemlist;
  const item = new Item({
    name:itemName
  });
  if(title===day){
  item.save();
  res.redirect("/");
}else{
  List.findOne({name:title},function(err,foundList){
        foundList.item.push(item);
        foundList.save();
        res.redirect("/"+title);
  });
}

});
app.post("/delete",function(req,res){
  const listTitle =req.body.listName;
  const checkedItemID =req.body.checkbox;
  if(listTitle===day){
  Item.findByIdAndRemove(checkedItemID,function(err){
    if(err)console.log(err);
    else {
    res.redirect("/");
  }
});
}else{
List.findOneAndUpdate({name:listTitle},{$pull:{item:{_id:checkedItemID}}},function(err){
  if(!err){
    res.redirect("/"+listTitle);
  }
});
}
});
app.get("/:customTitle", function(req, res) {

  const title = _.capitalize(req.params.customTitle);
  List.findOne({name:title},function(err,collectionItem){
    if(!err){
      if(!collectionItem){
        const list = new List({
          name:title,
          item:defaultItems
        });
        list.save();
        res.redirect("/"+title);
      }
      else{
        res.render("lists",{listTitle:collectionItem.name,items:collectionItem.item});
      }
    }
  });
  });


  //   Item.insertMany(customItems,function(err,customItem){
  //     if(err) console.log(err)
  //     else{
  //       res.render("lists", {
  //         listTitle: title,
  //         items: customItem,
  //       });
  //     }
  //   })
  // }

// });
// app.post("/work",function(req,res){
//   let item=req.body.itemList;
//   workItems.push(item);
//   res.redirect("/work");
// });
app.listen(process.env.PORT||3000, function() {
  console.log("Server success")
})
