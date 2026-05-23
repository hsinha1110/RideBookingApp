const mongoose = require("mongoose");

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/riderbooking");

    console.log("DB connected successfully..!!");
  } catch (err) {
    console.log("DB not connected...!!!", err);
  }
}

main();
