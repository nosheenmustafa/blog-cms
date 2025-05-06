import { NextResponse } from 'next/server';
import connectDB from '../../lib/db';
import Blog from '@/app/models/blog';
import fs from 'fs';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';

export const config = {
  api:{
    bodyParser:false
  }
}

export async function POST(request) {
  await connectDB();

  const formData = await request.formData(); // ✅ Correct method
  const title = formData.get('title');
  const category = formData.get('category');
  const description = formData.get('description');
  const author = formData.get('author');
  const file = formData.get('file'); // This will give you the uploaded file


  if(!file){
    return NextResponse.json({success:false, message:"no image received"}, {status:201})
  }

    const buffer = Buffer.from(await file.arrayBuffer()); //convert binary image into buffer so that we can save 
    const filename = Date.now() + file.name.replaceAll(" ", "_");//create a unique name of file
    const uploadPath = path.join(process.cwd(), "public/uploads");// told whre file will store

    try {
      await mkdir(uploadPath, { recursive: true });//make directory and recurive true means make a parent directory if not availbe
    } catch (err) {
      console.error("Error creating upload directory:", err);
      return NextResponse.json({ error: "Failed to create upload directory.", details: err.message }, { status: 500 });
    }

    try {
      const filePath = path.join(uploadPath, filename);// its the name of path including filename
      await writeFile(filePath, buffer);
    } catch (err) {
      console.error("Error saving file:", err);
      return NextResponse.json({ error: "Error saving file.", details: err.message }, { status: 500 });
    }


  // console.log("server is running");
  // console.log("Title:", title);
  // console.log("Category:", category);
  // console.log("Description:", description);
  // console.log("Author:", author);
  // console.log("File:", file); 

  const blog = new Blog({
    title,
    category,
    description,
    author,
    image: filename 
  });

  await blog.save();

  return NextResponse.json({ success: true, message: "Blog saved in database" });
}



//update any single blog using id
export async function PUT(request){
  await connectDB();
    try{
      const formData = await request.formData();
      // console.log("form data for updating record in route side", formData);
      const id = formData.get("id");
      const title = formData.get("title");
      // const author = formData.get("author");
      const description = formData.get("description");
      const file = formData.get("file");
      const category = formData.get("category");
      // console.log("id", id);
      // console.log("title", title);
      // console.log("category", category);
      // console.log("file", file);
      // console.log("description", description);
     
      //jo jo values updation ky liy availbe hn wo dal do 
      const updateField ={};
      if(title) updateField.title = title;
      if(category) updateField.category = category;
      if(description)  updateField.description = description;
       
      //for image update the process will be little different from textual data
      if(file && file instanceof Blob){
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = Date.now() + file.name.replaceAll("","-");
        const uploadPath = path.join(process.cwd(), "public/uploads");

        const filepath = path.join(uploadPath, filename);
        try{
          await fs.promises.mkdir(uploadPath, {recursive:true});
        }
        catch(error){
         return NextResponse.json({error:"Failed to create the uploaded path",detail:error.message},{status:500})
        }

        try{
          await fs.promises.writeFile(filepath,buffer);
          updateField.image = filename;
        }
        catch(error){
          return NextResponse.json({error:"Saving file", detail:error.message},{status:500})
        }
        const updateProduct = await Blog.findByIdAndUpdate(id, updateField,{new:true});
        if(!updateProduct){
          throw new Error('blog which you want to update not found');
        }
        return NextResponse.json({success:true, message:"data updated",data:updateProduct},{status:200})
      }
    }
    catch(error){
        consoele.log("error somethind is there");
        return NextResponse.json({success:false, message:"Error in updating the product", detail:error.message},{status:500})
    }
    return NextResponse.json({success:true, message:"data received"}, {status:200})
}



//delete the single blog logic goes hree
export async function DELETE(request){
  await connectDB();
 const id = await request.json();
 const findblog = await Blog.findByIdAndDelete(id);
 if(!findblog){
  return NextResponse.json({success:false, message:"no blog found of that id to delete"},{status:500})
 }
 return NextResponse.json({success:true, message:"data deleted successfully"},{status:200})
 
}