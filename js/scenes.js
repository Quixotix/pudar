// This is the main game scene
Crafty.scene('Game', function() {
    // Create the player at coordinates (0, 0)
    this.player = Crafty.e('Player')
        .attr({x: 0, y: 0});
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
    Crafty.load(['img/squares.png'], function() {
        // Load the sprite and tell crafty what is where
        Crafty.sprite(16, 'img/squares.png', {
            spr_player: [0, 0],
            spr_wall: [0, 1]
        })

        // Switch to the Game scene
        Crafty.scene('Game');
    });
});
