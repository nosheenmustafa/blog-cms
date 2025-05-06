'use client';
import React ,{useState, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useRouter} from 'next/navigation'
import {useSession, signIn,signOut} from 'next-auth/react';

const Add = () => {
  const { register, handleSubmit , formState: {errors}} = useForm();
  const [loading, setloading] = useState(false);
  const router = useRouter();
    const {data:session} = useSession();

//check weather the user is admin or not
useEffect(() => {
  const checkAdmin = async () => {
    try {
      const res = await fetch("/api/check-admin");
      const data = await res.json();

      if (!data.success || data.data !== "admin") {
        toast.error("Access denied. You are not an admin.");
        router.push("/blogs"); // redirect non-admins
      }
    } catch (error) {
      console.error("Failed to check admin status", error);
      toast.error("Something went wrong");
      router.push("/blogs");
    }
  };

  if (session) {
    checkAdmin();
  }
}, [session]);


 

  const onSubmit = async(data) => {
    // console.log(data); // 👉 this will show your form data
   setloading(true);
    const formdata = new FormData()
      formdata.append("title",data.title);
      formdata.append("category", data.category);
      formdata.append("description", data.description);
      formdata.append("author",data.author);
      formdata.append("file",data.file[0]);
    
    try{
      const request = await fetch('/api/blogapi',{
        method:"POST",
        body: formdata
        
      });
      const response = await request.json();
      if(response){
        toast.success("data store successfully");
          setTimeout(() => {
  router.push('/blogs');
}, 1500);
      }
    }
    catch(error){
        toast.error("there is an error in saving the data to database")
    }
  };

  return (

    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ width: '45%', margin: 'auto', mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <h1 className="font-bold text-center text-2xl">Add blog</h1>
      <TextField label="Title" {...register("title", { required:'Title is required' })} />
      {errors.title && <span className="font-bold text-red-600">{errors.title.message}</span>}
      <TextField label="Category" {...register("category", { required:'Category is required' })} />
      {errors.category && <span className="font-bold text-red-600">{errors.category.message}</span>}
      <TextField label="Author" {...register("author")} />
     {errors.author && <span className="font-bold text-red-600">{errors.author.message}</span>}
      <TextField label="Description"  {...register("description")} multiline rows={4} />
      {errors.description && <span className="font-bold text-red-600">{errors.description.message}</span>} 
      <input type="file" {...register("file")} />
      <ToastContainer />
      <Button variant="contained" color="primary" type="submit" disabled={loading}>{loading ? 'submitting..... : ': 'submit'}</Button>
    </Box>
  );
};

export default Add;
