import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default {
    schema: "./db/schema.js",
    out: "./drizzle",
    driver: "mysql2",
    dbCredentials: {
        connectionString: process.env.DATABASE_URL,
    },
};
