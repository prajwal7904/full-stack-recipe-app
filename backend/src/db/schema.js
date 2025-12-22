import {pgTable,serial,text,timestamp,integer} from "drizzle-orm/pg-core";

export const favouritesTable=pgTable("favourite",{
    id:serial("id").primaryKey(),
    userId:text("user_id").notNull(),
    recipeId:integer("recipe_id").notNull(),
    title:text("title").notNull(),
    image:text("image").notNull(),
    cookTime:text("cookTime").notNull(),
    servings:text("servings").notNull(),
    createdAt:timestamp("createdAt").defaultNow()
})