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
        this.requires('HUD, NoItemSprite');
        this.currentItemSpriteName = 'NoItemSprite';
    },

    changeItem: function(item_sprite_name) {
        this.removeComponent(this.currentItemSpriteName);
        this.currentItemSpriteName = item_sprite_name;
        this.addComponent(this.currentItemSpriteName);
    },

    removeItem: function() {
        this.removeComponent(this.currentItemSpriteName);
        this.currentItemSpriteName = 'NoItemSprite';
        this.addComponent(this.currentItemSpriteName);
    }
});

// Component for actual items
Crafty.c('Item', {
    init: function() {
        this.requires('Actor, Collision');
    },

    setSpriteName: function(itemSpriteName) {
        this.spriteName = itemSpriteName;
    },

    setItemName: function(itemName) {
        this.itemName = itemName;
    }
});

// Player
Crafty.c('Player', {
    init: function() {
        this.requires('Actor, Fourway');
        this.currentItem = 'none';
    }
});

// Sword item
Crafty.c('Sword', {
    init: function() {
        this.requires('Item, SwordSprite');
        this.setItemName('Sword');
        this.setSpriteName('SwordSprite');
    }
});
