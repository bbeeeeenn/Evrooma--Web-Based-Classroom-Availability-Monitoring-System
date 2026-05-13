import {
    Html,
    Head,
    Tailwind,
    pixelBasedPreset,
    Text,
    Heading,
} from "react-email";

export default function NewInstructorEmail({
    email = "example@email.com",
    password = "1234567890",
}: {
    email: string;
    password: string;
}) {
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
                <Heading className="text-md font-sans font-bold">
                    Instructor Account Created
                </Heading>
                <Text className="font-sans text-base font-semibold">
                    Dear Instructor,<br></br>
                    <br></br>A new instructor account has been successfully
                    created for you in the system.<br></br>
                    <br></br>You may now log in using the following credentials:
                </Text>
                <Text className="font-sans text-lg font-bold">Email:</Text>
                <Text className="w-fit font-sans text-xl font-bold underline">
                    {email}
                </Text>
                <Text className="font-sans text-lg font-bold">Password:</Text>
                <Text className="w-fit bg-black px-2 font-sans text-xl font-bold text-white">
                    {password}
                </Text>
                <Text className="font-sans text-base font-semibold">
                    For security purposes, we recommend changing your password
                    after your first login.<br></br>
                    <br></br>If you experience any issues accessing your
                    account, please contact the system administrator.<br></br>
                    <br></br> Best regards,
                </Text>
                <Text className="font-sans text-xl font-bold">Evrooma</Text>
            </Tailwind>
        </Html>
    );
}
