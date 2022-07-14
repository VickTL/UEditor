
// Execute the code below only once the page is loaded
window.onload = function() {
    // Get the canvas element from the HTML page
    var canvas = document.getElementById("canvas");
    // Get the 2D context of the canvas
    var ctx = canvas.getContext("2d");

    // Draw a rectangle on the canvas
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    var unit = canvasWidth / 18;
    var logoSize = unit * 1.5;
    var gridSize = unit * 2;
    var margin = unit;

    var countX = (canvasWidth-margin*2) / gridSize;
    var countY = (canvasHeight-margin*2) / gridSize;

    var counter = 0;

    var background;
    var isBackground = false;

    // Sliders
    var gridChance = 0.1;
    var distanceChance = 9;

    document.getElementById("slGridChance").oninput = function() { gridChance = mapRange(this.value, 0, 100, 0, 1, true); createGrid(); }
    document.getElementById("slDistanceChance").oninput = function() { distanceChance = mapRange(this.value, 0, 100, 0, 10, true); createGrid();}

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
                createGrid(); 
            }
            background.src = reader.result;
        }

        reader.readAsDataURL(file);

        
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
    
    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }

    var intP = new InterestPoint (0, 0);
    createGrid();

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
   

    function createGrid() {
        if(!isBackground) checkerboard();
        else {

            ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);
        }

        for(var i = 0; i < countX; i++) {
            for(var j = 0; j < countY; j++) {
                ctx.translate(margin + i * gridSize, margin + j * gridSize);
                ctx.strokeStyle = "rgb(255,50,40)";
                ctx.lineWidth = 3;
    
                var p = new Point(margin + i * gridSize, margin + j * gridSize);
    
                if(Math.random()*(-intP.distanceTo(p)) < gridChance) {
                    ctx.fillStyle = "rgba(255,50,40,"+intP.distanceTo(p)+")";
                    ctx.fillRect(0, 0, gridSize, gridSize);
                    ctx.strokeRect(0, 0, gridSize, gridSize);
                }

                ctx.translate(-margin - i * gridSize, -margin - j * gridSize);
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