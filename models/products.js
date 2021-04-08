const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Products {
    constructor(product_name, price, image, amount, description, type_id,id) {
        this.product_name = product_name;
        this.price = price;
        this._id = id;
        this.image = image;
        this.amount = amount;
        this.description = description;
        this.type_id = mongodb.ObjectID(type_id);
    }

    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            // Update the product
            dbOp = db
                .collection('products')
                .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this });
        } else {
            // Insert product
            dbOp = db.collection('products').insertOne(this);
        }
        return dbOp
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            });
    }

    static fetchAll() {
        const db = getDb();
        return db
            .collection('products')
            .aggregate([
            { $lookup:
                {
                    from: 'product_type',
                    localField: 'type_id',
                    foreignField: '_id',
                    as: 'types'
                }
                }
            ])
            .toArray()
            .then(products => {
                console.log(products);
                return products;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static findById(prodId) {
        const db = getDb();
        return db
            .collection('products')
            .aggregate([
            { $match : {  _id: new mongodb.ObjectId(prodId) } },
            { $lookup:
                {
                    from: 'product_type',
                    localField: 'type_id',
                    foreignField: '_id',
                    as: 'types'
                }
                }
            ])
            .next()
            .then(product => {
                console.log(product);
                return product;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static findByNameAndType(prodName,typeId) {
        const db = getDb();
        console.log(typeof typeId);
        if(typeId == "all"){
            return db
            .collection('products')
            // .find({product_name:new RegExp(prodName, 'i')})
            .aggregate([
            { $match : 
                    { product_name: new RegExp(prodName, 'i')}
            },
            { $lookup:
                {
                    from: 'product_type',
                    localField: 'type_id',
                    foreignField: '_id',
                    as: 'types'
                }
                }
            ])
            .toArray()
            .then(product => {
                console.log(product);
                return product;
            })
            .catch(err => {
                console.log(err);
            });
        }else{
            return db
            .collection('products')
            // .find({product_name:new RegExp(prodName, 'i')})
            .aggregate([
            { $match : 
                { $and:[
                    { product_name: new RegExp(prodName, 'i')},
                    { type_id:new mongodb.ObjectId(typeId)}
                ]}
            },
            { $lookup:
                {
                    from: 'product_type',
                    localField: 'type_id',
                    foreignField: '_id',
                    as: 'types'
                }
                }
            ])
            .toArray()
            .then(product => {
                console.log(product);
                return product;
            })
            .catch(err => {
                console.log(err);
            });
        }
    }

    static deleteById(prodId) {
        const db = getDb();
        return db
            .collection('products')
            .deleteOne({ _id: new mongodb.ObjectId(prodId) })
            .then(result => {
                console.log('Deleted');
            })
            .catch(err => {
                console.log(err);
            });
    }
}

module.exports = Products;