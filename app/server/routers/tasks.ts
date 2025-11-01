import { protectedProcedure, router } from "../trpc";
import prisma from "@/lib/prisma";
import { z } from "zod";

export const taskRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.userId;

      if (!userId) {
        throw new Error("User ID is required");
      }

      // Create task linked to user
      const task = await prisma.task.create({
        data: {
          title: input.title,
          ownerId: userId,
        },
      });

      return task;
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1).optional(),
        limit: z.number().min(1).max(100).default(10).optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.auth.userId;

        if (!userId) {
          throw new Error("User ID is required");
        }

        const page = input.page ?? 1;
        const limit = input.limit ?? 10;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = { ownerId: userId };

        if (input.search) {
          where.title = { contains: input.search, mode: "insensitive" };
        }

        // Fetch tasks with pagination
        const [tasks, totalCount] = await Promise.all([
          prisma.task.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
          }),
          prisma.task.count({ where }),
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return {
          tasks,
          pagination: {
            page,
            limit,
            totalCount,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        };
      } catch (error) {
        console.error("Error fetching tasks: ", error);
        throw new Error("Failed to fetch tasks");
      }
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.auth.userId;

        if (!userId) {
          throw new Error("User ID is required");
        }

        const { id } = input;

        const task = await prisma.task.findFirst({
          where: { id, ownerId: userId },
        });

        if (!task) {
          throw new Error("Task not found or access denied");
        }

        return task;
      } catch (error) {
        console.error("Error fetching task: ", error);
        throw new Error("Failed to fetch task");
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.auth.userId;

        if (!userId) {
          throw new Error("User ID is required");
        }

        const { id, ...updateData } = input;

        // Verify the task belongs to the user
        const existingTask = await prisma.task.findFirst({
          where: { id, ownerId: userId },
        });

        if (!existingTask) {
          throw new Error("Task not found or access denied");
        }

        const updatedTask = await prisma.task.update({
          where: { id },
          data: updateData,
        });

        return updatedTask;
      } catch (error) {
        console.error("Error updating task: ", error);
        throw new Error("Failed to update task");
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.auth.userId;

        if (!userId) {
          throw new Error("User ID is required");
        }

        const { id } = input;

        // Verify the task belongs to the user
        const existingTask = await prisma.task.findFirst({
          where: { id, ownerId: userId },
        });

        if (!existingTask) {
          throw new Error("Task not found or access denied");
        }

        await prisma.task.delete({
          where: { id },
        });

        return { success: true };
      } catch (error) {
        console.error("Error deleting task: ", error);
        throw new Error("Failed to delete task");
      }
    }),
});

export type TaskRouter = typeof taskRouter;

