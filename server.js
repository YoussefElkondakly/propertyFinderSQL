const app = require("./app");
const sequelize = require("./utils/database");
const port = process.env.PORT || 3000;

// const LDB = process.env.DB_LOCAL.replace('<PASSWORD>',process.env.DB_PASSWORD)
sequelize
  .sync
  // {force:true}
  ()
  .then(() => {
    console.log("DB connection successful");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => console.log(err));
