
const { body } = require('express-validator');

const newCorseValid = () => {
    return [
        body('cName')
            .notEmpty()
            .withMessage("cName not provideed"),
        body('price')
            .notEmpty()
            .withMessage("price not provideed")
    ]
}

module.exports = { newCorseValid }