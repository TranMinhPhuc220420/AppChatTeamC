const Product = require('../models/Product')

exports.addNew = async (req, res) => {
    console.log('Start create new Product');

    const ProductNew = new Product({
        name: "Product Test",
        price: 1500000,
        count: 10,
        description: "Description Test",
        discount: {
            timeStart: new Date(),
            timeEnd: new Date(),
            percent: 50
        }
    });

    ProductNew.save()
        .then(result => {
            console.log("Create new product is success")
            res.end("Create new product is success");
        })
        .catch(error => {
            console.log("Create new product Fail")
            res.end("Create new product Fail");
        });
};

exports.getAll = async (req, res) => {
    console.log('Get all Product');

    const data = await Product.find();
    if (data) {
        return res.status(200).json({data: data});
    } else {
        return res.status(500).json({data: null});
    }
};

exports.reductionDiscount = async (req, res) => {
    const {_idProduct} = req.body;
    const productFindForWork = await Product.findById(_idProduct);

    //Check count
    if(productFindForWork.count > 0){
        productFindForWork.count - 1;
    }

    productFindForWork.save()
        .then(result => {
            res.status(200).json({product: productFindForWork, msg: "ok"})
        })
        .catch(error => {
            res.status(500).json({msg: "error server"})
        });
};