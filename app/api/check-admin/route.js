import {NextResponse} from 'next/server';
import User from '@/app/models/user';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/app/lib/db';

export async function GET(request){
  await connectDB();
  try{
    const token = await getToken({req: request , secret: process.env.NEXTAUTH_SECRET});
  if(!token){
    return NextResponse.json({succes:false, message:"no token found"}, {status:401})
  }
  const user = await User.findOne({email: token.email});
  if(!user){
    return NextResponse.json({success:false, message:"no user found of that emial in token"}, {status:404})
  }
  return NextResponse.json({success:true, message:"data found", data:user.role});
  }catch(error){
    return NextResponse.json({success:false,message:"error in checking the user"}, {status:200})
  }
}