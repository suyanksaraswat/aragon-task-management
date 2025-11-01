"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { trpc } from "@/app/_trpc/client";
import { toast } from "sonner";

// -----------------------------
// SCHEMA
// -----------------------------
const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export default function CreateTaskForm() {
  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
    },
  });

  const utils = trpc.useContext();
  const createTaskMutation = trpc.tasks.create.useMutation({
    onSuccess: (data) => {
      utils.tasks.invalidate(); // refresh task list
      form.reset();
      toast.success("Task created successfully!", {
        description: `"${data.title}" has been created and is now live.`,
      });
    },
    onError: (error) => {
      toast.error("Failed to create task", {
        description: error.message || "Please try again later.",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof taskSchema>) => {
    createTaskMutation.mutate({ title: values.title });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter task title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={createTaskMutation.isLoading}
          className="w-full"
        >
          {createTaskMutation.isLoading ? "Creating..." : "Create Task"}
        </Button>
      </form>
    </Form>
  );
}
