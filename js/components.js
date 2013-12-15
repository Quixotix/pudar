// The Actor component is a component that includes the 2D and Canvas
// components.
Crafty.c('Actor', {
    init: function() {
        this.requires('2D, Canvas');
    }
});

Crafty.c('HUD', {
    init: function() {
        this.requires('Actor');
        this.bind('EnterFrame', this.adjustPosition);
    },

    fixedPosition: function(x, y) {
        this.fixedX = x;
        this.fixedY = y;
    },

    adjustPosition: function() {
        this.x = this.fixedX - Crafty.viewport.x;
        this.y = this.fixedY - Crafty.viewport.y;
    }
});

// This is the little box that will show the item you currently hold inside of
// it.
Crafty.c('ItemBox', {
    init: function() {
        this.requires('HUD, spr_item_box');
    }
});

// This is the sprite that goes inside the item box to display the icon of the
// currently held item
Crafty.c('ItemDisplay', {
    init: function() {
        this.requires('HUD, spr_no_item');
        this.currentItemSpriteName = 'spr_no_item';
    },

    changeItem: function(item_sprite_name) {
        this.removeComponent(this.currentSpriteName);
        this.currentItemSpriteName = item_sprite_name;
        this.addComponent(this.currentItemSpriteName);
    },

    removeItem: function() {
        this.removeComponent(this.currentSpriteName);
        this.currentItemSpriteName = 'spr_no_item';
        this.addComponent(this.currentItemSpriteName);
    }
});

// Component for actual items
Crafty.c('Item', {
    init: function() {
        this.requires('Actor, Collision')
        .collision();
    },

    setSpriteName: function(item_sprite_name) {
        this.spriteName = item_sprite_name;
    }
});

// The player component is just a component that includes the Actor, Fourway
// movement, and player sprite components.
Crafty.c('Player', {
    init: function() {
        this.requires('Actor, Fourway, spr_player, Collision')
            .fourway(4)
            // smaller collision rect for some overlap
            .collision([8,8],[8,24],[24,24],[24,8])
            .bind('Moved', function(from) {
                // collision detection with tiles from the "Collision" layer
                if (this.hit('Collision')){
                    this.attr({x: from.x, y:from.y});
                }
                this.z = Math.floor(this._y + this._h);
            })
    },
});
