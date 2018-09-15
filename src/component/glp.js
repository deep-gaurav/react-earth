import React, { Component } from 'react';
import * as THREE from 'three';
import {OBJLoader} from 'three-obj-loader-es6'
import model from './models/sphere-mercrator.obj'
import texture from './models/Surface_Reflection.jpg'
import './glp.css'
import capabilitiesxml from './WMTSCapabilities.xml'

class ThreeScene extends Component{

    renderheight=0;
    renderwidth=0;
    constructor(props){
        super(props);
        this.model=false;
        this.renderwidth=props.rwidth;
        this.renderheight=props.rheight;
        this.nasob=new Nasatex()

    }
    componentDidMount(){
        const width = this.mount.clientWidth
        const height = this.mount.clientHeight

        //ADD SCENE
        this.scene = new THREE.Scene()

        //ADD CAMERA
        this.camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
        )
        this.camera.position.z = 4

        //ADD RENDERER
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setClearColor('#000000')
        this.renderer.setSize(width, height)
        this.mount.appendChild(this.renderer.domElement)

        //ADD CUBE
        //const geometry = new THREE.SphereGeometry(1,20,20)
        const material = new THREE.MeshBasicMaterial({ color: '#433F81'     })
        //this.cube = new THREE.Mesh(geometry, material)
        //this.scene.add(this.cube)

        ///ADD OBJ
        this.obj= new OBJLoader()
        this.obj.load(
            model,
            (obj)=>{
                const textu=new THREE.TextureLoader().load(texture)
                const material = new THREE.MeshBasicMaterial({ map:textu    })
                this.model=obj
                obj.traverse(chiild=>{
                    if (chiild.isMesh){
                        chiild.material=material
                        console.log('child is mesh')
                    }

                })
                this.cube=obj;
                obj.material=material;
                this.scene.add(obj)
                console.log(obj)
            },

            // called when loading is in progresses
            xhr=>{
                console.log(xhr)
             },
            // called when loading has errors
            error=>{console.log(error)}
        )


        this.start()
    }

    componentWillUnmount(){
        this.stop()
        this.mount.removeChild(this.renderer.domElement)
    }

    start = () => {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }

    stop = () => {
        cancelAnimationFrame(this.frameId)
    }

    animate = () => {
        if (this.model){
            //this.model.rotation.x += 0.01
            this.model.rotation.y += 0.01
        }
        //this.cube.rotation.x += 0.01
        //this.cube.rotation.y += 0.01

        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate)
    }

    renderScene = () => {
        this.renderer.render(this.scene, this.camera)
    }

    render(){
        var sens=this.nasob.getnames()
        return(

            <div
                className='renderport'
                ref={(mount) => { this.mount = mount }}
            >
                <select className='insselector' onClick={event => {this.updatetex(event)}} >
                    {sens.map((value,key )=>(<option value={key}>{value}</option>))}
                </select>
                <div className='mountpoint'  ></div>

            </div>
        )
    }
    updatetex(ev){

        this.currentsel=ev.currentTarget.selectedIndex
        this.imagesrc=this.nasob.gettexture(this.currentsel)
        this.setmaterial(this.imagesrc)

    }
    setmaterial(src){
        const textu=new THREE.TextureLoader().load(src)
        const material = new THREE.MeshBasicMaterial({ map:textu })
        var obj=this.model
        console.log("new image:",src)
        obj.traverse(chiild=>{
            if (chiild.isMesh){
                chiild.material=material
                console.log('child is mesh')
            }
        })
        obj.material=material;
    }

}

class Nasatex  {
    constructor(){
        console.log('LOG TEST');
        console.log(capabilitiesxml)
        this.xhr=new XMLHttpRequest()
        this.xhr.open("GET",capabilitiesxml,false)
        this.xhr.onload=ev =>  {
            if(this.xhr.readyState===4 && this.xhr.status===200){
                this.capabilities=this.xhr.responseXML;
            }
        }
        this.xhr.send()
    }
    getLayers(){
        if(typeof this.capabilities=='undefined')
            return
        var num= this.capabilities.getElementsByTagName('Layer').length
        return num
    }
    getnames(){
        var namearr=[]
        var layers=this.capabilities.getElementsByTagName('Layer')
        for(var i=0;i<layers.length;i++)
            namearr.push(layers[i].getElementsByTagName('ows:Title')[0].textContent)
        return namearr
    }
    gettexture(id){
        var layer=this.capabilities.getElementsByTagName('Layer')[id]
        var tms=layer.getElementsByTagName('TileMatrixSet')[0].textContent
        var rurl=layer.getElementsByTagName('ResourceURL')[0].getAttribute('template')
        rurl=rurl.replace('{TileMatrixSet}',tms)
        rurl=rurl.replace('{TileMatrix}','0')
        rurl=rurl.replace('{TileRow}','0')
        rurl=rurl.replace('{TileCol}','0')
        rurl=rurl.replace('{Time}','')
        return rurl

    }
}

export default ThreeScene