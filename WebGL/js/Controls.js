Engine.Controls = function()
{
    this.camera;
    this.cameraLastPosition;
    
    this.screenWidth;
    this.screenHeight;
    this.screenWidthHalf;
    this.screenHeightHalf;    
    
    this.mousePosition;
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
            
            this.mousePosition = { x:0, y:0 };
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
    
    this.UpdateTarget = function()
    {
        this.controlsOrbit.target = Engine.modelManager.GetModel().mesh.position;
    };

    this.onMouseDown = function(event)
    {
        this.mouseDown = true;
        
        // Paint Mode
        if (Engine.Parameters.paintMode && event.button != 1)
        {            
            // Intersect Test
            var results = Engine.RayIntersection();
            if (results != undefined) {
                if(results.length > 0)
                {
                    var hitPoint = results[0].point;
                    var hitNormal = results[0].face.normal;
                    
                    // Left click
                    if (event.button == 0)
                    {    
                        hitPoint.add(hitNormal.multiplyScalar(0.5));
                        
                        Engine.voxelManager.AddVoxelAt(hitPoint);
                        
                        if (Engine.Parameters.autoUpdate) {
                            Engine.Update();
                        }
                    } 
                    // Right click
                    else if (event.button == 2)
                    {
                        hitPoint.sub(hitNormal.multiplyScalar(0.5));
                        
                        Engine.voxelManager.SubVoxelAt(hitPoint);
                        
                        if (Engine.Parameters.autoUpdate) {
                            Engine.Update();
                        }
                    }
                }
            }
        }
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
        Engine.controls.mousePosition.x = event.clientX;
        Engine.controls.mousePosition.y = event.clientY;
        
        Engine.lodManager.onMouseMove(event);
    };
};