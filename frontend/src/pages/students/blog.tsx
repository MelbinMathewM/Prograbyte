import BlogPart from "@/components/students/blog/blog-part";
import { TooltipProvider } from "@/components/ui/tooltip";

const Blog = () => {
    return (
        <>
           <TooltipProvider>
                <BlogPart />
           </TooltipProvider>
        </>
    )
}

export default Blog;