import { NextResponse } from 'next/server';
import Reaction from '@/app/models/reactions';
import connectDB from '@/app/lib/db';
import mongoose from 'mongoose';

// POST: Save or update reaction
export async function POST(request) {
  await connectDB();

  const { id, action, userId } = await request.json();
  const blogObjectId = new mongoose.Types.ObjectId(id);
  const userid = userId.toString();

  try {
    const existing = await Reaction.findOne({ blogId: blogObjectId, userId: userid });

    let newReaction;

    if (existing) {
      newReaction = existing.reaction === action ? null : action;
      existing.reaction = newReaction;
      await existing.save();

      return NextResponse.json({
        success: true,
        message: "Reaction updated",
        reaction: newReaction,
      }, { status: 200 });
    } else {
      const newDoc = new Reaction({ blogId: blogObjectId, userId: userid, reaction: action });
      await newDoc.save();

      return NextResponse.json({
        success: true,
        message: "Reaction saved",
        reaction: action,
      }, { status: 200 });
    }

  } catch (error) {
    console.error("Error saving reaction:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

// GET: Fetch reaction counts and current user's reaction
export async function GET(request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const blogId = searchParams.get('id');
  const userId = searchParams.get('userId');

  try {
    const blogObjectId = new mongoose.Types.ObjectId(blogId);

    const totalLikes = await Reaction.countDocuments({ blogId: blogObjectId, reaction: 'like' });
    const totalDislikes = await Reaction.countDocuments({ blogId: blogObjectId, reaction: 'dislike' });

    let userReaction = null;
    if (userId) {
      const existing = await Reaction.findOne({ blogId: blogObjectId, userId });
      userReaction = existing?.reaction || null;
    }

    return NextResponse.json({
      success: true,
      totalLikes,
      totalDislikes,
      userReaction,
    });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ success: false, message: "Error in GET" }, { status: 500 });
  }
}
