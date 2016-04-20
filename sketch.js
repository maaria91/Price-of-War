//-----------------------------------------------------THE SET UP-----------------------------------------------------------//


var dropStrings; //we will have somethign called dropStrings
var drop = []; //the drop is made out of so many points so its an array - here we have to empty -for NOW.
var dropWidth = 150,
    dropHeight = 300; //how big the drop is // global variables will use in DRAW

var arrayCircles = []; //we know we will have many circles later in the code.. so we come here and introduce them
var numberCircles = 30; //specify the number. ((is this because were randomly generating them??))

var table;
var wars = [];

var timelinePoints = [];
var arrayRects = [];
var container = [];




//-----------------------------------------------------DATA & IMAGES IMPORT-----------------------------------------------------------//


function preload() { //HERE we preload the array of the circle dots --it is pulling it from the folder
    dropStrings = loadStrings('assets/DropXY2.txt');
    table = loadTable("Data/Inter-StateWarData.csv", "csv", "header");
} //this is how its done - always




//-----------------------------------------------------THE SET UP FOR THE CANVAS-----------------------------------------------------------//


function setup() { //NOW we set up the space which we will AFTERWARDS draw on.
    var myCanvas = createCanvas(windowWidth, windowHeight);
    myCanvas.parent('myContainer');

    frameRate(50);//circle speed
    stroke(0);
    fill(150);


//fixing the X & Y of the drop shell
    var arrayStringCoordinates = dropStrings[0].split(" "); //pulling in the drop coordinates and splitting by SPAEC
    print(arrayStringCoordinates); //console.log = 
    arrayStringCoordinates.forEach(function (s) { //since we have 30 circles, we need a forEach statement
        var coordStrings = s.split(","); //splitting it up by comma.. now we have Xs and Ys 

        //-----------------------------------------------------YELLOW CAGE-----------------------------------------------------------//
        var x = float(coordStrings[0]) + 100 - dropWidth / 2; //converting a string to decimile (floating)
        var y = float(coordStrings[1]) - 50 - dropHeight / 2;
        var point = createVector(x * 2.2, y * 2.3); //creating the drop
        drop.push(point); //pushing point into drop --in the top of the page

    });


    print(table.getRowCount() + "total rows in table");


    /* FILTERING DATA*/
    table.getRows().forEach(function (row) {
        var warName = row.getString("WarName");
        //print(warName);

        var participantName = row.getString("StateName");
        var startYear = int(row.getString("StartYear1"));
        var startMonth = int(row.getString("StartMonth1"));
        var startDay = int(row.getString("StartDay1"));
        var endYear = int(row.getString("EndYear1"));
        var endMonth = int(row.getString("EndMonth1"));
        var endDay = int(row.getString("EndDay1"));
        var deaths = int(row.getString("BatDeath"));

        var startDate = new ODate(startYear, startMonth, startDay);
        var endDate = new ODate(endYear, endMonth, endDay);
        var participant = new Participant(participantName, startDate, endDate, deaths);

        var war = getWar(warName);
        if (war == "false") {
            //create a new war
            var myWar = new War(warName);
            myWar.deaths = deaths;
            myWar.participants.push(participant);
            wars.push(myWar);

        } else {
            //fill the existing war with new data
            war.participants.push(participant);
        }

    });
    /* WAR FILTERED BY YEAR */
    function getWar(name) {
        for (var i = 0; i < wars.length; i++) {
            var war = wars[i];
            if (war.name == name) {
                return war;
            }

        }
        return "false";

    }


    for (var i = 0; i < wars.length; i++) { //generating random circles and pushing them to the top intro part
        //var circle = new Circle(wars[i]);
        //arrayCircles.push(circle);

    }






    //-----------------------------------------------------THE TIMELINE SETUP-----------------------------------------------------------//

    /*RECTS ACCORDING TO END AND START YEAR*/
    arrayRects.push(new SelectRect(1823, 1852));
    arrayRects.push(new SelectRect(1853, 1882));
    arrayRects.push(new SelectRect(1883, 1912));
    arrayRects.push(new SelectRect(1913, 1942));
    arrayRects.push(new SelectRect(1943, 1972));
    arrayRects.push(new SelectRect(1973, 2003));


    wars.forEach(function (war) {
        var max = 0;
        var min = 9999;

        war.participants.forEach(function (part) {

            if (getDecimalDate(part.endDate) > max) max = getDecimalDate(part.endDate);
            if (getDecimalDate(part.startDate) < min) min = getDecimalDate(part.startDate);
        });

        war.starDate = min;
        war.endDate = max;

    });

    wars.forEach(function (war) {
        var maxi = 1;
        var mini = 99999;

        war.participants.forEach(function (parti) {

            if (getNormalDate(parti.endDate) > maxi) maxi = getNormalDate(parti.endDate);
            if (getNormalDate(parti.startDate) < mini) mini = getNormalDate(parti.startDate);
        });

        war.WNstartDate = mini;
        war.WNendDate = maxi;

    });



    wars.forEach(function (war) {
        war.computeDeaths();

    });




}


