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
        this.onMouseDown=this.onMouseDown.bind(this);
        this.onMouseMove=this.onMouseMove.bind(this);
        this.onMouseUp=this.onMouseUp.bind(this);
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
             ReactDom.findDOMNode(this).addEventListener('mousemove', this.onMouseMove);
             ReactDom.findDOMNode(this).addEventListener('mouseup', this.onMouseUp)
           } 
           else if(!this.state.dragging && state.dragging) {
             ReactDom.findDOMNode(this).removeEventListener('mousemove', this.onMouseMove)
             ReactDom.findDOMNode(this).removeEventListener('mouseup', this.onMouseUp)
           }
     }

    onMouseDown(e){
        if(e.button!==0) return
       
        var pos={
            x:this.cropRef.current.getBoundingClientRect().x-this.containerRef.current.getBoundingClientRect().x,
            y:this.cropRef.current.getBoundingClientRect().y-this.containerRef.current.getBoundingClientRect().y
        }
        this.setState({
            dragging: true,
            rel: {
              x: e.pageX - pos.x,
              y: e.pageY - pos.y
            }
          })
          e.stopPropagation()
          e.preventDefault()
    }
    
    onMouseUp(e){
        this.setState({dragging: false})
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
    onMouseMove(e){
        if (!this.state.dragging) return
        this.boundary(e.pageX - this.state.rel.x,e.pageY - this.state.rel.y)
        this.setState({
            // pos: {
            //     x: e.pageX - this.state.rel.x,
            //     y: e.pageY - this.state.rel.y
            // }
            pos: this.boundary(e.pageX - this.state.rel.x,e.pageY - this.state.rel.y)
        })
        e.stopPropagation()
        e.preventDefault()
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
                 className="cropper" ref={this.cropRef} 
                 onMouseDown={this.onMouseDown}>
                     </div>
                </div>
            </div>
        );
    }
}