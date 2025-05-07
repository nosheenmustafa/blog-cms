export const dynamic = "force-dynamic"; // Add this line

import React from 'react';
import connectDB from '../lib/db';
import Blog from '../models/blog';
import Showallblogs from './showallblogs/showallblog';

const Page = async () => {
  await connectDB();
  const blogs = await Blog.find();
const plainBlogs = blogs.map(blog =>({
    _id : blog._id.toString(),
    title: blog.title,
    category: blog.category,
    author: blog.author,
    description: blog.description,
    image:blog.image,
    

}))
  return (
    <div>
      {/* <h1>All Blogs</h1> */}
        <Showallblogs  blogs={plainBlogs}/>
    </div>
  );
};

export default Page;
