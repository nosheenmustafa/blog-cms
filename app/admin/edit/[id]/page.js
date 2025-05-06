import React from 'react'
import Edit from './edit'
import Blog from '@/app/models/blog';
import connectDB from '@/app/lib/db';

export default async function Editblog({params:rawParams}){
  await connectDB();
  const params =await rawParams;
  const {id} = params;
  // console.log("id of params",id)
  const findblog = await Blog.findById(id);
  // console.log("find blog by id", findblog);
  const plaiblog = {
    title: findblog.title,
    category:findblog.category,
    id:findblog._id.toString(),
    author:findblog.author,
    image:findblog.image,
    description: findblog.description,
    createdAt: findblog.createdAt

  }
  return ( 
    <div>
      
       <Edit id={id} result={plaiblog} />
    </div>
  )
}

