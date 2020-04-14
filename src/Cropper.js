import React,{Component} from 'react';
import ReactDom from 'react-dom';

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
    }
   

    isEqual(obj1,obj2){
        let keys=Object.keys(obj1);
        for(const key of keys){
            if(obj1[key]!==obj2[key])
            return false;
        }
        return true;
    }
    componentDidUpdate(props,state){
        if(!this.isEqual(this.state.pos,state.pos))
        this.props.onChange(this.state.pos);

         if (this.state.dragging && !state.dragging) {
             ReactDom.findDOMNode(this).addEventListener('mousemove', this.onTouchMove);
             ReactDom.findDOMNode(this).addEventListener('mouseup', this.onTouchEnd)
             ReactDom.findDOMNode(this).addEventListener('touchmove', this.onTouchMove);
             ReactDom.findDOMNode(this).addEventListener('touchend', this.onTouchEnd)
           } 
           else if(!this.state.dragging && state.dragging) {
             ReactDom.findDOMNode(this).removeEventListener('mousemove', this.onTouchMove)
             ReactDom.findDOMNode(this).removeEventListener('mouseup', this.onTouchEnd)
             ReactDom.findDOMNode(this).removeEventListener('touchmove', this.onTouchMove);
             ReactDom.findDOMNode(this).removeEventListener('touchend', this.onTouchEnd)
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
            width:this.props.width+"px",
            height:this.props.height+"px",
            position:"absolute",
        }
        return(
            <div ref={this.containerRef} className="container">
                <img src={this.props.img} alt="img" />
                <div className="shadow">
                <div style={{...this.cropperStyle, left:this.state.pos.x+"px",top:this.state.pos.y+"px",}} 
                 className="cropper" ref={this.cropRef} onTouchStart={this.onTouchStart}
                 onMouseDown={this.onMouseDown}>
                     </div>
                </div>
            </div>
        );
    }
}
