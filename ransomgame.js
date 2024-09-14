let currentStage = 0;
let score = 0;
let timeLeft = 120;
const chatBox = document.getElementById("chatBox");
const choicesElement = document.getElementById("choices");
const scoreDisplay = document.getElementById("scoreDisplay");
const timeRemainingElement = document.getElementById("timeRemaining");
const hackedScreenElement = document.getElementById("hackedScreen");
const endMessageElement = document.getElementById("endMessage");
const failedMessageElement = document.getElementById("failedMessage");
let countdown;
let startTime;
let endTime;
let takenMinutes;

function startChallenge() {
  // Get the logged in user ID
  let userID = localStorage.getItem("loggedInUserID");

  if (!userID) {
     currentStage = 1;
        score = 0;
        timeLeft = 120;
        updateScore();
        startTimer();
        nextStage();
        startTime = new Date();
  } else {
     // Get today's date and format it as dd-mm-yyyy
  let todaysDate = new Date().toISOString().split('T')[0];
  let [year, month, day] = todaysDate.split('-');
  let formattedTodaysDate = `${day}-${month}-${year}`;

  // Define the API URL
  let apiUrl = `https://app.nocodb.com/api/v2/tables/mk27lmgo6fq6u1q/records?offset=0&limit=10&where=(UserID,eq,${userID})~and(Date,eq,${formattedTodaysDate})&viewId=vwtanjh1wqnn2y29&sort=-Score`;

  // Make an AJAX call to the API
  $.ajax({
    url: apiUrl,
    method: 'GET',
    headers: {
      'xc-token': 'v659YuW3iQbnASgtnAmWEB_xuaXHX1cs6-V3Sy8B' // Your actual token here
    },
    success: function(response) {
      // Check if the list is empty
      if (response.list.length > 0) {
        // User has already played today, show a dialog
        alert('You have already played today!');
      } else {
        // List is empty, the user can start the challenge
        currentStage = 1;
        score = 0;
        timeLeft = 120;
        updateScore();
        startTimer();
        nextStage();
        startTime = new Date();
      }
    },
    error: function(error) {
      console.error('Error fetching data:', error);
    }
  });
  }

 
}

function updateScore() {
  scoreDisplay.textContent = `Score: ${score}`;
}

