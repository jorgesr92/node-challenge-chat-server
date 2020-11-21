const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());
const fs = require('fs');

const welcomeMessage = require("./data.json");

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
// const messages = [welcomeMessage];

const checkMessage = (obj) => {
  let fromCheck = false;
  let textCheck = false;
  obj.text && obj.text != ""  ? textCheck = true : textCheck = false;
  obj.from && obj.from != ""  ? fromCheck = true : fromCheck = false;
  if (fromCheck && textCheck){
    return true
  } else{
    return false;
  }
};

const updateDatabase = (newMessage) =>{
  let newMessageData = welcomeMessage;
  newMessageData.push(newMessage);

  fs.writeFileSync("./data.json", JSON.stringify(newMessageData));
  return "POST /albums route";
};

const findMessage = (text) => {
  return welcomeMessage.filter(el => el.text.includes(text));
}

const findLastest = () => {
  if (welcomeMessage.length <= 10){
    return welcomeMessage;
  } else {
    let findLastestM = [];
    for (let index = 0; index <= 9; index++) {
      findLastestM.push(welcomeMessage[welcomeMessage.length-1-index]);
      console.log(welcomeMessage.length-1-index);
    };
    console.log(findLastestM)
    return findLastestM;
  };
}

app.get("/", (req, res)=> {
  response.sendFile(__dirname + "/index.html");
});

app.get("/messages", (req, res)=> {
  res.json(welcomeMessage);
});

app.get("/messages/:id", (req, res)=> {
  const id = req.params.id;
  const message = welcomeMessage.filter(el => el.id === Number(id));
  res.json(message);
});


app.post("/messages", (req, res) => {
  const newMessage = req.body;
  let maxID = Math.max(...welcomeMessage.map(el => el.id));
  newMessage.id = maxID + 1;
  const dateStamp = new Date();
  newMessage.dateStamp = dateStamp;
 
  let checkStutas = checkMessage(newMessage);
  checkStutas ? res.send(updateDatabase(newMessage)) : res.status(400).json({succes: false});

});

app.delete("/messages/:id", (req, res) => {
  const id = req.params.id;
  const message = welcomeMessage.filter(el => el.id === Number(id));
  const index = welcomeMessage.indexOf(message[0]);

  let newMessageData = welcomeMessage;
  newMessageData.splice(index, 1);

  fs.writeFileSync("./data.json", JSON.stringify(newMessageData));
  res.status(200).json({succes: true});
});

app.get("/message/search", (req, res) => {
   let word = req.query.text;
   res.json(findMessage(word));
 });

 app.get("/message/lastest", (req, res) => {
  res.json(findLastest());
});

const listener = app.listen(3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});