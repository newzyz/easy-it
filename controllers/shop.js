const { validationResult } = require('express-validator')

const mongodb = require('mongodb');
const Product = require('../models/products');
const ProductType = require('../models/product_type');
const Cart = require('../models/cart');
const ObjectId = mongodb.ObjectId;


exports.getSearchItem = (req, res, next) => {
    search_item = req.query.search_item;
    type = req.query.type;
    Product.findByNameAndType(search_item,type)
        .then(products => {
            console.log(products);
            ProductType.fetchAll()
            .then(product_types => {
                Cart.getCountInCart()
                .then(result => {
                    res.render('customer/shop', {
                        pageTitle: 'Eazy !T',
                        prods: products,
                        prod_types: product_types,
                        search_item: search_item,
                        type: type,
                        count:result
                    });
                })
                .catch(err => {
                    console.log(err);
                });
            })
            .catch(err => {
                console.log(err);
            });
        })
        .catch(err => {
            console.log(err);
        });
}


exports.getSearchProduct = (req, res, next) => {
    const search_item = "";
    const type = "";
    Product.fetchAll()
        .then(products => {
            ProductType.fetchAll()
            .then(product_types => {
                Cart.getCountInCart()
                .then(result => {
                    res.render('customer/shop', {
                        pageTitle: 'Eazy !T',
                        prods: products,
                        prod_types: product_types,
                        search_item: search_item,
                        type: type,
                        count: result
                    });
                })
                .catch(err => {
                    console.log(err);
                });
            })
            .catch(err => {
                console.log(err);
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getCartItem = (req, res, next) => {
    var sum = 0;
    cart = Cart.fetchAll()
    .then(cart => {
        if(cart.length>0){
            for(var i=0; i < cart.length; i++){
                sum = sum + parseFloat(cart[i].products[0].price);
            }
        }
        Cart.getCountInCart()
        .then(result => {
                res.render('customer/cart', {
                    pageTitle: 'Cart',
                    products: cart,
                    sum:sum,
                    count:result
                });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));

}

exports.getProductDetail = (req, res, next) => {
    const { product_id } = req.params;
    console.log(product_id);
    Product.findById(product_id)
    .then(product => {
        Cart.getCountInCart()
        .then(result => {
            res.render('customer/product_detail', {
                pageTitle: 'Product Details',
                errorMessage: null,
                product_id: product_id,
                product_name: product.product_name,
                image: product.image,
                price: product.price,
                amount: product.amount,
                description: product.description,
                type_name: product.types[0].type_name,
                count:result
            });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.addToCart = (req, res, next) => {
    console.log(req.body);
    const { product_id } = req.params;
    const amount = 1;
    const cart = new Cart(product_id, amount);
    cart
        .save()
        .then(result => {
            // console.log(result);
            console.log('Add Product To Cart');
            res.redirect(req.get('referer'));
        })
        .catch(err => {
            console.log(err);
        });

};

exports.deleteProductCart = (req, res, next) => {
    const { product_id } = req.params;
    console.log(product_id);
    Cart.deleteProductInCart(product_id)
        .then(() => {
            console.log('Delete Product');
            res.redirect('/cart');
        })
    .catch(err => console.log(err));

};
