import React, { useEffect, useState } from "react";
import { MDBRow, MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from 'mdbreact';
import url from "../context/url";
import request from "request";
import socket from "../context/socket";

import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import './style.scss';
var currencyFormatter = require('currency-formatter');
import DateCountdown from 'react-date-countdown-timer';
import Countdown from 'react-countdown';

const ProductDiscount = () => {
    const [dataProduct, setDataProduct] = useState([]);

    useEffect(() => {
        getDataProduct();
    }, []);

    useEffect(() => {
        socket.on('update-product', () => {
            console.log('Test');
            getDataProduct();
        });
    });

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
            if (!err) socket.emit("product-reduction", _id);
        });
    };

    // Renderer callback with condition
    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a completed state
            return <Completionist />;
        } else {
            // Render a countdown
            return <span>{days} ngày {hours}:{minutes}:{seconds}</span>;
        }
    };

    return (
        <div className="container-fluid">
            <MDBRow>
                {dataProduct.map((item, index) => (
                    // {/* Khi thoi gian giam gia nam trong khoang thoi gian giam gia */ }
                    (
                        new Date(item.discount.timeEnd).getTime() >= Date.now()
                        && new Date(item.discount.timeStart).getTime() <= Date.now()
                        && (
                            <MDBCol size="3" key={index}>
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


                                        <MDBBtn disabled={item.discount.count == 0} href="#" color="primary"
                                            onClick={(event) => handleClickByProduct(event, item._id)}
                                        >Mua ngay</MDBBtn>
                                    </MDBCardBody>
                                </MDBCard>
                            </MDBCol>
                        ))
                ))
                }
            </MDBRow>
        </div>
    );
};

export default ProductDiscount;
