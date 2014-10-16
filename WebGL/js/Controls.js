Engine.Controls = function()
{
    this.camera;
    this.cameraLastPosition;
    
    this.modes = ["Orbit", "FPS"];
    this.currentMode = 0;
    this.GetMode = function() { return this.modes[this.currentMode]; };
    
    this.IsModeOrbit = function ()
    {
        return this.GetMode() === "Orbit";
    };
    
    this.ChangeMode = function(value)
    {
        this.currentMode = this.modes.indexOf(value);
        this.controlsOrbit.enabled = this.IsModeOrbit();
        this.controlsFPS.enabled = !this.IsModeOrbit();
        this.controlsFPS.lookAtPoint(Engine.scene.position);
//        this.camera.lookAt(Engine.scene);
    };
    
    this.screenWidth;
    this.screenHeight;
    this.screenWidthHalf;
    this.screenHeightHalf;    
    
    this.mousePosition;
    this.mouseLeft;
    this.mouseRight;
    this.controlsOrbit;
    this.controlsFPS;
    
    this.fireRate = 0.1;
    this.fireLastShot = 0;
    
    this.Init = function(camera_)
    {
        this.mouseLeft = false;
        this.mouseRight = false;
        
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
            this.controlsOrbit.enabled = this.IsModeOrbit();
            
            this.controlsFPS = new THREE.FirstPersonControls( this.camera );
            this.controlsFPS.enabled = !this.IsModeOrbit();
            
            // Events
			Engine.renderer.domElement.addEventListener( 'mousemove', this.onMouseMove, false );
            Engine.renderer.domElement.addEventListener( 'mousedown', this.onMouseDown, false );
            Engine.renderer.domElement.addEventListener( 'mouseup', this.onMouseUp, false );
            Engine.renderer.domElement.addEventListener( 'mousewheel', this.onMouseWheel, false );
            Engine.renderer.domElement.addEventListener( 'mousewheel', this.onMouseWheel, false );
        }
    }
    
    this.Update = function()
    {
        this.controlsFPS.update(Engine.Clock.getDelta());
        
        if (Engine.Parameters.autoUpdate && Engine.Parameters.exploreMode) {
            if (this.controlsFPS.moveForward || this.controlsFPS.moveBackward 
                || this.controlsFPS.moveLeft || this.controlsFPS.moveRight
                || this.controlsFPS.moveUp   || this.controlsFPS.moveDown)
            {
                Engine.lodManager.UpdateExplorationPosition();
            }
        }
    };
    
    this.ResetCamera = function()
    {
        this.camera.position.set(40, 40, -40);
//        this.camera.lookAt(Engine.scene);
        this.cameraLastPosition = this.camera.position;
    };    
    
    this.UpdateTarget = function()
    {
        this.controlsOrbit.target = Engine.modelManager.GetModel().mesh.position;
    };

    this.onMouseDown = function(event)
    {
        Engine.controls.mouseLeft = event.button == 0;
        Engine.controls.mouseRight = event.button == 2;
        
        if (Engine.Parameters.paintMode) {
            Engine.controls.Paint();
        }
    };

    this.onMouseUp = function(event)
    {
        Engine.controls.mouseLeft = false;
        Engine.controls.mouseRight = false;
        
        if (Engine.ready && Engine.Parameters.exploreMode && !Engine.Parameters.exploreModeAutoUpdate)
        {
            Engine.lodManager.UpdateExplorationPosition();
        }
    };

    this.onMouseWheel = function(event)
    {
    };
    
    this.onMouseMove = function(event)
    {
        Engine.controls.mousePosition.x = event.clientX;
        Engine.controls.mousePosition.y = event.clientY;
        
        if (Engine.ready && Engine.Parameters.exploreMode && Engine.Parameters.exploreModeAutoUpdate)
        {
            Engine.lodManager.UpdateExplorationPosition();
        }
        
    
        
    };
    
    this.Paint = function()
    {
        // PAINT MODE
//        if (this.fireLastShot + this.fireRate < Engine.Clock.getElapsedTime())
//        {
//            this.fireLastShot = Engine.Clock.elapsedTime;
            if (this.mouseLeft || this.mouseRight)
            {            
                // Intersect Test
                var results = Engine.RayIntersection();
                if (results != undefined) {
                    if(results.length > 0)
                    {
                        var hitPoint = results[0].point;
                        var hitNormal = results[0].face.normal;

                        // Left click
                        if (this.mouseLeft)
                        {    
                            hitPoint.add(hitNormal.multiplyScalar(0.5));

                            // ADD VOXEL
                            Engine.voxelManager.AddVoxelAt(hitPoint);
                        } 
                        // Right click
                        else if (this.mouseRight)
                        {
                            hitPoint.sub(hitNormal.multiplyScalar(0.5));

                            // DELETE VOXEL
                            Engine.voxelManager.SubVoxelAt(hitPoint);
                        }
                    }
                }
            }
//        }
    };
};