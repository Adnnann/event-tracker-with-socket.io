import mongoose from "mongoose";
import Events from "./src/models/events.model.js";
import Users from "./src/models/user.model.js";
import config from "./src/config/config.js";

mongoose
  .connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB successfully connected..."))
  .catch((e) => console.log(e));

const deleteSeed = async () => {
  await Users.deleteMany({});
  await Events.deleteMany({});
};

deleteSeed()
  .then(() => {
    mongoose.connection.close();
  })
  .catch((err) => console.log(err));
