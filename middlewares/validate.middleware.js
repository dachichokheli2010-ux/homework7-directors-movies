

const validate = (schema, source = 'body') => (req, res, next) => {
    const result = schema.safeParse(req[source] ?? {})

    if (!result.success) {
        const seen = new Set()
        const errors = []
        for (const issue of result.error.issues) {
            const field = issue.path.join('.') || source
            const key = `${field}:${issue.message}`
            if (seen.has(key)) continue
            seen.add(key)
            errors.push({ [field]: issue.message })
        }

        return res.status(400).json({ success: false, errors })
    }

    if (source === 'body') req.body = result.data
    else req.validated = result.data

    next()
}

module.exports = validate
