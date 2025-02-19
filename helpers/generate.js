module.exports.generateRandomString = (length) => {
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijk1mnopqrstuvwxyzØ123456789';

    let result = '';

    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }

    return result;
};
