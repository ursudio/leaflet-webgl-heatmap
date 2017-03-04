casper.test.begin('Page loads without error', 7, function suite (test) {

	casper.start('example/index.html', function() {
		/* 1 */
	    test.assertTitle('WebGL Heatmap Leaflet Plugin', 'title is correct');
	    /* 2 */
	    test.assertExists('#mapid', 'mapid exists');
	    /* 3 */
	    test.assertEvalEquals(function () {
		    return L.version;
	    }, '1.0.3', 'leaflet version is correct');

	    /* 4 */
	    test.assertEvalEquals(function () {
	    	window.meters = L.webGLHeatmap({
				    size: 50,
				    units: 'm',
				    alphaRange: 0.4
				});
	    	meters.setData( dataPoints );
	    	map.addLayer(meters);
		    return meters._scalem( L.latLng(meters.data[0]) );
	    }, 2, 'meters scale is correct');

   	    /* 5 */
   	    test.assertEvalEquals(function () {
   	    	map.setZoom(14);
   		    return meters._scalem( L.latLng(meters.data[0]) );
   	    }, 8, 'meters scale is correct after zoom');

	    /* 5 */
	    test.assertEvalEquals(function () {
	    	window.pixels = L.webGLHeatmap({
				    size: 50,
				    units: 'px',
				    alphaRange: 0.5
				});
	    	pixels.setData( dataPoints );
	    	map.addLayer(pixels);
		    return pixels._scalepx( L.latLng(pixels.data[0]) );
	    }, 50, 'pixel scale is correct');

   	    /* 5 */
   	    test.assertEvalEquals(function () {
   	    	map.setZoom(4);
   		    return pixels._scalepx( L.latLng(pixels.data[0]) );
   	    }, 50, 'pixel scale is correct after zoom');
	});

	casper.on("page.error", function(msg, trace) {
		if (msg === 'WebGL not supported') {
			// we know
			return;
		}
		this.echo("Error: " + msg, "ERROR");
	});

	casper.test.on("fail", function(failure) {
	    failure.message = "Message : " + failure.message + "\nLine : "+ failure.line + "\nCode : " + failure.lineContents;
	});

	casper.run(function () {
		test.done();
	});
});
