import React,{Component} from 'react';

export default class Cropper extends Component{

    constructor(props){
        super(props);
        this.cropRef=React.createRef();
        this.containerRef=React.createRef();
        this.state={
            pos:props.initialPos,
            dragging:false,
            rel:true
        }
       
        this.onTouchEnd=this.onTouchEnd.bind(this);
        this.onTouchMove=this.onTouchMove.bind(this);
        this.onTouchStart=this.onTouchStart.bind(this);
        this.dimDiff={width:1,height:1}
    }
   

    isEqual(obj1,obj2){
        let keys=Object.keys(obj1);
        for(const key of keys){
            if(obj1[key]!==obj2[key])
            return false;
        }
        return true;
    }

    
    componentDidMount(){

        this.dimDiff= {
            width:this.props.imgDimension.width/this.containerRef.current.getBoundingClientRect().width,
            height:this.props.imgDimension.height/this.containerRef.current.getBoundingClientRect().height,
        }
        
    }
    componentDidUpdate(props,state){
        if(!this.isEqual(this.state.pos,state.pos))
        this.props.onChange({
            x:this.state.pos.x*this.dimDiff.width,
            y:this.state.pos.y*this.dimDiff.height,
        });

         if (this.state.dragging && !state.dragging) {
             this.containerRef.current.addEventListener('mousemove', this.onTouchMove);
             this.containerRef.current.addEventListener('mouseup', this.onTouchEnd);
             this.containerRef.current.addEventListener('touchmove', this.onTouchMove);
             this.containerRef.current.addEventListener('touchend', this.onTouchEnd);
           
           } 
           else if(!this.state.dragging && state.dragging) {
            //  ReactDom.findDOMNode(this).removeEventListener('mousemove', this.onTouchMove)
            //  ReactDom.findDOMNode(this).removeEventListener('mouseup', this.onTouchEnd)
             this.containerRef.current.removeEventListener('mousemove', this.onTouchMove);
             this.containerRef.current.removeEventListener('mouseup', this.onTouchEnd);
             this.containerRef.current.removeEventListener('touchmove', this.onTouchMove);
             this.containerRef.current.removeEventListener('touchend', this.onTouchEnd);
           }
     }
    
    onTouchStart(e){
        var eventObj=e;
        if(e.type==="touchstart")
            eventObj=e.changedTouches[0];

        var pos={
            x:this.cropRef.current.getBoundingClientRect().x-this.containerRef.current.getBoundingClientRect().x,
            y:this.cropRef.current.getBoundingClientRect().y-this.containerRef.current.getBoundingClientRect().y
        }
        this.setState({
            dragging: true,
            rel: {
              x: eventObj.pageX - pos.x,
              y: eventObj.pageY - pos.y
            }
          })
          e.stopPropagation()
          e.preventDefault()
        
    }
    onTouchEnd(e){
        this.setState({dragging: false})
        e.stopPropagation()
        e.preventDefault()
    }
    onTouchMove(e){
        var eventObj=e;
        if(e.type==="touchmove")
            eventObj=e.changedTouches[0];

        if (!this.state.dragging) return
        this.boundary(eventObj.pageX - this.state.rel.x,eventObj.pageY - this.state.rel.y)
        this.setState({
            pos: this.boundary(eventObj.pageX - this.state.rel.x,eventObj.pageY - this.state.rel.y)
        })
        e.stopPropagation()
        e.preventDefault()
    }
   
    boundary(x,y){
        const boundaryD=this.containerRef.current.getBoundingClientRect();
        const cropperD=this.cropRef.current.getBoundingClientRect();
       
        let val={};

        if(x<0)
        val.x=0
        else if(x+cropperD.width>boundaryD.width)
        val.x=boundaryD.width-cropperD.width
        else
        val.x=x
        
        if(y<0)
        val.y=0
        else if(y+cropperD.height>boundaryD.height)
        val.y=boundaryD.height-cropperD.height
        else
        val.y=y
       

        return val;
        
        
    }


    render(){
        this.cropperStyle={
            width:this.props.width/this.dimDiff.width+"px",
            height:this.props.height/this.dimDiff.height+"px",
            position:"absolute",
            backgroundColor: "unset",
            border:"2px solid green",
            zIndex: "999999",
        }
        return(
            <div ref={this.containerRef} className="container">
                <img src={this.props.img}  ref={this.containerRef}  alt="img" style={{maxWidth:"100%"}}/>
                <div className="shadow">
                <div style={{...this.cropperStyle, left:this.state.pos.x+"px",top:this.state.pos.y+"px",}} 
                 className="cropper" ref={this.cropRef} onTouchStart={this.onTouchStart}
                 onMouseDown={this.onTouchStart}>
                     </div>
                </div>
            </div>
        );
    }
}


