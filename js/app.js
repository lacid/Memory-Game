// Create a list that holds all of your cards
let cardsName = ['fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube', 'fa fa-anchor', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-diamond', 'fa fa-bomb', 'fa fa-leaf', 'fa fa-bomb', 'fa fa-bolt', 'fa fa-bicycle', 'fa fa-paper-plane-o', 'fa fa-cube'];
let cards = [];
let openCards = [];

// timer https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers
let time = 0;
let stop = 0;
window.onload = function() {
    setInterval(function() {
        if (stop !== 1) {
            time++;
            $('.timer').html(time);
        }
    }, 1000);
};

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

// Display the cards on the page
//   - shuffle the list of cards using the provided "shuffle" method below
//   - loop through each card and create its HTML
//   - add each card's HTML to the page

$('.deck').each(function() {
    $(this).find('li').each(function() {
        cards.push($(this));
    });
});

cardsName = shuffle(cardsName);

let cardNumber = 0;
$('.deck').each(function() {
    $(this).find('li').find('i').each(function() {
        $(this).removeAttr('class');
        $(this).addClass(cardsName[cardNumber]);
        cardNumber++;
    });
});

let temp = 0;
$('.deck').each(function() {
    $(this).find('li').find('i').each(function() {
        let tempClass = $($(cards[temp][0]).find('i')[0]).attr('class');
        $(this).removeAttr('class');
        $(this).addClass(tempClass);
        temp++;
    });
});

 // set up the event listener for a card. If a card is clicked:
 //  - display the card's symbol (put this functionality in another function that you call from this one)
 //  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 //  - if the list already has another card, check to see if the two cards match
 //    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 //    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 //    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 //    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
let moves = 0,
    stars = 3;

removeProperties = function(prop) {
    setTimeout(function() {
        prop.removeClass('show open animated pulse');
        openCards[0].removeClass('show open animated pulse');
        openCards = [];
    }, 400);
};

showCardOnClick = function(clickEvent) {
    clickEvent.on('click', function() {
        moves++;
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
        $('.moves').html(moves);
        if ((openCards.length % 2) === 0) {
            $(this).addClass('show open animated pulse');
            $(this).off('click');
            openCards.push($(this));
        } else if (openCards.length !== 0) {
            $(this).addClass('show open animated pulse');

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
        if ($('.deck').find('.match').length === 16) {
            setTimeout(function() {
                $('.deck').each(function() {
                    swal({
                        title: 'Congratulations! You Won!',
                        type: 'success',
                        text: `in ${time} Seconds with ${moves} Moves and ${stars} Stars`,
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

for (let i = 0; i < cards.length; i++) {
    cards[i].on('click', showCardOnClick(cards[i]));
}

// reset game
$('.restart').click(function() {
  location.reload(true);
});
