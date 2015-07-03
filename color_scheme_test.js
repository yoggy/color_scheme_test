var div_num =  64;
var div_step = 71;

function generateColorScheme(num, h_step, s, l) {
	colors = [];

	var h = 0;
	var init_l = l;

	for (var i = 0; i < num; ++i) {
		c = d3.hsl(h, s, l);
		colors.push(c);

		h += h_step;
		if (h >= 360) {
			h -= 360;
			l -= 0.05;
			if (l < 0.1) l = init_l;
		}
	}
	return colors;
}

function updateText(color_scheme) {
	var textarea = d3.select("#colors_text")[0][0];
	var color_codes = [];

	color_scheme.forEach(function(hsv) {
		color_codes.push(hsv.toString());
	});
	textarea.value = JSON.stringify(color_codes);
	console.log(textarea);
}

function updateSVG(color_scheme) {
	var svg = d3.select("#svg_canvas");

	var rect_size = 40;

	svg.selectAll("rect").remove();

	svg.selectAll("rect")
		.data(color_scheme)
		.enter()
		.append("rect")
		.attr("x",function(d, i){ return (i % 8) * rect_size; })
		.attr("y",function(d, i){ return Math.floor(i / 8) * rect_size; })
		.attr("width", rect_size)
		.attr("height", rect_size)
		.style("stroke", "#ffffff")
		.style("fill", function(d) { return d.toString(); });
}

function update() {
	var color_scheme = generateColorScheme(div_num, div_step, 0.8, 0.7);
	updateText(color_scheme);
	updateSVG(color_scheme);
}

function onSliderDivNum(val) {
	div_num = val;
	update();
}

function onSliderDivStep(val) {
	div_step = val;
	update();
}

function createSliderH(id, min_val, max_val, init_val, is_int, updateHandler) {
	var w = 200;
	var h = 20;
	var offset_w = 20;
	var offset_h = 20;

	var svg = d3.select(id).attr("width", w + offset_w * 2).attr("height", h);

	var pos2val = d3.scale.linear().domain([0, w]).range([min_val, max_val]);
	var val2pos = d3.scale.linear().domain([min_val, max_val]).range([0, w]);

	var g = svg.selectAll('g')
            .data([{x: val2pos(init_val), y : 0}])
            .enter()
                .append('g')
                .attr("height", h)
                .attr("width", w)
                .attr('transform', 'translate(20, 10)');

	var rect = g
                .append('rect')
                .attr('y', 0)
                .attr("height", 3)
                .attr("width", w)
                .attr('fill', '#C0C0C0');

    function drag_handler(pos) {
	    var val = pos2val(pos);
	    if (is_int == true) {
		    val = Math.round(val);
	    }
	    updateHandler(val);
    }

	var drag = d3.behavior.drag()
	            .on("drag", function(d) {
				    d3.select(this)
				        .attr("cx", d.x = Math.max(0, Math.min(w, d3.event.x)))
				        .attr("cy", d.y = 0);
				    drag_handler(d.x);
	            })
	            .on('dragend', function(d) {
				    drag_handler(d.x);
	            });

	var circle = g.append("circle")
	    .attr("r", 10)
	    .attr("cx", function(d) { return d.x; })
	    .attr("cy", function(d) { return d.y; })
	    .attr("fill", "#2090FF")
	    .call(drag);

	updateHandler(init_val);
}

function setupGUI() {
	createSliderH("#svg_slider_div_num", 1, 64, 64, true,  onSliderDivNum);
	createSliderH("#svg_slider_div_step", 1, 180, 71, true, onSliderDivStep);
}

function init() {
	setupGUI();
	update();
}
