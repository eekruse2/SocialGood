-- Database Creation (Run this first)
CREATE DATABASE socialgood;

-- Connect to the database
\c socialgood;

-- Users Table
CREATE TABLE IF NOT EXISTS "Users" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "firstName" VARCHAR(255) NOT NULL,
  "lastName" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "role" VARCHAR(20) DEFAULT 'volunteer',
  "bio" TEXT,
  "profileImage" VARCHAR(255),
  "isActive" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Organizations Table
CREATE TABLE IF NOT EXISTS "Organizations" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "logo" VARCHAR(255),
  "website" VARCHAR(255),
  "email" VARCHAR(255),
  "phone" VARCHAR(50),
  "address" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Projects Table
CREATE TABLE IF NOT EXISTS "Projects" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT NOT NULL,
  "image" VARCHAR(255),
  "startDate" TIMESTAMP WITH TIME ZONE,
  "endDate" TIMESTAMP WITH TIME ZONE,
  "location" TEXT,
  "organizationId" UUID REFERENCES "Organizations"("id") ON DELETE CASCADE,
  "createdBy" UUID REFERENCES "Users"("id"),
  "status" VARCHAR(20) DEFAULT 'active',
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- UserProjects (Junction table for Users and Projects)
CREATE TABLE IF NOT EXISTS "UserProjects" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID REFERENCES "Users"("id") ON DELETE CASCADE,
  "projectId" UUID REFERENCES "Projects"("id") ON DELETE CASCADE,
  "role" VARCHAR(50) DEFAULT 'volunteer',
  "status" VARCHAR(20) DEFAULT 'pending',
  "joinedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("userId", "projectId")
);

-- Skills Table
CREATE TABLE IF NOT EXISTS "Skills" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(100) NOT NULL UNIQUE,
  "category" VARCHAR(100),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- UserSkills (Junction table for Users and Skills)
CREATE TABLE IF NOT EXISTS "UserSkills" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID REFERENCES "Users"("id") ON DELETE CASCADE,
  "skillId" UUID REFERENCES "Skills"("id") ON DELETE CASCADE,
  "level" INTEGER CHECK (level >= 1 AND level <= 5),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("userId", "skillId")
);

-- ProjectSkills (Junction table for Projects and Skills)
CREATE TABLE IF NOT EXISTS "ProjectSkills" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "projectId" UUID REFERENCES "Projects"("id") ON DELETE CASCADE,
  "skillId" UUID REFERENCES "Skills"("id") ON DELETE CASCADE,
  "importance" INTEGER CHECK (importance >= 1 AND importance <= 5),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("projectId", "skillId")
);

-- Causes Table (Categories for projects)
CREATE TABLE IF NOT EXISTS "Causes" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(100) NOT NULL UNIQUE,
  "description" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ProjectCauses (Junction table for Projects and Causes)
CREATE TABLE IF NOT EXISTS "ProjectCauses" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "projectId" UUID REFERENCES "Projects"("id") ON DELETE CASCADE,
  "causeId" UUID REFERENCES "Causes"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("projectId", "causeId")
); 