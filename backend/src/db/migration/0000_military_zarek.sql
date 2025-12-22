CREATE TABLE "favourite" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"recipe_id" integer NOT NULL,
	"title" text NOT NULL,
	"image" text NOT NULL,
	"cookTime" text NOT NULL,
	"servings" text NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
