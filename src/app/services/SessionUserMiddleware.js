export default (gameController) => {
    return function SessionUserMiddleware(req, res, next) {
        try {
            const sessionNumber = req.params.sessionNumber;
            const playerName = req.query.playerName;
            let session = gameController.obterSessao(sessionNumber);
            let player = session.getPlayer(playerName);
            if (!player) {
                return res.status(401).json({ message: 'Jogador e/ou sessão não encontrado(a)' });
            }
            req.player = player;
            req.session = session;
            next();
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: 'Não foi possível encontrar o jogador nessa sessão' });
        }
    };
}