// Simple Cube Geometry
Engine.BoxGeometry = new THREE.BoxGeometry(1,1,1);
for (var i = 0; i < Engine.BoxGeometry.faces.length; ++i) {
    // Setup material index for each face
    Engine.BoxGeometry.faces[i].materialIndex = 0;
}

// Textures
Engine.Textures = 
{
    brick: THREE.ImageUtils.loadTexture( "textures/BrickOldRounded0134_2_S.jpg" ),
    ivy: THREE.ImageUtils.loadTexture( "textures/Ivy0021_5_S.jpg" ),
    wood: THREE.ImageUtils.loadTexture( "textures/WoodPlanksBare0171_7_S.jpg" ),
    
//    list: [Engine.Textures.brick, Engine.Textures.ivy, Engine.Textures.wood],
//    random: function() { return Engine.Textures.list[Math.floor(Math.random()*Engine.Textures.list.length)]; }
};

// Materials
Engine.Materials = 
{   
    model: new THREE.MeshPhongMaterial({ 
        color: Engine.Parameters.modelColor, 
        wireframe: Engine.Parameters.modelWire,
        ambient: Engine.Parameters.globalColorAmbient, 
        specular: Engine.Parameters.globalColorSpecular, 
        shininess: Engine.Parameters.globalShininess }),
    
    voxel: new THREE.MeshPhongMaterial({ 
        color: Engine.Parameters.voxelColor,
        wireframe:Engine.Parameters.voxelWire,
        ambient: Engine.Parameters.globalColorAmbient, 
        specular: Engine.Parameters.globalColorSpecular, 
        shininess: Engine.Parameters.globalShininess }),
    
    octree: new THREE.MeshPhongMaterial({ 
        color: Engine.Parameters.octreeColor, 
        wireframe: Engine.Parameters.octreeWire,
        ambient: Engine.Parameters.globalColorAmbient, 
        specular: Engine.Parameters.globalColorSpecular, 
        shininess: Engine.Parameters.globalShininess }),
    
    normal: new THREE.MeshNormalMaterial(),
    
    wireframe: new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true }),
    
    voxelMultiMaterials: THREE.MeshFaceMaterial([
        // Normal visualization
        new THREE.MeshNormalMaterial(),
        // User color
        new THREE.MeshPhongMaterial({ 
            color: Engine.Parameters.voxelColor,
            wireframe:Engine.Parameters.voxelWire,
            ambient: Engine.Parameters.globalColorAmbient, 
            specular: Engine.Parameters.globalColorSpecular, 
            shininess: Engine.Parameters.globalShininess })
    ]),
    
    octreeMultiMaterials: THREE.MeshFaceMaterial([
        // Normal visualization
        new THREE.MeshNormalMaterial(),
        // For empty cell
        new THREE.MeshBasicMaterial({
            color: Engine.Parameters.octreeColorEmpty,
            wireframe: Engine.Parameters.octreeWire
        })
    ])
};