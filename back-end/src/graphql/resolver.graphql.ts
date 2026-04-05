import Website from "../models/website.models.ts";


const resolvers = {
  Query: {
    website: async () => {
      return await Website.findOne();
    }
  },
};

export default resolvers;