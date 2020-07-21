let scene, camera, renderer, box, cylinder;

const mainSCeneImgs = [
    'main_scene/1_right.jpg',
    'main_scene/1_left.jpg',
    'main_scene/1_up.jpg',
    'main_scene/1_down.jpg',
    'main_scene/1_back.jpg',
    'main_scene/1_front.jpg',
]

const zoomedSceneImgs = [
    'zoomed_scene/2_right.jpg',
    'zoomed_scene/2_left.jpg',
    'zoomed_scene/2_up.jpg',
    'zoomed_scene/2_down.jpg',
    'zoomed_scene/2_back.jpg',
    'zoomed_scene/2_front.jpg',
]

function pushArr(img, type, pos, matArr) {
    let texture = new THREE.TextureLoader().load('images/'+img);
    texture[type] = THREE.RepeatWrapping;
    texture.repeat[pos] = - 1;
    let mtl = new THREE.MeshBasicMaterial({map:texture,opacity: 1,transparent: true});
    mtl.side = THREE.BackSide;
    matArr.push(mtl);
}

function mainScene(arr) {
    let materialArray = [];
    arr.forEach(image => {
        if(
            image === 'main_scene/1_up.jpg' || 
            image === 'main_scene/1_down.jpg' ||
            image === 'zoomed_scene/2_up.jpg' ||
            image === 'zoomed_scene/2_down.jpg'
        ) {
            pushArr(image, 'wrapT', 'y', materialArray)
        } else {
            pushArr(image, 'wrapS', 'x', materialArray)
        }
    } )
    
    let boxGeo = new THREE.BoxGeometry(1500,1500,1500);
    box = new THREE.Mesh(boxGeo, materialArray);
    scene.add(box);
    
    let cylinderGeo = new THREE.CylinderGeometry( 3, 3, 1, 30 );
    let material = new THREE.MeshBasicMaterial( {color: 0xffaa00} );
    cylinder = new THREE.Mesh( cylinderGeo, material );
    box.add( cylinder );
    animate();
}

function init () {
    let active = false;
    let WIDTH = window.innerWidth;
    let HEIGHT = window.innerHeight;
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0xDDDDDD, 1);
    document.body.appendChild(renderer.domElement);
    scene = new THREE.Scene;

    camera = new THREE.PerspectiveCamera(70, WIDTH/HEIGHT);
    camera.position.z = 80;
    scene.add(camera);
    
    let controls = new THREE.OrbitControls(camera);
    controls.minDistance = 1;
    controls.maxDistance = 1000;
    
    mainScene(mainSCeneImgs);
    const domEvents = new THREEx.DomEvents(camera, renderer.domElement);
    domEvents.addEventListener(cylinder, 'click', e => {
       box.material.forEach(mtl=>{
       mtl.opacity = 0.4
       })
       box.material.map.needsUpdate = true;
       scene.remove(scene.children[0]);
       !active ? active = true : active = false; 
       active ? mainScene(zoomedSceneImgs) : mainScene(mainSCeneImgs);
    });

}

function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
    
} 

init();


