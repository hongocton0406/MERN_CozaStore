import React from "react";
import styled from "styled-components";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import { IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { SignIn } from "redux/authSlice";
import { Helmet } from "react-helmet";

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),
        url("https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80")
            center;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Wrapper = styled.div`
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    overflow: hidden;
    width: 768px;
    max-width: 100%;
    min-height: 480px;
    display: flex;

    @media (max-width: 800px) {
        width: 560px;
    }

    @media (max-width: 600px) {
        width: 460px;
        margin: 0 12px;
    }
`;

const Box = styled.div`
    min-height: 100%;
    width: 50%;
    ${(props) =>
        props.backgroundColor
            ? `
                background: #56CCF2;
                background: -webkit-linear-gradient(to top, #2F80ED, #56CCF2);
                background: linear-gradient(to top, #2F80ED, #56CCF2);
                @media (max-width: 800px) {
                    display: none;
                }
            `
            : ""}
    @media (max-width: 800px) {
        width: 100%;
    }
`;

const Title = styled.h1`
    font-size: 32px;
    font-weight: bold;
    color: ${(props) => (props.black ? "#222" : "#fff")};
`;

const Form = styled.form`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 50px;
`;

const Socials = styled.div`
    margin: 20px 0;
`;

const Noted = styled.span`
    font-size: 12px;
`;

const Noted2 = styled.span`
    font-size: 14px;
    margin-right: 2px;
`;

const Input = styled.input`
    border: 1px solid #e6e6e6;
    outline: none;
    padding: 12px 15px;
    margin: 8px 0;
    width: 100%;
`;

const TextBox = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
`;

const Paragraph = styled.p`
    margin: 20px 0 30px;
    color: #fff;
    font-size: 14px;
    font-weight: 300;
    letter-spacing: 0.5;
`;

const ButtonLink = styled(Link)`
    min-width: 180px;
    height: 46px;
    color: #fff;
    font-size: 15px;
    text-transform: uppercase;
    font-weight: 600;
    line-height: 1.4667;
    padding: 5px 15px;
    border: 1px solid #fff;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s ease;

    &:hover {
        opacity: 0.8;
    }
`;

const TabletOption = styled.div`
    margin-top: 15px;
    display: none;
    @media (max-width: 800px) {
        display: block;
    }
`;

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isFetching } = useSelector((state) => state.auth);
    const schema = yup.object({
        email: yup.string().email().required(),
        password: yup.string().required(),
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const onSubmit = (data) => {
        dispatch(SignIn({ email: data.email, password: data.password })).then((res) => {
            if (!res.error) navigate("/");
        });
    };

    return (
        <>
            <Helmet>
                <title>Login</title>
            </Helmet>
            <Container>
                <Wrapper>
                    <Box backgroundColor>
                        <TextBox>
                            <Title>Hello, Guy!</Title>
                            <Paragraph>Enter your personal details and start journey with us</Paragraph>
                            <ButtonLink to="/register">Sign Up</ButtonLink>
                        </TextBox>
                    </Box>
                    <Box>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Title black>Sign In</Title>
                            <Socials className="socials">
                                <IconButton>
                                    <FacebookRoundedIcon sx={{ color: "#222" }} />
                                </IconButton>
                                <IconButton>
                                    <GoogleIcon sx={{ color: "#222" }} />
                                </IconButton>
                                <IconButton>
                                    <GitHubIcon sx={{ color: "#222" }} />
                                </IconButton>
                            </Socials>
                            <Noted>or use your account</Noted>
                            <Input type="email" {...register("email")} placeholder="Email" />
                            <p className="error-message">{errors.email?.message}</p>
                            <Input type="password" {...register("password")} placeholder="Password" />
                            <p className="error-message">{errors.password?.message}</p>
                            <Link to="#" className="link">
                                Forgot your password?
                            </Link>
                            <button className="btn btn-primary btn-lg text-uppercase" disabled={isFetching}>
                                Sign in
                            </button>
                            <TabletOption>
                                <Noted2>Don't have an account? </Noted2>
                                <Link to="/register" className="link">
                                    Create an account
                                </Link>
                            </TabletOption>
                        </Form>
                    </Box>
                </Wrapper>
            </Container>
        </>
    );
}

export default Login;
