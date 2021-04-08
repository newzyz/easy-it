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
                .then(result  => {
                    res.render('admin/search', {
                    
                        pageTitle: 'Search Product',
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
                res.render('admin/search', {
                
                    pageTitle: 'Search Product',
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

exports.getAddProduct = (req, res, next) => {
    const product_name = '';
    const price = '';
    const image = '';
    const amount = '';
    const description = '';
    ProductType.fetchAll()
    .then(product_types => {
        Cart.getCountInCart()
        .then(result => {
        res.render('admin/insert', {
            pageTitle: 'Insert Product',
            errorMessage: null,
            product_name: product_name,
            price: price,
            image: image,
            amount: amount,
            description: description,
            prod_types: product_types,
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
};

exports.postAddProduct = (req, res, next) => {
    console.log(req.body);
    const { product_name, price, image, amount, description, type_id} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        ProductType.fetchAll()
        .then(product_types => {
            Cart.getCountInCart()
            .then(result => {
            res.render('admin/insert', {
                pageTitle: 'Insert Product',
                errorMessage: errors.array(),
                product_name: product_name,
                price: price,
                image: image,
                amount: image,
                description: description,
                type_id: type_id,
                prod_types: product_types,
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
    }else{
        const product = new Product(product_name, price, image, amount, description, type_id);
        product
            .save()
            .then(result => {
                // console.log(result);
                console.log('Created Product');
                res.redirect('/admin');
            })
            .catch(err => {
                console.log(err);
            });
    }

};

exports.getUpdateProduct = (req, res, next) => {
    console.log(req.params);
    const { product_id } = req.params;
    let item_types = [];
    let item = {};
    Product.findById(product_id)
        .then(product => {
            item = product;
            ProductType.fetchAll()
            .then(product_types => {
                Cart.getCountInCart()
                .then(result => {
                item_types = product_types;
                res.render('admin/update', {
                    pageTitle: 'Update Product',
                    errorMessage: null,
                    product_id: product_id,
                    product_name: item.product_name,
                    image: item.image,
                    price: item.price,
                    amount: item.amount,
                    description: item.description,
                    type_id: item.type_id,
                    prod_types: item_types,
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
        .catch(err => console.log(err));
};

exports.postUpdateProduct = (req, res, next) => {
    console.log(req.body);
    const { product_id, product_name, price ,image ,type_id ,amount ,description} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        ProductType.fetchAll()
        .then(product_types => {
            Cart.getCountInCart()
            .then(result => {
                res.render('admin/update', {
                    pageTitle: 'Update Product',
                    errorMessage: errors.array(),
                    product_id: product_id,
                    product_name: product_name,
                    price: price,
                    image: image,
                    amount: amount,
                    description: description,
                    type_id: type_id,
                    prod_types:product_types,
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
    }else{
        const product = new Product(product_name, price, image, amount, description, type_id, new ObjectId(product_id));
        product
            .save()
            .then(result => {
                console.log('Update Product');
                res.redirect('/admin');
            })
            .catch(err => console.log(err));
    }
};

exports.getDeleteProduct = (req, res, next) => {
    const { product_id } = req.params;
    console.log(product_id);
    Product.deleteById(product_id)
        .then(() => {
            console.log('Delete Product');
            res.redirect('/admin');
        })
        .catch(err => console.log(err));
};