function startTimer() {
  countdown = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeRemainingElement.innerText = `Time: ${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;

    if (timeLeft <= 0) {
      clearInterval(countdown);
      showScaryScreen();
    }
  }, 1000);
}

function typeMessage(element, text, speed = 30) {
  let i = 0;
  element.innerHTML = "";
  const interval = setInterval(() => {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      scrollToBottom();
    } else {
      clearInterval(interval);
      scrollToBottom();
    }
  }, speed);
}

function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

function makeChoice(choice) {
  const choiceText = choicesElement.querySelector(
    `button[onclick="makeChoice('${choice}')"]`
  ).innerText;

  const youMessage = document.createElement("div");
  youMessage.className = "message you";
  youMessage.innerHTML = `<div class="message-content">You: ${choiceText}</div>`;
  chatBox.appendChild(youMessage);
  scrollToBottom();

  let isCorrect = false;
  let feedbackText = "";

  switch (currentStage) {
    case 1:
      isCorrect = choice === "B";
      feedbackText = isCorrect
        ? "Correct! You've identified the source of the breach."
        : "Incorrect. The issue escalates.";
      break;
    case 2:
      isCorrect = choice === "A";
      feedbackText = isCorrect
        ? "Correct! You've limited the spread and secured core systems."
        : "Incorrect. The attack spreads further.";
      break;
    // case 3:
    //   isCorrect = choice === "B";
    //   feedbackText = isCorrect
    //     ? "Correct! Your statement reassures the public while maintaining control over information."
    //     : "Incorrect. The public panics or loses trust.";
    //   break;
    // case 4:
    //   isCorrect = choice === "A";
    //   feedbackText = isCorrect
    //     ? "Correct! Restoring from secure backups is a safe approach."
    //     : "Incorrect. This approach risks further complications.";
    //   break;
    // case 5:
    //   isCorrect = choice === "C";
    //   feedbackText = isCorrect
    //     ? "Correct! A comprehensive overhaul addresses immediate and long-term security needs."
    //     : "Incorrect. This approach may leave vulnerabilities.";
    //   break;
    // case 6:
    //   isCorrect = choice === "B";
    //   feedbackText = isCorrect
    //     ? "Correct! Regular, transparent updates maintain stakeholder trust."
    //     : "Incorrect. This approach may damage relationships.";
    //   break;
    // case 7:
    //   isCorrect = choice === "A";
    //   feedbackText = isCorrect
    //     ? "Correct! Swift action prevents further damage."
    //     : "Incorrect. Delayed response allows the threat to persist.";
    //   break;
    // case 8:
    //   isCorrect = choice === "C";
    //   feedbackText = isCorrect
    //     ? "Correct! Using uncompromised backups is the safest recovery method."
    //     : "Incorrect. This approach risks further complications.";
    //   break;
    // case 9:
    //   isCorrect = choice === "C";
    //   feedbackText = isCorrect
    //     ? "Correct! Direct engagement reassures stakeholders and rebuilds trust."
    //     : "Incorrect. This approach may leave stakeholders uncertain.";
    //   break;
    // case 10:
    //   isCorrect = choice === "B";
    //   feedbackText = isCorrect
    //     ? "Correct! Continuous improvement in cybersecurity is crucial for long-term protection."
    //     : "Incorrect. This approach may leave the organization vulnerable in the future.";
    //   break;
  }

  if (isCorrect) {
    score += 10;
    updateScore();
  } else {
    timeLeft -= 10;
  }

  const feedbackMessage = document.createElement("div");
  feedbackMessage.className = "message it-security";
  feedbackMessage.innerHTML = `<div class="message-content">IT Security: ${feedbackText}</div>`;
  chatBox.appendChild(feedbackMessage);
  scrollToBottom();

  if (isCorrect) {
    currentStage++;
    if (currentStage <= 2) {
      setTimeout(nextStage, 1500);
    } else {
      endGame(true);
    }
  } else if (timeLeft <= 0) {
    showScaryScreen();
  }
}

function nextStage() {
  let nextScenarioText = "";
  let choicesHTML = "";

  switch (currentStage) {
    case 1:
      nextScenarioText =
        "A major stock trading platform has been hit by a ransomware attack. What's our first step?";
      choicesHTML = `
                <button class="choice-button" onclick="makeChoice('A')">Wait and see if the system resolves the issue on its own.</button>
                <button class="choice-button" onclick="makeChoice('B')">Conduct an immediate audit to identify the source and scope of the breach.</button>
                <button class="choice-button" onclick="makeChoice('C')">Shut down all network access to prevent further spread.</button>`;
      break;
    case 2:
      nextScenarioText =
        "The audit points to a phishing attack as the entry vector. Multiple workstations are affected. How do we proceed?";
      choicesHTML = `
                <button class="choice-button" onclick="makeChoice('A')">Isolate affected systems and cut internet access to critical assets.</button>
                <button class="choice-button" onclick="makeChoice('B')">Engage with the attackers to buy time.</button>
                <button class="choice-button" onclick="makeChoice('C')">Immediately inform all employees via email about the breach.</button>`;
      break;
    // case 3:
    //   nextScenarioText =
    //     "Investors are panicking, and the media is calling. We need a communication strategy. Your advice?";
    //   choicesHTML = `
    //             <button class="choice-button" onclick="makeChoice('A')">Release a detailed report of the incident to the media.</button>
    //             <button class="choice-button" onclick="makeChoice('B')">Prepare a controlled statement emphasizing the containment and resolution efforts.</button>
    //             <button class="choice-button" onclick="makeChoice('C')">Stay silent until more information is available.</button>`;
    //   break;
    // case 4:
    //   nextScenarioText =
    //     "We've stabilized the system, but recovery is pending. How should we proceed with system restoration?";
    //   choicesHTML = `
    //             <button class="choice-button" onclick="makeChoice('A')">Begin system recovery using secure backups.</button>
    //             <button class="choice-button" onclick="makeChoice('B')">Attempt to decrypt affected files using available tools.</button>
    //             <button class="choice-button" onclick="makeChoice('C')">Negotiate with attackers for decryption keys.</button>`;
    //   break;
    // case 5:
    //   nextScenarioText =
    //     "With the immediate crisis managed, we need to address future security. What should be our focus?";
    //   choicesHTML = `
    //             <button class="choice-button" onclick="makeChoice('A')">Enhance employee training on cybersecurity best practices.</button>
    //             <button class="choice-button" onclick="makeChoice('B')">Invest in advanced threat detection systems.</button>
    //             <button class="choice-button" onclick="makeChoice('C')">Implement a comprehensive security policy overhaul and incident response plan.</button>`;
    //   break;
    // case 6:
    //   nextScenarioText =
    //     "Stakeholders are demanding updates. How do we manage ongoing communication?";
    //   choicesHTML = `
    //             <button class="choice-button" onclick="makeChoice('A')">Provide minimal updates to avoid potential legal issues.</button>
    //             <button class="choice-button" onclick="makeChoice('B')">Establish a regular schedule of transparent, detailed updates.</button>
    //             <button class="choice-button" onclick="makeChoice('C')">Defer all communication to legal team.</button>`;
    //   break;
    // case 7:
    //   nextScenarioText =
    //     "We've detected attempts at a second wave of attacks. What's our immediate response?";
    //   choicesHTML = `
    //             <button class="choice-button" onclick="makeChoice('A')">Implement additional security measures and monitor closely.</button>
    //             <button class="choice-button" onclick="makeChoice('B')">Shut down all systems temporarily.</button>
    //             <button class="choice-button" onclick="makeChoice('C')">Conduct another round of employee training.</button>`;
    //   break;
    // case 8:
    //   nextScenarioText =
    //     "Our backup systems were compromised. How do we approach data recovery?";
    //   choicesHTML = `
    //             <button class="choice-button" onclick="makeChoice('A')">Attempt to recover data from potentially infected backups.</button>
    //             <button class="choice-button" onclick="makeChoice('B')">Recreate lost data manually from other sources.</button>
    //             <button class="choice-button" onclick="makeChoice('C')">Utilize offsite, uncompromised backups for recovery.</button>`;
    //   break;
    // case 9:
    //   nextScenarioText =
    //     "We need to rebuild trust with our stakeholders. What's the best approach?";
    //   choicesHTML = `
    //             <button class="choice-button" onclick="makeChoice('A')">Offer compensation for any losses incurred.</button>
    //             <button class="choice-button" onclick="makeChoice('B')">Publish a detailed post-mortem of the incident.</button>
    //             <button class="choice-button" onclick="makeChoice('C')">Host a series of town halls and Q&A sessions with key stakeholders.</button>`;
    //   break;
    // case 10:
    //   nextScenarioText =
    //     "As we wrap up this incident, what's our strategy moving forward?";
    //   choicesHTML = `
    //             <button class="choice-button" onclick="makeChoice('A')">Focus on damage control and public relations.</button>
    //             <button class="choice-button" onclick="makeChoice('B')">Implement a long-term cybersecurity improvement plan.</button>
    //             <button class="choice-button" onclick="makeChoice('C')">Return to business as usual with minor security adjustments.</button>`;
    //   break;
  }

  const managerMessage = document.createElement("div");
  managerMessage.className = "message it-security";
  managerMessage.innerHTML = `<div class="message-content"></div>`;
  chatBox.appendChild(managerMessage);

  typeMessage(
    managerMessage.querySelector(".message-content"),
    `IT Security: ${nextScenarioText}`
  );

  setTimeout(() => {
    choicesElement.innerHTML = choicesHTML;
    scrollToBottom();
  }, nextScenarioText.length * 30 + 500);
}

