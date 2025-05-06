import React from 'react';
import Singleblog from './singleblog';
import Blog from '@/app/models/blog';
import connectDB from '@/app/lib/db';

export default async function singleblogParent({params: rawParams}) {
   const params = await rawParams; // ✅ satisfies Next.js runtime expectations
  const { id } = params;
  await connectDB();
  const findblog = await Blog.findById(id);

  if (!findblog) {
    return <div>Blog not found</div>;
  }

  const plainBlog = {
    title: findblog.title,
    author: findblog.author,
    id: findblog._id.toString(),
    description: findblog.description,
    image: findblog.image,
    createdAt: findblog.createdAt,
    category:findblog.category
  };

  return (
    <div>
      <Singleblog id={id} result={plainBlog} />
    </div>
  );
}
