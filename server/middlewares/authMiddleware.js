import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers["authorization"].split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    success: false,
                    message: "Authentication failed",
                });
            } else {
                req.body.address = decoded.address;
                next();
            }
        });
    } catch (error) {
        return res
            .status(401)
            .send({ success: false, message: "Authentication failed" });
    }
};

export default authMiddleware;
