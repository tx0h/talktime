
const express = require('express')
const app = express()
const port = 3000

buttonTempl = `<span id="X" class="btn"><button class="btnstyle"><b><span id="name">NAME</span></b><br><i>current time: <span id="ct">00:00:00</span><br>total time: <span id="tt">00:00:00</span></button></span>`;

app.use('/files', express.static('files'));
app.get('/', (req, res) => {
	res.write(`
<!DOCTYPE html>
	<html>

	<head>
		<style>
			input {
				background-color: #2f2f2f;
				color: aquamarine;
				border-color: #4189a2;
				border-style: solid;
				border-width: 3px;
			}
			.btnstyle {
				background-color: #2f2f2f;
				color: aquamarine;
		    	white-space: normal;
		    	text-align: left;
				width: 250px;
				padding: 5px;
				margin: 5px;
				border-color: #4189a2;
				border-style: solid;
				border-width: 3px;
			}
			body {
				color: aquamarine;
				background-color: #222;
				font-family: sans;
			}
		</style>
	</head>

	<body>
		<div>
			<span>Add new talker: </span><span> <input type="text" id="person"></input></span>
			<span id="stopBtn" class="stopbtn">
				<button class="btnstyle" style="width: auto"><b>STOP TIMER</b></button>
			</span>
			<span id="resetBtn" class="resetbtn">
				<button class="btnstyle" style="width: auto"><b>RESET</b></button>
			</span>
			<span style="float: right; margin-top: 13px">Total time: <span id="totalTime">00:00:00</span></span>
			<br>
			<hr>
			<br>
		</div>
		<div class="btnContainer">
	`);

	res.write(`
		</div>
	</body>
	<script src="/files/jquery-1.12.4.min.js"></script>
	`);

	res.write(`
	<script>
		var counter = 0;
		var startTime;

		function talkerTimer(ct, tt) {
			var oldct = new Date('1970-01-01T' + ct.innerText + 'Z').getTime() / 1000;
			var calcNow = Math.round(new Date()) - startTime;
			ct.innerText = new Date(calcNow).toISOString().substr(11, 8);
			tt.innerText = new Date(oldtt + calcNow).toISOString().substr(11, 8);
		};

		document.addEventListener("DOMContentLoaded", function (event) {
			var ct;
			var tt;
			var timerRef;

			// stop old talker timer, activate a new talkr timer
			jQuery(document).on("click", ".btn", function(e) {
				var name = jQuery(this).find('span[id = "name"]')[0];

				ct = jQuery(this).find('span[id = "ct"]')[0];
				tt = jQuery(this).find('span[id = "tt"]')[0];

				ct.innerText = "00:00:00";
				oldtt = new Date('1970-01-01T' + tt.innerText + 'Z').getTime();
				startTime = Math.round(new Date());

				clearInterval(timerRef);
				timerRef = setInterval(talkerTimer, 500, ct, tt);
			});

			jQuery(document).on("click", ".stopbtn", function(e) {
				clearInterval(timerRef);
				if(ct) {
					ct.innerText = "00:00:00";
				}
			});

			jQuery(document).on("click", ".resetbtn", function(e) {
				clearInterval(timerRef);
				jQuery("span#ct").each(function() {
					this.innerText = "00:00:00"
				});
				jQuery("span#tt").each(function() {
					this.innerText = "00:00:00"
				});
				jQuery("#totalTime").text("00:00:00");
			});

			// add new talker button
			jQuery("input#person").keypress(function(e) {
				if(e.keyCode == 13) {
					var s = '${buttonTempl}';
					s = s.replace("X", counter++);
					s = s.replace("NAME", this.value);
					jQuery(".btnContainer").append(s);
					this.value = "";
				}
			});

			setInterval(function() {
				var total = 0;
				jQuery('span[id = "tt"]').each(function() {
					total += new Date('1970-01-01T' + this.innerText + 'Z').getTime();
				});
				jQuery("#totalTime").text(new Date(total).toISOString().substr(11, 8));
			}, 1000);

		});
		</script>
	</html>
	`);
	res.end();
});


app.listen(port, () => {
  console.log(`talk timer on http://localhost:${port}`)
})

