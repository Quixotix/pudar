// This is the main game scene
Crafty.scene('Game', function() {
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
        .attr({z: 10})
        .fixedPosition(Crafty.viewport.width - (TILE_SIZE + HUD_PADDING),
                       HUD_PADDING);

    Crafty.sprite(32, 'img/sprites.png', {
        NoItemSprite: [0, 0],
        SwordSprite: [2, 0]
    });

    Crafty.sprite(32, 64, 'img/torch.png', {
        TorchSprite: [0, 0]
    });

    Crafty.sprite(64, "img/player.png", {
        PlayerSprite: [0,2]
    });

    Crafty.sprite(32, 'img/gui.png', {
        spr_item_box: [0, 0]
    });

    // Set map data source
    Crafty.e('2D, Canvas, TiledMapBuilder')
        .setMapDataSource(Pudar.getMapDataSource())
        .createWorld(function(map) {

            for (var collision = 0;
                 collision < map.getEntitiesInLayer('collision').length;
                 collision++) {
                map.getEntitiesInLayer('collision')[collision]
                    .addComponent("Collision, Solid")
                    .collision()
                    .attr({z: -1});
            }

            for (var overlay = 0;
                 overlay < map.getEntitiesInLayer('overlay').length;
                 overlay++) {
                map.getEntitiesInLayer('overlay')[overlay]
                    .attr({z: 6});
            }
        });

    var items = [];
    for (var i = 0; i < items_json.length; i++) {
        var item = items_json[i];
        items.push(Crafty.e(item.itemName)
            .attr({
                x: item.x * TILE_SIZE,
                y: item.y * TILE_SIZE,
                z: 4
            })
            .collision());
    }

    // player
    var player = Crafty.e('Player, PlayerSprite, Collision, SpriteAnimation')
        .fourway(3)
        .attr({x: 240, y: 432, z: 5})
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
            var hitObjects = this.hit('Solid');
            if (hitObjects) {
                //console.log(hitObjects);
                this.attr({x: from.x, y:from.y});
            }
        })

    Crafty.bind('KeyUp', function(e) {
        if (e.key == 88) {
            if (player.currentItem == 'none') {
                for (var j = 0; j < items.length; j++) {
                    var itemsTouching = player.hit('Item');
                    if (itemsTouching) {
                        var itemTouching = itemsTouching[0].obj;
                        itemDisplay.changeItem(itemTouching.spriteName);
                        player.currentItem = itemTouching.itemName;
                        itemTouching.destroy();
                    }
                }
            } else {
                var tileX = player.x + (TILE_SIZE / 2);
                var tileY = player.y + (TILE_SIZE);
                items.push(Crafty.e(player.currentItem)
                    .attr({
                        x: tileX,
                        y: tileY,
                        z: 4
                    })
                    .collision());
                player.currentItem = 'none';
                itemDisplay.removeItem();
            }
        }
        if (e.key == 67) {
            // Use item
        }
    });

    player.animate("stand", -1)
    Crafty.viewport.follow(player);
});
