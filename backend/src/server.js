import express from 'express'
import { ENV } from './config/env.js';
import {db} from './config/db.js';
import { favouritesTable } from './db/schema.js';
import { and, eq } from 'drizzle-orm';
import job from './config/cron.js';


const app=express();

if(ENV.NODE_ENV==="production")job.start()

app.use(express.json());

const PORT=ENV.PORT ||3000

app.get("/api/health", (req, res) => {
   res.status(200).json({success:true})
});

app.post("/api/favourite",async(req,res)=>{
    try {
        const {userId,recipeId,title,image,cookTime,servings}=req.body;
        if(!userId || !recipeId || !title ){
            return  res.status(400).json({error:"Missing required fields"})
        }
       const newFavourite= await db.insert(favouritesTable).values({
            userId,
            recipeId,
            title,
            image,
            cookTime,
            servings

        }).returning();
        res.status(201).json(newFavourite[0])

        
    } catch (error) {
        console.log("Error adding favourite",error);
        res.status(500).json({error:"Something went wrong"})
        
        
    }
})

app.delete("/api/favourite/:userId/:recipeId",async(req,res)=>{
    try {
        const {userId,recipeId}=req.params

        await db.delete(favouritesTable).where(
            and(eq(favouritesTable.userId,userId),eq(favouritesTable.recipeId,parseInt(recipeId)))
        )
        res.status(200).json({message:"Favourite remove successfully... "})
        
    } catch (error) {
        console.log("Error removing favourite",error);
        res.status(500).json({error:"Something went wrong"})
    }
})


app.get("/api/favourite/:userId",async(req,res)=>{
    try {
        const {userId}=req.params

       const userFav = await db.select().from(favouritesTable).where(eq(favouritesTable.userId,userId));
       res.status(200).json(userFav)
        
    } catch (error) {
        console.log("Error removing favourite",error);
        res.status(500).json({error:"Something went wrong"})
    }
})

app.listen(PORT,()=>{
    console.log(`Server is running on PORT:${PORT}`);
})