import * as OBC from 'openbim-components';

async function createPreview(container, fileUrl) {
  const components = new OBC.Components();
  components.scene = new OBC.SimpleScene(components);
  components.renderer = new OBC.SimpleRenderer(components, container);
  components.camera = new OBC.SimpleCamera(components);
  components.raycaster = new OBC.SimpleRaycaster(components);

  components.init();

  const grid = new OBC.SimpleGrid(components);
  components.scene.setup();
  const scene = components.scene.get();

  let fragmentIfcLoader = new OBC.FragmentIfcLoader(components);
  await fragmentIfcLoader.setup();
  fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = false;
  fragmentIfcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;

  async function loadIfcAsFragments() {
    const file = await fetch(fileUrl);
    const data = await file.arrayBuffer();
    const buffer = new Uint8Array(data);
    const model = await fragmentIfcLoader.load(buffer, "example");
    scene.add(model);
  }

  await loadIfcAsFragments();
}

document.querySelectorAll('.preview').forEach(async (preview, index) => {
  const fileUrl = `./model/${preview.getAttribute('data-ifc')}`;
  const container = document.createElement('div');
  container.style.width = '100%';
  container.style.height = '100%';
  preview.insertBefore(container, preview.firstChild);

  await createPreview(container, fileUrl);

  preview.addEventListener('click', () => {
    window.location.href = `viewer.html?file=${preview.getAttribute('data-ifc')}`;
  });
});
