const supabase = require("../config/database");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
    try {
        const {
            full_name,
            email,
            mobile,
            organization,
            department,
            employee_id,
            password
        } = req.body;

        if (!full_name || !email || !password) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from("users")
            .insert([{
                full_name,
                email,
                mobile,
                organization,
                department,
                employee_id,
                password: hashedPassword
            }])
            .select()
            .single();

        if (error) {
            return res.status(400).json({ message: error.message });
        }

        res.status(201).json({
            message: "Registration successful",
            user: {
                id: data.id,
                name: data.full_name,
                email: data.email,
                role: data.role
            }
        });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};