import { gql } from "apollo-boost";

export const addDirectorMutation = gql`
    mutation addDirectorMutation($name: String!, $age: Int!) {
        addDirector(name: $name, age: $age) {
            name
        }
    }
`;

export const updateDirectorMutation = gql`
    mutation updateDirectorMutation($id: ID, $name: String!, $age: Int!) {
        updateDirector(id: $id, name: $name, age: $age) {
            name
        }
    }
`;