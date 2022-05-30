const normal = document.getElementById('normal')
const hacker = document.getElementById('hacker')
const hackerpp = document.getElementById('hackerpp')
const title = document.getElementById('title')
const backbtn = document.getElementById('back-btn')

const leaderboardbtn = document.getElementById('leaderboard-btn')
const closebtn = document.getElementById('close-btn')
const bgoverlay = document.getElementById('bg-overlay')

const normalgameboard = document.getElementById('normal-game-board')
const normalgrid = document.getElementsByClassName('normal-col')

const hackergameboard = document.getElementById('hacker-game-board')
const hackergrid = document.getElementsByClassName('hacker-col')

const start = document.getElementById('start-btn-normal')

const score = document.getElementById('score')

const custommodel = document.getElementById('custom-model-main')
const positions = document.getElementsByClassName('ld')
const timerElm = document.getElementById('timer')
var timer;
var timeLeft = 60;


normal.addEventListener('click', function (e) {
    normalmode()
    function normalmode() {
        normal.style.display = 'none'
        hacker.style.display = 'none'
        hackerpp.style.display = 'none'
        title.innerHTML = 'Normal Mode'
        title.style.fontFamily = 'Amatic SC';
        backbtn.style.display = 'block'
        normalgameboard.style.display = 'flex'
        start.style.display = 'flex'
        let started = false;
        let userClicked = [];
        let gamePattern = [];
        let level = 0
        start.onclick = function (e) {
            start.style.display = 'none'
            score.style.display = 'block'
            score.innerHTML = 'Level : 0'
            if (!started) {
                nextSequence();
                started = true;
            }
            normalgameboard.onclick = function (e) {
                var userChosen = e.target.id;
                userClicked.push(userChosen);
                checkNormal(userClicked.length - 1);
            };
        };
    
        function checkNormal(currentLevel) {
            if (userClicked.some(r=> gamePattern.includes(r)) || (gamePattern.length == userClicked.length)) {
                if (gamePattern.sort().join(',') === userClicked.sort().join(',')) {
                        if (level>0) {
                            score.innerHTML = 'Level : ' + (level);
                        }
                        setTimeout(function () {
                            nextSequence();
                        }, 1000);
                } 
                else {
                    setTimeout(function () {
                        score.innerHTML = 'Game Over! Your Score is ' + (level-1);
                    }, 200);
                    normalmode();
                }
            }
            else if (userClicked.length > gamePattern.length) {
                setTimeout(function () {
                    score.innerHTML = 'Game Over! Your Score is ' + (level-1);
                }, 200);
                normalmode();
            }
        }
    
        function nextSequence() {
            userClicked = [];
            level++;
            var randomNumber = Math.floor(Math.random() * 16);
            gamePattern.push(randomNumber);
            var i = 0;
            var interval = setInterval(function () {
                if (i < gamePattern.length) {
                    var tile = document.getElementById(gamePattern[i]);
                    tile.style.backgroundColor = '#fff';
                    setTimeout(function () {
                        tile.style.backgroundColor = '#000';
                    }, 400);
                    i++;
                }
                else {
                    clearInterval(interval);
                }
            }, 450);
        }
    }
    backbtn.addEventListener('click', function (e1) {
            normal.style.display = 'block'
            hacker.style.display = 'block'
            hackerpp.style.display = 'block'
            backbtn.style.display = 'none'
            leaderboardbtn.style.display = 'none'
            title.innerHTML = 'Piano Tiles'
            title.style.fontFamily = 'Pacifico';
            hackergameboard.style.display = 'none'
            normalgameboard.style.display = 'none'
            start.style.display = 'none'
            score.style.display = 'none'
            start.innerHTML = 'Start'
            timerElm.style.display = 'none'
    });
});


