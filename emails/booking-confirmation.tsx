import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type Props = {
  name: string;
  tourTitle: string;
  reference: string;
  startDate: string;   // ISO string
  guests: number;
  total: number;
  currency: string;
  appUrl?: string;
};

export function BookingConfirmationEmail({
  name,
  tourTitle,
  reference,
  startDate,
  guests,
  total,
  currency,
  appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
}: Props) {
  const formattedDate = new Date(startDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Html>
      <Head />
      <Preview>
        Your booking for {tourTitle} is confirmed — ref {reference}
      </Preview>

      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={headerSection}>
            <Text style={brand}>Travel</Text>
          </Section>

          {/* Title */}
          <Heading style={h1}>Booking confirmed 🎉</Heading>

          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Great news — your booking for <strong>{tourTitle}</strong> is
            confirmed. We can&apos;t wait for you to experience it.
          </Text>

          {/* Booking details box */}
          <Section style={box}>
            <Text style={row}>
              <span style={label}>Reference:</span>{" "}
              <span style={value}>{reference}</span>
            </Text>
            <Text style={row}>
              <span style={label}>Tour:</span>{" "}
              <span style={value}>{tourTitle}</span>
            </Text>
            <Text style={row}>
              <span style={label}>Start date:</span>{" "}
              <span style={value}>{formattedDate}</span>
            </Text>
            <Text style={row}>
              <span style={label}>Guests:</span>{" "}
              <span style={value}>
                {guests} {guests === 1 ? "guest" : "guests"}
              </span>
            </Text>
            <Text style={rowTotal}>
              <span style={labelBold}>Total paid:</span>{" "}
              <span style={valueBold}>
                ${total.toFixed(0)} {currency}
              </span>
            </Text>
          </Section>

          {/* CTA */}
          <Section style={ctaSection}>
            <Button
              href={`${appUrl}/account/bookings`}
              style={button}
            >
              View my bookings
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footerText}>
            Need to make changes? Visit your account or reply to this email.
            Free cancellation policy applies.
          </Text>

          <Text style={footerSmall}>
            © {new Date().getFullYear()} Travel. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// ==========================================
// STYLES
// ==========================================
const body = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  margin: 0,
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px",
  borderRadius: "12px",
  maxWidth: "560px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
};

const headerSection = {
  textAlign: "center" as const,
  marginBottom: "30px",
};

const brand = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#00aa6c",
  margin: "0",
};

const h1 = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1a1a1a",
  margin: "0 0 20px",
  textAlign: "center" as const,
};

const text = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#333333",
  margin: "0 0 12px",
};

const box = {
  backgroundColor: "#f6f9fc",
  padding: "20px",
  borderRadius: "8px",
  margin: "20px 0",
};

const row = {
  fontSize: "14px",
  margin: "8px 0",
  color: "#333333",
};

const rowTotal = {
  fontSize: "15px",
  margin: "16px 0 0",
  paddingTop: "12px",
  borderTop: "1px solid #e6ebf1",
  color: "#1a1a1a",
};

const label = {
  color: "#8898aa",
  marginRight: "6px",
};

const labelBold = {
  color: "#1a1a1a",
  fontWeight: "bold" as const,
  marginRight: "6px",
};

const value = {
  color: "#1a1a1a",
  fontWeight: "500" as const,
};

const valueBold = {
  color: "#00aa6c",
  fontWeight: "bold" as const,
};

const ctaSection = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#00aa6c",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "bold" as const,
  textDecoration: "none",
  padding: "12px 28px",
  borderRadius: "8px",
  display: "inline-block",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "30px 0",
};

const footerText = {
  fontSize: "13px",
  lineHeight: "1.6",
  color: "#8898aa",
  margin: "0 0 12px",
};

const footerSmall = {
  fontSize: "12px",
  color: "#8898aa",
  textAlign: "center" as const,
  margin: "20px 0 0",
};