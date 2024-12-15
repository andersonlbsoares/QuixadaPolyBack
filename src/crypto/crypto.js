import pkg from "crypto-js"
const applyHash = (text) => {
    return pkg.MD5(text).toString();
};

export default { applyHash};