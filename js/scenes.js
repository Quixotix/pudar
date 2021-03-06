// This is the main game scene
Crafty.scene('Test', function() {
    var TILE_SIZE = 32;
    var HUD_PADDING = 5;

    // Show Item Box
    Crafty.e('ItemBox')
        .attr({z: 10})
        .fixedPosition(Crafty.viewport.width - (TILE_SIZE + HUD_PADDING),
                       HUD_PADDING);

    // Show current item
    var itemDisplay = Crafty.e('ItemDisplay');
    itemDisplay
        .attr({z: 9})
        .fixedPosition(Crafty.viewport.width - (TILE_SIZE + HUD_PADDING),
                       HUD_PADDING);

    Crafty.sprite(32, 'img/sprites.png', {
        spr_no_item: [0, 0],
        spr_player: [1, 0],
        spr_sword: [2, 0]
    });

    Crafty.sprite(64, "img/player.png", {
        Player: [0,2]
    });

    Crafty.sprite(32, 'img/gui.png', {
        spr_item_box: [0, 0]
    });

    // Set map data source
    Crafty.e('2D, Canvas, TiledMapBuilder')
        .setMapDataSource(Pudar.mapDataSource)
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

    var items = [];
    for (var i = 0; i < items_json.length; i++) {
        item_json = items_json[i];
        items.push(Crafty.e(item_json.component_string)
            .attr({
                x: item_json.x * TILE_SIZE,
                y: item_json.y * TILE_SIZE,
                z: 2})
            .setSpriteName(item_json.item_sprite_name));
    }

    // player
    var player = Crafty.e('Actor, Fourway, Player, Collision, SpriteAnimation')
        .fourway(3)
        .attr({x: 32, y: 192, z: 2})
        // smaller collision rect for some overlap
        .collision([22,46],[42,46],[42,64],[42,64])
        .reel("walk_up", 1000, 1, 0, 7)
        .reel("walk_left", 1000, 1, 1, 7)
        .reel("walk_down", 1000, 1, 2, 7)
        .reel("walk_right", 1000, 1, 3, 7)
        .reel("stand", 500, 1, 4, 3)
        .bind("NewDirection", function (direction) {
            if (direction.x < 0) {
                if (!this.isPlaying("walk_left"))
                    this.animate("walk_left", -1);
            }
            if (direction.x > 0) {
                if (!this.isPlaying("walk_right"))
                    this.animate("walk_right", -1);
            }
            if (direction.y < 0) {
                if (!this.isPlaying("walk_up"))
                    this.animate("walk_up", -1);
            }
            if (direction.y > 0) {
                if (!this.isPlaying("walk_down"))
                    this.animate("walk_down", -1);
            }
            if(!direction.x && !direction.y) {
                this.animate("stand", -1);
            }
        })
        .bind('Moved', function(from) {
            // collision detection with tiles from the "Collision" layer
            if (this.hit('Solid')){
                this.attr({x: from.x, y:from.y});
            }
        })

    Crafty.bind('KeyDown', function(e) {
        if (e.key == 88) {
            for (var j = 0; j < items.length; j++) {
                var itemsTouching = player.hit('Item');
                if (itemsTouching) {
                    var itemTouching = itemsTouching[0].obj;
                    itemDisplay.changeItem(itemTouching.spriteName);
                    itemTouching.destroy();
                }
            }
        }
    });

    player.animate("stand", -1)
    Crafty.viewport.follow(player);
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
    }, 500);

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

        Crafty.sprite(64, "img/player.png", {
            Player: [0,2]
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
