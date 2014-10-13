Engine.Controls = function()
{
    this.camera;
    this.cameraLastPosition;
    
    this.screenWidth;
    this.screenHeight;
    this.screenWidthHalf;
    this.screenHeightHalf;    
    
    this.mouseDown;
    this.controlsOrbit;
    this.controlsFPS;
    
    this.Init = function(camera_)
    {
        if (camera_ == undefined)
        { 
            alert("There is no camera attached to controls"); 
        }
        else
        {
            this.camera = camera_;
            this.ResetCamera();
            
            this.screenWidth = window.innerWidth;
            this.screenWidthHalf = this.screenWidth / 2;
            this.screenHeight = window.innerHeight;
            this.screenHeightHalf = this.screenHeight / 2;
            
            this.mouseDown = false;

            this.controlsOrbit = new THREE.OrbitControls( this.camera );
            this.controlsOrbit.damping = 0.2;
            this.controlsOrbit.enabled = !Engine.Parameters.modeFPS;
            
            this.controlsFPS = new THREE.FirstPersonControls( this.camera );
            this.controlsFPS.enabled = Engine.Parameters.modeFPS;
            
            // Events
			Engine.renderer.domElement.addEventListener( 'mousemove', this.onMouseMove, false );
            Engine.renderer.domElement.addEventListener( 'mousedown', this.onMouseDown, false );
            Engine.renderer.domElement.addEventListener( 'mouseup', this.onMouseUp, false );
            Engine.renderer.domElement.addEventListener( 'mousewheel', this.onMouseWheel, false );
        }
    }
    
    this.ResetCamera = function()
    {
        this.camera.position.set(20, 20, 20);
        this.camera.lookAt(Engine.scene);
        this.cameraLastPosition = this.camera.position;
    };    

    this.onMouseDown = function(event)
    {
        this.mouseDown = true;
    };

    this.onMouseUp = function(event)
    {
        this.mouseDown = false;
    };

    this.onMouseWheel = function(event)
    {
    };
    
    this.onMouseMove = function(event)
    {
        // var cameraDirection = new THREE.Vector3(0, 0, -1);
     //    cameraDirection.applyEuler(camera.rotation, camera.rotation.order);
        var vector = new THREE.Vector3(
            ( event.clientX / window.innerWidth ) * 2 - 1,
            - ( event.clientY / window.innerHeight ) * 2 + 1,
            0.5 );
        Engine.Projector.unprojectVector( vector, Engine.camera );
        var dir = vector.sub( Engine.camera.position ).normalize();
        rayCaster = new THREE.Raycaster(Engine.camera.position, dir);
        var results = rayCaster.intersectObject(Engine.voxelManager.meshVoxel);
        if (results != undefined) {
            if(results.length > 0) {
//                console.log(results);
                var hitPoint = results[0].point;
                var hitNormal = results[0].face.normal;
                var testPoint = hitPoint.sub(hitNormal.multiplyScalar(0.5));
//                var testPoint = hitPoint.add(dir.multiplyScalar(0.01));
                Engine.helper.HitTest(hitPoint.ceil().sub({x:0.5, y:0.5, z:0.5}));
//                Engine.voxelManager.ClickVoxelAt(hitPoint);
            }
        }
    };
};