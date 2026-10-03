import { DestinationForm } from "@/components/admin/destination-form";

export const dynamic = "force-dynamic";

export default function NewDestinationPage() {
    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Add destination</h2>
                <p className="text-sm text-muted-foreground">
                    Create a new destination to organize your tours
                </p>
            </div>

            <DestinationForm mode="create" />
        </div>
    );
}