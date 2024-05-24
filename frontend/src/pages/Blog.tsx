import { FullBlog } from "../components/FullBlog";
import { useBlog } from "../hooks"
import { useParams } from "react-router-dom";
import { Appbar } from "../components/Appbar";
import {Spinner} from "../components/Spinner";
//can use a hook but better alternative is to use 
// selectorFamily or atomFamily
export const Blog=()=>{
    const {id}=useParams();
    const {loading,blog} = useBlog({
        id:id||""
    });

    if(loading){
        return<div>
            <Appbar/>
            <div className="h-screen flex flex-col justify-center">
                <div className="flex justify-center">
                    <Spinner/>
                </div>

            </div>
            
        </div>
    }

    return <div>
        <FullBlog blog={blog}/>
    </div>

}