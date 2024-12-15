import TokenService from "../services/TokenService.js";

function validateTokenMiddleware(req, res, next) {
    const token = req.headers.authorization;
    if (req.url === '/usuario/login') return next();
    if (req.url === '/usuario' && req.method === 'POST') return next();
    if (req.url === '/ping') return next();
    if (req.url === '/area-interesse') return next();
    if (!token) return res.status(401).json({ message: 'Token não fornecido' });

    try {
        let decoded;
        if (token.startsWith('Bearer ')) {
            const tokenWithoutPrefix = token.slice(7);
            decoded = TokenService.validateToken(tokenWithoutPrefix);
        } else {
            decoded = TokenService.validateToken(token);
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
}

export default validateTokenMiddleware;