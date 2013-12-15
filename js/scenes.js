// This is the main game scene
Crafty.scene('Game', function() {
    // Show Item Box
    Crafty.e('ItemBox')
        .attr({z: 10})
        .fixedPosition(Crafty.viewport.width - 37, 5);

    // Show current item
    Crafty.e('ItemDisplay')
        .attr({z: 9})
        .fixedPosition(Crafty.viewport.width - 37, 5);

    // Set map data source
    Crafty.e('2D, Canvas, TiledMapBuilder')
        .setMapDataSource(map_json)
        .createWorld(function(map) {

            for (var collision = 0;
                 collision < map.getEntitiesInLayer('collision').length;
                 collision++) {
                map.getEntitiesInLayer('collision')[collision]
                    .addComponent("Collision, Solid")
                    .collision();
            }

            for (var overlay = 0;
                 overlay < map.getEntitiesInLayer('overlay').length;
                 overlay++) {
                map.getEntitiesInLayer('overlay')[overlay]
                    .attr({z: 3});
            }

            /*
            for (var sprite = 0;
                 sprite < map.getEntititesInLayer('sprites').length;
                 sprite++) {
                map.getEntitiesInLayer('sprites')[sprite]
                    .addComponent('Item');
                    .setItemSprite(
            }
            */
        });

    // Create the player at coordinates (0, 0)
    this.player = Crafty.e('Player')
        .attr({x: 10, y: 200, z: 2});

    Crafty.viewport.follow(this.player);
    //Crafty.viewport.bounds = {min:{x:0, y:0}, max:{x:1440, y:1200}};
});

// This scene displays "Loading..." while crafty loads up our sprites, and
// continues to the game scene afterwards.
Crafty.scene('Loading', function() {
    var doneLoading = false;
    var doneWaiting = false;

    setTimeout(function() {
        doneWaiting = true;
        if (doneLoading) {
            Crafty.scene('Game')
        }
    }, 1000);

    // Display "Loading..." in white at (10, 10) on the screen
    Crafty.e('2D, DOM, Text')
        .text('LOADING...')
        .attr({x: 10, y: 10})
        .textColor('#FFFFFF')
        .textFont({size: '24px', family: 'monospace', weight: 'bold'})

    // Load sprites from img/squares.png. Each sprites is 16x16, so the image
    // is divided into a grid of 16x16 tiles. The player sprite (currently a
    // white square) is located at (0, 0) on the grid, and the wall sprite
    // (currently a black square) is located at (0, 1) on the grid.
    Crafty.load(['img/sprites.png', 'img/gui.png', 'img/test_terrain.png'],
                function() {
        // Load the sprite and tell crafty what is where
        Crafty.sprite(32, 'img/sprites.png', {
            spr_no_item: [0, 0],
            spr_player: [1, 0],
            spr_sword: [2, 0]
        });

        Crafty.sprite(32, 'img/gui.png', {
            spr_item_box: [0, 0]
        });

        // Switch to the Game scene
        doneLoading = true;
        if (doneWaiting) {
            Crafty.scene('Game');
        }
    });
});
