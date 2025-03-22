function toggleSolution(solutionId) {
  const solutionElement = document.getElementById(solutionId);
  if (solutionElement.style.display === 'block') {
    solutionElement.style.display = 'none';
  } else {
    solutionElement.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const solutions = document.querySelectorAll('.solution-container');
  solutions.forEach(solution => {
    solution.style.display = 'none';
  });

  if (window.location.pathname.includes('idor.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const fileParam = urlParams.get('file');

    if (fileParam) {
      downloadFile(fileParam);
    }
  }

  document.querySelectorAll('a[href^="index.html"], a[href^="xss.html"], a[href^="sqli.html"], a[href^="clickjacking.html"], a[href^="csrf.html"], a[href^="auth.html"], a[href^="idor.html"], a[href^="misconfig.html"], a[href^="dirlisting.html"], a[href^="weakpass.html"], a[href^="base64.html"], a[href^="captcha.html"], a[href^="admin-panel.html"]').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      window.location.href = href;
    });
  });
});

function downloadFile(fileName) {
  const resultBox = document.getElementById('idor-result');
  if (!resultBox) return;

  const files = {
    'secret1.txt': {
      content: 'This is your personal file. Nothing interesting here.',
      authorized: true
    },
    'admin_notes.txt': {
      content: 'CONFIDENTIAL: Admin password is "supersecretadmin". DO NOT SHARE!',
      authorized: false
    },
    'user_list.txt': {
      content: 'User database: admin, john, sarah, mike - All with default passwords!',
      authorized: false
    }
  };

  if (files[fileName]) {
    if (!files[fileName].authorized) {
      resultBox.innerHTML = '<div class="success-message" style="display:block;">IDOR Vulnerability Exploited! You accessed a file you shouldn\'t have permission to view.</div>';
    }
    resultBox.innerHTML += `<div class="terminal-text">File: ${fileName}<br><br>${files[fileName].content}</div>`;
  } else {
    resultBox.innerHTML = '<div class="error-message" style="display:block;">File not found. Try a different file name.</div>';
  }

  const urlParams = new URLSearchParams(window.location.search);
  const fileParam = urlParams.get('file');
  if (!fileParam) {
    const newUrl = window.location.pathname + '?file=' + fileName;
    window.history.pushState({}, '', newUrl);
  }
}

function checkDirectory() {
  const directoryInput = document.getElementById('directory-input').value.trim();
  const resultBox = document.getElementById('dirlisting-result');

  if (directoryInput === '/hidden/' || directoryInput === 'hidden/' || directoryInput === 'hidden') {
    resultBox.innerHTML = `
      <div class="success-message" style="display:block;">
        Correct! You found the hidden directory.
      </div>
      <div class="terminal-text">
        Index of /hidden/<br>
        <br>
        [DIR] ../<br>
        [FILE] secret1.txt - 2KB - "Employee salary information"<br>
        [FILE] secret2.txt - 1KB - "Database credentials"<br>
        [FILE] admin_notes.txt - 3KB - "Server configuration details"<br>
        [FILE] backup.sql - 15KB - "Database backup"
      </div>
      <p>In a real scenario, this information could be used by attackers to access sensitive data or systems.</p>
    `;
  } else {
    resultBox.innerHTML = `
      <div class="error-message" style="display:block;">
        Directory not found. Try again!
      </div>
      <div class="form-group">
        <input type="text" id="directory-input" placeholder="Enter the hidden directory path">
        <button onclick="checkDirectory()">Check</button>
      </div>
    `;
  }
}

function checkWeakPassword() {
  const passwordInput = document.getElementById('weak-password').value;
  const resultBox = document.getElementById('weakpass-result');

  const secretPass = '123456';

  if (passwordInput === secretPass) {
    resultBox.innerHTML = `
      <div class="success-message" style="display:block;">
        Correct! You guessed a weak password.
      </div>
      <div class="terminal-text">
        Password: "${passwordInput}" is one of the most commonly used passwords.<br>
        In 2022, it was still #1 on the list of most common passwords.
      </div>
      <p>This demonstrates why using common passwords is dangerous. Attackers often try these first.</p>
    `;
  } else {
    resultBox.innerHTML = `
      <div class="error-message" style="display:block;">
        Incorrect password. Try a common weak password!
      </div>
    `;
  }
}

function checkBase64Flag() {
  const flagInput = document.getElementById('base64-input').value.trim();
  const resultBox = document.getElementById('base64-result');

  if (flagInput === 'flag{you-decoded-this-really}') {
    resultBox.innerHTML = `
      <div class="success-message" style="display:block;">
        Correct! You successfully decoded the Base64 message.
      </div>
      <div class="terminal-text">
        Original Base64: ZmxhZ3t5b3UtZGVjb2RlZC10aGlzLXJlYWxseX0=<br>
        Decoded: flag{you-decoded-this-really}
      </div>
      <p>This demonstrates why Base64 encoding should never be used to hide sensitive information.</p>
    `;
  } else {
    resultBox.innerHTML = `
      <div class="error-message" style="display:block;">
        Incorrect flag. Try looking at the page source code for a Base64-encoded string.
      </div>
    `;
  }
}

