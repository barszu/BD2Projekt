/**
 * Compares the structure of two objects.
 * @param {Object} obj - The object to compare.
 * @param {Object} template - The template to compare against.
 * @returns {boolean|Array} - Returns true if the structures match. If they don't match, returns an array of keys that are missing in the object.
 */
const compareStructure = (obj, template) => {
    //TODO sprawdza JSONY jako ===, moze wystarczy parsowac dane clienta przez mongo???
    if (typeof obj !== typeof template) return false;
    if (typeof obj !== 'object' || obj === null || template === null) return obj === template;

    const objKeys = Object.keys(obj);
    const templateKeys = Object.keys(template);

    if (objKeys.length !== templateKeys.length) {
        return templateKeys.filter(key => !objKeys.includes(key));
    }

    for (let key of objKeys) {
        if (!templateKeys.includes(key)) {
            return [key];
        }
        const result = compareStructure(obj[key], template[key]);
        if (result === false) {
            return false;
        }
        if (result !== true ) {
            return [key, ...result];
        }
    }

    return true;
};

/**
 * Middleware for checking the structure of the JSON request body if matches the template.
 * @param {Object} template - The template to compare against.
 * @returns {Function} - Returns a middleware function that checks if the request body matches the template structure.
 */
const validateJsonStructure = (template) => {
    return (req, res, next) => {
        const isValid = compareStructure(req.body, template);
        if (isValid !== true) {
            return res.status(400).json({
                success: false,
                message: 'Invalid JSON structure',
                missingFields: isValid
            });
        }
        next();
    };
};

const validateBodyJsonSchema = (bodyFieldName, schema) => {
    return (req, res, next) => {
        if (!req.body.hasOwnProperty(bodyFieldName)) {
            return res.status(400).json({
                success: false,
                message: 'Missing required field in JSON body',
                errors: `Missing required field: ${bodyFieldName}`
            });
        }

        try {
            // TODO check if schema is a schema by validate -> don't create an object
            const isValid = new schema(req.body[bodyFieldName]);
            // const isValid = schema.validate(req.body[bodyFieldName]);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid given JSON structure',
                errors: error
            });
        }
        next();
    };
};

export default validateBodyJsonSchema;

// module.exports = validateJsonStructure;

