import express from "express";

const app = express();
const port = 5000;

app.use(express.json());

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
});

app.listen(port, () => {
  console.log(`Server is listening at port: ${port}`);
});
