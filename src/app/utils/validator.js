export function validator(data, config) {
    const errors = {};
    function validate(validateMethod, data, config) {
        let statusValidate;
        switch (validateMethod) {
            case "isRequired": {
                if (typeof data === "boolean") {
                    statusValidate = !data;
                } else {
                    if (Array.isArray(data)) {
                        statusValidate = !data.length();
                    } else {
                        statusValidate = data.trim() === "";
                    }
                }
                break;
            }

            case "isEmail":
                statusValidate = !/^\S+@\S+\.\S+$/g.test(data);
                break;
            case "isCapitalSymbol":
                statusValidate = !/[A-Z]+/g.test(data);
                break;
            case "isContainDigit":
                statusValidate = !/\d+/g.test(data);
                break;
            case "min":
                statusValidate = data.length < config.value;
                break;
            default:
                break;
        }
        if (statusValidate) return config.message;
    }
    for (const fieldName in data) {
        for (const validateMethod in config[fieldName]) {
            const error = validate(
                validateMethod,
                data[fieldName],
                config[fieldName][validateMethod]
            );
            if (error && !errors[fieldName]) {
                errors[fieldName] = error;
            }
        }
    }
    return errors;
}
