const supabase = require("../config/database");

async function createAuditLog(userId, action, details) {
    try {
        await supabase
            .from("audit_logs")
            .insert([
                {
                    user_id: userId,
                    action: action,
                    details: details
                }
            ]);
    } catch (error) {
        console.error("Audit Log Error:", error);
    }
}

module.exports = {
    createAuditLog
};