import { gql } from "apollo-boost";

export const deleteDirectorMutation = gql`
    mutation ($id: ID) {
        deleteDirector(id: $id) {
            id
        }
    }
`;