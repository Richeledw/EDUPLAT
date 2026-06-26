const MongoStore = require('connect-mongo');
console.log('Type of MongoStore:', typeof MongoStore);
console.log('Is create function?:', typeof MongoStore.create);
console.log('Keys:', Object.keys(MongoStore));
try {
    if (MongoStore.default) {
        console.log('Has default export:', typeof MongoStore.default);
        console.log('Default create:', typeof MongoStore.default.create);
    }
} catch (e) { }
