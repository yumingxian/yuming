requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
        "use strict";

        // Tell WorldWind to log only warnings and errors.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWindow.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        // Create and add layers to the WorldWindow.
        var layers = [
            // Imagery layers.
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            // Add atmosphere layer on top of all base layers.
            {layer: new WorldWind.AtmosphereLayer(), enabled: true},
            // WorldWindow UI layers.
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];



        for (var l = 0; l < layers.length; l++) {
            console.log(layers[l].enabled);
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }
        console.log(wwd);
        // Create the custom image for the placemark with a 2D canvas.
        var canvas = document.createElement("canvas"),
            ctx2d = canvas.getContext("2d"),
            size = 64, c = size / 2 - 0.5, innerRadius = 5, outerRadius = 20;

        canvas.width = size;
        canvas.height = size;

        var gradient = ctx2d.createRadialGradient(c, c, innerRadius, c, c, outerRadius);
        gradient.addColorStop(0, 'rgb(255, 0, 0)');
        gradient.addColorStop(0.5, 'rgb(0, 255, 0)');
        gradient.addColorStop(1, 'rgb(255, 0, 0)');

        ctx2d.fillStyle = gradient;
        ctx2d.arc(c, c, outerRadius, 0, 2 * Math.PI, false);
        ctx2d.fill();

        // Set placemark attributes.
        var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
        // Wrap the canvas created above in an ImageSource object to specify it as the placemarkAttributes image source.
        placemarkAttributes.imageSource = new WorldWind.ImageSource(canvas);
        // Define the pivot point for the placemark at the center of its image source.
        placemarkAttributes.imageOffset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 0.5);
        placemarkAttributes.imageScale = 1;
        placemarkAttributes.imageColor = WorldWind.Color.WHITE;

        // Set placemark highlight attributes.
        // Note that the normal attributes are specified as the default highlight attributes so that all properties
        // are identical except the image scale. You could instead vary the color, image, or other property
        // to control the highlight representation.
        var highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
        highlightAttributes.imageScale = 1.2;

        // Create the placemark with the attributes defined above.
        var placemarkPosition = new WorldWind.Position(40.3968, -74.0916, 1e2);
        var placemark = new WorldWind.Placemark(placemarkPosition, false, placemarkAttributes);
        // Draw placemark at altitude defined above, relative to the terrain.
        placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
        // Assign highlight attributes for the placemark.
        placemark.highlightAttributes = highlightAttributes;

        // Create the renderable layer for placemarks.
        var placemarkLayer = new WorldWind.RenderableLayer("Custom Placemark");


        // Add the placemark to the layer.
        placemarkLayer.addRenderable(placemark);


        // Add the placemarks layer to the WorldWindow's layer list.
        wwd.addLayer(placemarkLayer);


        // Now set up to handle highlighting.
        var highlightController = new WorldWind.HighlightController(wwd);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);



        var handlePick = function (o) {

            var x = o.clientX,
                y = o.clientY;



            var pickList = wwd.pick(wwd.canvasCoordinates(x, y));
            for(var i = 0; i < pickList.objects.length; i++){
            if(pickList.objects[i].userObject instanceof WorldWind.Placemark){
                $('.hover_bkgr_fricc').show();
            }


        }
        };
        $('.hover_bkgr_fricc').click(function(){
            $('.hover_bkgr_fricc').hide();
        });

        wwd.addLayer(placemarkLayer);
        console.log(wwd);
        wwd.addEventListener("click", handlePick);
    });
