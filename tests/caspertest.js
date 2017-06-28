casper.test.begin('Page loads without error', function suite (test) {

    casper.start('example/index.html', function() {
        /* 1 */
        test.assertTitle('WebGL Heatmap Leaflet Plugin', 'title is correct');
        /* 2 */
        test.assertExists('#mapid', 'mapid exists');
        /* 3 */
        test.assertEvalEquals(function() {
            return L.version;
        }, '1.1.0', 'leaflet version is correct');

        /* 4 */
        test.assertEvalEquals(function() {
            window.meters = L.webGLHeatmap({
                size: 50,
                units: 'm',
                alphaRange: 0.4
            });
            meters.setData(dataPoints);
            map.addLayer(meters);
            return meters._scalem(L.latLng(meters.data[0]));
        }, 2, 'meters scale is correct');

        /* 5 */
        test.assertEvalEquals(function() {
            map.setZoom(14);
            return meters._scalem(L.latLng(meters.data[0]));
        }, 8, 'meters scale is correct after zoom');

        /* 6 */
        test.assertEvalEquals(function() {
            window.pixels = L.webGLHeatmap({
                size: 50,
                units: 'px',
                alphaRange: 0.5
            });
            pixels.setData(dataPoints);
            map.addLayer(pixels);
            return pixels._scalepx(L.latLng(pixels.data[0]));
        }, 50, 'pixel scale is correct');

        /* 7 */
        test.assertEvalEquals(function() {
            map.setZoom(4);
            return pixels._scalepx(L.latLng(pixels.data[0]));
        }, 50, 'pixel scale is correct after zoom');

        /* test remove */
        test.assertEvalEquals(function () {
            map.removeLayer(window.pixels);
            return map.hasLayer(window.pixels);
        }, false, 'Map successfully removed the pixels layer');

        /* test re-add */
        test.assertEvalEquals(function () {
            map.addLayer(window.pixels);
            return map.hasLayer(window.pixels);
        }, true, 'Map successfully re-added the pixels layer after destruction');
    });

    casper.run(function() {
        test.done();
        this.page.close();
        window.setTimeout(function () {
            casper.exit();
        }, 150);
    });
});