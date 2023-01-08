import { gql } from "apollo-boost";

export const deleteMovieMutation = gql`
    mutation ($id: ID) {
        deleteMovie(id: $id) {
            id
        }
    }
`;