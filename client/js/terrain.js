// ============================================================
//  TERRAIN  –  génération procédurale par heightmap
// ============================================================

function createTerrain(scene) {

  const SIZE       = 200;   // largeur/profondeur du terrain
  const SEGMENTS   = 80;    // résolution de la grille
  const MAX_HEIGHT = 8;     // amplitude max des collines

  // --- géométrie plane que l'on va déformer ---
  const geometry = new THREE.PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS);
  geometry.rotateX(-Math.PI / 2); // horizontal

  // --- déformation des vertices (bruit simple additionné) ---
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const z = positions.getZ(i);

    // Superposition de plusieurs fréquences pour un relief naturel
    let y  = Math.sin(x * 0.05) * Math.cos(z * 0.05) * MAX_HEIGHT;
        y += Math.sin(x * 0.12 + 1.3) * Math.cos(z * 0.09 + 0.7) * (MAX_HEIGHT * 0.4);
        y += Math.sin(x * 0.25 + 2.1) * Math.cos(z * 0.22 + 1.5) * (MAX_HEIGHT * 0.15);

    // Zone de spawn aplatie (rayon 15 autour de l'origine)
    const dist = Math.sqrt(x * x + z * z);
    if (dist < 15) y *= (dist / 15);

    positions.setY(i, y);
  }

  geometry.computeVertexNormals();

  // --- matériau : couleur rocheuse / désertique alien ---
  const material = new THREE.MeshLambertMaterial({
    color: 0x8B6914,
    wireframe: false
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  scene.add(mesh);

  // --- fonction utilitaire : hauteur du sol en (x, z) ---
  // On fait un raycast vers le bas depuis une altitude élevée.
  const raycaster = new THREE.Raycaster();

  function getHeightAt(x, z) {
    raycaster.set(
      new THREE.Vector3(x, 100, z),
      new THREE.Vector3(0, -1, 0)
    );
    const hits = raycaster.intersectObject(mesh);
    return hits.length > 0 ? hits[0].point.y : 0;
  }

  // --- quelques rochers décoratifs ---
  addRocks(scene, mesh, getHeightAt);

  return { mesh, getHeightAt };
}

// -------------------------------------------------------
function addRocks(scene, terrain, getHeightAt) {
  const rockMat = new THREE.MeshLambertMaterial({ color: 0x555555 });

  for (let i = 0; i < 40; i++) {
    const x = (Math.random() - 0.5) * 160;
    const z = (Math.random() - 0.5) * 160;

    // On évite la zone de spawn
    if (Math.sqrt(x * x + z * z) < 18) continue;

    const scale = 0.5 + Math.random() * 2;
    const geo   = new THREE.DodecahedronGeometry(scale, 0);
    const rock  = new THREE.Mesh(geo, rockMat);

    const y = getHeightAt(x, z);
    rock.position.set(x, y + scale * 0.5, z);
    rock.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    rock.castShadow    = true;
    rock.receiveShadow = true;
    scene.add(rock);
  }
}
