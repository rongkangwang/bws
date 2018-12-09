/*
 Navicat Premium Data Transfer

 Source Server         : sqlite
 Source Server Type    : SQLite
 Source Server Version : 3021000
 Source Schema         : main

 Target Server Type    : SQLite
 Target Server Version : 3021000
 File Encoding         : 65001

 Date: 07/12/2018 12:02:57
*/

PRAGMA foreign_keys = false;

-- ----------------------------
-- Table structure for deviceselfcheck
-- ----------------------------
DROP TABLE IF EXISTS "deviceselfcheck";
CREATE TABLE "deviceselfcheck" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "date" text NOT NULL,
  "status" text(20) NOT NULL,
  "solution" text(300),
  "user_id" integer(11) NOT NULL,
  CONSTRAINT "deviceselfcheck_ibfk_1" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);

-- ----------------------------
-- Table structure for event
-- ----------------------------
DROP TABLE IF EXISTS "event";
CREATE TABLE "event" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "datetime" text NOT NULL,
  "detector_type" text(20) NOT NULL,
  "position" text(20) NOT NULL,
  "solution" text(300),
  "user_id" integer(11) NOT NULL,
  CONSTRAINT "event_ibfk_1" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);

-- ----------------------------
-- Table structure for repair
-- ----------------------------
DROP TABLE IF EXISTS "repair";
CREATE TABLE "repair" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "date" text NOT NULL,
  "status" text(20) NOT NULL,
  "content" text(20) NOT NULL,
  "material" text(20) NOT NULL,
  "staff" text(20) NOT NULL,
  "user_id" integer(11) NOT NULL,
  CONSTRAINT "repair_ibfk_1" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);

-- ----------------------------
-- Table structure for sqlite_sequence
-- ----------------------------
DROP TABLE IF EXISTS "sqlite_sequence";
CREATE TABLE "sqlite_sequence" (
  "name",
  "seq"
);

-- ----------------------------
-- Table structure for test
-- ----------------------------
DROP TABLE IF EXISTS "test";
CREATE TABLE "test" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "datetime" text NOT NULL,
  "test_type" text(20) NOT NULL,
  "sector" text(20) NOT NULL,
  "position" text(20) NOT NULL,
  "report_num" integer(11) NOT NULL,
  "phone_number" text(20) NOT NULL,
  "user_id" integer(11) NOT NULL,
  CONSTRAINT "test_ibfk_1" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS "user";
CREATE TABLE "user" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "username" text(100) NOT NULL,
  "address" text(100),
  "device_id" text(20) NOT NULL,
  "device_phone" text(20),
  "usertype_id" integer(11) NOT NULL,
  CONSTRAINT "user_ibfk_1" FOREIGN KEY ("usertype_id") REFERENCES "usertype" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);

-- ----------------------------
-- Table structure for usertype
-- ----------------------------
DROP TABLE IF EXISTS "usertype";
CREATE TABLE "usertype" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "type" text(50) NOT NULL
);

-- ----------------------------
-- Auto increment value for deviceselfcheck
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 1 WHERE name = 'deviceselfcheck';

-- ----------------------------
-- Indexes structure for table deviceselfcheck
-- ----------------------------
CREATE INDEX "user_id"
ON "deviceselfcheck" (
  "user_id" ASC
);

-- ----------------------------
-- Auto increment value for event
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 3 WHERE name = 'event';

-- ----------------------------
-- Auto increment value for repair
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 1 WHERE name = 'repair';

-- ----------------------------
-- Auto increment value for test
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 1 WHERE name = 'test';

-- ----------------------------
-- Auto increment value for user
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 2 WHERE name = 'user';

-- ----------------------------
-- Auto increment value for usertype
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 7 WHERE name = 'usertype';

PRAGMA foreign_keys = true;
