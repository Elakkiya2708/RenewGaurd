const supabase = require("../config/database");

// GET ALL USERS
exports.getUsers = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("id, full_name, email, mobile, organization, department, employee_id, role, created_at")
            .order("created_at", { ascending: false });

        if (error) {
            return res.status(400).json({
                message: error.message
            });
        }

        res.json(data);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// UPDATE USER ROLE
exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role || !["Admin", "Employee"].includes(role)) {
            return res.status(400).json({
                message: "Invalid role"
            });
        }

        const { data, error } = await supabase
            .from("users")
            .update({ role })
            .eq("id", id)
            .select("id, full_name, email, role")
            .single();

        if (error) {
            return res.status(400).json({
                message: error.message
            });
        }

        res.json({
            message: "User role updated successfully",
            user: data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// DELETE USER
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from("users")
            .delete()
            .eq("id", id);

        if (error) {
            return res.status(400).json({
                message: error.message
            });
        }

        res.json({
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// GET MY PROFILE
exports.getProfile = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("id, full_name, email, mobile, organization, department, employee_id, role, created_at")
            .eq("id", req.user.id)
            .single();

        if (error) {
            return res.status(400).json({
                message: error.message
            });
        }

        res.json(data);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// UPDATE MY PROFILE
exports.updateProfile = async (req, res) => {
    try {
        const {
            full_name,
            mobile,
            organization,
            department,
            employee_id
        } = req.body;

        if (!full_name) {
            return res.status(400).json({
                message: "Full name is required"
            });
        }

        const { data, error } = await supabase
            .from("users")
            .update({
                full_name,
                mobile,
                organization,
                department,
                employee_id
            })
            .eq("id", req.user.id)
            .select("id, full_name, email, mobile, organization, department, employee_id, role")
            .single();

        if (error) {
            return res.status(400).json({
                message: error.message
            });
        }

        res.json({
            message: "Profile updated successfully",
            user: data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};