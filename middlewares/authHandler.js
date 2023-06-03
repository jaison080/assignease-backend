const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
    const publicUrls = ["/auth/register", "/auth/login"];
    try
    {
        let urlPath = req.path;
        if(publicUrls.includes(urlPath))
        {
            next();
            return;
        }
        if(!req.headers.authorization)
        {
            return res.status(401).json({ message: "Auth failed" });
        }
        const token = req.headers.authorization.split(" ")[1];
        if(!token)
        {
            return res.status(401).json({ message: "Auth failed" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user_id = decoded.id;
        next();
    }
    catch (err)
    {
        return res.status(401).json({ message: "Auth failed" });
    }
};
module.exports = checkAuth;