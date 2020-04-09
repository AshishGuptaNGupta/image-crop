

export default ()=>{
    
    function extractExtension(img64){
        return img64.substring('data:image/'.length,img64.indexOf(';base64'))
    }
    
    function base64toFile (base64String, filename) {
        var arr = base64String.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], filename, {type: mime})
      }

    function downloadBase64File (base64Data, file) {
        var element = document.createElement('a')
        element.setAttribute('href', base64Data)
        element.setAttribute('download', file.name)
        element.style.display = 'none'
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
      }
      
    function image64toCan(canvas,img,pixel){
        canvas.current.width=pixel.width;
        canvas.current.height=pixel.height;
        const ctx=canvas.current.getContext('2d');
        const image=new Image();
        image.src=img;
        image.onload=()=>{
            ctx.drawImage(
                image,
                pixel.x,
                pixel.y,
                pixel.width,
                pixel.height,
                0,
                0,
                pixel.width,
                pixel.height
            );
        }

    }

    return {image64toCan,extractExtension,base64toFile,downloadBase64File}

}