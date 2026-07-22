import bcrypt from "bcrypt";

const password = "123456";
const hash = "$2b$10$jmJ/kWU96ggDwn/FoBz/a.l5GaaPZu5fwiUCpodIpRiv63.X4LMF.";

const isMatch = await bcrypt.compare(password, hash);

console.log(isMatch); // true or false
