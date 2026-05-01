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
    Section,
    Column,
    Row,
} from "react-email";

export default function Email({ href }: { href: string }) {
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
                {/* A simple `section` */}
                <Section>
                    <Text>Hello World</Text>
                </Section>

                {/* Formatted with `rows` and `columns` */}
                <Section>
                    <Row>
                        <Column>Column 1, Row 1</Column>
                        <Column>Column 2, Row 1</Column>
                    </Row>
                    <Row>
                        <Column>Column 1, Row 2</Column>
                        <Column>Column 2, Row 2</Column>
                    </Row>
                </Section>
            </Tailwind>
        </Html>
    );
}
