// Mock database to store user sign-ups and referral counts
const users = [];
const leaderboard = {};

// Handle form submission
document.getElementById('signupForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const referee = document.getElementById('referee').value;

  // Generate random referral code
  const referralCode = generateReferralCode();

  // Add the user to the database
  users.push({ name, email, referralCode, referee });

  // Track referrals
  if (referee) {
    const referrer = users.find(user => user.referralCode === referee);
    if (referrer) {
      if (!leaderboard[referrer.name]) {
        leaderboard[referrer.name] = 0;
      }
      leaderboard[referrer.name] += 1;

      // Give the referred person 1 referral
      if (!leaderboard[name]) {
        leaderboard[name] = 0;
      }
      leaderboard[name] += 1;
    }
  }

  // Show referral code to the user
  showReferralCodePopup(referralCode);

  // Update leaderboard
  updateLeaderboard();

  // Reset form
  e.target.reset();
});

// Generate random referral code
function generateReferralCode() {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}

// Show referral code in popup
function showReferralCodePopup(referralCode) {
  document.getElementById('referralCode').textContent = referralCode;
  document.getElementById('referralCodePopup').style.display = 'block';
}

// Close the popup
function closePopup() {
  document.getElementById('referralCodePopup').style.display = 'none';
}

// Copy referral code to clipboard
function copyReferralCode() {
  const referralCode = document.getElementById('referralCode').textContent;
  navigator.clipboard.writeText(referralCode).then(() => {
    showCopiedMessage();
  });
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '1';
  }, 10);

  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Update leaderboard
function updateLeaderboard() {
  const leaderboardList = document.getElementById('leaderboard');
  leaderboardList.innerHTML = '';

  // Sort users by referral count
  const sortedLeaderboard = Object.keys(leaderboard).sort((a, b) => leaderboard[b] - leaderboard[a]);

  // Display top users
  sortedLeaderboard.forEach(userName => {
    const li = document.createElement('li');
    li.textContent = `${userName}: ${leaderboard[userName]} referrals`;
    leaderboardList.appendChild(li);
  });
}

// Show copied message
function showCopiedMessage() {
  const popup = document.getElementById('referralCodePopup');
  const originalContent = popup.innerHTML;
  
  popup.innerHTML = '<p>Referral Code Copied to Clipboard!</p><button onclick="closePopup()">Close</button>';
  
  setTimeout(() => {
    popup.innerHTML = originalContent;
  }, 3000);
}
