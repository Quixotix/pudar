// This is the main game scene
Crafty.scene('Game', function() {
    // Show Item Box
    Crafty.e('ItemBox')
        .attr({x: Crafty.viewport.width - 37, y: 5, z: 10});

    // Show current item
    Crafty.e('ItemDisplay')
        .attr({x: Crafty.viewport.width - 37, y: 5, z: 9});

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
        });

    // Create the player at coordinates (0, 0)
    this.player = Crafty.e('Player')
        .attr({x: 0, y: 0, z: 2});
});

// This scene displays "Loading..." while crafty loads up our sprites, and
// continues to the game scene afterwards.
Crafty.scene('Loading', function() {
    // Display "Loading..." in white at (10, 10) on the screen
    Crafty.e('2D, DOM, Text')
        .text('Loading...')
        .attr({x: 10, y: 10})
        .css({
            'font-family': 'monospace',
            'font-size': '24px',
            'color': 'white'
        });

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
        Crafty.scene('Game');
    });
});
