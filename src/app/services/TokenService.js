import jwt from "jsonwebtoken";

class TokenService {
    generateToken(payload) {
        const token = jwt.sign(payload, process.env.JWT_SEED, { expiresIn: "1d" });
        return token;
    }
    validateToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SEED);
            return decoded;
        } catch (error) {
            throw new Error("Token inválido!");
        }
    }
}

export default new TokenService();
