const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },

    discount: {
        timeStart: {
            type: Date,
        },
        timeEnd: {
            type: Date,
        },
        price: {
            type: Number,
            required: true
        },
        count: {
            type: Number,
            required: true
        },
        sold:{
            type: Number,
            required: true,
            default: 0
        }
    }
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;