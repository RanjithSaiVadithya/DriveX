import { BookingWizard } from "@/features/user/booking-wizard";

export default function BookPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-h1">Book a Driver</h1>
        <p className="mt-2 text-muted-foreground">
          Choose pickup, destination, your vehicle, and a driving service.
          Fare estimates are mock values for the driver service.
        </p>
      </div>
      <BookingWizard />
    </div>
  );
}
