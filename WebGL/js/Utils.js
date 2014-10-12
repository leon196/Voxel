// Create Engine Object
var Engine = {};

// Simple Vector3 object
Engine.Vector3 = function(x, y, z)
{
	if (x == undefined || y == undefined || z == undefined) {
		return { x: 0, y: 0, z: 0 };
	}
	return { x: x, y: y, z: z };
}

// Load Mesh
Engine.meshToLoad = 1;
Engine.meshLoaded = 0;
Engine.OBJLoader = new THREE.OBJLoader();
Engine.LoadMesh = function(filepath, model)
{    
	// Callback function for OBJLoader
	var onLoaded = function(object) {
		object.traverse( function (child) {
	    	if ( child instanceof THREE.Mesh )
            {
                // Setup Model with mesh
	    		model.mesh = child;
	    		model.Init();
                
                // Handle loading
                Engine.meshLoaded++;
                if (Engine.meshLoaded == Engine.meshToLoad) {
                    Engine.OnLoadedMesh();
                }
	    	}
	    });
	}
	Engine.OBJLoader.load( filepath, onLoaded );
}

// For elapsed time
Engine.Clock = new THREE.Clock();

// For calculate delta time
Engine.elpasedTimeLastFrame = Date.now();

// For raycast operations
Engine.Raycaster;
Engine.Projector = new THREE.Projector();

// Find the closest power of 2
Engine.ClosestPowerOfTwo = function(number) {
    var n = number;
    n+=(n==0);
    n--;
    n|=n>>1;
    n|=n>>2;
    n|=n>>4;
    n|=n>>8;
    n|=n>>16;
    n++;
    return number;
}

// Add clone to array
Array.prototype.clone = function() { return this.slice(0); };

// Used to calculate length of vector from center of box to corner of box
var sqrt3 = Math.sqrt(3);