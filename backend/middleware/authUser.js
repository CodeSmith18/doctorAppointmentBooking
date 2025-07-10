import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: 'Not Authorized. Login Again.' });
    }

    try {
        const token = authHeader.split(" ")[1]; // Get the token after "Bearer"
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decoded.id;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: 'Invalid Token: ' + error.message });
    }
};

export default authUser;
