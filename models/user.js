module.exports = function (sequelize, DateTypes) {
	return sequelize.define('user', {
		email: {
            type: DateTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
                // isLowercase: true,
                // notEmpty: true
            }
        },
        password: {
            type: DateTypes.STRING,
            allowNull: false,
            validate: {
                // Validate pass length: min, max
                len: [7, 100]
            }
        }
    });
};


// Sequelize Validation Docs: http://docs.sequelizejs.com/manual/tutorial/models-definition.html#validations