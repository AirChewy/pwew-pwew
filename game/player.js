var Player = function(name, color, position, direction) {

    this.name = name;
    this.position = position;
    this.life = 3;
    this.bullets = new Array();
    this.direction = direction;
    this.speed = 0;
    this.enemyUp = true;
    this.enemyRight = false;
    this.lastTouch = new Date();
    this.begin = Date.now();
    this.kill = 0;

    this.material = new THREE.MeshLambertMaterial({
        color: color,
        });

    bumperMesh = new THREE.Mesh(new THREE.CylinderGeometry(0, 10, 10, 12, 12, false), this.materialBumper);
    bumperMesh.rotation.x = Math.PI / 2 ;

    sphere = new THREE.SphereGeometry(6, 8, 8);
    THREE.GeometryUtils.merge(sphere, bumperMesh);

    canon = new THREE.CubeGeometry(3, 3, 15);
    THREE.GeometryUtils.merge(canon, sphere);

    this.graphic = new THREE.Mesh(sphere, this.material);
    this.graphic.position.x = position.x;
    this.graphic.position.y = position.y;
    this.graphic.position.z = 6;
    this.graphic.rotateOnAxis(new THREE.Vector3(0,0,1), this.direction);
};

Player.prototype.accelerate = function (distance) {
    var max = 2;

    this.speed += distance / 4;
    if (this.speed >= max) {
        this.speed = max;
    }
};

Player.prototype.dead = function () {
    this.graphic.position.z = this.graphic.position.z-0.1;
        //Nettoyage de la div container
        $("#container").html("");
        jQuery('#'+this.name+' >.life').text("Tu es mort !");
        init();
};

Player.prototype.moveEnemy = function() {
    var x = this.graphic.position.x + WIDTH / 2;
    var y = this.graphic.position.y + HEIGHT / 2;

    if (this.enemyRight) {
        if (x > WIDTH) {
            this.position.x -= 1;
            this.enemyRight = false;
        }
        else
            this.position.x += 1;
    }
    else if (x < 0) {
        this.enemyRight = true;
        this.position.x += 1;
    }
    else
        this.position.x -= 1;

    if (this.enemyUp) {
        if (y > HEIGHT) {
            this.position.y -= 1;
            this.enemyUp = false;
        }
        else
            this.position.y += 1;
    }
    else if (y < 0) {
        this.enemyUp = true;
        this.position.y += 1;
    }
    else
        this.position.y -= 1;

    this.graphic.position.x += (this.position.x - this.graphic.position.x);
    this.graphic.position.y += (this.position.y - this.graphic.position.y);
};


Player.prototype.decelerate = function (distance) {
    var min = -1;

    this.speed -= distance / 16;
    if (this.speed <= min) {
        this.speed = min;
    }
};

Player.prototype.displayInfo = function () {
    var time = Date.now() - player1.begin;
    jQuery('#'+this.name+' >.life').text(this.life);
    jQuery(".kill").text(this.kill);
    jQuery(".time").text(time);
};

Player.prototype.turnRight = function (angle) {
    this.direction -= angle;
    this.graphic.rotateOnAxis(new THREE.Vector3(0,0,1), angle);
};

Player.prototype.turnLeft = function (angle) {
    this.direction += angle;
    this.graphic.rotateOnAxis(new THREE.Vector3(0,0,1), angle);
};

Player.prototype.move = function () {
    var moveTo = new THREE.Vector3(
        this.speed * Math.cos(this.direction) + this.graphic.position.x,
        this.speed * Math.sin(this.direction) + this.graphic.position.y,
        this.graphic.position.z
    );

    this.graphic.position = moveTo;
    if (this.speed > 0) {
        this.speed = this.speed - 0.04;
    }
    else if (this.speed < 0) {
        this.speed = this.speed + 0.04
    }

    light1.position.x = 0;
    light1.position.y = this.graphic.position.y;
   // light1.position.z = this.graphic.position.z + 500;
};
