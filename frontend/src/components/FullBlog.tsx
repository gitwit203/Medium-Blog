import { Appbar } from "./Appbar"
import {Blog} from "../hooks"
import { Avatar } from "./BlogCard"



export const FullBlog=({blog}:{blog:Blog})=>{

    return <div>
        <Appbar/>
        <div className="flex jsutify-center">
        </div>
            <div className="grid grid-cols-12 px-10 w-full pt-200 max-w-screen-2xl pt-12">
                <div className="col-span-8 ">
                    <div className="text- 5xl font-extrabold">
                        {blog.title}
                    </div>
                    <div className="text-slate-500">
                        Posted on dec 2023
                    </div>
                    <div className="">
                        {blog.content}
                    </div>
                </div>
                

                <div className="col-span-4">
                    <div className="text-slate-600 text-lg">
                        Author
                    </div>
                    
                    <div className="flex">
                        <div className="pr-4 flex flex-col justify-center">
                            <Avatar name={blog.author.name||"Anonymous"} size="small"/>
                        </div>
                        
                        <div className="text-xl font-bold">
                            {blog.author.name||"Anonymous"}
                        </div>
                        <div className="pt-2 text-slate-500">
                            Random catchPhrase(to be entered by author)
                        </div>
                    </div>
                    
                    
                </div>
            </div>
        
        </div> 
    
    


    

}