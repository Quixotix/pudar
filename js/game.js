Game = {
    // Initialize crafty and start our game
    start: function() {
        // Tiles will be 16x16 pixels, and a screen will have 40x30 tiles.
        // This comes out to a screen size of 640x480
        Crafty.init(640, 480);

        // Set the screens background to Micah's favorite color
        Crafty.background('black');

        // Start the Loading scene.
        Crafty.scene('Loading');
    }
}
