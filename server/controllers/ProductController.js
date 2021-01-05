const Product = require('../models/Product')

exports.addNew = async (req, res) => {
    console.log('Start create new Product');

    const dataToRandom = [
        {
            name: "Điện thoại Samsung Galaxy Note 10+",
            image: "https://cdn.tgdd.vn/Products/Images/42/206176/samsung-galaxy-note-10-plus-silver-new-600x600.jpg",
            price: 1649000,
            description: "Trông ngoại hình khá giống nhau, tuy nhiên Samsung Galaxy Note 10+ sở hữu khá nhiều điểm khác biệt so với Galaxy Note 10 và đây được xem là một trong những chiếc máy đáng mua nhất trong năm 2019, đặc biệt dành cho những người thích một chiếc máy màn hình lớn, camera chất lượng hàng đầu.",
            discount: {
                timeStart: new Date("01-02-2021 24:00:00"),
                timeEnd: new Date("01-10-2021 24:00:00"),
                price: 1449000,
                count: 3,
            }
        },
        {
            name: "Điện thoại iPhone 12 64GB",
            image: "https://cdn.tgdd.vn/Products/Images/42/213031/iphone-12-xanh-duong-new-600x600-600x600.jpg",
            price: 2249000,
            description: "Apple tiếp tục khẳng định vị thế của mình trên thị trường smartphone khi mới đây cho ra mắt mẫu iPhone 12 với nhiều điểm được tối ưu hơn, nâng cấp mạnh hơn. Trong đó, iPhone 12 mini 128 GB được ví như là phiên bản thu nhỏ hơn là bản rút gọn với cấu hình không khác gì mấy anh lớn có mức giá hấp dẫn hơn.",
            discount: {
                timeStart: new Date("01-05-2021 24:00:00"),
                timeEnd: new Date("01-15-2021 24:00:00"),
                count: 8,
                price: 2149000
            }
        },
        {
            name: "Điện thoại iPhone 12 128GB",
            image: "https://cdn.tgdd.vn/Products/Images/42/228741/TimerThumb/iphone-12-mini-128gb-(2).jpg",
            price: 2049000,
            description: "OnePlus 8T là chiếc flagship mới nhất của OnePlus vừa được trình làng, gây ấn tượng với màn hình 120 Hz, tốc độ sạc siêu nhanh và cấu hình mạnh mẽ.",
            discount: {
                timeStart: new Date("01-04-2021 24:00:00"),
                timeEnd: new Date("01-06-2021 24:00:00"),
                count: 5,
                price: 1949000
            }
        },
        {
            name: "Điện thoại OnePlus 8T 5G",
            image: "https://cdn.tgdd.vn/Products/Images/42/226460/oneplus-8t-600x600-1-600x600.jpg",
            price: 1749000,
            description: "OnePlus 8 Pro 5G là chiếc điện thoại đánh dấu bước ngoặt của OnePlus trong năm 2020, smartphone đã và đang khẳng định lại vị trí của mình trên thị trường flagship cao cấp với thiết kế độc đáo, cụm camera ấn tượng, hiệu năng siêu khủng tích hợp nhiều công nghệ hiện đại.",
            discount: {
                timeStart: new Date("01-10-2021 24:00:00"),
                timeEnd: new Date("01-15-2021 24:00:00"),
                count: 1,
                price: 1549000
            }
        },
        {
            name: "Điện thoại OPPO Reno4 Pro",
            image: "https://cdn.tgdd.vn/Products/Images/42/223497/oppo-reno4-pro-trang-600x600.jpg",
            price: 1199000,
            description: "Mới đây, OPPO đã chính thức trình làng chiếc smartphone mới mang tên OPPO Reno4 Pro. Máy được trang bị cấu hình vô cùng cao cấp với vi xử lý chip Snapdragon 720G, bộ 4 camera đến 48 MP ấn tượng, cùng công nghệ sạc siêu nhanh Super VOOC 65 W hướng tới nhóm khách hàng thích chụp ảnh, chơi game với hiệu năng cao nhưng được bán với mức giá vô cùng tốt.",
            discount: {
                timeStart: new Date("01-01-2021 24:00:00"),
                timeEnd: new Date("01-20-2021 24:00:00"),
                count: 10,
                price: 1099000
            }
        }
    ];

    const ProductNew = new Product(dataToRandom[Math.floor(Math.random() * 5)]);

    ProductNew.save()
        .then(result => {
            console.log("Create new product is success")
            res.end("Create new product is success");
        })
        .catch(error => {
            console.log(error)
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
    console.log(_idProduct)
    const productFindForWork = await Product.findById(_idProduct);

    if (productFindForWork) {
        //Check count
        if (productFindForWork.discount.count > 0) {
            productFindForWork.discount.count = productFindForWork.discount.count - 1;
            productFindForWork.discount.sold = productFindForWork.discount.sold + 1;
        }
        productFindForWork.save()
            .then(result => {
                res.status(200).json({product: productFindForWork, msg: "ok"})
            })
            .catch(error => {
                res.status(500).json({msg: "error server"})
            });
    }else{
        res.status(404).json({msg: 'Không tìm thấy sản phẩm vừa chọn'})
    }
};