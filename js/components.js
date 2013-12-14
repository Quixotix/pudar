// The Actor component is a component that includes the 2D and Canvas
// components.
Crafty.c('Actor', {
    init: function() {
        this.requires('2D, Canvas');
    }
});

// The player component is just a component that includes the Actor, Fourway
// movement, and player sprite components.
Crafty.c('Player', {
    init: function() {
        this.requires('Actor, Fourway, spr_player')
            .fourway(4);
    }
});
