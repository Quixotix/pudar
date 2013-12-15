/**
 *  Main game object and configuration.
 */
var Pudar = (function (Crafty, jQuery) {

    /**
     *  Pudar configuration settings.
     */
    var config = {
        width: 640,
        height: 480,
        xhrBase: 'http://pudar.quixotix.com',

        /**
         *  Define scenes that can be loaded for the game.
         */
        scenes: {
            test: {
                name: 'Game',
                assets: ['img/sprites.png', 'img/gui.png', 'img/terrain-on-sand.png', 'img/terrain.png', 'img/terrain-atlas.png'],
                map: 'maps/test-2.json',
            },
            begin: {
                name: 'Game',
                assets: ['img/sprites.png', 'img/gui.png', 'img/terrain-on-sand.png'],
                map: 'maps/lost-lava.json',
            }
        }
    };

    // private
    var sceenConfig = null;
    var mapDataSource = null;

    return {

        /**
         *  JSON data source for tilemap loaded in the loadScene() method.
         */
        getMapDataSource: function() {
            return mapDataSource;
        },

        /**
         *  Currently loaded scene configuration set in the loadScene() method.
         */
        getSceneConfig: function() {
            return getSceneConfig;
        },

        /**
         *  Get an object from external JSON source.
         *
         *  @returns {Object} Object representation of the parsed JSON.
         */
        getJSON: function(path, callback) {
            return jQuery.getJSON(config.xhrBase + "/" + path, callback);
        },

        /**
         *  Load a game scene by showing a loading scene and waiting for the
         *  assets and tilemap to be loaded.
         */
        loadScene: function(scene) {
            var self = this;
            sceenConfig = scene;

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
                        mapDataSource = data;
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
            Crafty.init(config.width, config.height);
            Crafty.background('black');
            this.loadScene(config.scenes.test)
        }
    }
}(Crafty, jQuery));
