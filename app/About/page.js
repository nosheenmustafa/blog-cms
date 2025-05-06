import React from "react";
import { Crimson_Text } from "next/font/google";

const crimson = Crimson_Text({
  weight: ["400"],
  subsets: ["latin"], //required
  style: ["normal"],
});

const page = () => {
  return (
    <div>
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
      <div className="text-white">
        <div className="leading-[1.5]">
          <h2
            className={`${crimson.className} mt-4 text-center text-3xl  underline text-white font-bold`}
          >
            Who i am
          </h2>

          <p
            className={`w-[65%]  mx-auto text-center items-center flex h-32  text-white font-bold text-2xl ${crimson.className}`}
          >
            Hi, am Nosheen Mustafa a web developer with a love for clean code
            and creative user experience. i built this BLOG-CMS to simpilify the
            content creation and management for writers and team.
          </p>
        </div>

        <div className="leading-[1.5]">
          <h2
            className={`${crimson.className} mt-4 text-center text-3xl  underline text-white font-bold`}
          >
            Project Story
          </h2>

          <p
            className={`w-[65%]  mx-auto text-center items-center flex h-32  text-white font-bold text-2xl ${crimson.className}`}
          >
            I created this Blog-CMS to give the full control over content with
            fast and secure backend. built by using Nextjs, Node js and
            mongoose, with feature of real time editing and role based access of
            admin and normal user.
          </p>
        </div>
        <div className={`font-bold mx-32  items-center  ${crimson.className}`}>
          <h2
            className={`${crimson.className} mt-4 text-center text-3xl  underline text-white font-bold`}
          >
            Key Featured
          </h2>
          <div className="flex gap-8 mx-32 mt-4 ">
            <ul className="list-disc pl-5 space-y-1">
              <li>User Authentication (NextAuth + JWT)</li>
              <li>Google Login</li>
              <li>Blog Schedule</li>
            </ul>

            <ul className="list-disc pl-5 space-y-1">
              <li>Like & Dislike functionality</li>
              <li>Basic CRUD operations</li>
              <li>Media uploads</li>
            </ul>
          </div>

          <p className="mt-4 mx-32 text-white"><b>Contact: 03020788297</b></p>
        </div>
      </div>
    </div>
  );
};

export default page;
