import "dotenv/config";
import express from "express";
import logger from "./logger.js";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 6000;

app.use(express.json());

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

let teaData = [];
let nextId = 1;

//add a new tea
app.post("/teas", (req, res) => {
  const { name, price } = req.body;
  const newTea = { id: nextId++, name, price };
  teaData.push(newTea);
  res.status(201).send(newTea);
});

//get all tea
app.get("/teas", (req, res) => {
  res.status(200).send(teaData);
});

//get tea by id
app.get("/teas/:id", (req, res) => {
  const tea = teaData.find((tea) => tea.id === parseInt(req.params.id));
  if (!tea) {
    return res.status(404).send("Tea not fount");
  }
  res.status(200).send(tea);
});

//edit a tea
app.put("/teas/:id", (req, res) => {
  const tea = teaData.find((tea) => tea.id === parseInt(req.params.id));
  if (!tea) {
    return res.status(404).send("Tea not fount");
  }

  const { name, price } = req.body;
  tea.name = name;
  tea.price = price;

  res.status(200).send(tea);
});

app.delete("/teas/:id", (req, res) => {
  const teaIndex = teaData.findIndex(
    (tea) => tea.id === parseInt(req.params.id)
  );

  if (teaIndex === -1) {
    return res.status(404).send("Tea not fount");
  }

  teaData.splice(teaIndex, 1);
  res.status(204).send("Deleted Successfully");

  logger.warn("Delete successful");
});

app.listen(port, () => {
  console.log(`Server is listening at port: ${port}`);
});
