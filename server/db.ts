import { eq, and, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  students,
  events,
  teams,
  teamMembers,
  registrations,
  results,
  adminCredentials,
  Student,
  Event,
  Team,
  TeamMember,
  Registration,
  Result,
  AdminCredential
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ STUDENT QUERIES ============

export async function createStudent(data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(students).values(data);
  return result;
}

export async function getStudents() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(students);
}

export async function getStudentById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(students).where(eq(students.id, id)).limit(1);
  return result[0];
}

export async function updateStudent(id: number, data: Partial<Student>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(students).set(data).where(eq(students.id, id));
}

export async function deleteStudent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(students).where(eq(students.id, id));
}

// ============ EVENT QUERIES ============

export async function createEvent(data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(events).values(data);
  return result;
}

export async function getEvents() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(events);
}

export async function getEventById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return result[0];
}

export async function updateEvent(id: number, data: Partial<Event>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(events).set(data).where(eq(events.id, id));
}

export async function deleteEvent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(events).where(eq(events.id, id));
}

// ============ TEAM QUERIES ============

export async function createTeam(data: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(teams).values(data);
  return result;
}

export async function getTeams() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(teams);
}

export async function getTeamById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(teams).where(eq(teams.id, id)).limit(1);
  return result[0];
}

export async function updateTeam(id: number, data: Partial<Team>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(teams).set(data).where(eq(teams.id, id));
}

export async function deleteTeam(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(teams).where(eq(teams.id, id));
}

export async function getTeamMembers(teamId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(teamMembers).where(eq(teamMembers.teamId, teamId));
}

export async function addTeamMember(teamId: number, studentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(teamMembers).values({ teamId, studentId });
}

export async function removeTeamMember(teamId: number, studentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(teamMembers).where(
    and(eq(teamMembers.teamId, teamId), eq(teamMembers.studentId, studentId))
  );
}

// ============ REGISTRATION QUERIES ============

export async function createRegistration(data: Omit<Registration, 'id' | 'registeredAt'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(registrations).values(data);
  return result;
}

export async function getRegistrations() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(registrations);
}

export async function getRegistrationById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(registrations).where(eq(registrations.id, id)).limit(1);
  return result[0];
}

export async function getRegistrationsByEvent(eventId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(registrations).where(eq(registrations.eventId, eventId));
}

export async function getRegistrationsByStudent(studentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(registrations).where(eq(registrations.studentId, studentId));
}

export async function getRegistrationsByTeam(teamId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(registrations).where(eq(registrations.teamId, teamId));
}

export async function checkDuplicateRegistration(eventId: number, studentId?: number, teamId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  if (studentId) {
    const result = await db.select().from(registrations).where(
      and(eq(registrations.eventId, eventId), eq(registrations.studentId, studentId))
    ).limit(1);
    return result.length > 0;
  }
  
  if (teamId) {
    const result = await db.select().from(registrations).where(
      and(eq(registrations.eventId, eventId), eq(registrations.teamId, teamId))
    ).limit(1);
    return result.length > 0;
  }
  
  return false;
}

export async function deleteRegistration(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(registrations).where(eq(registrations.id, id));
}

// ============ RESULT QUERIES ============

export async function createResult(data: Omit<Result, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(results).values(data);
  return result;
}

export async function getResults() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(results);
}

export async function getResultById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(results).where(eq(results.id, id)).limit(1);
  return result[0];
}

export async function getResultsByEvent(eventId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(results).where(eq(results.eventId, eventId));
}

export async function updateResult(id: number, data: Partial<Result>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(results).set(data).where(eq(results.id, id));
}

export async function deleteResult(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(results).where(eq(results.id, id));
}

// ============ ADMIN QUERIES ============

export async function createAdminCredential(data: Omit<AdminCredential, 'id' | 'createdAt'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(adminCredentials).values(data);
  return result;
}

export async function getAdminByUsername(username: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(adminCredentials).where(eq(adminCredentials.username, username)).limit(1);
  return result[0];
}

export async function getAdminById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(adminCredentials).where(eq(adminCredentials.id, id)).limit(1);
  return result[0];
}
