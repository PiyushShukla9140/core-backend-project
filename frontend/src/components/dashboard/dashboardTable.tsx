import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { useDashboardVideos } from "@/hooks/useDashboardVideos";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil,  Video } from "lucide-react";
import DeleteVideoDialog from "@/components/dashboard/deleteVideoDialog";
import TogglePublishButton from "@/components/dashboard/TogglePublishButton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import { Link } from "react-router-dom";

const DashboardTable = () => {
    
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, loading, error,refetch } =
        useDashboardVideos(page);

  const videos = data?.videos ?? [];

  const pagination = data?.pagination;
  

  if (loading) {
    return (
        <Card>
            <CardContent className="py-20 text-center">
                Loading videos...
            </CardContent>
        </Card>
    );
  }

  if (error) {
    return (
        <Card>
            <CardContent className="py-20 text-center text-destructive">
                {error}
            </CardContent>
        </Card>
    );
  }
  if (videos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Videos</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Video className="h-10 w-10 text-muted-foreground" />
            </div>

            <h3 className="text-xl font-semibold">
              No videos uploaded yet
            </h3>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Upload your first video to start building your channel
              and engaging with your audience.
            </p>

            <Button
              className="mt-6"
              onClick={() => navigate("/upload")}
            >
              Upload Video
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Your Videos</CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
            <Table className="min-w-[900px]">
                <TableHeader>
                    <TableRow>
                        <TableHead>Video</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Uploaded</TableHead>
                        <TableHead className="text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {videos.map((video) => (
                        <TableRow key={video._id}>
                            {/* Video */}

                            <TableCell>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="h-16 w-28 rounded-md object-cover"
                                    />

                                    <div>
                                        <p className="font-medium line-clamp-2">
                                            {video.title}
                                        </p>
                                    </div>
                                </div>
                            </TableCell>

                            {/* Views */}

                            <TableCell>
                                {video.views.toLocaleString()}
                            </TableCell>

                            {/* Status */}

                            <TableCell>
                                <Badge
                                    variant={
                                        video.isPublished
                                            ? "default"
                                            : "secondary"
                                    }
                                >
                                    {video.isPublished
                                        ? "Published"
                                        : "Draft"}
                                </Badge>
                            </TableCell>

                            {/* Uploaded */}

                            <TableCell>
                                {new Date(
                                    video.createdAt
                                ).toLocaleDateString()}
                            </TableCell>

                            {/* Actions */}

                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon" asChild>
                                         <Link to={`/dashboard/videos/${video._id}/edit`}>
                                            <Pencil className="h-4 w-4" />
                                        </Link>
                                    </Button>

                                    <TogglePublishButton
                                        videoId={video._id}
                                        isPublished={video.isPublished}
                                        onToggle={refetch}
                                    />

                                    <DeleteVideoDialog
                                        videoId={video._id}
                                        title={video.title}
                                        onDelete={refetch}
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {pagination && pagination.totalPages > 1 && (
              <Pagination className="mt-6">
                  <PaginationContent>

                      <PaginationItem>
                          <PaginationPrevious
                              href="#"
                              onClick={(e) => {
                                  e.preventDefault();

                                  if (pagination.hasPreviousPage) {
                                      setPage((prev) => prev - 1);
                                  }
                              }}
                              className={
                                  !pagination.hasPreviousPage
                                      ? "pointer-events-none opacity-50"
                                      : ""
                              }
                          />
                      </PaginationItem>

                      {Array.from(
                          { length: pagination.totalPages },
                          (_, index) => (
                              <PaginationItem key={index}>
                                  <PaginationLink
                                      href="#"
                                      isActive={
                                          pagination.currentPage ===
                                          index + 1
                                      }
                                      onClick={(e) => {
                                          e.preventDefault();
                                          setPage(index + 1);
                                      }}
                                  >
                                      {index + 1}
                                  </PaginationLink>
                              </PaginationItem>
                          )
                      )}

                      <PaginationItem>
                          <PaginationNext
                              href="#"
                              onClick={(e) => {
                                  e.preventDefault();

                                  if (pagination.hasNextPage) {
                                      setPage((prev) => prev + 1);
                                  }
                              }}
                              className={
                                  !pagination.hasNextPage
                                      ? "pointer-events-none opacity-50"
                                      : ""
                              }
                          />
                      </PaginationItem>

                  </PaginationContent>
              </Pagination>
          )}
        </CardContent>
    </Card>
);


  
};

export default DashboardTable;