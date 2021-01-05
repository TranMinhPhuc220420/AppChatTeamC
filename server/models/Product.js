const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    count: {
        type: Number,
        required: true
    },
    discount: {
        timeStart: {
            type: Date,
        },
        timeEnd: {
            type: Date,
        },
        percent: {
            type: Number,
        }
    }
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;