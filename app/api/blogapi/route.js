import { NextResponse } from 'next/server';
import connectDB from '../../lib/db';
import Blog from '@/app/models/blog';
import cloudinary from '@/lib/cloudinary';

// ======================== POST ========================
export async function POST(request) {
  await connectDB();

  const formData = await request.formData();
  const title = formData.get('title');
  const category = formData.get('category');
  const description = formData.get('description');
  const author = formData.get('author');
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ success: false, message: "No image received" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64String = buffer.toString('base64');
  const dataURI = `data:${file.type};base64,${base64String}`;

  let uploadedImage;
  try {
    uploadedImage = await cloudinary.uploader.upload(dataURI, {
      folder: 'blogs',
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Image upload failed", error: error.message }, { status: 500 });
  }

  const blog = new Blog({
    title,
    category,
    description,
    author,
    image: uploadedImage.secure_url,
    imagePublicId: uploadedImage.public_id, // Save for later deletion
  });

  await blog.save();

  return NextResponse.json({ success: true, message: "Blog saved", blog });
}

// ======================== PUT ========================
export async function PUT(request) {
  await connectDB();

  try {
    const formData = await request.formData();
    const id = formData.get("id");
    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const file = formData.get("file");

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    }

    const updateFields = {};
    if (title) updateFields.title = title;
    if (category) updateFields.category = category;
    if (description) updateFields.description = description;

    // If new image is uploaded
    if (file && file instanceof Blob) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64String = buffer.toString("base64");
      const dataURI = `data:${file.type};base64,${base64String}`;

      // Delete old image from Cloudinary
      if (blog.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(blog.imagePublicId);
        } catch (err) {
          console.warn("Failed to delete old image from Cloudinary:", err.message);
        }
      }

      const uploadedImage = await cloudinary.uploader.upload(dataURI, {
        folder: "blogs",
      });

      updateFields.image = uploadedImage.secure_url;
      updateFields.imagePublicId = uploadedImage.public_id;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateFields, { new: true });

    return NextResponse.json({ success: true, message: "Blog updated", data: updatedBlog });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Update failed", error: error.message }, { status: 500 });
  }
}

// ======================== DELETE ========================
export async function DELETE(request) {
  await connectDB();

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, message: "ID not provided" }, { status: 400 });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ success: false, message: "No blog found with that ID" }, { status: 404 });
    }

    // Delete Cloudinary image
    if (blog.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(blog.imagePublicId);
      } catch (err) {
        console.warn("Failed to delete image from Cloudinary:", err.message);
      }
    }

    await Blog.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Blog deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error", detail: error.message }, { status: 500 });
  }
}
