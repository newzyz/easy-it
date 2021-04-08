const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class ProductType {
    constructor(type_name,id) {
        this.type_name = type_name;
        this._id = id;
    }

    static fetchAll() {
        const db = getDb();
        return db
            .collection('product_type')
            .find()
            .toArray()
            .then(product_types => {
                console.log(product_types);
                return product_types;
            })
            .catch(err => {
                console.log(err);
            });
    }

}

module.exports = ProductType;