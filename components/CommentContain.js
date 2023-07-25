import React, { useEffect } from 'react'
import Image from 'next/image'


const Comment = ( {comments, authUser, comment} ) => {
  
  useEffect(() => {
    console.log(comment)
  }, [])
  
    return (
      <div className=" flex items-start justify-start flex flex-col ml-5 mt-5 mb-5">
        <div className="flex">
          <Image
            src={comments.ownerPic}
            width={30}
            height={30}
            className="mr-3"
          />
          <h1 className="text-white">{comments.ownerName}: </h1>
        </div>
        <p className=" min-w-[87%] max-w-[87%] rounded-md ml-11"> {comments.post}</p>
        <div className='flex items-center mt-2.5 ml-1'>
          <p className="text-xs">2d ago</p>
          {authUser && <button className='text-xs ml-3'>Reply</button>}
        </div>
      </div>
    );
}

export default Comment