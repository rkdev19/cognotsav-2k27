import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";

// ============ VALIDATION SCHEMAS ============

const studentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  rollNumber: z.string().min(1, "Roll number is required"),
  department: z.string().min(1, "Department is required"),
  year: z.number().int().min(1).max(4),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone number"),
});

const eventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().optional(),
  date: z.date(),
  venue: z.string().min(1, "Venue is required"),
  maxParticipants: z.number().int().positive(),
  eventType: z.enum(["individual", "team"]),
  prize: z.string().optional(),
});

const teamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  leaderId: z.number().int().positive(),
});

const registrationSchema = z.object({
  eventId: z.number().int().positive(),
  studentId: z.number().int().positive().optional(),
  teamId: z.number().int().positive().optional(),
});

const resultSchema = z.object({
  eventId: z.number().int().positive(),
  position: z.number().int().positive(),
  score: z.number().optional(),
  studentId: z.number().int().positive().optional(),
  teamId: z.number().int().positive().optional(),
});

const adminLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ============ ADMIN AUTHENTICATION ============

const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  // Check if user has admin role in the session
  const adminSession = ctx.req.headers["x-admin-session"] as string | undefined;
  if (!adminSession) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin access required" });
  }
  return next({ ctx: { ...ctx, isAdmin: true } });
});