hacker.addEventListener('click', function (e) {
        normal.style.display = 'none'
        hacker.style.display = 'none'
        hackerpp.style.display = 'none'
        title.innerHTML = 'Hacker Mode'
        title.style.fontFamily = 'Amatic SC';
        backbtn.style.display = 'block'
        leaderboardbtn.style.display = 'block'
        normalgameboard.style.display = 'none'
        hackergameboard.style.display = 'flex'
        start.style.display = 'flex'
        let started = false;
        let level = 0;
        let gamePattern = [];
        let userClickedPattern = [];
        if (localStorage.length > 0) {
            var localScoreList = JSON.parse(localStorage.scoreList)
            for (let i = 0; i < 5; i++) {
                positions[i].innerHTML = (i+1) + '. ' + localScoreList[i];
            }
        }
        if (localStorage.length == 0) {
            localScoreList = [];
        }
        if (!started) {
            start.onclick = function (e) {
                start.style.display = 'none'
                timerElm.style.display = 'block'
                score.style.display = 'block'
                startTimer();
                score.innerHTML = 'Score: ' + level;
                nextSequence();
                started = true;
                hackergameboard.onclick = function (e) {
                    var userChosenColour = e.target.id;
                    userChosenNum = parseInt(userChosenColour.split('-').pop());
                    userClickedPattern.push(userChosenNum);
                    checkAnswer(userClickedPattern.length - 1);
                };
            };
        }       
        function checkAnswer(currentLevel) {
            if (gamePattern[currentLevel] === Number(userClickedPattern[currentLevel])) {
                playSound('correct')
                if (userClickedPattern.length === gamePattern.length){
                    if (level>0) {
                        score.innerHTML = 'Score: ' + ((level-1)*10 + (timeLeft));
                    }
                    nextSequence();
                }
            } 
            else {
                playSound('wrong')
                console.log('game over');
                score.innerHTML = 'Game Over! Your Score is ' + ((level-1)*10 + (timeLeft));
                localScoreList.push(((level-1)*10 + (timeLeft)));
                localScoreList.sort();
                localScoreList.reverse();
                cancelTimer();
                for (let i = 0; i < localScoreList.length; i++) {
                    localStorage.setItem('scoreList', JSON.stringify(localScoreList));
                }
                localScoreList = JSON.parse(localStorage.scoreList)
                for (let i = 0; i < 5; i++) {
                    positions[i].innerHTML = (i+1) + '. ' + localScoreList[i];
                }
                leaderboardbtn.click();
                timerElm.style.display = 'none'
                start.style.display = 'flex'
                startOver();
            }
    
        function startOver() {
            cancelTimer();
            timeLeft = 60;
            level = 0;
            userClickedPattern = [];
            gamePattern = [];
            started = false;
        }

    }
   
    function updateTimer() {
        timeLeft = timeLeft - 1;
        if(timeLeft >= 0)
            timerElm.innerHTML = 'Time left : ' + timeLeft;
        else {
            playSound('wrong')
            console.log('game over');
            score.innerHTML = 'Game Over! Your Score is ' + ((level-1)*10 + (timeLeft));
            localScoreList.push(((level-1)*10 + (timeLeft)));
            localScoreList.sort();
            localScoreList.reverse();
            cancelTimer();
            for (let i = 0; i < localScoreList.length; i++) {
                localStorage.setItem('scoreList', JSON.stringify(localScoreList));
            }
            localScoreList = JSON.parse(localStorage.scoreList)
            for (let i = 0; i < 5; i++) {
                positions[i].innerHTML = (i+1) + '. ' + localScoreList[i];
            }
            leaderboardbtn.click();
            timerElm.style.display = 'none'
            start.style.display = 'flex'
            startOver();
        }
    }
    
    function startTimer() {
        timer = setInterval(updateTimer, 1000);
        updateTimer();
    }

    function cancelTimer() {
        clearInterval(timer);
    }

    function startOver() {
        cancelTimer();
        timeLeft = 60;
        level = 0;
        userClickedPattern = [];
        gamePattern = [];
        started = false;
    }
    
    function nextSequence() {
        userClickedPattern = [];
        level++;
        var randomNumber = Math.floor(Math.random() * 36);
        gamePattern.push(randomNumber);
        blink(gamePattern);
    }

    function playSound(name) {
        var audio = new Audio("./assets/" + name + ".mp3");
        audio.play();
    }

    function blink(gamePattern) {
        var i = 0;
        var interval = setInterval( () => {
            if (i < gamePattern.length) {
                var tile = document.getElementById('hacker-' + gamePattern[i]);
                tile.style.backgroundColor = '#fff';
                setTimeout(function () {
                    tile.style.backgroundColor = '#000';
                }, 400);
                i++;
            }
            else {
                clearInterval(interval);
            }
        }, 550);
    }

        
    leaderboardbtn.onclick = function () { 
        custommodel.classList.add('model-open')
    }

    closebtn.onclick = function () { 
        custommodel.classList.remove('model-open')
    }

    bgoverlay.onclick = function () { 
        custommodel.classList.remove('model-open')
    }

    backbtn.addEventListener('click', function (e1) {
            normal.style.display = 'block'
            hacker.style.display = 'block'
            hackerpp.style.display = 'block'
            backbtn.style.display = 'none'
            leaderboardbtn.style.display = 'none'
            title.innerHTML = 'Piano Tiles'
            title.style.fontFamily = 'Pacifico';
            hackergameboard.style.display = 'none'
            normalgameboard.style.display = 'none'
            start.style.display = 'none'
            score.style.display = 'none'
            start.innerHTML = 'Start'
            timerElm.style.display = 'none'
            cancelTimer();
            startOver();
    });
});

hackerpp.addEventListener('click', function (e) {
    normal.style.display = 'none'
    hacker.style.display = 'none'
    hackerpp.style.display = 'none'
    title.innerHTML = 'Hacker Mode ++'
    title.style.fontFamily = 'Amatic SC';
    backbtn.style.display = 'block'

    backbtn.addEventListener('click', function (e1) {
        normal.style.display = 'block'
        hacker.style.display = 'block'
        hackerpp.style.display = 'block'
        backbtn.style.display = 'none'
        leaderboardbtn.style.display = 'none'
        title.innerHTML = 'Piano Tiles'
        title.style.fontFamily = 'Pacifico';
        hackergameboard.style.display = 'none'
        normalgameboard.style.display = 'none'
        start.style.display = 'none'
        score.style.display = 'none'
        start.innerHTML = 'Start'
        timerElm.style.display = 'none'
    });
});
