import { gql } from "graphql-tag";

const typeDefs = gql`
  # Define SocialLink first
  type SocialLink {
    name: String
    link: String
  }

  # Then Website can reference SocialLink
  type Website {
    id: ID
    title: String
    copyright: String
    logo: String
    socialLinks: [SocialLink]
  }

  type Query {
    website: Website
  }
`;

export default typeDefs;