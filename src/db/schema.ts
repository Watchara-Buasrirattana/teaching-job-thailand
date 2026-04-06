// src/db/schema.ts
import { mysqlTable, varchar, text, boolean, datetime, int, json, timestamp } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";


// 📰 ตารางข่าวสาร (News)
export const news = mysqlTable("news", {
    id: varchar("id", { length: 36 })
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()), // ใช้ $defaultFn เพื่อสร้าง UUID อัตโนมัติ
    slug: varchar("slug", { length: 255 }).unique().notNull(),
    headlineTh: varchar("headline_th", { length: 255 }).notNull(),
    headlineEn: varchar("headline_en", { length: 255 }).notNull(),
    bodyTh: text("body_th"),
    bodyEn: text("body_en"),
    featuredImage: varchar("featured_image", { length: 255 }).notNull(),
    galleryImages: json("gallery_images"),
    status: varchar("status", { length: 50 }).default("Draft").notNull(),
    // ใช้ mode: 'date' เพื่อให้ใช้งานเป็น Object Date ได้เหมือน Prisma
    createdAt: timestamp("created_at", { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: 'date' }).defaultNow().onUpdateNow().notNull(),
});


// 👨‍🏫 ตารางครู (Teacher)
export const teacher = mysqlTable("teacher", {
    id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: varchar("title", { length: 50 }),
    fName: varchar("f_name", { length: 100 }).notNull(),
    lName: varchar("l_name", { length: 100 }).notNull(),
    country: varchar("country", { length: 100 }),
    image: varchar("image", { length: 255 }),
    schoolProject: varchar("school_project", { length: 255 }),
    phone: varchar("phone", { length: 50 }),
    email: varchar("email", { length: 255 }),
    passportNumber: varchar("passport_number", { length: 100 }),
    visaExpiryDate: timestamp("visa_expiry_date", { mode: 'date' }),
    workPermitNumber: varchar("work_permit_number", { length: 100 }),
    workPermitExpiryDate: timestamp("work_permit_expiry_date", { mode: 'date' }),
    status: varchar("status", { length: 50 }).default("Active").notNull(),
    docReady: boolean("doc_ready").default(false).notNull(),
    docSigned: boolean("doc_signed").default(false).notNull(),
    docSubmitted: boolean("doc_submitted").default(false).notNull(),
    docCompleted: boolean("doc_completed").default(false).notNull(),
    docNote: text("doc_note"),
    createdAt: timestamp("created_at", { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: 'date' }).defaultNow().onUpdateNow().notNull(),
});

// ความสัมพันธ์ของ Teacher (1 ครู มีหลาย Review)
export const teacherRelations = relations(teacher, ({ many }) => ({
    reviews: many(review),
}));


// ⭐ ตารางรีวิว (Review)
export const review = mysqlTable("review", {
    id: int("id").primaryKey().autoincrement(),
    teacherId: varchar("teacher_id", { length: 36 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(),
    rating: int("rating").default(5).notNull(),
    status: boolean("status").default(true).notNull(),
    createdAt: timestamp("created_at", { mode: 'date' }).defaultNow().notNull(),
});

// ความสัมพันธ์ของ Review (1 Review เป็นของครู 1 คน)
export const reviewRelations = relations(review, ({ one }) => ({
    teacher: one(teacher, {
        fields: [review.teacherId],
        references: [teacher.id],
    }),
}));


// 📝 ตารางฟอร์มสมัครงาน (Application Form)
export const applicationForm = mysqlTable("application_form", {
    id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: varchar("title", { length: 50 }).notNull(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 50 }).notNull(),
    resumeUrl: varchar("resume_url", { length: 255 }).notNull(),
    coverLetter: varchar("cover_letter", { length: 255 }),
    message: text("message"),
    status: varchar("status", { length: 50 }).default("New").notNull(),
    createdAt: timestamp("created_at", { mode: 'date' }).defaultNow().notNull(),
});


// 👮‍♂️ ตารางผู้ดูแลระบบ (Admin)
export const admin = mysqlTable("admin", {
    id: int("id").primaryKey().autoincrement(),
    username: varchar("username", { length: 255 }).unique().notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }),
    createdAt: timestamp("created_at", { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: 'date' }).defaultNow().onUpdateNow().notNull(),
});

// ความสัมพันธ์ของ Admin (1 Admin มีหลาย ActivityLog)
export const adminRelations = relations(admin, ({ many }) => ({
    logs: many(activityLog),
}));


// 📋 ตารางประวัติการทำงาน (Activity Log)
export const activityLog = mysqlTable("activity_log", {
    id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    adminId: int("admin_id").notNull(),
    action: varchar("action", { length: 255 }).notNull(),
    entity: varchar("entity", { length: 255 }).notNull(),
    entityId: varchar("entity_id", { length: 255 }).notNull(),
    details: text("details"),
    createdAt: timestamp("created_at", { mode: 'date' }).defaultNow().notNull(),
});

// ความสัมพันธ์ของ ActivityLog (1 Log ทำโดย Admin 1 คน)
export const activityLogRelations = relations(activityLog, ({ one }) => ({
    admin: one(admin, {
        fields: [activityLog.adminId],
        references: [admin.id],
    }),
}));