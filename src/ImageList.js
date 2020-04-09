import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';

export default ()=>{
    const [imgUrls,setImgUrls]=useState([]);

    const storageRef=firebase.storage().ref();

    useEffect(()=>{
        storageRef.listAll().then(res=>{
            res.items.forEach(imgRef=>{
                displayImage(imgRef);
            });
        });
    },[]);

    
    function displayImage(imageRef) {
        imageRef.getDownloadURL().then(function(url) {
            setImgUrls([url]);
        }).catch(function(error) {
          console.log(error); 
      return (
          <div className="main">
          {
              imgUrls.map(url=><img src={url} alt={url} key={url}/>)
          }
          </div>
      );
       
}