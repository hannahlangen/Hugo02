-- 01_init_multi_tenant.sql
-- Clean reset: löscht Views, Zusatz- und Kern-Tabellen sowie den Enum-Typ.
-- ACHTUNG: Wird nur bei leerem Volume automatisch ausgeführt; bei Re-Runs manuell.

-- Views zuerst
DROP VIEW IF EXISTS user_team_summary;
DROP VIEW IF EXISTS company_overview;

-- Zusatz-Tabellen (hängen an Kernschema)
DROP TABLE IF EXISTS team_synergy_metrics CASCADE;
DROP TABLE IF EXISTS user_culture_profiles CASCADE;
DROP TABLE IF EXISTS culture_dimensions CASCADE;
DROP TABLE IF EXISTS hugo_personality_types CASCADE;

-- Kernschema (in umgekehrter Abhängigkeitsreihenfolge)
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS company_settings CASCADE;
DROP TABLE IF EXISTS assessment_responses CASCADE;
DROP TABLE IF EXISTS assessment_sessions CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

-- Enum-Typ zuletzt
DROP TYPE IF EXISTS user_role CASCADE;

-- Keine \i Includes hier! 02_… und 03_… werden vom Entrypoint automatisch
-- in alphabetischer Reihenfolge ausgeführt.