// ============ APP ROUTER ============

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============ STUDENT ROUTES ============
  student: router({
    create: publicProcedure
      .input(studentSchema)
      .mutation(async ({ input }) => {
        try {
          await db.createStudent(input);
          return { success: true, message: "Student registered successfully" };
        } catch (error: any) {
          if (error.message.includes("Duplicate entry")) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Email or Roll Number already exists",
            });
          }
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
        }
      }),

    list: publicProcedure.query(async () => {
      return await db.getStudents();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .query(async ({ input }) => {
        const student = await db.getStudentById(input.id);
        if (!student) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Student not found" });
        }
        return student;
      }),

    update: adminProcedure
      .input(z.object({ id: z.number().int().positive(), data: studentSchema.partial() }))
      .mutation(async ({ input }) => {
        await db.updateStudent(input.id, input.data);
        return { success: true, message: "Student updated successfully" };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await db.deleteStudent(input.id);
        return { success: true, message: "Student deleted successfully" };
      }),
  }),

  // ============ EVENT ROUTES ============
  event: router({
    create: adminProcedure
      .input(eventSchema)
      .mutation(async ({ input }) => {
        const eventData: any = {
          name: input.name,
          date: input.date,
          venue: input.venue,
          maxParticipants: input.maxParticipants,
          eventType: input.eventType,
          description: input.description || null,
          prize: input.prize || null,
        };
        await db.createEvent(eventData);
        return { success: true, message: "Event created successfully" };
      }),

    list: publicProcedure.query(async () => {
      return await db.getEvents();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .query(async ({ input }) => {
        const event = await db.getEventById(input.id);
        if (!event) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
        }
        return event;
      }),

    update: adminProcedure
      .input(z.object({ id: z.number().int().positive(), data: eventSchema.partial() }))
      .mutation(async ({ input }) => {
        await db.updateEvent(input.id, input.data);
        return { success: true, message: "Event updated successfully" };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await db.deleteEvent(input.id);
        return { success: true, message: "Event deleted successfully" };
      }),
  }),

  // ============ TEAM ROUTES ============
  team: router({
    create: publicProcedure
      .input(teamSchema)
      .mutation(async ({ input }) => {
        await db.createTeam(input);
        return { success: true, message: "Team created successfully" };
      }),

    list: publicProcedure.query(async () => {
      return await db.getTeams();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .query(async ({ input }) => {
        const team = await db.getTeamById(input.id);
        if (!team) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Team not found" });
        }
        return team;
      }),

    getMembers: publicProcedure
      .input(z.object({ teamId: z.number().int().positive() }))
      .query(async ({ input }) => {
        return await db.getTeamMembers(input.teamId);
      }),

    addMember: publicProcedure
      .input(z.object({ teamId: z.number().int().positive(), studentId: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await db.addTeamMember(input.teamId, input.studentId);
        return { success: true, message: "Member added to team" };
      }),

    removeMember: publicProcedure
      .input(z.object({ teamId: z.number().int().positive(), studentId: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await db.removeTeamMember(input.teamId, input.studentId);
        return { success: true, message: "Member removed from team" };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await db.deleteTeam(input.id);
        return { success: true, message: "Team deleted successfully" };
      }),
  }),

  // ============ REGISTRATION ROUTES ============
  registration: router({
    create: publicProcedure
      .input(registrationSchema)
      .mutation(async ({ input }) => {
        const isDuplicate = await db.checkDuplicateRegistration(
          input.eventId,
          input.studentId,
          input.teamId
        );

        if (isDuplicate) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Already registered for this event",
          });
        }

        const regData: any = {
          eventId: input.eventId,
          studentId: input.studentId || null,
          teamId: input.teamId || null,
        };
        await db.createRegistration(regData);
        return { success: true, message: "Registration successful" };
      }),

    list: publicProcedure.query(async () => {
      return await db.getRegistrations();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .query(async ({ input }) => {
        const registration = await db.getRegistrationById(input.id);
        if (!registration) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Registration not found" });
        }
        return registration;
      }),

    getByEvent: publicProcedure
      .input(z.object({ eventId: z.number().int().positive() }))
      .query(async ({ input }) => {
        return await db.getRegistrationsByEvent(input.eventId);
      }),

    getByStudent: publicProcedure
      .input(z.object({ studentId: z.number().int().positive() }))
      .query(async ({ input }) => {
        return await db.getRegistrationsByStudent(input.studentId);
      }),

    getByTeam: publicProcedure
      .input(z.object({ teamId: z.number().int().positive() }))
      .query(async ({ input }) => {
        return await db.getRegistrationsByTeam(input.teamId);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await db.deleteRegistration(input.id);
        return { success: true, message: "Registration deleted successfully" };
      }),
  }),

  // ============ RESULT ROUTES ============
  result: router({
    create: adminProcedure
      .input(resultSchema)
      .mutation(async ({ input }) => {
        const resultData: any = {
          eventId: input.eventId,
          position: input.position,
          studentId: input.studentId || null,
          teamId: input.teamId || null,
        };
        if (input.score !== undefined) {
          resultData.score = input.score.toString();
        }
        await db.createResult(resultData);
        return { success: true, message: "Result added successfully" };
      }),

    list: publicProcedure.query(async () => {
      return await db.getResults();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .query(async ({ input }) => {
        const result = await db.getResultById(input.id);
        if (!result) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Result not found" });
        }
        return result;
      }),

    getByEvent: publicProcedure
      .input(z.object({ eventId: z.number().int().positive() }))
      .query(async ({ input }) => {
        return await db.getResultsByEvent(input.eventId);
      }),

    update: adminProcedure
      .input(z.object({ id: z.number().int().positive(), data: resultSchema.partial() }))
      .mutation(async ({ input }) => {
        const updateData: any = {};
        if (input.data.eventId !== undefined) updateData.eventId = input.data.eventId;
        if (input.data.position !== undefined) updateData.position = input.data.position;
        if (input.data.studentId !== undefined) updateData.studentId = input.data.studentId || null;
        if (input.data.teamId !== undefined) updateData.teamId = input.data.teamId || null;
        if (input.data.score !== undefined) updateData.score = input.data.score.toString();
        await db.updateResult(input.id, updateData);
        return { success: true, message: "Result updated successfully" };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await db.deleteResult(input.id);
        return { success: true, message: "Result deleted successfully" };
      }),
  }),

  // ============ ADMIN ROUTES ============
  admin: router({
    login: publicProcedure
      .input(adminLoginSchema)
      .mutation(async ({ input, ctx }) => {
        const admin = await db.getAdminByUsername(input.username);
        
        if (!admin) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid username or password",
          });
        }

        const isPasswordValid = await bcrypt.compare(input.password, admin.passwordHash);
        
        if (!isPasswordValid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid username or password",
          });
        }

        // Set admin session in response header
        ctx.res.setHeader("x-admin-session", `admin-${admin.id}`);
        
        return {
          success: true,
          message: "Login successful",
          adminId: admin.id,
        };
      }),

    logout: adminProcedure.mutation(({ ctx }) => {
      ctx.res.removeHeader("x-admin-session");
      return { success: true, message: "Logout successful" };
    }),

    checkSession: publicProcedure.query(({ ctx }) => {
      const adminSession = ctx.req.headers["x-admin-session"] as string | undefined;
      return { isAdmin: !!adminSession };
    }),
  }),
});

export type AppRouter = typeof appRouter;
