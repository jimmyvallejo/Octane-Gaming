
import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { Martel_Sans } from 'next/font/google';
import { useContext } from 'react';
import { AuthContext } from './authProvider';

  const martelSans = Martel_Sans({
    weight: ["300", "400", "600"],
    subsets: ["latin"],
  });

const SideNav = () => {

     const { changeLogout, authUser } = useContext(AuthContext);
  
    return (
      <section className={martelSans.className}>
        <div className="sideNav fixed h-screen flex flex-col items-start tracking-wider uppercase font-bold">
          <div className="pt-5 flex flex-col justify-start w-full mt-5 border-b border-gray-500">
            <div className="flex  flex-col items-center  justify-around h-60 mr-5 w-full pointer">
              <div className="flex flex-row items-center justify-between w-[97%] rounded py-3 hover:bg-gray-800">
                <div className="flex flex-row items-center ml-3">
                  <Image
                    src={`/assets/icons/customer.png`}
                    width={35}
                    height={35}
                    alt="profile"
                  />
                  <Link
                    className="ml-2 text-l mt-2 text-gray-300 "
                    href={`/profile`}
                  >
                    Profile
                  </Link>
                </div>
                <Image
                  src={`/assets/icons/right.png`}
                  width={25}
                  height={25}
                  className="mr-4"
                  alt="continue"
                />
              </div>
              <div className="flex flex-row items-center justify-between w-[97%] rounded py-3 hover:bg-gray-800">
                <div className="flex flex-row items-center ml-3">
                  <Image
                    src={`https://www.svgrepo.com/show/508322/upload.svg`}
                    width={35}
                    height={35}
                    alt="profile"
                  />
                  <Link
                    className="ml-2 text-l mt-2 text-gray-300"
                    href={`/upload`}
                  >
                    Upload
                  </Link>
                </div>
                <Image
                  src={`/assets/icons/right.png`}
                  width={25}
                  height={25}
                  className="mr-4 "
                  alt="continue"
                />
              </div>
              <div className="flex flex-row items-center justify-between w-[97%] rounded py-3 hover:bg-gray-800 ">
                <div className="flex flex-row items-center ml-3 cursor-pointer ">
                  <Image
                    src="/assets/icons/shutdown.png"
                    width={32}
                    height={32}
                    alt="logout"
                  />
                  <a
                    className="ml-3 text-l mt-1 text-gray-300"
                    onClick={changeLogout}
                  >
                    Logout
                  </a>
                </div>
                <Image
                  src={`/assets/icons/right.png`}
                  width={25}
                  height={25}
                  className="mr-4 cursor-pointer "
                  alt="continue"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}

  


export default SideNav