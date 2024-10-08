const { Telegraf } = require('telegraf');
const mysql = require('mysql2');
const { text } = require('body-parser');

const bot = new Telegraf('7267953844:AAFvJAtBwdINBS0bbMuRtg1-hs6hL1VF0CQ'); // Replace with your bot token

// MySQL Connection Setup
const db = mysql.createConnection({
    host: 'mysql-38ee13b7-rijeshsapkota023-b3be.i.aivencloud.com',
    user: 'avnadmin', // your MySQL username
    password: 'AVNS_q8WCH_9XsyJus7vT1Ur', // your MySQL password
    database: 'telegram_game'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Start Command
bot.start((ctx) => {
    const telegramId = ctx.message.from.id;

    // Check if user exists
    db.query('SELECT * FROM users WHERE telegram_id = ?', [telegramId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            ctx.reply('An error occurred. Please try again.');
            return;
        }

        if (results.length === 0) {
            // New user, insert into DB
            db.query('INSERT INTO users (telegram_id) VALUES (?)', [telegramId], (err) => {
                if (err) {
                    console.error('Database error:', err);
                    ctx.reply('An error occurred during registration.');
                    return;
                }
                ctx.reply('Welcome! You have been registered.');
                
            });
        } else {
            ctx.reply('Welcome back! You are already registered.');
        }
    });
});
// Command to check balance
bot.command('balance', (ctx) => {
    const telegramId = ctx.message.from.id;

    db.query('SELECT balance FROM users WHERE telegram_id = ?', [telegramId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            ctx.reply('An error occurred. Please try again.');
            return;
        }

        if (results.length > 0) {
            const balance = results[0].balance;
            ctx.reply(`Your balance is: ${balance} coins.`);
        } else {
            ctx.reply('You are not registered yet. Use /start to register.');
            ctx.reply("Click On Play Button To Start the bot")
        }
    });
});

// Command to update balance (for simplicity, we're adding 10 coins)
bot.command('earn', (ctx) => {
    const telegramId = ctx.message.from.id;

    db.query('UPDATE users SET balance = balance + 10 WHERE telegram_id = ?', [telegramId], (err) => {
        if (err) {
            console.error('Database error:', err);
            ctx.reply('An error occurred while updating balance.');
            return;
        }
        ctx.reply('You earned 10 coins!');
    });
});

bot.launch();
