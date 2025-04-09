"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import {
  Calendar,
  Clock,
  DownloadIcon,
  Edit,
  EyeIcon,
  FilterIcon,
  MapPin,
  PlusIcon,
  SearchIcon,
  Trash2,
  Users,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const page = () => {
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { toast } = useToast();
  const { user } = useUser();

  const events: any = [];
  const categories: any = [];
  const isLoadingEvents = false;

  // Filter events based on search query and category filter
  const filteredEvents = events
    ? events.filter((event: any) => {
        const matchesSearch =
          searchQuery === "" ||
          event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          categoryFilter === "all" ||
          event.categoryId === parseInt(categoryFilter);

        return matchesSearch && matchesCategory;
      })
    : [];

  // Handle delete event
  const handleDeleteEvent = (eventId: number) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      // delete event logic
    }
  };

  // Function to render category name from ID
  const getCategoryName = (categoryId: number) => {
    if (!categories) return "";
    const category = categories.find((cat: any) => cat.id === categoryId);
    return category ? category.name : "";
  };

  return (
    <>
      <div className="max-w-screen-xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Events</h1>
            <p className="text-slate-500 mt-1">
              Manage your upcoming and past events
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <DownloadIcon className="h-4 w-4" />
              Export
            </Button>
            <Button
              onClick={() => setIsCreateEventModalOpen(true)}
              className="bg-jmprimary text-primary-foreground hover:bg-jmprimary/50"
              size="sm"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              New Event
            </Button>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search events..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-48">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <div className="flex items-center">
                  <FilterIcon className="h-4 w-4 mr-2 text-slate-400" />
                  <SelectValue placeholder="All Categories" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories &&
                  categories.map((category: any) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoadingEvents ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} className="overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <Card className="bg-slate-50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-16 w-16 text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-700 mb-2">
                No events found
              </h3>
              <p className="text-sm text-slate-500 text-center mb-6">
                {searchQuery || categoryFilter !== "all"
                  ? "No events match your search criteria. Try adjusting your filters."
                  : "You don't have any events yet. Create your first event to get started."}
              </p>
              <Button
                onClick={() => setIsCreateEventModalOpen(true)}
                className="bg-jmprimary hover:bg-jmprimary"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Create New Event
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event: any) => {
              const categoryName = getCategoryName(event.categoryId);
              const eventDate = formatDate(event.date);

              return (
                <Card key={event.id} className="overflow-hidden">
                  <div
                    className="h-40 bg-cover bg-center relative"
                    style={{
                      backgroundImage: event.bannerImage
                        ? `url(${event.bannerImage})`
                        : "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60')",
                    }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="absolute top-2 right-2">
                      <Badge
                        className={
                          event.isPublished ? "bg-green-500" : "bg-amber-500"
                        }
                      >
                        {event.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg text-slate-900 mb-1 line-clamp-1">
                      {event.name}
                    </h3>

                    {categoryName && (
                      <Badge variant="outline" className="mb-2">
                        {categoryName}
                      </Badge>
                    )}

                    <div className="space-y-2 mt-3">
                      <div className="flex items-start gap-2 text-sm text-slate-500">
                        <Calendar className="h-4 w-4 mt-0.5" />
                        <span>{eventDate}</span>
                      </div>

                      <div className="flex items-start gap-2 text-sm text-slate-500">
                        <Clock className="h-4 w-4 mt-0.5" />
                        <span>
                          {event.startTime} - {event.endTime}
                        </span>
                      </div>

                      <div className="flex items-start gap-2 text-sm text-slate-500">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>

                      <div className="flex items-start gap-2 text-sm text-slate-500">
                        <Users className="h-4 w-4 mt-0.5" />
                        <span>{event.capacity} capacity</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View
                        </Button>

                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default page;
