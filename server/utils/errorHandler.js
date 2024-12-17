export const handleError = (err, res) => {
    console.error("Error:", err);
    res.status(500).json({
        status: "error",
        message: "Internal server error",
    });
};
