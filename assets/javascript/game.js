//Variables

//used to set interval
var timeCount;

var questionTime;

var answerTime;

//keeps track of right answers
var right;

//keeps track of wrong answers
var wrong;

//keeps track of unanswered questions
var unanswered;

var questionOrder = [];

var answerOrder = [];

//counter will keep track of current index in order.
var counter;

//trivia counter will cycle through different elements of trivia object
var triviaCounter;

var clock;

var images = ["assets/images/jumpman.gif","assets/images/tvGame.gif","assets/images/pauline.gif"
,"assets/images/doki.gif","assets/images/wario.gif","assets/images/waluigi.gif","assets/images/mother.gif"
,"assets/images/nintendo","assets/images/game&watch.gif","assets/images/iwata.gif"];

//trivia object stores arrays filled with a question,
//3 bogus questions and an answer. 
//at the end of the array is stored a number that refers to the order of questions
var trivia = {
	q1 : ["What is Mario's original name?","Carl","Jeff","Mario","Jumpman","assets/images/jumpman.gif"],
	q2 : ["What is Nintendo's first home console?","NES","Master System","Nintendo 64","Color TV-Game 6","assets/images/tvGame.gif"],
	q3 : ["Who did Donkey Kong kidnap in Donkey Kong?","Princess Peach","Princess Toadstool","Princess Daisy","Pauline","assets/images/pauline.gif"],
	q4 : ["Why is Super Mario Bros. 2 so strange?","The 80's","Mario got drunk","Acid?","Doki Doki Panic","assets/images/doki.gif"],
	q5 : ["What is Wario's food of choice?","Money","Beets","Apples","Garlic","assets/images/wario.gif"],
	q6 : ["What game had Waluigi make his debut?","Mario Party 3","Mario Kart 64","Banjo Kazooie","Mario Tennis","assets/images/waluigi.gif"],
	q7 : ["Which fans does Nintendo hate the most?","Metroid","F-Zero","Animal Crossing","Mother/Earthbound","assets/images/mother.gif"],
	q8 : ["What year was Nintendo started?","1981","1976","1964","1889","assets/images/nintendo.gif"],
	q9 : ["Why was the Game & Watch called that?","You can watch it","Why not?","Nintendo","It is also a clock","assets/images/game&watch.gif"],
	q10 : ["What does Nintendo mean?","We are supreme","Boo sega","Games are fun","Leave luck to heaven","assets/images/iwata.gif"]
};

// Functions

//ranOrder chooses a random order for my 10 questions to be asked every time
//The trivia player cannot just memorize the order of questions, but must learn every answer.
//generalized to take a length, ranOrder will create an array that is length long starting with 1 going to length. 
function ranOrder(length)
{
	var order = [];
	while (order.length < length)
	{
		var ranNum = Math.floor(Math.random() * length) +1;
		if(order.indexOf(ranNum) === -1)
		{
			order.push(ranNum);
		}
	}
	return order;
} 

//displayQuestion displays a random question chosen from trivia object
//the possible answers are displayed in a random order
//triviaCounter increases as the program goes from question to question
//ensuring a new question each time.  
function displayQuestion()
{
	answerOrder = ranOrder(4);
	$(".question").show();
	$("#timer").show();
	$(".answer").show();
	$(".response").hide();
	$(".question").text(trivia["q"+questionOrder[triviaCounter]][0]);
	$(".answer").each(function(i)
	{
		$(this).text(trivia["q"+questionOrder[triviaCounter]][answerOrder[i]]);
	});

	answerTime = setTimeout(showAnswer,10000);
}

//showAnswer first checks if the argument passed to it is true.
//if it is then the player chose the correct answer and is rewarded with Yup.
//triviaCounter is increased to move to the next question.
//when trivia counter is 10 no questions are left and the results screen is displayed
//clock is set to 11 to account for the 1 second spent on the answer screen.
function showAnswer(isCorrect)
{
	clock =12;
	if(isCorrect === 1)
	{
		$(".response").show()
		$(".response").html("<h1 class='text-center'>YUP!</h1>");
		$("#musicGame")[0].pause();
		$("#musicRight")[0].play();
		setTimeout(playMusic,2000);
	}
	else if(isCorrect === -1)
	{
		$(".response").show()
		$(".response").html("<h1 class='text-center'>NOPE!</h1>");
		$("#musicGame")[0].pause();
		$("#musicWrong")[0].play();
		setTimeout(playMusic,3000);
	}
	else if(isCorrect === 0)
	{
		$(".response").show()
		$(".response").html("<h1 class='text-center'>OUTTA TIME!</h1>");
		$("#musicGame")[0].pause();
		$("#musicTime")[0].play();
		setTimeout(playMusic,2000);
	}
	
	$(".answer").hide();
	$("#timer").hide();
	$(".question").text("The answer was " + trivia["q"+questionOrder[triviaCounter]][4]);
	var string = images[0];
	$(".question").append("<br/><img class='center-block gif' src=/>");
	$(".gif").attr("src",trivia["q"+questionOrder[triviaCounter]][5]);
	triviaCounter++;
	if(triviaCounter === 10)
	{
		setTimeout(showResults,3000);
		return;
	}
	questionTime = setTimeout(displayQuestion,3000);
}

