import { gql } from "@apollo/client";

const getWebsite = gql`
  query GetWebsite {
    website {
        id
        title
        copyright
        socialLinks {
            name
            link
        }
        logo
    }
  }
`;

export { getWebsite };
