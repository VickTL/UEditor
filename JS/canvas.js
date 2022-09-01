
// Execute the code below only once the page is loaded
window.onload = function() {
    // Get the canvas element from the HTML page
    var canvas = document.getElementById("canvas");
    // Get the 2D context of the canvas
    var ctx = canvas.getContext("2d");



    var gridColor = "rgb(255,50,40)";
    var gridThick = 3;
    
    var canvasHeight, canvasWidth, unit, logoSize, gridSize, margin, countX, countY;

    var counter = 0;

    var background;
    var isBackground = false;
    var imageZoom = 1;
    var imageX = 0;
    var imageY = 0;

    var grid = [];





    // INPUTS
    var gridChance = 0.1;
    var distanceChance = 9;

    document.getElementById("presetV").onclick = function() { 
        canvas.width = 1080; 
        canvas.height = 1920;
        canvasWidth = canvas.width;
        canvasHeight = canvas.height; 
        createGrid();
    }

    document.getElementById("presetH").onclick = function() { 
        canvas.width = 1920; 
        canvas.height = 1080;
        canvasWidth = canvas.width;
        canvasHeight = canvas.height; 
        createGrid();
    }

    document.getElementById("presetC").onclick = function() { 
        canvas.width = 1080; 
        canvas.height = 1080;
        canvasWidth = canvas.width;
        canvasHeight = canvas.height; 
        createGrid();
    }
  
    document.getElementById("inCanvasX").oninput = function() { canvas.width = this.value; canvasWidth = canvas.width; createGrid();}
    document.getElementById("inCanvasY").oninput = function() { canvas.height = this.value; canvasHeight = canvas.height; createGrid();}

    document.getElementById("slImageZoom").oninput = function() { imageZoom = mapRange(this.value, 0, 100, 0, 10, true); drawGrid();}
    document.getElementById("inImageX").oninput = function() { imageX = this.value; drawGrid();}
    document.getElementById("inImageY").oninput = function() { imageY = this.value; drawGrid();}

    document.getElementById("slGridChance").oninput = function() { gridChance = mapRange(this.value, 0, 100, 0, 1, true); createGrid(); }
    document.getElementById("slDistanceChance").oninput = function() { distanceChance = mapRange(this.value, 0, 100, 0, 10, true); createGrid();}

    // Carga imagen
    document.getElementById("inImage").onchange = function() {
        var file = this.files[0];
        var reader = new FileReader();

        reader.onloadend = function() {
            console.log('RESULT', reader.result);
            //var canvas = document.getElementById("myCanvas");
            //var ctx = canvas.getContext("2d");

            background = new Image();
            
            background.onload = function() { 
                isBackground = true;
                drawGrid(); 
            }
            background.src = reader.result;
        }

        reader.readAsDataURL(file);
    }   





    // CLASES    
    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }
    
    class InterestPoint {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    
        draw() {
            ctx.translate(this.x, this.y);
            ctx.fillStyle = "rgb(255,50,40)";
            ctx.fillRect(0, 0, unit, unit);
            ctx.translate(-this.x, -this.y);
        }
    
        distanceTo(point) {
            var distance = Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2));
            var mappedDistance = mapRange(distance, (canvasHeight+canvasWidth/2)/distanceChance, 0, 0, 0.5);
            return mappedDistance;
        }
    }

    class Square {
        constructor(x, y) {
            this.x = margin + x * gridSize;
            this.y = margin + y * gridSize;

            this.visible = true;

            this.centerX = this.x + (this.x+gridSize) / 2;
            this.centerY = this.y + (this.y+gridSize) / 2;
            this.center = new Point(this.centerX, this.centerY);
        }

        draw() {
            if(this.visible) {
                ctx.translate(this.x, this.y);
                ctx.strokeStyle = gridColor;
                ctx.lineWidth = gridThick;
    
                ctx.strokeRect(0, 0, gridSize, gridSize);
                ctx.translate(-this.x, -this.y);
            }
        }

        heatmap() {
            if(this.visible) {
                ctx.translate(this.x, this.y);
                ctx.fillStyle = "rgba(255,50,40,"+intP.distanceTo(this.center)+")";
                
                ctx.fillRect(0, 0, gridSize, gridSize);
                ctx.translate(-this.x, -this.y);
            }
        }
    }     





    
    var intP = new InterestPoint (0, 0);
    createGrid();

    function initGrid() {
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;

        if(canvasHeight > canvasWidth) {
            unit = canvasWidth / 18;
        }
        else unit = canvasHeight / 18;

        logoSize = unit * 1.5;
        gridSize = unit * 2;
        margin = unit;

        countX = (canvasWidth-margin*2) / gridSize;
        countY = (canvasHeight-margin*2) / gridSize;
    }

    function checkerboard() {
        // Create a checkerboard pattern background with each cell of size unit
        for(var i = 0; i < canvasWidth/unit; i++) {
            counter++;
            for(var j = 0; j < canvasHeight/unit; j++) {
                ctx.translate(i * unit,  j * unit);
                if(counter%2==0) ctx.fillStyle = "#fff";
                else ctx.fillStyle = "#eee";
                ctx.fillRect(0, 0, unit, unit);
                ctx.translate(- i * unit, - j * unit);
                counter++;
            }
        }
    }
   
    function drawBackground() {
        if(!isBackground) checkerboard();
        else {
            ctx.drawImage(background, imageX, imageY, background.width*imageZoom, background.height*imageZoom);
        }
    }

    function createGrid() {
        initGrid();
        drawBackground();

        // Genera toda la grid completa
        for(var i = 0; i < countX; i++) {
            for(var j = 0; j < countY; j++) {
                grid[i+j*countX] = new Square(i,j);
            }
        }

        console.table(grid);

        // Togglea la visibilidad según condiciones
        for(var i = 0; i < countX; i++) {
            for(var j = 0; j < countY; j++) {
                if(Math.random()*(-intP.distanceTo(grid[i+j*countX])) < gridChance) {
                    grid[i+j*countX].visible = true;
                }
                else grid[i+j*countX].visible = false;
            }
        }

        drawGrid();

        /*
        for(var i = 0; i < countX; i++) {
            for(var j = 0; j < countY; j++) {
                ctx.translate(margin + i * gridSize, margin + j * gridSize);
                ctx.strokeStyle = gridColor;
                ctx.lineWidth = gridThick;
    
                var p = new Point(margin + i * gridSize, margin + j * gridSize);
    
                if(Math.random()*(-intP.distanceTo(p)) < gridChance) {
                    ctx.fillStyle = "rgba(255,50,40,"+intP.distanceTo(p)+")";
                    ctx.fillRect(0, 0, gridSize, gridSize);
                    ctx.strokeRect(0, 0, gridSize, gridSize);
                }

                ctx.translate(-margin - i * gridSize, -margin - j * gridSize);
            }
        }
        */
    }

    function drawGrid() {
        drawBackground();

        for(var i = 0; i < countX; i++) {
            for(var j = 0; j < countY; j++) {
                grid[i+j*countX].draw();
                //grid[i+j*countX].heatmap();
            }
        }
    }

    canvas.addEventListener('click', function (evt) {
        var mousePos = getMousePos(canvas, evt);
        var message = 'Mouse Clicked at ' + mousePos.x + ',' + mousePos.y;
        intP = new InterestPoint(mousePos.x, mousePos.y);
        createGrid();
        console.log(message);
    }, false);    

}