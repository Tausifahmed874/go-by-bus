import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
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
            }
            .header {
                background-color: #4a6bff;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
            }
            .content {
                padding: 30px;
                background-color: #f9f9f9;
                border-radius: 0 0 8px 8px;
                border: 1px solid #e1e1e1;
                border-top: none;
            }
            .otp-container {
                background-color: #ffffff;
                border: 2px dashed #4a6bff;
                padding: 15px;
                text-align: center;
                margin: 20px 0;
                font-size: 24px;
                font-weight: bold;
                color: #4a6bff;
            }
            .footer {
                margin-top: 30px;
                font-size: 12px;
                color: #777;
                text-align: center;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #4a6bff;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                margin-top: 15px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Your Verification Code</h1>
        </div>
        <div class="content">
            <p>Hello ${options.name || 'User'},</p>
            <p>Thank you for using our service. Here is your One-Time Password (OTP) for verification:</p>
            
            <div class="otp-container">
                ${options.otp}
            </div>
            
            <p>This code will expire in 10 minutes. Please do not share this code with anyone.</p>
            
            <p>If you didn't request this code, you can safely ignore this email.</p>
            
            <div class="footer">
                <p>© ${new Date().getFullYear()} GoByBus. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: `"Go By Bus" <${process.env.SMPT_MAIL}>`,
        to: options.email,
        subject: options.subject || 'Your Verification Code',
        html: htmlTemplate,
        text: `Hello ${options.name || 'User'},\n\nYour OTP is: ${options.otp}\n\nThis code will expire in 10 minutes.`
    };

    await transporter.sendMail(mailOptions);
};