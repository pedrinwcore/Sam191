const express = require('express');
const router = express.Router();
const StreamingControlService = require('../services/StreamingControlService');
const authMiddleware = require('../middlewares/authMiddleware');

// Middleware de autenticação
router.use(authMiddleware);

/**
 * POST /api/streaming-control/ligar
 * Ligar streaming
 */
router.post('/ligar', async (req, res) => {
    try {
        const { login } = req.body;

        if (!login) {
            return res.status(400).json({
                success: false,
                message: 'Login do streaming é obrigatório'
            });
        }

        const result = await StreamingControlService.ligarStreaming(login);

        if (result.success) {
            return res.json(result);
        } else {
            return res.status(result.alreadyActive ? 200 : 500).json(result);
        }

    } catch (error) {
        console.error('Erro ao ligar streaming:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao ligar streaming',
            error: error.message
        });
    }
});

/**
 * POST /api/streaming-control/desligar
 * Desligar streaming
 */
router.post('/desligar', async (req, res) => {
    try {
        const { login } = req.body;

        if (!login) {
            return res.status(400).json({
                success: false,
                message: 'Login do streaming é obrigatório'
            });
        }

        const result = await StreamingControlService.desligarStreaming(login);

        if (result.success) {
            return res.json(result);
        } else {
            return res.status(result.alreadyInactive ? 200 : 500).json(result);
        }

    } catch (error) {
        console.error('Erro ao desligar streaming:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao desligar streaming',
            error: error.message
        });
    }
});

/**
 * POST /api/streaming-control/reiniciar
 * Reiniciar streaming
 */
router.post('/reiniciar', async (req, res) => {
    try {
        const { login } = req.body;

        if (!login) {
            return res.status(400).json({
                success: false,
                message: 'Login do streaming é obrigatório'
            });
        }

        const result = await StreamingControlService.reiniciarStreaming(login);

        if (result.success) {
            return res.json(result);
        } else {
            return res.status(500).json(result);
        }

    } catch (error) {
        console.error('Erro ao reiniciar streaming:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao reiniciar streaming',
            error: error.message
        });
    }
});

/**
 * POST /api/streaming-control/bloquear
 * Bloquear streaming (apenas admin/revenda)
 */
router.post('/bloquear', async (req, res) => {
    try {
        const { login } = req.body;
        const userType = req.user?.type || req.user?.tipo;

        if (!login) {
            return res.status(400).json({
                success: false,
                message: 'Login do streaming é obrigatório'
            });
        }

        if (!userType || (userType !== 'admin' && userType !== 'revenda')) {
            return res.status(403).json({
                success: false,
                message: 'Acesso não autorizado'
            });
        }

        const result = await StreamingControlService.bloquearStreaming(login, userType);

        if (result.success) {
            return res.json(result);
        } else {
            return res.status(500).json(result);
        }

    } catch (error) {
        console.error('Erro ao bloquear streaming:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao bloquear streaming',
            error: error.message
        });
    }
});

/**
 * POST /api/streaming-control/desbloquear
 * Desbloquear streaming (apenas admin/revenda)
 */
router.post('/desbloquear', async (req, res) => {
    try {
        const { login } = req.body;
        const userType = req.user?.type || req.user?.tipo;

        if (!login) {
            return res.status(400).json({
                success: false,
                message: 'Login do streaming é obrigatório'
            });
        }

        if (!userType || (userType !== 'admin' && userType !== 'revenda')) {
            return res.status(403).json({
                success: false,
                message: 'Acesso não autorizado'
            });
        }

        const result = await StreamingControlService.desbloquearStreaming(login, userType);

        if (result.success) {
            return res.json(result);
        } else {
            return res.status(500).json(result);
        }

    } catch (error) {
        console.error('Erro ao desbloquear streaming:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao desbloquear streaming',
            error: error.message
        });
    }
});

/**
 * DELETE /api/streaming-control/remover
 * Remover streaming (apenas admin/revenda)
 */
router.delete('/remover', async (req, res) => {
    try {
        const { login } = req.body;
        const userType = req.user?.type || req.user?.tipo;

        if (!login) {
            return res.status(400).json({
                success: false,
                message: 'Login do streaming é obrigatório'
            });
        }

        if (!userType || (userType !== 'admin' && userType !== 'revenda')) {
            return res.status(403).json({
                success: false,
                message: 'Acesso não autorizado'
            });
        }

        const result = await StreamingControlService.removerStreaming(login, userType);

        if (result.success) {
            return res.json(result);
        } else {
            return res.status(500).json(result);
        }

    } catch (error) {
        console.error('Erro ao remover streaming:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao remover streaming',
            error: error.message
        });
    }
});

/**
 * GET /api/streaming-control/status/:login
 * Verificar status do streaming
 */
router.get('/status/:login', async (req, res) => {
    try {
        const { login } = req.params;

        if (!login) {
            return res.status(400).json({
                success: false,
                message: 'Login do streaming é obrigatório'
            });
        }

        // Buscar configurações globais (opcional)
        const db = require('../config/database');
        const [configRows] = await db.execute('SELECT * FROM configuracoes LIMIT 1');
        const configData = configRows.length > 0 ? configRows[0] : null;

        const result = await StreamingControlService.verificarStatus(login, configData);

        return res.json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error('Erro ao verificar status:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao verificar status',
            error: error.message
        });
    }
});

/**
 * GET /api/streaming-control/list
 * Listar streamings do usuário
 */
router.get('/list', async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.codigo;
        const db = require('../config/database');

        const [streamings] = await db.execute(
            `SELECT s.*, srv.nome as servidor_nome, srv.status as servidor_status
             FROM streamings s
             LEFT JOIN servidores srv ON s.codigo_servidor = srv.codigo
             WHERE s.codigo_cliente = ?
             ORDER BY s.login`,
            [userId]
        );

        return res.json({
            success: true,
            streamings
        });

    } catch (error) {
        console.error('Erro ao listar streamings:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao listar streamings',
            error: error.message
        });
    }
});

module.exports = router;