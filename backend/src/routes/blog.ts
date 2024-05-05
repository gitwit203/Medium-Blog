import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {decode,sign,verify} from 'hono/jwt'
import { createblogInput,updateblogInput } from "@abhi_203/medium-common";

export const blogRouter=new Hono<
{
    Bindings:{
        DATABASE_URL:string;
        JWT_SECRET:string;
    }
    Variables:{
        userId:string;
    }
}
>();

//middleware
blogRouter.use('/*', async(c,next)=>{
    //geting headers
    const authHeader = c.req.header("authorization")||"";

    //verify jwt
    const user = await verify(authHeader,c.env.JWT_SECRET);

    try{
        if(user)
            {
                c.set("userId",user.id)
                await next()
            }
            else{
                c.status(403);
                return c.json({
                    message:"You are not logged in"
                })
            }
    }   catch(e){
        c.status(403);
        return c.json({
            message:"You are not logged in"
        })
    }
    
    
})


  //creating blog

blogRouter.post('/', async(c) => {
    const body = await c.req.json();

    const {success} = createblogInput.safeParse(body);
    if(!success)
    {
      c.status(403)
      return c.json({
        message:"Inputs not correct"
      })
    }


    //get authorID
    const authorId=c.get("userId")

    //initialise prisma
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate()) 




  
    const blog =await prisma.blog.create({
        data:{
            title:body.title,
            content:body.content,
            authorId:Number(authorId)
        }
    })


    return c.json({
        id: blog.id
    })
  })

//updating blog
blogRouter.put('/',async (c)=>{
    //get the body
    const body = await c.req.json();


    const {success} = updateblogInput.safeParse(body);
    if(!success)
    {
      c.status(403)
      return c.json({
        message:"Inputs not correct"
      })
    }

    //intialise prisma
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate()) 

    //actual updation takes place
    const blog = await prisma.blog.update({
        where : {
            id: body.id,
              
        },
        data:{
            title:body.title,
            content:body.content,
        }
    })



    return c.text('Blog Updated')
})

//ToDO: add pagination
//this is before /:id as it catches all request and it treats "bulk" as id

blogRouter.get('/bulk', async (c) => {
    //intialise prisma
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate()) 

    //get all blogs
    const blogs = await prisma.blog.findMany({
        select: {
            content: true,
            title: true,
            id: true,
            author: {
                select: {
                    name: true
                } 
            }
        }
    });

    //return all blogs
    //try to implement pagination
    return c.json({
        blogs
    })
    
  })



//fetching blog
blogRouter.get('/:id', async (c) => {
    //get the body
    const id = c.req.param("id");

    //intialise prisma
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate()) 

    try{
    const blog = await prisma.blog.findFirst({
        where:{
            id:Number(id)
        },
        select:{
            id:true,
            title:true,
            content:true,
            author:{
                select:{
                    name:true,
                }
            }
        }
    })

    return c.json({
        blog
    });
    }catch(e){
        c.status(404);
        return c.json({
            message: "Couldn't find blog"
        })
    }

    
  })

