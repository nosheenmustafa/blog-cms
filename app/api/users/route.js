import { NextResponse } from "next/server";
import User from "@/app/models/user";
import connectDB from "@/app/lib/db";
// import jwt from "jsonwebtoken"; // Import the jwt library to verify JWT
import { getToken } from "next-auth/jwt";

export async function POST(request) {
  try {
    await connectDB();

    // Corrected this line 👇
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 });
    }
  

    const data = await request.json();
    // console.log("name", data.name);
    // console.log("email", data.email);
    // console.log("profile pic", data.image);

    let userExists = await User.findOne({ email: data.email });
    const role = "normal user";
    if (userExists) {
      return NextResponse.json({
        success: true,
        message: "this email already exists try another",
        data: userExists,
      });
    }
//if the user is not aleady saved then save this user in the db
    const userinfo = new User({
      name: data.name,
      email: data.email,
      profile: data.image,
      role: role,
    });

    await userinfo.save();

    return NextResponse.json(
      { success: true, message: "new user saved successfully", userinfo: userinfo },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error in saving the user" }, { status: 401 });
  }
}

