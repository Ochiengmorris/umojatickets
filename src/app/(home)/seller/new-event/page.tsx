import EventForm from "@/components/events/EventForm";

export default function NewEventPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className=" border bg-card text-card-foreground rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#00c9aa] to-[#00a184] px-6 py-8 text-black">
          <h2 className="text-2xl font-bold">Create New Event</h2>
          <p className="text-gray-600 mt-2">
            List your event and start selling tickets
          </p>
        </div>

        <div className="p-6">
          <EventForm mode="create" />
        </div>
      </div>
    </div>
  );
}
