$(document).ready(function () {

    if (window.innerHeight<= 680 || window.innerWidth <= 570) {
        window.location.href = "mobile.html";
    }

    $('#video').on('ended', function () {
        console.log("restart");

        this.load();
        this.play();
    });


    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var W = window.innerWidth,
        H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    var particleCount = 60,
        particles = [],
        minDist = 80,
        dist,
        mousePos = -1;

    function paintCanvas() {

        ctx.rect(0, 0, canvas.width, canvas.height);

        var grd1 = ctx.createLinearGradient(canvas.width, canvas.height, canvas.width, 0);
        grd1.addColorStop(1, '#3a4f6e');
        grd1.addColorStop(0.7, '#655e75');
        grd1.addColorStop(0.4, '#d3808a');
        grd1.addColorStop(0.15, '#f4aca0');
        grd1.addColorStop(0, '#f8f3c9');

        ctx.fillStyle = grd1;
        ctx.fill();
    }

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    canvas.addEventListener('mousemove', function (evt) {
        mousePos = getMousePos(canvas, evt);
    }, false);

    function Particle() {

        this.x = Math.random() * W;
        this.y = Math.random() * H;

        this.vx = 0;
        this.vy = -Math.random() * 1.6;

        this.radius = 2;

        this.draw = function () {
            if (mousePos != -1) {
                var dx = mousePos.x - this.x;
                var dy = mousePos.y - this.y;
                var mouseDist = Math.sqrt(dx * dx + dy * dy);
                if (mouseDist < 80) {
                    this.radius = 18 - mouseDist * 0.2;
                } else {
                    this.radius = 2;
                }
            }

            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

            ctx.fill();
        }
    }

    for (var i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function draw() {
        paintCanvas();

        for (var i = 0; i < particles.length; i++) {
            p = particles[i];
            p.draw();
        }

        update();
    }

    function update() {

        for (var i = 0; i < particles.length; i++) {
            p = particles[i];

            p.x += p.vx;
            p.y += p.vy


            if (p.x + p.radius > W)
                p.x = Math.random() * W;

            else if (p.x - p.radius < 0) {
                p.x = W - p.radius;
            }

            if (p.y + p.radius > H)
                p.y = Math.random() * H;

            else if (p.y - p.radius < 0) {
                p.y = H - p.radius;
            }

            for (var j = i + 1; j < particles.length; j++) {
                p2 = particles[j];
                distance(p, p2, i);
            }

        }
    }

// Distance calculator between two particles
    function distance(p1, p2, i) {
        var dist,
            dx = p1.x - p2.x;
        dy = p1.y - p2.y;

        dist = Math.sqrt(dx * dx + dy * dy);

        // Draw the line when distance is smaller
        // then the minimum distance
        if (dist <= minDist) {
            if (i % 2 == 0) {
                // Draw the line
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.quadraticCurveTo((p1.x + p2.x) / 2, p1.y, p2.x, p2.y);
                ctx.lineWidth = (1.0 - (dist / minDist) ^ 3) * 0.3;

                ctx.strokeStyle = "rgba(255,255,255," + (1.2 - dist / minDist) + ")";
                ctx.stroke();

                // 		// Some acceleration for the partcles
                // 		// depending upon their distance
                // 		var ax = dx/2000,
                // 			ay = dy/2000;

                // 		// Apply the acceleration on the particles
                // 		p1.vx -= ax;
                // 		p1.vy -= ay;

                // 		p2.vx += ax;
                // 		p2.vy += ay;
            } else {
                // Draw the line
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.lineWidth = (1.0 - (dist / minDist) ^ 3) * 0.5;

                ctx.strokeStyle = "rgba(255,255,255," + (1.2 - dist / minDist) + ")";
                ctx.stroke();
            }
        }
    }

// Start the main animation loop using requestAnimFrame
    function animloop() {
        draw();
        requestAnimFrame(animloop);
    }

    animloop();

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function (event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top'
    })

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function () {
        $('.navbar-toggle:visible').click();
    });

    //// Waypoint
    //$('.wpl').waypoint(function () {
    //    $('.wp1').addClass('animated fadeInLeft');
    //}, {
    //    offset: '75%'
    //});
    //$('.wp2').waypoint(function () {
    //    $('.wp2').addClass('animated fadeInUp');
    //}, {
    //    offset: '75%'
    //});
    //$('.wp3').waypoint(function () {
    //    $('.wp3').addClass('animated fadeInDown');
    //}, {
    //    offset: '75%'
    //});
});
