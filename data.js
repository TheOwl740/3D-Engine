const player = {
  transform: new Transform(0, 0, 0),
  camera3: {
    xr: 0,
    yr: 0,
    fov: 90,
  }
};

const border = new BorderRenderer("blue", 1, 3);

const box = new Polygon([
	new Tri([
		new Transform(-50, -50),
		new Transform(50, -50),
		new Transform(50, 50)
	], 2),
	new Tri([
		new Transform(50, 50),
		new Transform(-50, 50),
		new Transform(-50, -50)
	], 2)
]);

const walls = [
  {
    transform: new Transform(0, 300),
    polygon: new Polygon([
      new Tri([
        new Transform(-50, -50),
        new Transform(50, -50),
        new Transform(50, 50)
      ], 3),
      new Tri([
        new Transform(50, 50),
        new Transform(-50, 50),
        new Transform(-50, -50)
      ], 3)
    ])
  },
  {
    transform: new Transform(150, 150),
    polygon: new Polygon([
      new Tri([
        new Transform(-50, -50),
        new Transform(50, -50),
        new Transform(50, 50)
      ], 3),
      new Tri([
        new Transform(50, 50),
        new Transform(-50, 50),
        new Transform(-50, -50)
      ], 3)
    ])
  },
];

const minimap = {
  transform: new Transform(60, -60, 0),
  body: new Polygon([
		new Tri([
			new Transform(-50, -50),
			new Transform(50, -50),
			new Transform(50, 50)
		], 2),
		new Tri([
			new Transform(50, 50),
			new Transform(-50, 50),
			new Transform(-50, -50)
		], 2)
	]),
	playerToken: {
    body: new Polygon([
      new Tri([
        new Transform(-5, -5),
        new Transform(5, -5),
        new Transform(5, 5)
      ], 3),
      new Tri([
        new Transform(5, 5),
        new Transform(-5, 5),
        new Transform(-5, -5)
      ], 3)
    ]),
    view: new Polygon([
      new Tri([
        new Transform(0, 0),
        e.methods.calcRotationalVector(45, 50),
        e.methods.calcRotationalVector(-45, 50)
      ], 3)
    ])
  },
	draw: () => {
    e.methods.renderPolygon(minimap.transform, minimap.body, new FillRenderer("grey", null, 1, null), new BorderRenderer("black", 1, 5));
    e.methods.renderPolygon(new Transform(minimap.transform.x, minimap.transform.y, player.camera3.xr), minimap.playerToken.view, new FillRenderer("#00FF00", null, 1, null), null);
    e.methods.renderPolygon(minimap.transform, minimap.playerToken.body, new FillRenderer("#00BB00", null, 1, null), null);
    for(i = 0; i < walls.length; i++) {
      e.methods.renderPolygon(token(walls[i]).transform, token(walls[i]).polygon, new FillRenderer("blue", null, 1, null), null);
    }
	}
};

function token(obj) {
  return {
    transform: new Transform((obj.transform.x - player.transform.x + 600) / 10, (obj.transform.y - player.transform.y - 600) / 10),
    polygon: new Polygon([
      new Tri([
        new Transform(obj.polygon.tris[0].points[0].x / 10, obj.polygon.tris[0].points[0].y / 10),
        new Transform(obj.polygon.tris[0].points[1].x / 10, obj.polygon.tris[0].points[1].y / 10),
        new Transform(obj.polygon.tris[0].points[2].x / 10, obj.polygon.tris[0].points[2].y / 10)
      ], 3),
      new Tri([
        new Transform(obj.polygon.tris[1].points[0].x / 10, obj.polygon.tris[1].points[0].y / 10),
        new Transform(obj.polygon.tris[1].points[1].x / 10, obj.polygon.tris[1].points[1].y / 10),
        new Transform(obj.polygon.tris[1].points[2].x / 10, obj.polygon.tris[1].points[2].y / 10)
      ], 3)
    ])
  };
}

function drawFrame() {
  e.methods.clearCanvas(new FillRenderer("white", "white", 1, 0));
  minimap.draw();
}

