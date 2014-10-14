Engine.LodManager = function()
{
    this.modes = ["Mouse", "Camera", "Helper"];
    this.currentMode = 0;
    
    this.position = new Engine.Vector3();
    this.positionLast = new Engine.Vector3();
    
    this.GetMode = function() { return this.modes[this.currentMode]; };
    
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
        this.currentMode = this.modes.indexOf[value];
    };
    
    this.onMouseMove = function(event)
    {
        // Local Level of Details
        if (Engine.Parameters.exploreMode)
        {
            // Intersect Test
            var results = Engine.RayIntersection();
            if (results != undefined) {
                if(results.length > 0)
                {
                    var hitPoint = results[0].point;
                                        
                    this.position = hitPoint.round();
                    if (this.position.x != this.positionLast.x
                        || this.position.y != this.positionLast.y
                        || this.position.z != this.positionLast.z) {
                    
                        this.positionLast.x = this.position.x;
                        this.positionLast.y = this.position.y;
                        this.positionLast.z = this.position.z;
                        
                        if (Engine.Parameters.autoUpdate) {
                            Engine.Update();
                        }
                    }
                }
            }
        }
    };
    
    this.GetPosition = function()
    {
        return this.position;
    };
};


