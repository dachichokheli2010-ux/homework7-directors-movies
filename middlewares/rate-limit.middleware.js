const { rateLimit, ipKeyGenerator } = require('express-rate-limit')


const rateLimiter = ({ limit = 5, windowMs = 60 * 1000, blockMs = 5 * 60 * 1000 } = {}) => {
    const blockedUntil = new Map()
    const getKey = (req) => ipKeyGenerator(req.ip)

    const sendBlocked = (res, until) => {
        const retryAfterSec = Math.ceil((until - Date.now()) / 1000)
        res.set('Retry-After', String(retryAfterSec))
        return res.status(429).json({
            success: false,
            message: `Too many requests. Try again in ${retryAfterSec} seconds`
        })
    }

    const blockGuard = (req, res, next) => {
        const key = getKey(req)
        const until = blockedUntil.get(key)

        if (until) {
            if (Date.now() < until) return sendBlocked(res, until)
            blockedUntil.delete(key)
        }

        next()
    }

    const limiter = rateLimit({
        windowMs,
        limit,
        standardHeaders: 'draft-8',
        legacyHeaders: false,
        keyGenerator: getKey,
        handler: (req, res) => {
            const key = getKey(req)
            const until = Date.now() + blockMs
            blockedUntil.set(key, until)
            limiter.resetKey(key) 
            return sendBlocked(res, until)
        }
    })

    setInterval(() => {
        const now = Date.now()
        for (const [key, until] of blockedUntil) {
            if (until <= now) blockedUntil.delete(key)
        }
    }, windowMs).unref()

    return [blockGuard, limiter]
}

module.exports = rateLimiter
