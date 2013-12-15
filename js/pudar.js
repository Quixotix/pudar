/**
 *  Main game object and configuration.
 */
var Pudar = {
    /**
     *  Pudar global configuration settings.
     */
    config: {
        width: 640,
        height: 480,
        xhrBase: 'http://pudar.quixotix.com'
    },

    /**
     *  Define scenes that can be loaded for the game.
     */
    scenes: {
        test: {
            name: 'Test',
            assets: ['img/sprites.png', 'img/gui.png', 'img/test_terrain.png'],
            map: 'maps/test-2.json',
        }
    },

    /**
     *  JSON data source for tilemap defined by the loadScene() method.
     */
    mapDataSource: null,

    /**
     *  Get an object from external JSON source.
     *
     *  @returns {Object} Object representation of the parsed JSON.
     */
    getJSON: function(relativePath, callback) {
        return jQuery.getJSON(this.config.xhrBase + "/" + relativePath, callback);
    },

    /**
     *  Load a game scene by showing a loading scene and waiting for the assets
     *  and map to be loaded.
     */
    loadScene: function(scene) {
        var self = this;

        // flags used to poll for loading to complete
        var assetsLoaded = false;
        var mapLoaded = false;
        
        // display a "Loading..." scene
        Crafty.scene('Loading', function() {

            Crafty.e('2D, DOM, Text')
                .text('LOADING...')
                .attr({x: 10, y: 10})
                .textColor('#FFFFFF')
                .textFont({size: '24px', family: 'monospace', weight: 'bold'})

            // load assets
            if (scene.assets !== 'undefined') {
                Crafty.load(scene.assets, function() {
                    console.log(scene.name + ": Assets loaded.");
                    assetsLoaded = true;
                });
            }

            // load tilemap
            if (scene.map !== 'undefined') {
                self.getJSON(scene.map, function(data) {
                    console.log(scene.name + ": Map loaded.");
                    self.mapDataSource = data;
                    mapLoaded = true;
                });
            }

            // poll for assets and map to be loaded
            var timerId = setInterval(function() {
                if ((scene.assets && assetsLoaded) && (scene.map && mapLoaded)) {
                    console.log(scene.name + ": Loading complete.");
                    Crafty.scene(scene.name);
                    clearInterval(timerId);
                }
            }, 250);
        });

        Crafty.scene('Loading');
    },

    /**
     *  Initialize Crafty and start the game.
     */
    start: function() {
        var self = this;
        Crafty.init(this.config.width, this.config.height);
        Crafty.background('black');
        this.loadScene(self.scenes.test)
    }
}
