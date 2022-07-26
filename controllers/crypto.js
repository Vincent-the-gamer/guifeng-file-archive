//crypto用于生成密钥，并且暴露出去
const crypto = require('crypto');
module.exports = {
    MD5_SUFFIX: "PlayStation",
    md5: pwd => {
        let md5 = crypto.createHash("md5");
        return md5.update(pwd).digest("hex");
    },
    secretKey: "NintendoSwitch" + Date.now()
}