function checkCaptcha() {
  const captchaInput = document.getElementById('captcha-input').value;
  const resultBox = document.getElementById('captcha-result');

  const captchaAnswer = "4";

  if (captchaInput === captchaAnswer) {
    resultBox.innerHTML = `
      <div class="success-message" style="display:block;">
        CAPTCHA Bypassed! You've successfully bypassed the CAPTCHA.
      </div>
      <div class="terminal-text">
        Protected content revealed:<br>
        Server backup schedule: Every Sunday at 2 AM<br>
        Admin email: admin@example.com
      </div>
      <p>This demonstrates why CAPTCHAs should never be validated client-side, as the answer can be found in the JavaScript code.</p>
    `;
  } else {
    resultBox.innerHTML = `
      <div class="error-message" style="display:block;">
        Incorrect CAPTCHA. Try examining the page's JavaScript!
      </div>
    `;
  }
}

function checkAdminPanel() {
  const resultBox = document.getElementById('misconfig-result');
  if (!resultBox) return;

  resultBox.innerHTML = `
    <div class="success-message" style="display:block;">
      You found the admin panel through a security misconfiguration!
    </div>
    <div class="terminal-text">
      Try navigating to: admin-panel.html
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('matrix-canvas')) {
    initMatrix();
  }
});

function postComment() {
  const nameInput = document.getElementById('name-input');
  const commentInput = document.getElementById('comment-input');
  const commentsSection = document.getElementById('comments-section');

  if (!nameInput || !commentInput || !commentsSection) return;

  const name = nameInput.value.trim();
  const comment = commentInput.value.trim();

  if (name && comment) {
    commentsSection.innerHTML += `
      <div class="comment">
        <strong>${name}</strong>
        <p>${comment}</p>
      </div>
    `;

    if (comment.includes('<script>') ||
      comment.includes('javascript:') ||
      comment.includes('onerror=') ||
      comment.includes('onload=')) {
      const resultBox = document.getElementById('xss-result');
      if (resultBox) {
        resultBox.innerHTML = `
          <div class="success-message" style="display:block;">
            XSS Vulnerability Exploited! You've successfully injected JavaScript.
          </div>
        `;
      }
    }

    nameInput.value = '';
    commentInput.value = '';
  }
}

function checkLogin() {
  const usernameInput = document.getElementById('username-input');
  const passwordInput = document.getElementById('password-input');
  const resultBox = document.getElementById('sqli-result');

  if (!usernameInput || !passwordInput || !resultBox) return;

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (username.includes("'") || username.includes("--") ||
    username.includes("=") || username.includes(" or ")) {
    resultBox.innerHTML = `
      <div class="success-message" style="display:block;">
        SQL Injection Successful! You've bypassed authentication.
      </div>
      <div class="terminal-text">
        Simulated SQL query: SELECT * FROM users WHERE username='${username}' AND password='${password}'<br>
        Query result: 1 row returned
      </div>
      <p>Welcome, admin! You have access to all user data.</p>
    `;
  } else if (username === "admin" && password === "admin123") {
    resultBox.innerHTML = `
      <div class="success-message" style="display:block;">
        Login successful using correct credentials.
      </div>
    `;
  } else {
    resultBox.innerHTML = `
      <div class="error-message" style="display:block;">
        Login failed. Try using SQL injection to bypass authentication.
      </div>
    `;
  }
}

function transferMoney() {
  const amountInput = document.getElementById('amount-input');
  const accountInput = document.getElementById('account-input');
  const resultBox = document.getElementById('csrf-result');

  if (!amountInput || !accountInput || !resultBox) return;

  const amount = amountInput.value.trim();
  const account = accountInput.value.trim();

  if (amount && account) {
    resultBox.innerHTML = `
      <div class="success-message" style="display:block;">
        Transfer successful! $${amount} sent to account ${account}.
      </div>
      <p>This demonstrates how a CSRF attack could trick users into performing unwanted actions.</p>
    `;
  }
}

function checkAdminAuth() {
  const passwordInput = document.getElementById('admin-password');
  const resultBox = document.getElementById('auth-result');

  if (!passwordInput || !resultBox) return;

  const password = passwordInput.value;

  if (password === "admin123") {
    resultBox.innerHTML = `
      <div class="success-message" style="display:block;">
        Authentication successful! You've found the hardcoded credentials.
      </div>
      <div class="terminal-text">
        Admin access granted. You now have access to all system functions.
      </div>
    `;
  } else {
    resultBox.innerHTML = `
      <div class="error-message" style="display:block;">
        Authentication failed. Try examining the page source for hardcoded credentials.
      </div>
    `;
  }
}

function setupClickjacking() {
  const hiddenButton = document.getElementById('hidden-button');
  const resultBox = document.getElementById('clickjacking-result');

  if (!hiddenButton || !resultBox) return;

  hiddenButton.addEventListener('click', function () {
    resultBox.innerHTML = `
      <div class="success-message" style="display:block;">
        Clickjacking Successful! You clicked a hidden button.
      </div>
      <div class="terminal-text">
        In a real attack, this could have performed an unwanted action like:
        - Deleting your account
        - Making a purchase
        - Changing your email/password
        - Granting permissions to an application
      </div>
      <p>This demonstrates why frame-busting code and X-Frame-Options headers are important.</p>
    `;
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const solutions = document.querySelectorAll('.solution-container');
  solutions.forEach(solution => {
    solution.style.display = 'none';
  });

  if (window.location.pathname.includes('idor.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const fileParam = urlParams.get('file');

    if (fileParam) {
      downloadFile(fileParam);
    }
  }

  if (window.location.pathname.includes('clickjacking.html')) {
    setupClickjacking();
  }

  if (document.getElementById('matrix-canvas')) {
    initMatrix();
  }
});
