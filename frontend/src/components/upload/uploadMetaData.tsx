import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFormContext } from "react-hook-form";


import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import type { UploadSchema } from "@/schemas/upload.schema";


const UploadMetadata = () => {
  const { control } = useFormContext<UploadSchema>();
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Video Details</CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        

        <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
                Choose a descriptive title that helps viewers understand your video.
            </p>
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter your video title"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
              Describe your content to improve discoverability.
          </p>

          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>

                <FormControl>
                  <Textarea
                    rows={8}
                    placeholder="Tell viewers about your video..."
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          
        </div>

      </CardContent>
    </Card>
  );
};

export default UploadMetadata;