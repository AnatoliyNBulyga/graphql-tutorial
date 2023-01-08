const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3005;
const BASE_URL = 'mongodb+srv://root:root@cluster0.s1akpjj.mongodb.net/graphql-tutorial?retryWrites=true&w=majority'

mongoose.set("strictQuery", false);
const start = async () => {
    try {
        await mongoose.connect(BASE_URL, { useNewUrlParser: true });
        app.listen(PORT, () => console.log(`SERVER START ON PORT ${PORT}`));
    } catch(e) {
        console.log(e);
    }
};

app.use(cors());

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

start();