function detectInput() {
  if(e.data.pressedKeys.includes("ArrowRight")) {
    if(player.camera3.xr > 0) {
      player.camera3.xr--;
    } else {
      player.camera3.xr = 360;
    }
  } else if(e.data.pressedKeys.includes("ArrowLeft")) {
    if(player.camera3.xr < 360) {
      player.camera3.xr++;
    } else {
      player.camera3.xr = 0;
    }
  }
  if(e.data.pressedKeys.includes("w")) {
    player.transform = e.methods.addTransform(player.transform, e.methods.calcRotationalVector(player.camera3.xr, 1));
  }
  if(e.data.pressedKeys.includes("s")) {
    player.transform = e.methods.addTransform(player.transform, e.methods.calcRotationalVector(player.camera3.xr - 180, 1));
  }
  if(e.data.pressedKeys.includes("a")) {
    player.transform = e.methods.addTransform(player.transform, e.methods.calcRotationalVector(player.camera3.xr + 90, 0.5));
  }
  if(e.data.pressedKeys.includes("d")) {
    player.transform = e.methods.addTransform(player.transform, e.methods.calcRotationalVector(player.camera3.xr - 90, 0.5));
  }
}

function updateFOV() {
  if(e.data.pressedKeys.includes("q") && player.camera3.fov > 40) {
    player.camera3.fov--;
    minimap.playerToken.view = new Polygon([
      new Tri([
        new Transform(0, 0),
        e.methods.calcRotationalVector(player.camera3.fov / 2, 50),
        e.methods.calcRotationalVector(player.camera3.fov / -2, 50)
      ], 3)
    ]);
  }
  if(e.data.pressedKeys.includes("e") && player.camera3.fov < 120) {
    player.camera3.fov++;
    minimap.playerToken.view = new Polygon([
      new Tri([
        new Transform(0, 0),
        e.methods.calcRotationalVector(player.camera3.fov / 2, 50),
        e.methods.calcRotationalVector(player.camera3.fov / -2, 50)
      ], 3)
    ]);
  }
}

function calcLegLength(transform) {
  return 200 * (Math.tan(1 / e.methods.calcDistance(player.transform, transform)) * 57.295);
}

function calcLegHorizontal(transform) {
  if(e.methods.calcAngle(player.transform, transform) < 90 && player.camera3.xr > 270) {
    return Math.round(((e.methods.calcAngle(player.transform, transform) - (player.camera3.xr - 360) - (player.camera3.fov / 2)) * -1 * (e.data.w / player.camera3.fov)));
  } else if(e.methods.calcAngle(player.transform, transform) > 270 && player.camera3.xr < 90) {
    return Math.round(((e.methods.calcAngle(player.transform, transform) - (player.camera3.xr + 360) - (player.camera3.fov / 2)) * -1 * (e.data.w / player.camera3.fov)));
  } else {
    return Math.round(((e.methods.calcAngle(player.transform, transform) - (player.camera3.xr) - (player.camera3.fov / 2)) * -1 * (e.data.w / player.camera3.fov)));
  }
}

function renderCube(base) {
  let legs = [
    e.methods.addTransform(base.transform, base.polygon.tris[0].points[0]),
    e.methods.addTransform(base.transform, base.polygon.tris[0].points[1]),
    e.methods.addTransform(base.transform, base.polygon.tris[0].points[2]),
    e.methods.addTransform(base.transform, base.polygon.tris[1].points[1]),
  ];
  
  let polygons = [
  ];
  
  for(leg = 0; leg < 4; leg++) {
    if(leg !== 3) {
      polygons.push(new Polygon([
        new Tri([
          new Transform(calcLegHorizontal(legs[leg]), calcLegLength(legs[leg])),
          new Transform(calcLegHorizontal(legs[leg + 1]), calcLegLength(legs[leg + 1])),
          new Transform(calcLegHorizontal(legs[leg + 1]), -1 * calcLegLength(legs[leg + 1]))
        ], 2),
        new Tri([
          new Transform(calcLegHorizontal(legs[leg + 1]), -1 * calcLegLength(legs[leg + 1])),
          new Transform(calcLegHorizontal(legs[leg]), -1 * calcLegLength(legs[leg])),
          new Transform(calcLegHorizontal(legs[leg]), calcLegLength(legs[leg]))
        ], 2)
      ]));
    } else {
      polygons.push(new Polygon([
        new Tri([
          new Transform(calcLegHorizontal(legs[leg]), calcLegLength(legs[leg])),
          new Transform(calcLegHorizontal(legs[0]), calcLegLength(legs[0])),
          new Transform(calcLegHorizontal(legs[0]), -1 * calcLegLength(legs[0]))
        ], 2),
        new Tri([
          new Transform(calcLegHorizontal(legs[0]), -1 * calcLegLength(legs[0])),
          new Transform(calcLegHorizontal(legs[leg]), -1 * calcLegLength(legs[leg])),
          new Transform(calcLegHorizontal(legs[leg]), calcLegLength(legs[leg]))
        ], 2)
      ]));
    }
    e.methods.renderPolygon(new Transform(0, e.data.h / -2, 0), polygons[leg], null, new BorderRenderer("blue", 1, 2));
  }
}