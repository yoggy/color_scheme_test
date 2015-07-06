var div_num =  64;
var div_step = 71;
var color_s = 0.8;
var color_l = 0.7;
var color_l_step = 0.05;

function generateColorScheme(num, h_step, s, l, l_step) {
	colors = [];

	var h = 0;
	var init_l = l;

	for (var i = 0; i < num; ++i) {
		c = d3.hsl(h, s, l);
		colors.push(c);

		h += h_step;
		if (h >= 360) {
			h -= 360;
			l -= l_step;
			if (l < 0.1) l = 0.9;
			if (l > 0.9) l = 0.1;
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
	var color_scheme = generateColorScheme(div_num, div_step, color_s, color_l, color_l_step);
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

function onSliderColorS(val) {
	color_s = val;
	update();
}

function onSliderColorL(val) {
	color_l = val;
	update();
}

function onSliderColorLStep(val) {
	color_l_step = val;
	update();
}

function createSliderH(id, min_val, max_val, init_val, floating_point_quantize_decimal_place, updateHandler) {
	var w = 200;
	var h = 20;
	var offset_w = 20;
	var offset_h = 10;
	var text_w = 80;

	var svg = d3.select(id).attr("width", w + offset_w * 2 + text_w).attr("height", h);

	var pos2val = d3.scale.linear().domain([0, w]).range([min_val, max_val]);
	var val2pos = d3.scale.linear().domain([min_val, max_val]).range([0, w]);

	var val_text = svg.append('g')
                .attr('transform', 'translate('+(w + offset_w * 2)+', '+offset_h+')')
                .append('text')
                .attr('x', text_w/2)
                .style('font-size', 12)
                .style('text-anchor', 'end')
                .text('aaa');

	var g = svg.append('g').selectAll('g')
            .data([{x: val2pos(init_val), y : 0}])
            .enter()
                .append('g')
                .attr("height", h)
                .attr("width", w)
                .attr('transform', 'translate('+offset_w+', '+offset_h+')');

	var rect = g
                .append('rect')
                .attr('y', 0)
                .attr("height", 3)
                .attr("width", w)
                .attr('fill', '#C0C0C0');

    function drag_handler(pos) {
	    var val = pos2val(pos);
	    if (floating_point_quantize_decimal_place == 0) {
	    	val = Math.round(val);
	    }
	    else {
		    var n = Math.pow(10, floating_point_quantize_decimal_place);
		    val = Math.round(val * n) / n;
	    }
	    updateHandler(val);
	    val_text.text(val);
    }

	var drag = d3.behavior.drag()
	            .on("drag", function(d) {
				    d3.select(this)
				        .attr("cx", d.x = Math.max(0, Math.min(w, d3.event.x)))
				        .attr("cy", d.y = 0);
				    drag_handler(d.x);
				    d3.select("body").style("cursor", "move");
	            })
	            .on('dragend', function(d) {
				    drag_handler(d.x);
				    d3.select("body").style("cursor", "auto");
	            });

	var circle = g.append("circle")
	    .attr("r", 10)
	    .attr("cx", function(d) { return d.x; })
	    .attr("cy", function(d) { return d.y; })
	    .attr("fill", "#2090FF")
	    .call(drag);

	updateHandler(init_val);
    val_text.text(init_val);
}

function setupGUI() {
	createSliderH("#svg_slider_div_num", 1, 64, 64, 0,  onSliderDivNum);
	createSliderH("#svg_slider_div_step", 1, 200, 71, 0, onSliderDivStep);
	createSliderH("#svg_slider_color_s", 0.0, 1.0, color_s, 2, onSliderColorS);
	createSliderH("#svg_slider_color_l", 0.0, 1.0, color_l, 2, onSliderColorL);
	createSliderH("#svg_slider_color_l_step", 0.0, 0.2, color_l_step, 2, onSliderColorLStep);
}

function init() {
	setupGUI();
	update();
}
