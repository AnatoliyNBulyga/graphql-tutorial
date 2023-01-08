const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean } = graphql;

const Movie = require('../models/movie');
const Director = require('../models/director');

/*
const directorsJson = [
    { "name": "Quentin Tarantino", "age": 55 }, // 63b1a891f9c80d9d9e42b6f8
    { "name": "Michael Radford", "age": 72 }, // 63b1aaa2f9c80d9d9e42b6fa
    { "name": "James McTeigue", "age": 51 }, // 63b1aadbf9c80d9d9e42b6fb
    { "name": "Guy Ritchie", "age": 50 }, // 63b1ab04f9c80d9d9e42b6fc
];
*/

/*
const movieJson = [
    { "name": "Pulp Fiction", "genre": "Crime", "directorId": "63b1a891f9c80d9d9e42b6f8" },
    { "name": "1984", "genre": "Sci-Fi", "directorId": "63b1aaa2f9c80d9d9e42b6fa"},
    { "name": "V for vendetta", "genre": "Sci-Fi-Triller", "directorId": "63b1aadbf9c80d9d9e42b6fb"},
    { "name": "Snatch", "genre": "Crime-Comedy", "directorId": "63b1ab04f9c80d9d9e42b6fc"},
    { "name": "Reservoir Dogs", "genre": "Crime", "directorId": "63b1a891f9c80d9d9e42b6f8"},
    { "name": "The Hateful Eight", "genre": "Crime", "directorId": "63b1a891f9c80d9d9e42b6f8"},
    { "name": "Inglourious Basterds", "genre": "Crime", "directorId": "63b1a891f9c80d9d9e42b6f8"},
    { "name": "Lock, Stock and Two Smoking Barrels", "genre": "Crime", "directorId": "63b1ab04f9c80d9d9e42b6fc"},
]
*/

/*
const movies = [
    { id: '1', name: 'Pulp Fiction', genre: 'Crime', directorId: '1' },
    { id: '2', name: '1984', genre: 'Sci-Fi', directorId: '2' },
    { id: '3', name: 'V for vendetta', genre: 'Sci-Fi-Triller', directorId: '3' },
    { id: '4', name: 'Snatch', genre: 'Crime-Comedy', directorId: '4' },
    { id: '5', name: 'Reservoir Dogs', genre: 'Crime', directorId: '1' },
    { id: '6', name: 'The Hateful Eight', genre: 'Crime', directorId: '1' },
    { id: '7', name: 'Inglourious Basterds', genre: 'Crime', directorId: '1' },
    { id: '8', name: 'Lock, Stock and Two Smoking Barrels', genre: 'Crime-Comedy', directorId: '4' },
];
*/

/*
const directors = [
    { id: '1', name: 'Quentin Tarantino', age: 55 },
    { id: '2', name: 'Michael Radford', age: 72 },
    { id: '3', name: 'James McTeigue', age: 51 },
    { id: '4', name: 'Guy Ritchie', age: 50 },
];
*/

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        rate: { type: GraphQLInt },
        watched: { type: new GraphQLNonNull(GraphQLBoolean) },
        director: {
            type: DirectorType,
            resolve({ directorId }, args) {
                return Director.findById(directorId);
            }
        }
    }),
});

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        movies: {
            type: new GraphQLList(MovieType),
            resolve( { id }, args) {
                return Movie.find({ directorId: id});
            }
        }
    }),
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addDirector: {
            type: DirectorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve( parent, { name, age }) {
                const director = new Director({
                    name,
                    age,
                });
                return director.save();
            },
        },
        addMovie: {
            type: MovieType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                rate: { type: GraphQLInt },
                watched: { type: new GraphQLNonNull(GraphQLBoolean) },
                directorId: { type: GraphQLID },
            },
            resolve( parent, { name, genre, rate, watched, directorId } ) {
                const movie = new Movie({
                    name,
                    genre,
                    rate,
                    watched,
                    directorId
                });
                return movie.save();
            },
        },
        deleteDirector: {
            type: DirectorType,
            args: {
                id: { type: GraphQLID }
            },
            resolve( parent, { id }) {
                return Director.findByIdAndRemove(id);
            }
        },
        deleteMovie: {
            type: MovieType,
            args: {
                id: { type: GraphQLID }
            },
            resolve( parent, { id }) {
                return Movie.findByIdAndRemove(id);
            }
        },
        updateDirector: {
            type: DirectorType,
            args: {
               id: { type: GraphQLID },
               name: { type: GraphQLString },
               age: { type: GraphQLInt },
            },
            resolve( parent, { id, name, age }) {
                return Director.findByIdAndUpdate(
                    id,
                    { $set: { name, age }},
                    { new: true },
                );
            },
        },
        updateMovie: {
            type: MovieType,
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                genre: { type: GraphQLString },
                rate: { type: GraphQLInt },
                watched: { type: GraphQLBoolean },
                directorId: { type: GraphQLID },
            },
            resolve( parent, { id, name, genre, rate, watched, directorId }) {
                return Movie.findByIdAndUpdate(
                    id,
                    { $set: { name, genre, rate, watched, directorId } },
                    { new: true },
                );
            },
        },
    }
});

const Query = new GraphQLObjectType(({
    name: 'Query',
    fields: {
        movie: {
            type: MovieType,
            args: { id: { type: GraphQLID } },
            resolve(parent, { id }) {
                return Movie.findById(id);
            }
        },
        director: {
            type: DirectorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, { id }) {
                return Director.findById(id)
            }
        },
        movies: {
            type: new GraphQLList(MovieType),
            args: { name: { type: GraphQLString }},
            resolve(parent, { name }) {
                return Movie.find({ name: { $regex: name, $options: "i" } });
            }
        },
        directors: {
            type: new GraphQLList(DirectorType),
            args: { name: { type: GraphQLString }},
            resolve(parent, { name }) {
                return Director.find({ name: { $regex: name, $options: "i" } });
            }
        },
    }
}));

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});