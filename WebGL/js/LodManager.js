Engine.LodManager = function()
{
    this.modes = ['Camera', 'Mouse', 'Helper'];
    this.currentMode = 0;
    this.GetMode = function() { return this.modes[this.currentMode]; };
    
    this.generationModes = ['Random', 'Shrink'];
    this.currentGenerationMode = 0;
    this.GetGenerationMode = function() { return this.generationMods[this.currentGenerationMode]; }
    
    this.position = new Engine.Vector3();
    this.positionLast = new Engine.Vector3();
    
    
    this.IsModeMouse = function()
    {
        return this.GetMode() == "Mouse";
    };
    
    this.IsModeCamera = function()
    {
        return this.GetMode() == "Camera";
    };
    
    this.IsModeHelper = function()
    {
        return this.GetMode() == "Helper";
    };
    
    this.ChangeMode = function(value)
    {
        this.currentMode = this.modes.indexOf(value);
        this.UpdateExplorationPosition();
    };
    
    this.ChangeGenerationMode = function(value)
    {
        this.currentGenerationMode = this.generationModes.indexOf(value);
        if (Engine.Parameters.autoUpdate) {
            Engine.octreeManager.Update();
        }
    };
    
    this.UpdateExplorationPosition = function()
    {
        if (this.IsModeMouse()) {
            // Intersect Test
            var results = Engine.RayIntersection();
            if (results != undefined) {
                if(results.length > 0)
                {                                        
                    this.position = results[0].point.clone();//.round();
                    
//                    if (this.position.x !== this.positionLast.x || this.position.y !== this.positionLast.y || this.position.z !== this.positionLast.z) {
//                        this.positionLast.x = this.position.x;
//                        this.positionLast.y = this.position.y;
//                        this.positionLast.z = this.position.z;
                        
                        if (Engine.Parameters.autoUpdate) {
                            Engine.octreeManager.Update();
                        }
//                    }
                }
            }
        } else if (this.IsModeCamera())
        {                   
            this.position = Engine.camera.position.clone();//.round();

//            if (this.position.x !== this.positionLast.x || this.position.y !== this.positionLast.y || this.position.z !== this.positionLast.z) {
//                this.positionLast.x = this.position.x;
//                this.positionLast.y = this.position.y;
//                this.positionLast.z = this.position.z;

                if (Engine.Parameters.autoUpdate) {
                    Engine.octreeManager.Update();
                }
//            }
        }
    };
    
    this.GetPosition = function()
    {
        return this.position;
    };
};