var prevRectSelected = null;




//-----------------------------------------------------THE DRAW FUNCTION-----------------------------------------------------------//


function draw() { //HERE we beging the drawing process.. everythign we want to draw needs to be inside here.
    background(50, 50, 50);


    /*DRAWING THE RECTS*/
    arrayRects.forEach(function (c) {
        c.isMouseOver();
        c.draw();

    });

    var rectSelected = null;
    arrayRects.forEach(function (rect) {
        if (rect.active == true) {
            rectSelected = rect;

        }
    });




    if (rectSelected != prevRectSelected && rectSelected != null) {
        arrayCircles = [];

        //print(rectSelected);
        wars.forEach(function (war) {
            // print(war.starDate + " " + war.endDate);
            if (war.starDate >= rectSelected.start && war.endDate <= rectSelected.end) {

                var circle = new Circle(war);
                arrayCircles.push(circle);


            }

        });
        prevRectSelected = rectSelected;


    }



    //-----------------------------------------------------THE TOOLTIP-----------------------------------------------------------//


    function MousePos(circle) {
        //print(circle);
        var mPos = createVector(mouseX, mouseY);
        var cpos = createVector(circle.pos.x + width / 2.129, circle.pos.y + height / 2.06);
        //cpos.mult(1.7);
        print(circle.radius + " " + mPos.dist(cpos));

        if (mPos.dist(cpos) <= circle.radius) {




            fill("red");
//            circle.radius = sqrt(war.totalDeaths) / 15 * 2.10;
//            if (this.radius < 7) this.radius = 35;
//            if (this.radius > 50) this.radius = 70
            ellipse(circle.pos.x + width / 2.129, circle.pos.y + height / 2.06, (circle.radius)  * 2.10, circle.radius  * 2.10 )

            



            print(circle.radius + " " + mPos.dist(cpos));

            //information inside the tooltip - from data
            enteries = "War Name:" + "\n" + "Casualties";

            warStartDate = circle.war.WNstartDate
            warEndDate = circle.war.WNendDate
            Casualties = circle.war.totalDeaths
                //            partName = circle.war.participantName



            details = "War Name:" + "    " + circle.war.name + "\n" + "Casualties:" + "    " + Casualties + "\n" + "Start Date:" + "     " + warStartDate + "\n" + "End Date:" + "      " + warEndDate //+ "\n" +  "Countries at war:" + "    " + circle.war.countries;

            //details = circle.war.name;

            //drawing the toolip
            push();
            noStroke();
            fill(150);
            textSize(22);
            textLeading(35);
            text(details, 1350, 490)

            pop();

           


        }


    }




    arrayCircles.forEach(function (c) {
        MousePos(c);
    });



    //-----------------------------------------------------================-----------------------------------------------------------//

    /*DRAWING THE BLOOD DROP SHELL*/
    translate(width / 2.129, height / 2.06); //location of the drop
    //stroke("yellow");
    //scale(1.7);
    noStroke();
    noFill();
    drop.forEach(function (p) {
        ellipse(p.x, p.y, 1, 1);
    });

    /*DRAWING THE CIRCLES*/
//    for (var STEPS = 0; STEPS < 3; STEPS++) {
//        //making a collision
//        for (var i = 0; i < arrayCircles.length - 1; i++) {
//            for (var j = i + 1; j < arrayCircles.length; j++) {
//                var pa = arrayCircles[i];
//                var pb = arrayCircles[j];
//                var ab = p5.Vector.sub(pb.pos, pa.pos);
//                var distSq = ab.magSq();
//                if (distSq <= sq(pa.radius + pb.radius)) {
//                    var dist = sqrt(distSq);
//                    var overlap = (pa.radius + pb.radius) - dist;
//                    ab.div(dist);
//                    ab.mult(overlap * 0.5);
//                    pb.pos.add(ab);
//                    ab.mult(-1);
//                    pa.pos.add(ab);
//
//
//                    if (pa.testCollision()) {
//                        pa.goInwards();
//                    }
//
//                    if (pb.testCollision()) {
//                        pb.goInwards();
//                    }
//
//
//                }
//            }
//        }
//    }

    arrayCircles.forEach(function (c) { //for each circle, update it then draw it
        c.update();
        c.draw();
    });


   


    for (var STEPS = 0; STEPS < 3; STEPS++) {
        //make a collision
        for (var i = 0; i < arrayCircles.length - 1; i++) {
            for (var j = i + 1; j < arrayCircles.length; j++) {
                var pa = arrayCircles[i];
                var pb = arrayCircles[j];
                var ab = p5.Vector.sub(pb.pos, pa.pos);
                var distSq = ab.magSq();
                if (distSq <= sq(pa.radius + pb.radius)) {
                    var dist = sqrt(distSq);
                    var overlap = (pa.radius + pb.radius) - dist;
                    ab.div(dist);
                    ab.mult(overlap * 0.5);
                    pb.pos.add(ab);
                    ab.mult(-1);
                    pa.pos.add(ab);


                    if (pa.testCollision()) {
                        pa.goInwards();
                    }

                    if (pb.testCollision()) {
                        pb.goInwards();
                    }


                }
                
            }
        }
    }

    arrayCircles.forEach(function (c) { //for each circle, update it then draw it
        c.update();
        c.draw();
    });


}

