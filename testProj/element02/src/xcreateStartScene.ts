/*  import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import {
  Scene,
  ArcRotateCamera,
  Vector3,
  Vector4,
  HemisphericLight,
  SpotLight,
  MeshBuilder,
  Mesh,
  Light,
  Camera,
  Engine,
  StandardMaterial,
  Texture,
  Color3,
  Space,
  ShadowGenerator,
  PointLight,
  DirectionalLight,
  CubeTexture,
  Sprite,
  SpriteManager,
  InstancedMesh,
} from "@babylonjs/core";

function createTerrain(scene: Scene) {
  const largeGroundMat = new StandardMaterial("largeGroundMat");
  largeGroundMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/valleygrass.png");

  const largeGround = MeshBuilder.CreateGroundFromHeightMap("largeGround", "https://assets.babylonjs.com/environments/villageheightmap.png", {width:150, height:150, subdivisions: 20, minHeight:0, maxHeight: 10});
  largeGround.material = largeGroundMat;
  return largeGround;
}

function createGround(scene: Scene) {
  const groundMat = new StandardMaterial("groundMat");
  groundMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/villagegreen.png");
  groundMat.diffuseTexture.hasAlpha = true;

  const ground = MeshBuilder.CreateGround("ground", {width:24, height:24});
  ground.material = groundMat;
  ground.position.y = 0.01;
  return ground;
}

function createSkybox(scene: Scene) {
  const skybox = MeshBuilder.CreateBox("skyBox", {size:150}, scene);
  const skyboxMaterial = new StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new CubeTexture("textures/skybox", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
  skyboxMaterial.specularColor = new Color3(0, 0, 0);
  skybox.material = skyboxMaterial;
  return skybox;
}

function createTrees(scene: Scene) {
  const spriteManagerTrees = new SpriteManager("treesManager", "assets/textures/palmtree.png", 2000, {width: 512, height: 1024}, scene);

  for (let i = 0; i < 500; i++) {
    const tree = new Sprite("tree", spriteManagerTrees);
    tree.position.x = Math.random() * (-30);
    tree.position.z = Math.random() * 20 + 8;
    tree.position.y = 0.5;
  }

  for (let i = 0; i < 500; i++) {
    const tree = new Sprite("tree", spriteManagerTrees);
    tree.position.x = Math.random() * (25) + 7;
    tree.position.z = Math.random() * -35  + 8;
    tree.position.y = 0.5;
  }
  return spriteManagerTrees;
}

function createBox(scene: Scene, width: number): Mesh {
  const boxMat = new StandardMaterial("boxMat");
  if (width == 2) {
    boxMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/semihouse.png") 
  } else {
    boxMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/cubehouse.png");   
  }

  const faceUV: Vector4[] = [];
  if (width == 2) {
    faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0);
    faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0);
    faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0);
    faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0);
  } else {
    faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0);
    faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0);
    faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0);
    faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0);
  }

  const box = MeshBuilder.CreateBox("box", {faceUV: faceUV, wrap: true});
  box.position.y = 0.5;
  box.material = boxMat;
  return box;
}

function createRoof(scene: Scene, width: number): Mesh {
  const roofMat = new StandardMaterial("roofMat");
  roofMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/roof.jpg");

  const roof = MeshBuilder.CreateCylinder("roof", {diameter: 1.3, height: 1.2, tessellation: 3});
  roof.material = roofMat;
  roof.scaling.x = 0.75;
  roof.scaling.y = width;
  roof.rotation.z = Math.PI / 2;
  roof.position.y = 1.22;
  return roof;
}

function createHouse(scene: Scene, width: number): Mesh {
  const box = createBox(scene, width);
  const roof = createRoof(scene, width);
  const house: InstancedMesh = Mesh.MergeMeshes([box, roof], true, false, undefined, false, true);
  return house;
}

function cloneHouse(scene: Scene): InstancedMesh[] {
  const detached_house = createHouse(scene, 1);
  detached_house.rotation.y = -Math.PI / 16;
  detached_house.position.x = -6.8;
  detached_house.position.z = 2.5;

  const semi_house = createHouse(scene, 2);
  semi_house.rotation.y = -Math.PI / 16;
  semi_house.position.x = -4.5;
  semi_house.position.z = 3;

  const places: number[][] = [];
  places.push([1, -Math.PI / 16, -6.8, 2.5 ]);
  places.push([2, -Math.PI / 16, -4.5, 3 ]);
  // ... (more places)

  const houses: InstancedMesh[] = [];
  for (let i = 0; i < places.length; i++) {
    if (places[i][0] === 1) {
      houses[i] = detached_house.createInstance("house" + i);
    } else {
      houses[i] = semi_house.createInstance("house" + i);
    }
    houses[i].rotation.y = places[i][1];
    houses[i].position.x = places[i][2];
    houses[i].position.z = places[i][3];
  }

  return houses;
}

function createAnyLight(scene: Scene, index: number, px: number, py: number, pz: number, colX: number, colY: number, colZ: number, mesh: Mesh): Light | null {
  switch (index) {
    case 1:
      const hemiLight = new HemisphericLight("hemiLight", new Vector3(px, py, pz), scene);
      hemiLight.intensity = 0.1;
      return hemiLight;
    case 2:
      const spotLight = new SpotLight("spotLight", new Vector3(px, py, pz), new Vector3(0, -1, 0), Math.PI / 3, 10, scene);
      spotLight.diffuse = new Color3(colX, colY, colZ);
      let shadowGenerator = new ShadowGenerator(1024, spotLight);
      shadowGenerator.addShadowCaster(mesh);
      shadowGenerator.useExponentialShadowMap = true;
      return spotLight;
    case 3:
      const pointLight = new PointLight("pointLight", new Vector3(px, py, pz), scene);
      pointLight.diffuse = new Color3(colX, colY, colZ);
      shadowGenerator = new ShadowGenerator(1024, pointLight);
      shadowGenerator.addShadowCaster(mesh);
      shadowGenerator.useExponentialShadowMap = true;
      return pointLight;
  }
  return null;
}

function createHemiLight(scene: Scene): HemisphericLight {
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  light.intensity = 0.8;
  return light;
}

function createArcRotateCamera(scene: Scene): ArcRotateCamera {
  let camAlpha = -Math.PI / 2,
    camBeta = Math.PI / 2.5,
    camDist = 10,
    camTarget = new Vector3(0, 0, 0);
  let camera = new ArcRotateCamera(
    "camera1",
    camAlpha,
    camBeta,
    camDist,
    camTarget,
    scene,
  );
  camera.attachControl(true);
  return camera;
}

export default function createStartScene(engine: Engine) {
  interface SceneData {
    scene: Scene;
    terrain?: Mesh;
    ground?: Mesh;
    skybox?: Mesh;
    trees?: SpriteManager;
    house?: InstancedMesh[];
    light?: Light;
    hemisphericLight?: HemisphericLight;
    camera?: Camera;
  }

  let that: SceneData = { scene: new Scene(engine) };
  that.scene.debugLayer.show();

  that.terrain = createTerrain(that.scene);
  that.ground = createGround(that.scene);
  that.skybox = createSkybox(that.scene);
  that.trees = createTrees(that.scene);
  that.house = cloneHouse(that.scene);

  that.hemisphericLight = createHemiLight(that.scene);
  that.camera = createArcRotateCamera(that.scene);
  return that;
}
*/