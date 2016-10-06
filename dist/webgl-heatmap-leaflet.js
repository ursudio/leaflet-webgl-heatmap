/*
 * MIT Copyright 2016 Ursudio <info@ursudio.com>
 * http://www.ursudio.com/
 * Please attribute Ursudio in any production associated with this JavaScript plugin.
 */

L.WebGLHeatMap = L.Renderer.extend({

    // tested on Leaflet 1.0.1
    version : '0.2.0', 

    options: {
        // @option size: Number
        // corresponds with units below
        size: 30000,
        // @option units: String
        // 'm' for meters or 'px' for pixels
        units : 'm', 
        opacity: 1,
		gradientTexture: false,
		alphaRange: 1,
        // @option padding: 
        // don't add padding (0 helps with zoomanim)
        padding: 0
    },

    _initContainer : function () {
        var container = this._container = document.createElement('canvas'),
            options = this.options;

        container.id = 'webgl-leaflet-' + L.Util.stamp(this);
        container.style.opacity = options.opacity;
        container.style.position = 'absolute';
            
        this.gl = window.createWebGLHeatmap({ 
            canvas: container, 
            gradientTexture: options.gradientTexture, 
            alphaRange: [0, options.alphaRange]
        });

        this._container = container;
    },

    onAdd: function () {
        L.Renderer.prototype.onAdd.call(this);
		this.resize();
    },

    // events

    getEvents : function () {
        var events = L.Renderer.prototype.getEvents.call(this);

        L.Util.extend(events, {
            resize : this.resize,
            move : L.Util.throttle(this._update, 49, this)
        });

        return events;
    },

    resize: function () {
		var canvas = this._container,
			size = this._map.getSize();
		
		canvas.width = size.x;
		canvas.height = size.y;

		this.gl.adjustSize();
		this.draw();
    },
    
    reposition: function () {
        // canvas moves opposite to map pane's position
    	var pos = this._map
            ._getMapPanePos()
            .multiplyBy(-1);

		L.DomUtil.setPosition(this._container, pos);
    },

    _update : function () {
        L.Renderer.prototype._update.call(this);
        this.draw();
    },

    // draw function
    	
    draw : function () {
		var map = this._map,
			heatmap = this.gl,
			dataLen = this.data.length,
            floor = Math.floor,
            scaleFn = this['_scale' + this.options.units];

		if (!map) return;

        heatmap.clear();
        this.reposition();

		if (dataLen) {

            for (var i = 0; i < dataLen; i++) {
				var dataVal = this.data[i],
					latlng = L.latLng( dataVal ),
					point = map.latLngToContainerPoint( latlng );
                
                heatmap.addPoint(
                    floor(point.x),
                    floor(point.y),
                    scaleFn(latlng),
					dataVal[2]
				);
            }

            heatmap.update();

            if (this._multiply) {
            	heatmap.multiply( this._multiply );
            	heatmap.update();
            }

        }
        heatmap.display();
    },
	
    // scale methods 

    _scalem : function (latlng) {
    	// necessary to maintain accurately sized circles
    	// to change scale to miles (for example), you will need to convert 40075017 (equatorial circumference of the Earth in metres) to miles
        var map = this._map,
            lngRadius = (this.options.size / 40075017) * 
            360 / Math.cos(L.LatLng.DEG_TO_RAD * latlng.lat),
            latlng2 = new L.LatLng(latlng.lat, latlng.lng - lngRadius),
            point = map.latLngToLayerPoint(latlng),
            point2 = map.latLngToLayerPoint(latlng2);
            
        return Math.max(Math.round(point.x - point2.x), 1);
    },

    _scalepx: function (latlng) {
        return options.size;
    },

    // data handling methods

    data : [],
	
    addDataPoint: function (lat, lon, value) {
        this.data.push( [ lat, lon, value / 100 ] );
    },
	
    setData: function (dataset) {
		// format: [[lat, lon, intensity],...]
		this.data = dataset;
		this._multiply = null;
		this.draw();
    },
	
    clear: function () {
		this.setData([]);
    },

    // affects original points
    multiply: function (n) {
    	this._multiply = n;
    	this.draw();
    }

});

L.webGLHeatmap = function ( options ) {
    return new L.WebGLHeatMap( options );
};
