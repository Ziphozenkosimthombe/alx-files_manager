import express from "express";
import mainRoutes from "./routes/index.js";
const app = express();
const port = process.env.PORT || 6000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", mainRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
