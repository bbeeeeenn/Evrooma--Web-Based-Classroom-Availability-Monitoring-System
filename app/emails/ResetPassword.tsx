import {
    Button,
    Html,
    Head,
    Container,
    Img,
    Tailwind,
    pixelBasedPreset,
    Text,
    Heading,
} from "react-email";

export default function ResetPasswordEmail({ href }: { href: string }) {
    return (
        <Html>
            <Tailwind
                config={{
                    presets: [pixelBasedPreset],
                    theme: {
                        extend: {
                            colors: {
                                brand: "#007291",
                            },
                        },
                    },
                }}
            >
                <Head />
                <Img
                    src="https://www.evrooma.online/logo_white.png"
                    alt=""
                    width={75}
                    height={75}
                    className="m-auto mt-10 rounded-full bg-black p-1.5"
                />
                <Heading className="text-md text-center font-sans font-bold">
                    Password Reset
                </Heading>
                <Text className="text-md text-center font-sans font-semibold">
                    Seems like you forgot your password for Evrooma. If this is
                    true, click below to reset your password.
                </Text>
                <Container className="w-fit">
                    <Button
                        href={href}
                        className="mx-auto w-fit rounded-md border-2 border-white bg-black px-10 py-4 font-sans text-xl font-bold tracking-wide text-white"
                    >
                        Reset My Password
                    </Button>
                </Container>
                <Text className="text-md text-center font-sans font-semibold">
                    If you did not forgot your password you can safely ignore
                    this email.
                </Text>
            </Tailwind>
        </Html>
    );
}
