const roleCheck = (targetRole) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== targetRole) {
            return res.status(403).json({ error: "Zugriff verweigert!" });
        }
        next();
    };
};

export default roleCheck;