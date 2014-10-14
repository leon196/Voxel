Engine.Controls = function()
{
    this.camera;
    this.cameraLastPosition;
    
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
        Engine.controls.mouseLeft = event.button == 0;
        Engine.controls.mouseRight = event.button == 2;
    };

    this.onMouseUp = function(event)
    {
        Engine.controls.mouseLeft = false;
        Engine.controls.mouseRight = false;
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
    
    this.onUpdate = function()
    {
        if (this.fireLastShot + this.fireRate < Engine.Clock.getElapsedTime())
        {
            this.fireLastShot = Engine.Clock.elapsedTime;
            // Paint Mode
            if (Engine.Parameters.paintMode && (this.mouseLeft || this.mouseRight))
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

                            Engine.voxelManager.AddVoxelAt(hitPoint);

                            if (Engine.Parameters.autoUpdate) {
                                Engine.Update();
                            }
                        } 
                        // Right click
                        else if (this.mouseRight)
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
        }
    };
};