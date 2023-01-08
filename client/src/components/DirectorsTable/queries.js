import {gql} from 'apollo-boost';

export const directorsQuery = gql`
    query ($name: String) {
        directors(name: $name) {
            id
            name
            age
            movies {
                id
                name
            }
        }
    }
`;