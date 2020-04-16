import React, { useState, useRef, useEffect  } from 'react';
import useImage from './useImage';
import Cropper from './Cropper';
import firebase from 'firebase/app';

export default ()=>{
    const storageRef=firebase.storage().ref();
    const acceptedFiles="image/jpeg image/png image/jpg".split(" ");
    const {image64toCan,extractExtension,downloadBase64File,base64toFile}=useImage();
    const canvasRef=useRef();
    // const canvasRef755X450=useRef();  for simultaneously do 4 crop
    // const canvasRef365X450=useRef();
    // const canvasRef365X212=useRef();
    // const canvasRef380X380=useRef();
    const [original64,setOriginal64]=useState(null);
    const [cropPos,setCropPos]=useState({x:0,y:0});
    const [width,setWidth]=useState(200);
    const [height,setHeight]=useState(200);
    const [imgName,setImageName]=useState("");
    const [imgDim,setImgDim]=useState({width:0,height:0});


    useEffect(()=>{
        if(canvasRef.current)
        image64toCan(canvasRef,original64,{...cropPos,width,height})
    },[width,height,cropPos,original64]);

    function selectFile(e){
        if(e.target.files && e.target.files.length>0){
            if(verifyFile(e.target.files[0]))
            {
               
                setImageName(e.target.files[0].name.split(".")[0]);
                const reader=new FileReader();
                reader.onload=(e)=>{

                    var image = new Image();
                    image.src = e.target.result;
                           
                    image.onload = function () {
                        if (this.height > 1024 || this.addEventListenerwidth > 1024) {
                            alert("Height and Width must not exceed 1024px.");
                            reset();
                        }
                        else
                        {
                            setImgDim({width:image.width,height:image.height});
                            setOriginal64(e.target.result);
                        }
                        
                }
            }
                reader.readAsDataURL(e.target.files[0]);
            }
        }
        
    }
    function preProcessFile(){
        const fex=extractExtension(original64);

        const base64=canvasRef.current.toDataURL('image/'+fex);
        
        let fname=`${imgName}-${width}x${height}.${fex}`;

        const newFile=base64toFile(base64,fname);
        return {base64,newFile}
    }

    function uploadImage(){
        const {newFile}=preProcessFile();
        storageRef.child(newFile.name).put(newFile).then(()=>{
            console.log("file uploaded")
        }).catch(err=>{
            console.log(err.message);
        })


    }
    function downloadImage(){
        const {base64,newFile}=preProcessFile();
        downloadBase64File(base64,newFile);

    }
    function verifyFile(file){
        if(!acceptedFiles.includes(file.type))
        {
            alert("File not accepted")
            return false;
        }
      
        return true;
            
    }
    function reset(){
        setOriginal64(null);
        setCropPos({x:0,y:0});
        setImageName("");
        setHeight(200);
        setWidth(200); 
        setImgDim({width:0,height:0});
    }


    // function renderCanvas(){
    //     image64toCan(canvasRef755X450,original64,{...cropPos,width:755,height:450})
    //     image64toCan(canvasRef365X450,original64,{...cropPos,width:365,height:450})
    //     image64toCan(canvasRef365X212,original64,{...cropPos,width:365,height:212})
    //     image64toCan(canvasRef380X380,original64,{...cropPos,width:380,height:380})
    // }
    return(
        <div className="main">

        {
            original64?
            <>
            <form>
                <label htmlFor="width">Width</label>
                <input name="width" value={width} onChange={e=>setWidth(Number(e.target.value))} />
                <label htmlFor="heiht">Height</label>
                <input name="height" value={height} onChange={e=>setHeight(Number(e.target.value))} />
            </form>
            <Cropper img={original64} width={width} height={height} initialPos={cropPos} onChange={setCropPos} imgDimension={imgDim} />
            <canvas ref={canvasRef}></canvas>
            {/* <canvas ref={canvasRef365X450}></canvas>
            <canvas ref={canvasRef365X212}></canvas>
            <canvas ref={canvasRef380X380}></canvas> */}
            {/* {canvasRef755X450.current?renderCanvas():""} */}
            {/* {canvasRef.current?image64toCan(canvasRef,original64,{...cropPos,width,height}):""} */}
            <div>
            <button className="action-btn" onClick={downloadImage}>Download</button>
            <button className="action-btn" onClick={reset}>New Image</button>
            <button className="action-btn" onClick={uploadImage}>Upload Image</button>
            </div>
            
            </>
            :
            <input type="file" accept="image/*" multiple={false} onChange={selectFile}/>

        }
            



        </div>
    );
}