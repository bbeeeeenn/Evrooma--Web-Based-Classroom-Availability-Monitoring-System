import {
    Button,
    Html,
    Head,
    Body,
    Container,
    Img,
    Tailwind,
    pixelBasedPreset,
    Text,
    Heading,
} from "react-email";

export default function Email({ href }: { href: string }) {
    return (
        <Html>
            <Head />
            <Body>
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
                    <Container className="w-full bg-gray-100">
                        <Img
                            src="https://www.evrooma.online/logo_black.png"
                            alt=""
                            width={75}
                            height={75}
                            className="mx-auto mt-3"
                        />
                        <Container className="px-5">
                            <Heading className="text-md text-center font-sans font-semibold">
                                Password Reset
                            </Heading>
                            <Text className="text-md font-sans font-semibold">
                                Seems like you forgot your password for Evrooma.
                                If this is true, click below to reset your
                                password.
                            </Text>
                            <Button
                                href={href}
                                className="mx-auto w-fit rounded-md bg-black px-10 py-4 font-sans text-xl font-bold tracking-wide text-white"
                            >
                                Reset My Password
                            </Button>
                            <Text className="text-md font-sans font-semibold">
                                If you did not forgot your password you can
                                safely ingore this email.
                            </Text>
                        </Container>
                    </Container>
                </Tailwind>
            </Body>
        </Html>
    );
}
