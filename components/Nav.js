"use client"
import Link from 'next/link'
import React, { use } from 'react'
import { AuthContext } from './authProvider'
import { useContext } from 'react'


const Nav = () => {
    const {changeLogout, authUser} = useContext(AuthContext)
    
    
    return (
      <div className="flex justify-end">
        <div className="flex justify-between">
          <Link className='py-3' href="/">
            Home
          </Link>
          {!authUser ?
          <div className='p-3'>
          <Link className='px-3' href="/signup">
            Signup
          </Link>
          <Link className="px-3" href="/login">
            Login
          </Link>
          </div>
          
          : <div className='p-3'> <Link className="p-3" href="/upload">
            Upload
          </Link>
          <a className='p-3 cursor-pointer' onClick={changeLogout}>Logout</a>
          </div>
          }
        </div>
      </div>
    );
}

export default Nav