//Show results just hides html elements and adds new ones to display results
function showResults()
{
	$("#musicGame")[0].pause();
	$("#musicEnd")[0].play();
	$(".answer").hide();
	$("#timer").hide();
	clear();
	$(".results").show();
	$(".response").hide();
	$(".question").text("Results:");
	$(".results").append("<h2 class='text-center'>Correct: "+right+"</h2>");
	$(".results").append("<h2 class='text-center'>Wrong: "+wrong+"</h2>");
	$(".results").append("<h2 class='text-center unanswered'>Unanswered: "+unanswered+"</h2>");
	$(".results").append("<button class='reset center-block'>Play Again</button>");
}

//Timer is independent, but in sync with the various setTimeouts,
//it is used to keep track of time to answer questions. 
//there is also logic for if the player leaves a question unanswered.
function timer() 
{
	$("#timer").text("Time Left: " + clock + "s");
	clock--;

	if(clock === -1)
	{
		unanswered++;
		clear();
		setTimeout(showAnswer(0),1000);
		timeCount = setInterval(timer,1000);
	}
}

//start simply starts the game.
function start()
{
	$(".start").hide();
	setTimeout(displayQuestion,5000);
	setTimeout(startTimer,4000);
	setTimeout(playMusic,5000);
	$("#musicStart")[0].play();
}

function startTimer()
{
	timeCount = setInterval(timer, 1000);
}

function playMusic()
{
	$("#musicGame")[0].play();
}

//initialize resets game elements to their state at the beginnning of the game.
function initialize()
{
	$("#musicGame")[0].pause();
	$("#musicGame")[0].currentTime = 0;
	$("#musicEnd")[0].pause();
	$("#musicEnd")[0].currentTime = 0;
	clear();
	$(".start").show();
	$(".answer").hide();
	$(".question").hide();
	$("#timer").hide();
	$(".response").hide();
	$(".results").empty();
	right = 0;
	wrong = 0;
	unanswered =0;
	counter =0;
	clock = 10;
	triviaCounter = 0;
	questionOrder = ranOrder(10);

}

//clear is used to clear timers when necessary
function clear()
{
	clearTimeout(questionTime);
	clearTimeout(answerTime);
	clearInterval(timeCount);
}

//clicked function looks whether the right or wrong answer was chosen
//button is $(this), which is one of the possible answers clicked. 
//clicked clears out timers and restarts the counting timer. 
function clicked(button)
{
	//correct guess
	if (button.text() === trivia["q"+questionOrder[triviaCounter]][4])
	{
		right++;
		button.text("YUP!");
		clear();
		showAnswer(1);
		clock = 12;
		timeCount = setInterval(timer,1000);
	}

	//incorrect guess
	else if (button.text() !== trivia["q"+questionOrder[triviaCounter]][4])
	{
		wrong++;
		button.text("NOPE!");
		clear();
		showAnswer(-1);
		clock = 12;
		timeCount = setInterval(timer,1000);
	}
}

//this is where the code for pressing various buttons lives.
$(document).ready(function() 
{	
	//Creates hover effect
	$(".answer").hover(
	function()
	{	
		$(this).addClass("hovered");
	},
	function() 
	{
		$(this).removeClass("hovered");
	});

	initialize();

	//starts trivia game
	$(".start").click(start);
	
	//When you click an answer the answer that was picked is passed into
	//clicked as an argument.
	$(".answer").click(function()
	{
		clicked($(this));
	});

	//when play again button is pressed the game resets
	$(document).on("click", ".reset", function()
	{
		clear();
		initialize();
	});
});	













