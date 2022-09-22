const updateInt = setInterval(update, 10);

function update() {
  detectInput();
  drawFrame();
  updateFOV();
  for(wall = 0; wall < walls.length; wall++) {
    renderCube(walls[wall]);
  }
}