function showScaryScreen() {
  hackedScreenElement.style.display = "block";
  endGame(false);
}

async function saveScoreInDB() {
  let scoreText = $("#scoreDisplay").text();
  let score = scoreText.replace("Score: ", "");

  if (!endTime) {
    console.error("endTime is not defined");
    return;
  }

  let timeTaken = Math.floor((endTime - startTime) / 1000); // Time taken in seconds
  let takenMinutes = Math.floor(timeTaken / 60);
  console.log(timeTaken, takenMinutes, "timetaken.....")
  let userID = localStorage.getItem("loggedInUserID");
  let userName = localStorage.getItem("loggedInUser");

  if (!userID || !userName) {
    console.error("User ID or User Name is missing from localStorage");
    return;
  }

  let todaysDate = new Date().toISOString().split('T')[0]

  //Convert the todaysDate in format of dd-mm-yyyy

  let [year, month, day] = todaysDate.split('-');
  let formattedTodaysDate = `${day}-${month}-${year}`;


  let data = {
    UserID: userID,
    UserName: userName,
    Date: formattedTodaysDate, 
    Score: score,
    TimeTaken: timeTaken,
  };

  console.log("Attempting to save data:", data);

  try {
    let response = await $.ajax({
      url: "https://app.nocodb.com/api/v2/tables/mk27lmgo6fq6u1q/records",
      type: "POST",
      headers: {
        "xc-token": "v659YuW3iQbnASgtnAmWEB_xuaXHX1cs6-V3Sy8B",
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data)
    });

    console.log("Data saved successfully:", response);
  } catch (error) {
    console.error("Error saving data:", error);
    if (error.responseJSON) {
      console.error("Server response:", error.responseJSON);
    }
  }
}

