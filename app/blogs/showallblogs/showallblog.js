"use client";
import React, { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Showallblogs = ({ blogs = [] }) => {
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [blogList, setBlogList] = useState(blogs);

  //this use effect show the edit buton only when the use is admin otherwise it will hide the edit btn to normal user
  useEffect(() => {
    if (status === "loading") return;
    const checkAdmin = async () => {
      try {
        const res = await fetch("/api/check-admin");
        const data = await res.json();
        console.log("data in showall blog page", data);
        if (data.success && data.data == "admin") {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Failed to check admin status", error);
        toast.error("Something went wrong in checking the status of the admin");
      }
    };

    if (session) {
      checkAdmin();
    }
  }, [session, status]);

  //handle delete logic here

  const handleDelete = async (id) => {
    console.log("delete this id", id);
    const request = await fetch("/api/blogapi", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    const response = await request.json();
    if (response.success) {
      setBlogList((prev) => prev.filter((b) => b._id !== id));
      toast.success("blog deleted successfully");
    } else {
      toast.error("error in deleting the record");
    }
  };
  if (session) {
    // const profileimage = session.user?.image || "";

    return (
      <div className="w-full p-4">
        <ToastContainer />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6 px-16 mt-14 w-full">
          {blogList?.map((blog) => (
            <div
              key={blog._id}
              className="w-full bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
            >
              <a href="#">
                <h5 className="my-2 text-center text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  {blog.title}
                </h5>
              </a>
              <a href="#">
                <Image
                  src={blog.image}
                  height={128}
                  width={128}
                  className="w-full h-50 object-cover"
                  alt={blog.title}
                />
              </a>
              <div className="px-5 pb-5 mt-1">
                {blog.description.slice(0, 100)}
                <Link
                  href={`/blogs/singleblog/${blog._id}`}
                  className="mx-4 text-blue-600 hover:underline"
                >
                  Read more
                </Link>
                {/* Conditionally show edit and delete buttons for admin */}
                <div className="flex justify-between mt-2">
                  {isAdmin && (
                    <Link href={`/admin/edit/${blog._id}`}>
                      <button className="bg-green-400 text-white font-bold hover:bg-green-600 px-2 py-2 rounded-lg w-24">
                        Edit
                      </button>
                    </Link>
                  )}
                  {isAdmin && (
                    <button
                      className="bg-red-400 text-white font-bold hover:bg-red-600 px-2 py-2 rounded-lg w-24 o"
                      onClick={() => handleDelete(blog._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default Showallblogs;
