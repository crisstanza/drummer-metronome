function DrummerMetronome() {
	this.beat = null;
	this.beatNotes = null;
	this.audioContext = null;
	this.SOUNDS = null;
	this.TIMER = null;
	this.display = document.getElementById('metronome-display');
	this.displayCurrentBeat = document.getElementById('metronome-display-current-beat');
	this.btUspeedUp = document.getElementById('bt-speed-up');
	this.btSpeedDown = document.getElementById('bt-speed-down');
	this.btPlay = document.getElementById('bt-play');
}

(function() {

	DrummerMetronome.prototype.btPlay_Click = function(event) {
		var bt = event.target;
		if (bt.getAttribute('class') == 'arrow-right') {
			bt.setAttribute('class', 'arrow-right-square');
			this.start(event);
		} else {
			bt.setAttribute('class', 'arrow-right');
			this.stop(event);
		}
	};

	DrummerMetronome.prototype.btSpeedUp_Click =function(event) {
		this.display.innerText++;
	};

	DrummerMetronome.prototype.btSpeedDown_Click = function(event) {
		this.display.innerText--;
	};

	DrummerMetronome.prototype.start = function(event) {
		var MUL = 2;
		if (this.displayCurrentBeat.value == '') {
				this.beat = -4 * MUL;
		} else {
			var currentBeat = this.displayCurrentBeat.value * 1;
			if (currentBeat >= this.beatNotes.length) {
				this.beat = -4 * MUL;
			} else {
				this.beat = this.displayCurrentBeat.value * 1;
			}
		}
		this.play(event);
		this.TIMER = setInterval(
			function() {
				this.play(event);
			}, 60000 / (this.display.innerText * MUL)
		);
	};

	DrummerMetronome.prototype.stop = function(event) {
		clearInterval(this.TIMER);
	};
	DrummerMetronome.prototype.play = function(event) {
		this.displayCurrentBeat.value = this.beat;
		var bufferSource = this.audioContext.createBufferSource();
		bufferSource.buffer = null;
		if (this.beat < 0) {
			if (this.beat % 2 == 0) {
				bufferSource.buffer = this.SOUNDS[4];
			}
		} else {
			var beatNote = this.beatNotes[this.beat];
			if (beatNote) {
				var note = beatNote.replace(/\/\*.*\*\//, '');
				if (note != 0) {
					bufferSource.buffer = this.SOUNDS[note*1];
				}
			} else {
				this.btPlay_Click(event);
			}
		}
		if (bufferSource.buffer != null) {
			bufferSource.connect(this.audioContext.destination);
			bufferSource.start();
		}
		this.beat += 1;
	};
	DrummerMetronome.prototype.init = function(event) {
		this.beatNotes = document.getElementById('music-pre').getAttribute('data-beats').split(',');
		this.audioContext = new AudioContext() || new webkitAudioContext();
		this.SOUNDS = [];
		function onDecoded(buffer, note) {
			this.SOUNDS[note] = buffer;
		}
		function loadAudio(note) {
			var request = new XMLHttpRequest();
			request.open('GET', './audio/_' + note + '.wav.dat', true);
			request.responseType = 'arraybuffer';
			request.onload = function() {
				this.audioContext.decodeAudioData(request.response, function(buffer) { onDecoded(buffer, note); });
			};
			request.send();
		}
		loadAudio(1);
		loadAudio(4);
		loadAudio(8);
		loadAudio(10);
	};

	function init(event) {
		var musicPre = document.getElementById('music-pre');
		var musicLinks = musicPre.querySelectorAll('a');
		for (var i = 0 ; i < musicLinks.length ; i++) {
			var musicLink = musicLinks[i];
			musicLink.addEventListener('dblclick', link_DoubleClick);
		}
		// this.btPlay.addEventListener('click', this.btPlay_Click);
		// this.btUspeedUp.addEventListener('click', this.btSpeedUp_Click);
		// this.btSpeedDown.addEventListener('click', this.btSpeedDown_Click);
	}

// // // // // // // // // // // // // // // // // // // // // // // // //

	function link_DoubleClick(event) {
		var link = event.target
		var beatNote = link.getAttribute('title');
		if (metronome) {
			if (beatNote != '') {
				this.beat = beatNote;
				this.displayCurrentBeat.value = beatNote;
			}
		}
	}

// // // // // // // // // // // // // // // // // // // // // // // // //

	function window_Load(event) {
		init(event);
	}

// // // // // // // // // // // // // // // // // // // // // // // // //

	window.addEventListener('load', window_Load);

})();
