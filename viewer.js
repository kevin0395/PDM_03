import * as OBC from 'openbim-components';

async function loadIfc(fileUrl) {
  const container = document.getElementById('container');
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');

  const components = new OBC.Components();
  components.scene = new OBC.SimpleScene(components);
  components.renderer = new OBC.SimpleRenderer(components, container);
  components.camera = new OBC.SimpleCamera(components);
  components.raycaster = new OBC.SimpleRaycaster(components);

  try {
    components.init();

    const grid = new OBC.SimpleGrid(components);
    components.scene.setup();
    const scene = components.scene.get();

    let fragmentIfcLoader = new OBC.FragmentIfcLoader(components);
    await fragmentIfcLoader.setup();
    fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = false;
    fragmentIfcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;

    const file = await fetch(fileUrl);
    const data = await file.arrayBuffer();
    const buffer = new Uint8Array(data);
    const model = await fragmentIfcLoader.load(buffer, "example");
    scene.add(model);
    loading.style.display = 'none'; // Cacher l'indicateur de chargement après chargement
  } catch (error) {
    console.error("Erreur lors du chargement de l'IFC :", error);
    loading.style.display = 'none';
    error.style.display = 'block';
  }
}

const urlParams = new URLSearchParams(window.location.search);
const file = urlParams.get('file');

if (file) {
  loadIfc(`./model/${file}`);
} else {
  console.error("Aucun fichier IFC spécifié dans l'URL");
  document.getElementById('loading').style.display = 'none';
  document.getElementById('error').style.display = 'block';
}
