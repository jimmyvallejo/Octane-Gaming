import React from 'react'
import Dropzone from '@components/Dropzone';


const Upload = () => {
  return (
    <section className="py-24 flex items-center justify-center">
      <div className="container flex justify-center">
        
        <Dropzone className="mt-10 border border-neutral-200 p-16" />
      </div>
    </section>
  );
}

export default Upload