/*CONTROLLING THE WINDOW VIEW*/
//function windowResized() { //this is to allow the window to adjust with making it big or small 
//    resizeCanvas(windowWidth, windowHeight);
//
//}


/*SETTING UP MORE FUNCTIONS AND VARIABLES TO USE*/
var ODate = function (AAAA, MM, DD) {
    this.year = AAAA;
    this.month = MM;
    this.day = DD;

}


//******************************
//*****************************
function getDecimalDate(date) {
    return date.year + (date.month - 1) / 12 + (date.day - 1) / 365;
}


function getNormalDate(date) {
    return date.year
}

var War = function (name, startyear) {
    this.name = name;
    this.participants = [];
    this.deaths = [];
    this.totalDeaths = 0;
    // this.participantsName = countries;

    this.computeDeaths = function () {
        var sum = 0;
        for (var i = 0; i < this.participants.length; i++) {
            sum += this.participants[i].deaths;
        }
        this.totalDeaths = sum;
    }

    //---


    //---


}

var Participant = function (country, startDate, endDate, deaths, participantName) {
    this.country = country;
    this.startDate = startDate;
    this.endDate = endDate;
    this.deaths = deaths;
    // this.participantName= countries;
}


var Circle = function (war) { //the position and movement of circles
    this.war = war;
    this.pos = createVector(random(-5, 5), random(-5, 5));


    //DO SOMETHING ABOUT ZEROS AND OTHER WEIRD NUMBERS
    this.radius = sqrt(this.war.totalDeaths) / 15 * 2.10;
    if (this.radius < 7) this.radius = 35;
    if (this.radius > 50) this.radius = 70


    this.outwardsVelocity = createVector(random(-1, 1), random(-1, 1)); //((Not moving anymore?- is this location + V like reading))
    this.outwardsVelocity.normalize();
    //this.outwardsVelocity.mult(-5);
    this.velocity = this.outwardsVelocity;
    var center = createVector(50, 50);
    //var center = createVector(0, 0);

    //SETTING UP WHAT WOULD HAPPEN IF IT COMES ON DROP BOARDER
    this.innerVel = createVector(50, 50);
    //this.innerVel = createVector(0, 0);
    //this.innerVel.normalize();

    this.hit = false;

    this.update = function () {

    }


    this.testCollision = function () {
        this.hit = collideCirclePoly(this.pos.x, this.pos.y, this.radius * 2, drop);
        return this.hit;
    }

    this.goInwards = function () {
        var vpush = p5.Vector.sub(center, this.pos);
        vpush.normalize();
        vpush.mult(3);
        this.pos.add(vpush);

    }

    //REACTION TO SHELL
    this.draw = function () { //DRAWING the circles after we gave it all the above charactaristics 
        noStroke();
        if (this.hit) {
            //            fill(255, 0, 0, 100);
            fill(102, 0, 0, 100);

            //this.velocity = this.innerVel;

        } else {
            fill(102, 0, 0, 100);
        }

        ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2);
        //        text(this.war.name, this.pos.x, this.pos.y);


    }
}



function changeBG() {
    var val = random(255);
    background(val);
}




//-----------------------------------------------------DRAWING THE TIMELINE-----------------------------------------------------------//


var SelectRect = function (start, end) {
    this.start = start;
    this.end = end;
    this.active = false;

    var totalWidth = 1200;

    var yearsSpan = this.end - this.start;

    this.width = map(yearsSpan, 0, 2003 - 1823, 0, totalWidth);
    this.height = 10;

    //print(180/yearsSpan);

    this.x1 = map(this.start, 1823, 2003, 0, totalWidth) + 470;


    //this.x1 = map(this.start, 1823, 2003, 0, this.width);
    this.x2 = this.width + this.x1;
    this.y1 = 670 + 300;
    this.y2 = this.height + this.y1;

    this.draw = function () {
        //stroke("teal");
        noFill();
        noStroke();
        if (this.active) {
            fill(102, 0, 0, 70);
        } else noFill();
        //print(this.active);
        rect(this.x1, this.y1, this.width, this.height);
        //print(this.x1);
    }


    //-----------------------------------------------------MOUSE OVER FUNCTION-----------------------------------------------------------//

    this.isMouseOver = function () {
        if (mouseX < this.x2 && mouseX >= this.x1 && mouseY < this.y2 && mouseY >= this.y1) {
            this.active = true;



        } else this.active = false;



    }





}
