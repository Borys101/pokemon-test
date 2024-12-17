import jwt from "jsonwebtoken";

export const verifyToken = async (token) => {
    try {
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    reject(new Error("Authentication failed"));
                } else {
                    resolve(decoded);
                }
            });
        });
        return decoded;
    } catch (error) {
        throw new Error("Authentication failed");
    }
};
