const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Cart {
    constructor(product_id, amount,id) {
        this.product_id =  mongodb.ObjectID(product_id);
        this._id = id;
        this.amount = amount;
    }

    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            // Update the product
            dbOp = db
                .collection('cart')
                .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this });
        } else {
            // Insert product
            dbOp = db.collection('cart').insertOne(this);
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
            .collection('cart')
            .aggregate([
            { $lookup:
                    {
                        from: 'products',
                        localField: 'product_id',
                        foreignField: '_id',
                        as: 'products'
                    }
                }
            ])
            .toArray()
            .then(cart => {
                console.log(cart);
                return cart;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static deleteProductInCart(prodId) {
        const db = getDb();
        return db
            .collection('cart')
            .deleteOne({ product_id: new mongodb.ObjectId(prodId) })
            .then(result => {
                console.log('Deleted');
            })
            .catch(err => {
                console.log(err);
            });
    }

    static getCountInCart() {
        const db = getDb();
        return db
            .collection('cart')
            .find()
            .toArray()
            .then(result => {
                console.log(result.length);
                return result.length;
            })
            .catch(err => {
                console.log(err);
            });
    }
}

module.exports = Cart;