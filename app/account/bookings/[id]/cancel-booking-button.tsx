"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleCancel() {
        setLoading(true);
        try {
            const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
                method: "POST",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error ?? "Cancellation failed");
            }

            toast.success("Booking cancelled successfully");
            router.refresh();
        } catch (err: any) {
            toast.error(err.message ?? "Something went wrong");
            setLoading(false);
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive">
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel booking
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will cancel your trip and initiate a refund to your original
                        payment method. Depending on our cancellation policy, you may not
                        receive a full refund.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Keep booking</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleCancel();
                        }}
                        disabled={loading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Cancelling...
                            </>
                        ) : (
                            "Yes, cancel it"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}