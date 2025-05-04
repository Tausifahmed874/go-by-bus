import nodemailer from 'nodemailer';

export const sendFeedback = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
        },
    });

    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f8fb;
            }
            .header {
                background-color: #2d3e50;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
            }
            .content {
                padding: 30px;
                background-color: #ffffff;
                border-radius: 0 0 8px 8px;
                border: 1px solid #e1e1e1;
                border-top: none;
            }
            .feedback-container {
                background-color: #f9fafb;
                border-left: 4px solid #4a6bff;
                padding: 20px;
                margin: 20px 0;
                font-size: 16px;
                color: #222;
                white-space: pre-line;
            }
            .footer {
                margin-top: 30px;
                font-size: 12px;
                color: #777;
                text-align: center;
            }
            .user-info {
                margin-top: 20px;
                font-size: 14px;
                color: #555;
                background: #eef2f7;
                padding: 10px;
                border-radius: 4px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>New Feedback / Issue Report</h1>
        </div>
        <div class="content">
            <p>Hello Admin,</p>
            <p>A new feedback or issue has been submitted by a user:</p>
            <div class="feedback-container">
                ${options.message}
            </div>
            <div class="user-info">
                <strong>Submitted by:</strong> ${options.name || 'Anonymous'}<br/>
                <strong>Email:</strong> ${options.email || 'Not provided'}
            </div>
            <div class="footer">
                <p>© ${new Date().getFullYear()} Go By Bus. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: `"Go By Bus" <${process.env.SMPT_MAIL}>`,
        to: options.adminEmail || process.env.SMPT_MAIL,
        subject: options.subject || 'New Feedback / Issue Report',
        html: htmlTemplate,
        text: `A new feedback or issue has been submitted by ${options.name || 'Anonymous'} (${options.email || 'Not provided'}):\n\n${options.message}`
    };

    await transporter.sendMail(mailOptions);
};