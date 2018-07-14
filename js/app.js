// Create a list that holds all of your cards
let cardsName = ['fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube', 'fa fa-anchor', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-diamond', 'fa fa-bomb', 'fa fa-leaf', 'fa fa-bomb', 'fa fa-bolt', 'fa fa-bicycle', 'fa fa-paper-plane-o', 'fa fa-cube'];
let cards = [];
let openCards = [];

// initial states
let sec = 0,
    min = 0,
    moves = 0,
    stop = 0;
let stars = 3;

// timer Self-Executing Anonymous Functions
(function() {
    setInterval(function() {
        if (moves !== 0 && stop !== 1) {
            sec++;

            if (sec === 60) {
                min++;
                sec = 0;
            }
            $('.timer').html(`${sec}sec`);

            if (min > 0) {
                $('.timer').html(`${min}min ${sec}sec`);
            }
        }
    }, 1000);
})();

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// add each card's HTML to the page
$('.deck').each(function() {
    $(this).find('li').each(function() {
        cards.push($(this));
    });
});

// shuffle the list of cards using the provided "shuffle" method
cardsName = shuffle(cardsName);

// loop through each card and create its HTML
let cardNumber = 0;
$('.deck').each(function() {
    $(this).find('li').find('i').each(function() {
        $(this).removeAttr('class');
        $(this).addClass(cardsName[cardNumber]);
        cardNumber++;
    });
});

// remove properties function; hides card
removeProperties = function(prop) {
    setTimeout(function() {
        prop.removeClass('show open animated pulse');
        openCards[0].removeClass('show open animated pulse');
        openCards = [];
    }, 600);
};

/// main onclick handler
showCardOnClick = function(clickEvent) {
    clickEvent.on('click', function() {
        // add moves
        moves++;

        // remove stars after moves
        if (moves === 16) {
        } else if (moves > 24 && moves <= 30) {
            $('section ul li').hide();
            $('section ul').append('<li><i class="fa fa-star"></i></li>');
            $('section ul').append('<li><i class="fa fa-star"></i></li>');
            stars = 2;
        } else if (moves > 30) {
            $('section ul li').hide();
            $('section ul').append('<li><i class="fa fa-star"></i></li>');
            stars = 1;
        }

        // flips card when they are same; when they match
        $('.moves').html(moves);
        if ((openCards.length % 2) === 0) {
            $(this).addClass('show open animated pulse');
            $(this).off('click');
            openCards.push($(this));
        } else if (openCards.length !== 0) {
            $(this).addClass('show open animated pulse');

            // allows to flip the cards till it finds all pairs
            let self = $(this);
            for (let i = 0; i < openCards.length; i++) {
                if (openCards[i].find('i').attr('class') === self.find('i').attr('class')) {
                    self.removeClass('animated wobble');
                    self.addClass('show match animated rubberBand');
                    openCards[i].removeClass('animated pulse');
                    openCards[i].addClass('show match animated rubberBand');
                    console.log('match');
                    $(this).off('click');
                    openCards = [];
                    break;
                } else {
                    self.addClass('show open animated pulse');
                    removeProperties(self);
                    openCards[0].on('click', showCardOnClick(openCards[0]));
                    console.log('no match');
                }
            }
        }

        // sweetalert2 instead kind of modal on finding all pairs
        if ($('.deck').find('.match').length === 16) {
            setTimeout(function() {
                $('.deck').each(function() {
                    swal({
                        title: 'Congratulations! You Won!',
                        type: 'success',
                        text: `in ${min} minute(s) and ${sec} seconds with ${moves} Moves and ${stars} Star(s) Woooooo!`,
                        allowOutsideClick: false,
                        showCancelButton: true,
                        confirmButtonText: 'Play Again',
                        confirmButtonColor: '#02ccba',
                        cancelButtonText: 'Close',
                        cancelButtonColor: '#6c6c6c'
                    }).then(function() {
                        location.reload();
                    }, function(dismiss) {
                        console.log('Yes');
                    });
                });
            }, 300);
            stop = 1;
        }
    });
};

// flips the cards on click
for (let i = 0; i < cards.length; i++) {
    cards[i].on('click', showCardOnClick(cards[i]));
}

// reset game
$('.restart').click(function() {
  location.reload(true);
});
