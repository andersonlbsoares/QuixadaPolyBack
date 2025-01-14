export default (gameController) => {
    return function SessionUserMiddleware(req, res, next) {
        try {
            if(req.url === '/sessao') return next();
            const sessionNumber = req.params.sessionNumber;
            const playerName = req.query.playerName;
            if (!sessionNumber || !playerName) {
                return res.status(401).json({ message: 'Sessão e/ou jogador não informado(a)' });
            }
            let session = gameController.obterSessao(sessionNumber);
            let player = session.getPlayer(playerName);
            
            if (!player) {
                return res.status(401).json({ message: 'Jogador e/ou sessão não encontrado(a)' });
            }
            req.player = player;
            req.session = session;
            req.tile = session.board.getTile(player.position);

            next();
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: 'Não foi possível encontrar o jogador nessa sessão' });
        }
    };
}