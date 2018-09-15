import React, { Component } from 'react';
import * as THREE from 'three';
import {OBJLoader} from 'three-obj-loader-es6'
import model from './models/sphere-mercrator.obj'
import texture from './models/Surface_Reflection.jpg'
import './glp.css'

class ThreeScene extends Component{

    renderheight=0;
    renderwidth=0;
    constructor(props){
        super(props);
        this.model=false;
        this.renderwidth=props.rwidth;
        this.renderheight=props.rheight;
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
        return(
            <div
                className='renderport'
                ref={(mount) => { this.mount = mount }}
            />
        )
    }
}

export default ThreeScene