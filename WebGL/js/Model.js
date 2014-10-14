// Model Element
Engine.Model = function(filePath)
{
	this.mesh;
    this.scale;
	this.size;
	this.sizeHalf;
    this.bounds;

	this.Init = function()
	{
		// Compute geometry
		this.mesh.geometry.computeBoundingBox();
		this.bounds = this.mesh.geometry.boundingBox;
        
		// Scale
		this.scale = Engine.Parameters.modelScale;
		this.mesh.scale.set(this.scale, this.scale, this.scale);
        
		// Size
		this.size = new Engine.Vector3(
			Math.ceil((this.bounds.max.x - this.bounds.min.x) * this.scale), 
			Math.ceil((this.bounds.max.y - this.bounds.min.y) * this.scale), 
			Math.ceil((this.bounds.max.z - this.bounds.min.z) * this.scale));

		// Size Half
		this.sizeHalf = new Engine.Vector3(
			Math.floor(this.size.x / 2), 
			Math.floor(this.size.y / 2), 
			Math.floor(this.size.z / 2));
        
        // Material
        this.mesh.material = Engine.Materials.model;
        
        //
//        this.mesh.position.set(this.size.x, this.size.y, this.size.z);

		// Add to scene
		Engine.scene.add(this.mesh);
	};
    
    this.UpdateScale = function(value)
    {
        this.scale = value;
        this.mesh.scale.set(value, value, value);
		this.size.x = Math.ceil((this.bounds.max.x - this.bounds.min.x) * this.scale); 
        this.size.y = Math.ceil((this.bounds.max.y - this.bounds.min.y) * this.scale); 
        this.size.z = Math.ceil((this.bounds.max.z - this.bounds.min.z) * this.scale);
		this.sizeHalf.x = Math.floor(this.size.x / 2);
        this.sizeHalf.y = Math.floor(this.size.y / 2);
        this.sizeHalf.z = Math.floor(this.size.z / 2);
    };
    
    this.UpdateDisplay = function()
    {
        this.mesh.material.visible = Engine.Parameters.modelVisible;
        this.mesh.material.color = new THREE.Color(Engine.Parameters.modelColor);
        this.mesh.material.wireframe = Engine.Parameters.modelWire;
    };
};

// Model Manager
Engine.ModelManager = function()
{
    // Models
    this.models;
    this.modelSelected;
    this.modelsPaths;
    this.modelsNames;
    
    this.GetModel = function() { return this.models[this.modelSelected]; };
    
    // Mesh Loading
    this.meshToLoad;
    this.meshLoaded;
    this.OBJLoader = new THREE.OBJLoader();
    this.LoadMesh = function(filepath, model, modelManager)
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
                    modelManager.meshLoaded++;
                    if (modelManager.meshLoaded == modelManager.meshToLoad) {
                        Engine.OnLoadedMesh();
                    }
                }
            });
        }
        modelManager.OBJLoader.load( filepath, onLoaded );
    }
    
    this.Init = function()
    {
        // List of Model elements
        this.models = [];
        this.modelSelected = 0;
        
        // Names
        this.modelsNames = [
            "Cube", 
            "Sphere", 
            "Monkey"];
        
        // Paths
        this.modelsPaths = [
            "models/cubeOriented.mesh",
            "models/sphere.mesh",
            "models/mesh.mesh"];
    
        // Update mesh count
        this.meshLoaded = 0;
        this.meshToLoad = this.modelsPaths.length;
        
        // Create, Load and Store models
        for (var m = 0; m < this.meshToLoad; ++m)
        {
            var model = new Engine.Model(this.modelsPaths[m]);
            this.LoadMesh(this.modelsPaths[m], model, this);
            this.models.push(model);
        }
        
    };
    
    this.Update = function()
    {   
        this.UpdateModel(this.modelsNames[this.modelSelected]);
    };

    this.UpdateModel = function(value)
    {
        this.modelSelected = this.modelsNames.indexOf(value);
        for (var m = 0; m < this.models.length; ++m)
        {
            this.models[m].mesh.visible = (this.modelSelected == m);
        }
        this.UpdateScale(Engine.Parameters.modelScale);
        this.UpdateDisplay();
    };
    
    this.UpdateDisplay = function()
    {
        this.GetModel().UpdateDisplay();
    };
    
    this.UpdateScale = function(value)
    {
        this.GetModel().UpdateScale(value);
    };
    
    
};