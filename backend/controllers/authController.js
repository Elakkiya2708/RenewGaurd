const supabase = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createAuditLog } = require("../services/auditService");


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
            return res.status(400).json({
                message: "Full name, email and password are required"
            });
        }

        const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .maybeSingle();

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
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
                password: hashedPassword,
                role: "Employee"
            }])
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                message: error.message
            });
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

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .maybeSingle();

        if (error || !user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // Audit log
        await createAuditLog(
            user.id,
            "User Login",
            `User logged in: ${user.email}`
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.full_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};