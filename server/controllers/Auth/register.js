import OTP from "../../models/task.js";
import sendEmail from "../../utils/sendEmail.js";


const register = async (req, res) => {
const { email } = req.body;
const otp = Math.floor(100000 + Math.random() * 900000).toString();


await OTP.create({
email,
otp,
expiresAt: new Date(Date.now() + 5 * 60000)
});


await sendEmail(email, "Verify Account", `Your OTP Code is ${otp}`);


res.json({ message: "OTP sent to email" });
};


export default register;