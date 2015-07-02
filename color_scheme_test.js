function generateColorScheme(num, h_step, s, l) {
	colors = [];

	var h = 0;

	for (var i = 0; i < num; ++i) {
		c = d3.hsl(h, s, l);
		colors.push(c);

		h += h_step;
		if (h >= 360) {
			h -= 360;
			l -= 0.05;
		}
	}
	return colors;
}

function update() {
	var color_scheme = generateColorScheme(100, 71, 0.8, 0.7);

	var svg = d3.select("#svg_canvas");

	var rect_size = 50;

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

function init() {
	update();
}
