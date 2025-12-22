import { ENV } from './src/env.js'; 


export default {
  schema: "./src/db/schema.js",
  out: "./src/db/migration",
  dialect: "postgresql",
  dbCredentials: {
    url: ENV.DATABASE_URL,
  },
};
