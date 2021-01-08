import React, { useEffect, useState } from "react";
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText } from 'mdbreact';
import url from "../context/url";
import request from "request";
import socket from "../context/socket";

import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import './style.scss';
import Swal from 'sweetalert2';
import Countdown from 'react-countdown';
var currencyFormatter = require('currency-formatter');

const ProductDiscount = () => {
  const [dataProduct, setDataProduct] = useState([]);

  useEffect(() => {
    getDataProduct();
  }, []);

  useEffect(() => {
    socket.on('update-product', () => {
      getDataProduct();
    });
  }, []);

  const getDataProduct = async () => {
    const options = {
      uri: `${url.LOCAL}/api/product/get-all`,
      method: "get",
    };

    request.get(options, (err, httpResponse, body) => {
      setDataProduct(JSON.parse(body).data);
    });
  }

  const handleClickByProduct = (event, _id) => {
    event.preventDefault();
    const options = {
      uri: `${url.LOCAL}/api/product/reduction`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({
        _idProduct: _id,
      }),
    };

    request.post(options, (err, httpResponse, body) => {
      if (!err) {
        socket.emit("product-reduction");
        getDataProduct();
        Swal.fire({
          icon: 'success',
          title: 'Đã mua 🐱‍🚀',
          text: 'Bạn đã mua thành công sản phẩm vừa chọn!',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Rất tiết 😭',
          text: 'Mua không thành công, dừng như đang có lỗi ở phía máy chủ',
        })
      }
    });
  };

  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    // Render a countdown
    return <span>{days} ngày {hours}:{minutes}:{seconds}</span>;
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {dataProduct.map((item, index) => (
          // {/* Khi thoi gian giam gia nam trong khoang thoi gian giam gia */ }
          (
            new Date(item.discount.timeEnd).getTime() >= Date.now()
              && new Date(item.discount.timeStart).getTime() <= Date.now()
              ? (
                <div className="col-md-3" key={index}>
                  <MDBCard>
                    <MDBCardImage className="image-product" src={item.image} waves />
                    <MDBCardBody>
                      <MDBCardTitle>{item.name}</MDBCardTitle>
                      <MDBCardText>
                        {item.description.substring(0, 100)}...
                                        </MDBCardText>


                      <div className="status">
                        <div className="count">
                          <MDBCardText className=''>
                            Đã bán {item.discount.sold}
                          </MDBCardText>
                          <MDBCardText className=''>
                            Còn lại {item.discount.count}
                          </MDBCardText>
                        </div>

                        <Countdown date={new Date(item.discount.timeEnd).getTime()} renderer={renderer} />
                      </div>

                      {item.discount.count != 0 && (
                        <div className="options-price">
                          <h5 className='red-text'>
                            {currencyFormatter.format((item.discount.price), { code: 'VND' })}
                          </h5>

                          <h5 className='red-text text-decoration-line-through'>
                            {currencyFormatter.format(item.price, { code: 'VND' })}
                          </h5>
                        </div>
                      )}
                      {item.discount.count == 0 && (
                        <div className="options-price">
                          <h5 className='red-text'>
                            {currencyFormatter.format(item.price, { code: 'VND' })}
                          </h5>
                        </div>
                      )}

                      {item.discount.count == 0 ?
                        (
                          <MDBBtn disabled={true} href="#!" color="warning">Hết số lượng bán</MDBBtn>
                        ) :
                        (
                          <MDBBtn disabled={item.discount.count == 0} href="#" color="primary"
                            onClick={(event) => handleClickByProduct(event, item._id)}
                          >Mua ngay</MDBBtn>
                        )
                      }
                    </MDBCardBody>
                  </MDBCard>
                </div>
              )
              :
              (
                <div className="col-md-3" key={index}>
                  <MDBCard>
                    <MDBCardImage className="image-product" src={item.image} waves />
                    <MDBCardBody>
                      <MDBCardTitle>{item.name}</MDBCardTitle>
                      <MDBCardText>
                        {item.description.substring(0, 100)}...
                                        </MDBCardText>


                      <div className="status">
                        <div className="count">
                          <MDBCardText className=''>
                            Đã bán {item.discount.sold}
                          </MDBCardText>
                          <MDBCardText className=''>
                            Còn lại {item.discount.count}
                          </MDBCardText>
                        </div>

                      </div>

                      <div className="options-price">
                        <h5 className='red-text'>
                          {currencyFormatter.format(item.price, { code: 'VND' })}
                        </h5>
                      </div>

                      <MDBBtn disabled={true} href="#" color="danger"
                        onClick={(event) => handleClickByProduct(event, item._id)}
                      >Hết thời gian giảm giá</MDBBtn>
                    </MDBCardBody>
                  </MDBCard>
                </div>
              ))
        ))
        }
      </div>
    </div>
  );
};

export default ProductDiscount;
