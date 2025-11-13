import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';

/**
 * Rate Limiting - Proteção contra ataques de força bruta
 */
export const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: { error: 'Muitas requisições. Por favor, tente novamente mais tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health' || req.path === '/api/health';
  }
});

/**
 * Rate limiting mais restritivo para autenticação
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas
  message: { error: 'Muitas tentativas de login. Por favor, aguarde 15 minutos.' },
  skipSuccessfulRequests: true,
  skipFailedRequests: false
});

/**
 * Rate limiting para rotas sensíveis
 */
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Limite de requisições excedido para esta operação.' },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Middleware de autenticação JWT
 */
export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido' });
  }

  const token = authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-this';
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    return res.status(403).json({ error: 'Token inválido' });
  }
};

/**
 * Middleware de autorização por role
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Acesso negado',
        message: 'Você não tem permissão para acessar este recurso'
      });
    }

    next();
  };
};

/**
 * Sanitização de inputs - Remove caracteres perigosos
 */
export const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      // Remove caracteres SQL perigosos e XSS
      return obj
        .replace(/[<>]/g, '') // Remove < e >
        .replace(/javascript:/gi, '') // Remove javascript:
        .replace(/on\w+=/gi, '') // Remove event handlers
        .trim();
    }

    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        obj[key] = sanitize(obj[key]);
      });
    }

    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }

  if (req.query) {
    req.query = sanitize(req.query);
  }

  if (req.params) {
    req.params = sanitize(req.params);
  }

  next();
};

/**
 * Validação de CPF
 */
export const isValidCPF = (cpf) => {
  if (typeof cpf !== 'string') return false;

  cpf = cpf.replace(/[^\d]/g, '');

  if (cpf.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;

  return true;
};

/**
 * Middleware de validação de CPF
 */
export const validateCPF = (req, res, next) => {
  const cpf = req.body.cpf || req.params.cpf || req.query.cpf;

  if (cpf && !isValidCPF(cpf)) {
    return res.status(400).json({ error: 'CPF inválido' });
  }

  next();
};

/**
 * Middleware de logging de segurança
 */
export const securityLogger = (logger) => {
  return (req, res, next) => {
    const startTime = Date.now();

    // Log após a resposta
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const logData = {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent'),
        userId: req.user?.id || 'anonymous'
      };

      // Log de erro para status 4xx e 5xx
      if (res.statusCode >= 400) {
        logger.warn('Request failed', logData);
      } else {
        logger.info('Request completed', logData);
      }
    });

    next();
  };
};

/**
 * Middleware de proteção contra CSRF (simplificado)
 */
export const csrfProtection = (req, res, next) => {
  // Para métodos seguros, não valida CSRF
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Verifica origin/referer
  const origin = req.get('origin') || req.get('referer');
  const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];

  if (origin) {
    const isAllowed = allowedOrigins.some(allowed =>
      origin.startsWith(allowed.trim())
    );

    if (!isAllowed && process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        error: 'CSRF validation failed',
        message: 'Request origin not allowed'
      });
    }
  }

  next();
};

/**
 * Middleware de timeout para requisições
 */
export const requestTimeout = (timeout = 30000) => {
  return (req, res, next) => {
    req.setTimeout(timeout, () => {
      res.status(408).json({
        error: 'Request timeout',
        message: 'A requisição demorou muito tempo para ser processada'
      });
    });
    next();
  };
};

/**
 * Headers de segurança
 */
export const securityHeaders = (req, res, next) => {
  // Já configurados no vercel.json, mas mantém como fallback
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Remove header que expõe tecnologia
  res.removeHeader('X-Powered-By');

  next();
};

/**
 * Middleware de tratamento de erros
 */
export const errorHandler = (logger) => {
  return (err, req, res, next) => {
    logger.error('Unhandled error', {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      userId: req.user?.id
    });

    // Não expõe detalhes de erro em produção
    if (process.env.NODE_ENV === 'production') {
      return res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Ocorreu um erro ao processar sua requisição'
      });
    }

    res.status(500).json({
      error: err.message,
      stack: err.stack
    });
  };
};
