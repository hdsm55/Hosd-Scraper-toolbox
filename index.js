import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://scraper.run";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs"); // Set EJS as the template engine

app.get("/", (req, res) => {
  res.render("index.ejs", { content: null }); // Initialize content as null
});

app.post("/Validation", async (req, res) => {
  const inputValidation = req.body.inputValidation;
  let result;

  try {
    // Determine the validation type based on the input
    if (inputValidation.includes("@")) {
      result = await axios.get(API_URL + `/email?addr=${inputValidation}`);
    } else if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(inputValidation)) {
      result = await axios.get(API_URL + `/ip?addr=${inputValidation}`);
    } else if (/^(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.?)+(?:[A-Za-z]{2,})$/.test(inputValidation)) {
      result = await axios.get(API_URL + `/dns?addr=${inputValidation}`);
    } else {
      result = await axios.get(API_URL + `/whois?addr=${inputValidation}`);
    }

    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.get('/Hosd', (req, res) => {
  res.render('Hosd.ejs');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
