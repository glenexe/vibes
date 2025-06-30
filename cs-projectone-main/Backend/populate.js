require("dotenv").config();
const ConnectDb = require("./Dbconnection/Connect");
const Item = require("./Model/item.model");
const fakeDataItems = [
  {
    ItemName: "Designer Leather Wallet",
    Description: "Found in the student lounge with credit cards and ID.",
    Category: "Accessories",
    Locationfound: "Student Center Lounge",
    Imageurl:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    ItemName: "Ray-Ban Sunglasses",
    Description: "Wayfarer style found near sports bleachers.",
    Category: "Accessories",
    Locationfound: "Sports Field Bleachers",
    Imageurl:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    Foundby: "685bc2391be79230d8be6dbb",
    Status: "approved",
    isVeriticationQuestionSet: true,
  },
  {
    "ItemName": "Black Backpack",
    "Description": "North Face backpack with laptop compartment.",
    "Category": "Other",
    "Locationfound": "Bus Stop #12",
    "Imageurl":
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  {
    "ItemName": "Gold Necklace",
    "Description": "Thin gold chain with heart pendant.",
    "Category": "Accessories",
    "Locationfound": "Central Campus Fountain",
    "Imageurl":
      "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    "ItemName": "AirPods Pro (2nd Gen)",
    "Description": "White case with blue tooth sticker.",
    "Category": "Electronics",
    "Locationfound": "Library Study Room B2",
    "Imageurl":
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
   
  },
];

const start = async () => {
  try {
    await ConnectDb.connect(process.env.MONGO_URI);
    await Item.deleteMany();
    await Item.create(fakeDataItems);
    console.log("Success!!!!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
