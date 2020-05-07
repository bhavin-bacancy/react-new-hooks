const express = require("express");
const app = express();
const http = require("http").Server(app);
const path = require("path");
const PORT = process.env.PORT || 5000;
app.use("/static", express.static(path.join(__dirname, "build/static")));
app.use("/images", express.static(path.join(__dirname, "build/images")));
app.use("/icons", express.static(path.join(__dirname, "build/icons")));
app.use("/css", express.static(path.join(__dirname, "build/css")));
app.use("/*", (req, res) => {
  res.sendFile(path.join(`${__dirname}/build/index.html`));
});
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
