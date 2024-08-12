const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const port = 4005;
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: "103.92.235.85",
    user: "yatayati_vrk",
    password: "vamsee@ranjith",
    database: "yatayati_My store database",
});

connection.connect();

const jwtSecretKey = 'yatayatismdnvlsvnvlefmv';

app.post('/login', async (req, res) => {
    const { username, password, role, email } = req.body;
  
    try {
      // Check if email is already registered
      const checkEmailQuery = 'SELECT * FROM rolebased WHERE email = ?';
      connection.query(checkEmailQuery, [email], async (err, results) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error checking email' });
        }
  
        if (results.length > 0) {
          return res.status(400).json({ success: false, message: 'Email is already registered' });
        }
        const checkUsernameQuery = 'SELECT * FROM rolebased WHERE username = ?';
        connection.query(checkUsernameQuery, [username], async (err, usernameResults) => {
          if (err) {
            return res.status(500).json({ success: false, message: 'Error checking username' });
          }
  
          if (usernameResults.length > 0) {
            return res.status(400).json({ success: false, message: 'Username is already taken' });
          }
          const hashedPassword = await bcrypt.hash(password, 10);
          const insertQuery = 'INSERT INTO rolebased (username, password, role, email) VALUES (?, ?, ?, ?)';
          connection.query(insertQuery, [username, hashedPassword, role, email], (err, result) => {
            if (err) {
              res.status(500).json({ success: false, message: 'Error inserting data' });
            } else {
              res.json({ success: true, message: 'Login data saved successfully', role });
            }
          });
        });
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error processing request' });
    }
  });
  function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
  }
  
  function sendOTP(email, otp) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "vamseedhar151@gmail.com",
        pass: "hyskokcgnohwhlqr",
      },
    });
   
    const mailOptions = {
      from: "vamseedhar151@gmail.com",
      to: email,
      subject: "OTP for Login",
      text: `Your OTP for login is: ${otp}`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
  
  app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      const userQuery = 'SELECT * FROM rolebased WHERE email = ?';
      connection.query(userQuery, [email], async (err, results) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error checking email' });
        }
  
        if (results.length === 0) {
          return res.status(400).json({ success: false, message: 'Email is not registered' });
        }
  
        const storedOTP = results[0].otp;
        if (otp === storedOTP) {
          res.json({ success: true, message: 'OTP verified successfully' });
        } else {
          res.status(400).json({ success: false, message: 'Invalid OTP' });
        }
      });
    } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ success: false, message: 'An error occurred while verifying OTP' });
    }
  });
  
  app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    try {
      const userQuery = 'SELECT * FROM rolebased WHERE email = ?';
      connection.query(userQuery, [email], async (err, results) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error checking email' });
        }
  
        if (results.length === 0) {
          return res.status(400).json({ success: false, message: 'Email is not registered' });
        }
  
        const otp = generateOTP();
        const updateQuery = 'UPDATE rolebased SET otp = ? WHERE email = ?';
        connection.query(updateQuery, [otp, email], async (err, updateResult) => {
          if (err) {
            return res.status(500).json({ success: false, message: 'Error updating OTP' });
          }
  
          sendOTP(email, otp);
          res.json({ success: true, message: 'OTP sent to your email for password reset' });
        });
      });
    } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({ success: false, message: 'An error occurred while sending OTP' });
    }
  });

  app.post('/change-password', async (req, res) => {
    const { email, newPassword } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      connection.query(
        'UPDATE rolebased SET password = ? WHERE email = ?',
        [hashedPassword, email],
        (error, results, fields) => {
          if (error) {
            console.error('Error updating password:', error);
            return res.status(500).json({ success: false, message: 'Failed to update password.' });
          }
          res.status(200).json({ success: true, message: 'Password updated successfully.' });
        }
      );
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ success: false, message: 'Failed to update password.' });
    }
  });
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    jwt.verify(token.split(' ')[1], jwtSecretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      req.user = decoded;
      next();
    });
  }
  
app.get('/masteradmin', verifyToken, (req, res) => {
  const user = req.user;
  res.json({ success: true, message: `Hello, ${user.username}! You have access to this protected route.` });
});

app.get('/employee', verifyToken, (req, res) => {
  const user = req.user;
  res.json({ success: true, message: `Hello, ${user.username}! You have access to this protected route.` });
});

app.post('/loginn', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM rolebased WHERE username = ?`;

    connection.query(query, [username], async (error, results) => {
        if (error) {
            res.status(500).json({ success: false, message: 'Database error' });
        } else if (results.length > 0) {
            const user = results[0];
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                const role = user.role;
                const token = jwt.sign({ username, role }, jwtSecretKey, { expiresIn: '30m' });
                res.cookie('token', token, { httpOnly: true });
                res.json({ success: true, role, token });
            } else {
                res.json({ success: false, message: 'Invalid credentials' });
            }
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    });
});

app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out successfully' });
});

app.get('/loginn', (req, res) => {
    const query = 'SELECT * FROM rolebased';
    connection.query(query, (error, results) => {
        if (error) {
            res.status(500).json({ success: false, message: 'Error fetching user data' });
        } else {
            res.json({ success: true, users: results });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