async function endGame(success) {
  clearInterval(countdown);
  choicesElement.style.display = "none";
  endTime = new Date(); // Set the end time
  if (success) {
    let userIDLoggedIn = localStorage.getItem("loggedInUserID")

    if (userIDLoggedIn) {
      await saveScoreInDB();
    }

    console.log(endMessageElement)
    endMessageElement.innerHTML = `<button id="closeEndMessage" onclick="closeEndMessage()">✖</button>
                    <div id="endMessageContent">Congratulations! You've successfully managed the ransomware crisis!<br><br>Your final score is ${score} and you completed the game in ${takenMinutes} minutes. <br><br>To better prepare your organization, consider using <strong>WhizRange</strong> for comprehensive employee training in cybersecurity scenarios and <strong>ZeroHack-S</strong> for advanced ransomware simulation. These tools will help ensure your team is ready to handle real-world cyber threats.</div>`;
    endMessageElement.style.display = "block";
    console.log(endMessageElement)

  } else {
    failedMessageElement.innerHTML = `Game Over: The attack caused irreparable damage.<br><br>Your final score is ${score}.<br><br>Remember, in a real ransomware situation, never pay the ransom and immediately contact cybersecurity professionals and law enforcement.`;
    failedMessageElement.style.display = "block";
  }
  scrollToBottom();
}

function resetGame() {
  currentStage = 0;
  score = 0;
  timeLeft = 120;
  updateScore();
  clearInterval(countdown);
  timeRemainingElement.innerText = "Time: 2:00";
  chatBox.innerHTML =
    '<div class="message it-security"><div class="message-content">Welcome to the AI Security Challenge. Click \'Start the challenge\' to begin.</div></div>';
  choicesElement.innerHTML = "";
  hackedScreenElement.style.display = "none";
  endMessageElement.style.display = "none";
  failedMessageElement.style.display = "none";
  scrollToBottom();
}

// Disclaimer
alert(
  "This is a simulation for educational purposes only. In a real ransomware situation, never pay the ransom and immediately contact cybersecurity professionals and law enforcement."
);

// Event listeners
document.getElementById("startButton").addEventListener("click", startChallenge);
document.getElementById("resetButton").addEventListener("click", resetGame);

// Initialize the game
resetGame();

// Function to check if user is logged in
function checkLoggedInUser() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const loggedInUserID = localStorage.getItem("loggedInUserID");
  
  if (loggedInUser && loggedInUserID) {
    document.getElementById("userInfo").textContent = `Logged in as: ${loggedInUser}`;
    document.getElementById("startButton").disabled = false;
  } else {
    document.getElementById("userInfo").textContent = "Please log in to play";
    document.getElementById("startButton").disabled = true;
  }
}

// Call this function when the page loads
window.onload = checkLoggedInUser;

// You might want to add a login function here
function login(username, userID) {
  localStorage.setItem("loggedInUser", username);
  localStorage.setItem("loggedInUserID", userID);
  checkLoggedInUser();
}

// And a logout function
function logout() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("loggedInUserID");
  checkLoggedInUser();
}

// Remember to call checkLoggedInUser() after any login/logout operations