import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();
const app = express();
const port = 3000;
const db = new pg.Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});
db.connect();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  {
    id: 1,
    title: "Shampoo",
    type: true,
    created: new Date().toISOString().slice(0, 10),
  },
  {
    id: 2,
    title: "Cereal",
    type: false,
    created: new Date().toISOString().slice(0, 10),
  },
];

app.get("/", async (req, res) => {
  const response = await db.query("SELECT * FROM products");
  items = response.rows;
  res.render("index", {
    listTitle: new Date().toLocaleDateString("en-GB"),
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try {
    await db.query("INSERT INTO products (title) VALUES ($1)", [item]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  try {
    await db.query("UPDATE products SET title=($1) WHERE id=$2", [item, id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deletedItemId;
  try {
    await db.query("DELETE FROM products WHERE id=$1", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
