function visitAll(gx0, gy0, gz0, gx1, gy1, gz1, visitor) {
	
	var gx0idx = Math.floor(gx0);
	var gy0idx = Math.floor(gy0);
	var gz0idx = Math.floor(gz0);
	
	var gx1idx = Math.floor(gx1);
	var gy1idx = Math.floor(gy1);
	var gz1idx = Math.floor(gz1);
    
    var sx = gx1idx > gx0idx ? 1 : gx1idx < gx0idx ? -1 : 0;
    var sy = gy1idx > gy0idx ? 1 : gy1idx < gy0idx ? -1 : 0;
    var sz = gz1idx > gz0idx ? 1 : gz1idx < gz0idx ? -1 : 0;
        
	var gx = gx0idx;
	var gy = gy0idx;
	var gz = gz0idx;
	
	//Planes for each axis that we will next cross
    var gxp = gx0idx + (gx1idx > gx0idx ? 1 : 0);
    var gyp = gy0idx + (gy1idx > gy0idx ? 1 : 0);
    var gzp = gz0idx + (gz1idx > gz0idx ? 1 : 0);
	
	//Only used for multiplying up the error margins
	var vx = gx1 === gx0 ? 1 : gx1 - gx0;
	var vy = gy1 === gy0 ? 1 : gy1 - gy0;
	var vz = gz1 === gz0 ? 1 : gz1 - gz0;
	
    //Error is normalized to vx * vy * vz so we only have to multiply up
    var vxvy = vx * vy;
    var vxvz = vx * vz;
    var vyvz = vy * vz;
	
	//Error from the next plane accumulators, scaled up by vx*vy*vz
	var errx = (gxp - gx0) * vyvz;
	var erry = (gyp - gy0) * vxvz;
	var errz = (gzp - gz0) * vxvy;
	
	var derrx = sx * vyvz;
	var derry = sy * vxvz;
	var derrz = sz * vxvy;
    
        console.log("v",vx,vy,vz);
        console.log("step",sx,sy,sz);
    var testEscape = 100;
    do {
        visitor(gx, gy, gz);
		
		if (gx === gx1idx && gy === gy1idx && gz === gz1idx) break;

        //Which plane do we cross first?
		var xr = Math.abs(errx);
		var yr = Math.abs(erry);
		var zr = Math.abs(errz);
        
        console.log("err",errx,erry,errz);
		
		if (sx !== 0 && (sy === 0 || xr < yr) && (sz === 0 || xr < zr)) {
			gx += sx;
			errx += derrx;
		}
		else if (sy !== 0 && (sz === 0 || yr < zr)) {
			gy += sy;
			erry += derry;
		}
		else if (sz !== 0) {
			gz += sz;
			errz += derrz;
		}

//	} while (true);
	} while (testEscape-->0);
}

var renderer = new THREE.WebGLRenderer();
renderer.setSize( 600,400 );
document.body.appendChild( renderer.domElement );

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, renderer.domElement.width / renderer.domElement.height, 0.1, 1000 );

camera.position.set(-5,-10,15);
camera.up.set(0,0,1);
camera.lookAt(new THREE.Vector3(0,0,0));

document.onmousemove = function (e) {
    var a = (e.x - renderer.domElement.width/2)/50;
    var b = (e.y - renderer.domElement.height / 2)/50;
    camera.position.set(
        Math.sin(a) * Math.cos(b),
        Math.cos(a) * Math.cos(b),
        Math.sin(b)).multiplyScalar(5);
    camera.lookAt(new THREE.Vector3(0,0,0));
    renderer.render(scene,camera);
}

var light = new THREE.PointLight( 0xffffff, 1, 200 );
light.position.set( 15, 15, 50 );
scene.add( light );

var cubeGeom = new THREE.CubeGeometry(1,1,1);
var material = new THREE.MeshLambertMaterial({color:0x33cc33, opacity:0.5, transparent:true});

function makeCube(x,y,z) {
    console.log("makeCube",x,y,z);
    var mesh = new THREE.Mesh(cubeGeom, material);
    mesh.position.set(x+0.5,y+0.5,z+0.5);
    mesh.matrixNeedsUpdate = true;
    scene.add(mesh);
}
function testLine(l0,l1) {
    document.getElementById('a').textContent = l0.x.toFixed(3) + ','+l0.y.toFixed(3)+','+l0.z.toFixed(3);
    document.getElementById('b').textContent = l1.x.toFixed(3) + ','+l1.y.toFixed(3)+','+l1.z.toFixed(3);
    var geometry = new THREE.Geometry();
    geometry.vertices.push( l0 );
    geometry.vertices.push( l1 );
    scene.add(new THREE.Line(geometry, new THREE.LineBasicMaterial({color:0xff00ff})));
    visitAll(l0.x,l0.y,l0.z, l1.x,l1.y,l1.z, makeCube);
}
function randomVector() {
    return new THREE.Vector3(Math.random()-0.5,Math.random()-0.5,Math.random()-0.5).multiplyScalar(3);
}

function testRandom() {
    scene = new THREE.Scene();
    scene.add(light);
    testLine(randomVector(), randomVector(), makeCube);
}
testLine(new THREE.Vector3(0.5,1.5,0.5 ),new THREE.Vector3(4.5,0.5,0.5));
//testRandom();
renderer.domElement.onclick=testRandom;
renderer.setClearColorHex(0x333333);
renderer.render(scene,camera);