import React,{useState} from 'react';
import FilePicker from './FilePicker';
import ImageList from './ImageList';
export default ()=>{
    const [showImg,setshowImg]=useState(false);
    return(
        <div className="main">
            <button className="action-btn" onClick={()=>setshowImg(!showImg)}>Cloud Images</button>
            {
                showImg?
                <ImageList />
                :
                <FilePicker />
            }
            
            
           
        </div>
    );
}