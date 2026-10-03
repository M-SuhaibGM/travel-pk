"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe/client";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

// ==========================================
// TYPES
// ==========================================
type PaymentFormProps = {
    tourId: string;
    startDate: string;         // ISO string
    guests: number;
    fullName: string;
    email: string;
    phone?: string;
    notes?: string;
};

type CreateIntentResponse = {
    clientSecret?: string;
    bookingId?: string;
    error?: string;
};

// ==========================================
// MAIN COMPONENT
// ==========================================
export function PaymentForm(props: PaymentFormProps) {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [initError, setInitError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function createIntent() {
            try {
                const res = await fetch("/api/bookings/create-intent", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(props),
                });

                const data: CreateIntentResponse = await res.json();

                if (cancelled) return;

                if (!res.ok || !data.clientSecret || !data.bookingId) {
                    setInitError(data.error ?? "Failed to initialize payment");
                    return;
                }

                // Store bookingId for later (used in confirm + redirect)
                sessionStorage.setItem("pendingBookingId", data.bookingId);
                setClientSecret(data.clientSecret);
            } catch (err: any) {
                if (!cancelled) {
                    setInitError(err.message ?? "Network error");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        createIntent();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border bg-card py-20">
                <Loader2 className="h-8 w-8 animate-spin text-[#00aa6c]" />
                <p className="mt-4 text-sm text-muted-foreground">
                    Preparing secure payment...
                </p>
            </div>
        );
    }

    // Error state
    if (initError || !clientSecret) {
        return (
            <div className="rounded-2xl border border-destructive/50 bg-destructive/5 p-8 text-center">
                <p className="font-medium text-destructive">
                    Could not initialize payment
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                    {initError ?? "Please refresh and try again."}
                </p>
                <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </Button>
            </div>
        );
    }

    // Render Elements wrapper
    return (
        <Elements
            stripe={stripePromise}
            options={{
                clientSecret,
                appearance: {
                    theme: "stripe",
                    variables: {
                        colorPrimary: "#00aa6c",
                        colorText: "#1a1a1a",
                        colorDanger: "#df1b41",
                        fontFamily: "inherit",
                        borderRadius: "8px",
                    },
                },
            }}
        >
            <CheckoutForm />
        </Elements>
    );
}

// ==========================================
// INNER CHECKOUT FORM (has access to useStripe/useElements)
// ==========================================
function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        setError(null);

        const bookingId = sessionStorage.getItem("pendingBookingId");
        if (!bookingId) {
            setError("Booking session expired. Please start over.");
            setLoading(false);
            return;
        }

        // 1. Validate the form fields (card number, expiry, CVC, etc.)
        const { error: submitError } = await elements.submit();
        if (submitError) {
            setError(submitError.message ?? "Please check your payment details");
            setLoading(false);
            return;
        }

        // 2. Confirm the payment with Stripe
        // 2. Confirm the payment with Stripe
        const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/book/success?bookingId=${bookingId}`,
            },
            redirect: "if_required",
        } as any); // 👈 TypeScript overload workaround

        // 3. Handle Stripe errors
        if (confirmError) {
            setError(mapStripeError(confirmError));
            setLoading(false);
            return;
        }

        // 4. For 3DS or redirect flows, Stripe handles redirect
        if (!paymentIntent) {
            // If we reach here without a paymentIntent, something is off
            setError("Payment status unknown. Please check your email.");
            setLoading(false);
            return;
        }

        // 5. If payment succeeded on the client, verify server-side
        if (paymentIntent.status === "succeeded") {
            try {
                const res = await fetch("/api/bookings/confirm", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        paymentIntentId: paymentIntent.id,
                        bookingId,
                    }),
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error ?? "Confirmation failed");
                }

                sessionStorage.removeItem("pendingBookingId");
                router.push(`/book/success?bookingId=${bookingId}`);
            } catch (err: any) {
                setError(err.message ?? "Payment succeeded, but confirmation failed");
                setLoading(false);
            }
            return;
        }

        // 6. Handle processing / requires_action states
        if (paymentIntent.status === "processing") {
            toast.message(
                "Your payment is processing. We'll email you once confirmed."
            );
            sessionStorage.removeItem("pendingBookingId");
            router.push(`/book/success?bookingId=${bookingId}`);
            return;
        }

        setError(`Unexpected payment status: ${paymentIntent.status}`);
        setLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Element */}
            <div className="rounded-2xl border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold">Payment details</h2>
                <PaymentElement
                    options={{
                        layout: "tabs",
                        // Uncomment to hide specific payment methods:
                        // paymentMethodOrder: ["card"],
                    }}
                />
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
                    {error}
                </div>
            )}

            {/* Pay button */}
            <Button
                type="submit"
                disabled={!stripe || !elements || loading}
                size="lg"
                className="h-12 w-full bg-[#00aa6c] text-base font-semibold text-white hover:bg-[#008f5b]"
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing payment...
                    </>
                ) : (
                    <>
                        <Lock className="mr-2 h-4 w-4" />
                        Pay now
                    </>
                )}
            </Button>

            {/* Trust badges */}
            <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#00aa6c]" />
                    Secured by Stripe · PCI-compliant
                </div>
                <p className="text-center">
                    Your card details never touch our servers.
                </p>
            </div>
        </form>
    );
}

// ==========================================
// STRIPE ERROR MAPPER
// ==========================================
function mapStripeError(error: { code?: string; message?: string }): string {
    const messages: Record<string, string> = {
        card_declined: "Your card was declined. Please try a different card.",
        expired_card: "Your card has expired. Please use a different card.",
        incorrect_cvc: "The security code is incorrect.",
        incorrect_number: "The card number is incorrect.",
        insufficient_funds: "Your card has insufficient funds.",
        processing_error:
            "An error occurred while processing your card. Please try again.",
        rate_limit: "Too many attempts. Please wait a moment and try again.",
        authentication_failure:
            "Authentication failed. Please try again or use a different card.",
        card_not_supported: "This card type is not supported.",
        currency_not_supported:
            "This currency is not supported for your card.",
        invalid_expiry_month: "The expiry month is invalid.",
        invalid_expiry_year: "The expiry year is invalid.",
    };

    return (
        messages[error.code ?? ""] ??
        error.message ??
        "Payment failed. Please try again."
    );
}
