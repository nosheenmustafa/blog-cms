'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { AiOutlineLike, AiFillLike } from "react-icons/ai"
import { BiDislike, BiSolidDislike } from "react-icons/bi"


const Singleblog = ({ id, result }) => {
  const { data: session } = useSession();
  const[reaction, setReaction] = useState(null);
  const [likecount, setlikecount] = useState();
  const [dislikeCount, setDislikecount] = useState();

//initially get all likes and dislikes on that blog as the page load


// outside useEffect so it can be reused
const fetchReactions = async () => {
  try {
    const res = await fetch(`/api/blogapi/likedislikeapi?id=${id}&userId=${session?.user?.id}`);
    const data = await res.json();

    console.log("reactions response", data);
    setlikecount(data.totalLikes);
    setDislikecount(data.totalDislikes);
    setReaction(data.userReaction);
  } catch (err) {
    console.error("Error fetching reactions:", err);
  }
};

useEffect(() => {
  if (id && session?.user?.id) {
    fetchReactions();
  }
}, [id, session?.user?.id]);

  
//hanlde likes and dislikes
  const handleReaction = async (action) => {
    if (!session?.user?.id) {
      console.log("Please login first to react to the post");
      return;
    }

    // Toggle the reaction
    const newReaction = reaction === action ? null : action;
    setReaction(newReaction);

    try {
      const res = await fetch(`/api/blogapi/likedislikeapi?id=${id}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          action: newReaction,
          userId: session.user.id
        }),
      });
    await fetchReactions(); // call it again after POST

      if (!res.ok) throw new Error("Request failed");
    } catch (error) {
      console.error("Error updating reaction:", error);
    }
  };


  return (
    <div>
      <div className="border-2 border-gray-300 w-[65%] my-3 mx-auto">
        <h2 className="font-bold text-3xl text-center my-4">{result.title}</h2>
        <Image
          src={`/uploads/${result.image}`}
          width={100}
          height={100}
          className="w-full object-cover h-[200px]"
          alt={result.title}
        />
        <div className="px-4 py-2">
          <div>{result.description}</div>
          <div className="flex gap-8">
            <b>Author: {result.author}</b>
            <b>Published: {new Date(result.createdAt).toLocaleDateString()}</b>
            <b>Category: {result.category}</b>
          </div>
        </div>
      </div>

      <div className="w-[65%] mx-auto">
        <div className="flex gap-4 text-2xl">
         <button onClick={() => handleReaction('like')}>
            {reaction === 'like' ? <AiFillLike /> : <AiOutlineLike />} 
            <span>{likecount}</span>
          </button>
          <button onClick={() => handleReaction('dislike')}>
             {reaction === 'dislike' ? <BiSolidDislike /> : <BiDislike />} {dislikeCount}
          </button>
          {/* <span>Comment</span> */}
        </div>
      </div>
     
    </div>
  );
};

export default Singleblog;
