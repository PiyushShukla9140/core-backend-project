import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    loginSchema,
    type LoginFormData,
} from "../schemas/auth.schema";

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginFormData) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input
                type="email"
                placeholder="Email"
                {...register("email")}
            />

            <p>{errors.email?.message}</p>

            <input
                type="password"
                placeholder="Password"
                {...register("password")}
            />

            <p>{errors.password?.message}</p>

            <button type="submit">
                Login
            </button>
        </form>
    );
};

export default Login;