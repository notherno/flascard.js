var flashCard = function() {

	// defining function to play audios
	$.fn.audioplay = function () {
		(this)[0].play();
	}
	$.fn.audiostop = function () {
		(this)[0].pause();
		(this)[0].currentTime = 0;
	}

	$('#soundbutton').click(function () {
		$('audio.question').audiostop();
		$('audio.answer').audiostop();

		if ($('#flashcard').data('flipped')) {
			$('audio.answer').audioplay();
		} else {
			$('audio.question').audioplay();
		}
	});

	// Card flipping
	var card = $('#flashcard');
	$('.panel.answer').removeClass('invisible');
	card.data('flipped', false);
	card.quickFlip();
	card.bind({
		click: function() {
			card.quickFlipper();
			if (card.data('flipped')) {
				// Question
				card.data('flipped', false);
				$('audio.answer').audiostop();
				$('audio.question').audioplay();
			} else {
				// Answer
				card.data('flipped', true);
				$('audio.question').audiostop();
				$('audio.answer').audioplay();
			}
		}
	});
};

$(function(){
	flashCard();
});