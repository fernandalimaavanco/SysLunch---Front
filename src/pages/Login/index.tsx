import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Eye, EyeSlash } from 'phosphor-react';
import { Container, Form, Title, InputContainer, Input, EyeIcon, Button } from './styles';
import logo from "../../assets/SysLunch.svg"
import { useContextSelector } from 'use-context-selector';
import { AuthContext } from '../../contexts/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Alert from '../../components/Alert';
import { AlertContext } from '../../contexts/AlertContext';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
    email: z.string().email('E-mail inválido.').nonempty('O campo e-mail é obrigatório.'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const alerts = useContextSelector(AlertContext, (context) => context.alerts);
    const removeAlert = useContextSelector(AlertContext, (context) => context.removeAlert);

    const login = useContextSelector(AuthContext, (context) => {
        return context.login
    })

    const isAuthenticated = useContextSelector(AuthContext, (context) => {
        return context.isAuthenticated
    })

    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home');
        } else {
            navigate('/login');
        }
    }, [isAuthenticated]);

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
        reset,
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function handleVeriftyLogin(data: LoginFormInputs) {
        try {

            const { email, password } = data

            login(email, password)
            reset({
                email: '',
                password: '',
            })

        } catch (error) {
            console.log(error)
        }
    };

    return (
        <>
            <Alert alerts={alerts} onClose={removeAlert} />
            <Container>

                <Form onSubmit={handleSubmit(handleVeriftyLogin)}>
                    <img src={logo} />
                    <Title>Login</Title>
                    <InputContainer>
                        <Input
                            type="email"
                            placeholder="Email"
                            {...register('email')}
                        />
                        {errors.email && <p>{errors.email.message}</p>}
                    </InputContainer>
                    <InputContainer>
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Senha"
                            {...register('password')}
                        />
                        <EyeIcon
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                        </EyeIcon>
                        {errors.password && <p>{errors.password.message}</p>}
                    </InputContainer>
                    <Button type="submit" disabled={isSubmitting}>Entrar</Button>
                </Form>
            </Container>
        </>
    );
}
