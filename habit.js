document.addEventListener("DOMContentLoaded", function () {
    var date = new Date();
    var currentMonth = date.getMonth();
    var currentYear = date.getFullYear();
    var currentDate = date.getDate();

    var months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Ask for username every time
    var username = prompt("Enter your name to track your progress:");
    if (!username || username.trim() === "") {
        username = "Guest"; // Default name if left blank
    }

    // Set the title of the calendar
    document.getElementById("title").innerHTML = "🌺" + months[currentMonth] + "🌺";

    var daysInTheMonthList = [31, (currentYear % 4 === 0 && (currentYear % 100 !== 0 || currentYear % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var daysInThisMonth = daysInTheMonthList[currentMonth];

    var tracker = document.getElementById("tracker");
    tracker.innerHTML = ""; 
    var totalDaysElement = document.getElementById("totalDays");

    // Unique storage key per user
    var storageKey = `habitTracker-${username}-${currentYear}-${currentMonth}`;
    var storedData = JSON.parse(localStorage.getItem(storageKey)) || {};

    var completedDays = Math.max(0, Object.values(storedData).filter(value => value).length);

    var dayCount = 1;
    var totalCells = 35;

    for (var week = 0; week < 5; week++) {
        var weekRow = document.createElement("div");
        weekRow.classList.add("days");

        for (var day = 0; day < 7; day++) {
            var dayDiv = document.createElement("div");
            dayDiv.classList.add("day");
            var storageString = `${currentMonth + 1}-${dayCount}-${currentYear}`;

            if (dayCount <= daysInThisMonth) {
                var isCompleted = storedData[storageString] || false;

                dayDiv.textContent = dayCount;
                dayDiv.style.backgroundColor = isCompleted ? "pink" : "white";
                dayDiv.style.border = dayCount === currentDate ? "2px solid black" : "none";

                // Click event to toggle completion
                dayDiv.onclick = function () {
                    var dayNumber = parseInt(this.textContent);
                    var storageString = `${currentMonth + 1}-${dayNumber}-${currentYear}`;

                    if (!storedData[storageString]) {
                        storedData[storageString] = true;
                        this.style.backgroundColor = "pink";
                        completedDays++;
                    } else {
                        storedData[storageString] = false;
                        this.style.backgroundColor = "white";
                        completedDays = Math.max(0, completedDays - 1);
                    }

                    localStorage.setItem(storageKey, JSON.stringify(storedData));
                    totalDaysElement.innerHTML = `${completedDays}/${daysInThisMonth}`;

                    if (completedDays === daysInThisMonth) {
                        alert("Great progress! 🎉");
                    }
                };

                dayCount++;
            } else {
                dayDiv.style.backgroundColor = "white";
                dayDiv.textContent = "";
                dayDiv.style.border = "none";
            }

            weekRow.appendChild(dayDiv);
        }

        tracker.appendChild(weekRow);
    }

    // Habit Prompt when clicking "My New Habit"
    var habitTitle = document.getElementById("habitTitle");
    habitTitle.onclick = function () {
        let habitInput = prompt("What is your habit?", habitTitle.innerHTML);
        habitTitle.innerHTML = habitInput && habitInput.trim().length > 0 ? habitInput : "Click to add your habit";
        localStorage.setItem(`habitTitle-${username}`, habitTitle.innerHTML);
    };

    var savedHabit = localStorage.getItem(`habitTitle-${username}`);
    if (savedHabit) {
        habitTitle.innerHTML = savedHabit;
    }

    totalDaysElement.innerHTML = `${completedDays}/${daysInThisMonth}`;

    // RESET BUTTON FUNCTIONALITY
    var resetButton = document.getElementById("resetButton");
    resetButton.onclick = function () {
        if (confirm("Are you sure you want to reset your progress?")) {
            localStorage.removeItem(storageKey);

            document.querySelectorAll(".day").forEach(day => {
                if (day.textContent) {
                    day.style.backgroundColor = "white";
                }
            });

            completedDays = 0;
            totalDaysElement.innerHTML = `${completedDays}/${daysInThisMonth}`;
        }
    };
});
